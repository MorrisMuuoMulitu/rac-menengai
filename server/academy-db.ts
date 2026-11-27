/**
 * Postgres storage for learning records and membership applications.
 *
 * One row per learner per club. Progress lives in a jsonb column so the
 * curriculum can add lessons without a migration, while the things the club
 * has to reason about — assessment attempts, submitted applications and who
 * reviewed them — are real rows with real columns.
 *
 * Writes are scoped by user id at the SQL level. A request cannot address
 * somebody else's record, because no query accepts a user id from the caller.
 */

import { Pool } from "pg";
import { attachDatabasePool } from "@vercel/functions";
import {
  emptyRecord,
  normaliseRecord,
  withProgressStamp,
  type LearningRecord,
} from "../shared/rotaract-academy/progress.js";
import type {
  ApplicationStatus,
  MembershipApplication,
} from "../shared/rotaract-academy/application.js";
import { FULL_COURSE } from "./course.js";

export interface LearnerRow {
  userId: string;
  clubId: string;
  email: string | null;
  displayName: string | null;
  phone: string | null;
  record: LearningRecord;
}

export interface AttemptRow {
  id: number;
  correct: number;
  total: number;
  passed: boolean;
  createdAt: string;
}

/**
 * One learner as the membership team sees them.
 *
 * The record is the same one the learner's own screen is built from, so the
 * officer view can never disagree with what the learner is shown.
 */
export interface LearnerProgressRow {
  userId: string;
  email: string | null;
  displayName: string | null;
  phone: string | null;
  record: LearningRecord;
  /** When the learner first appeared on this club's course. */
  startedAt: string | null;
  /** Last sign-in or progress write, whichever is more recent. */
  lastSeenAt: string | null;
}

export interface ReviewQueueItem extends MembershipApplication {
  userId: string;
}

export interface AcademyRepository {
  loadNote(
    userId: string,
    clubId: string,
    lessonId: string,
  ): Promise<{ text: string; updatedAt: string } | null>;
  saveNote(
    userId: string,
    clubId: string,
    lessonId: string,
    text: string,
  ): Promise<{ text: string; updatedAt: string }>;
  /** Create or return the learner. Never returns another learner's row. */
  ensureLearner(input: {
    userId: string;
    clubId: string;
    email: string | null;
    displayName: string | null;
  }): Promise<LearnerRow>;
  saveRecord(
    userId: string,
    clubId: string,
    record: LearningRecord,
  ): Promise<LearningRecord>;
  updateLearnerProfile(
    userId: string,
    clubId: string,
    profile: { displayName: string; certificateName: string; phone: string },
  ): Promise<LearnerRow | null>;
  nextCertificateSequence(clubId: string, rotaryYear: string): Promise<number>;
  recordAttempt(
    userId: string,
    clubId: string,
    attempt: {
      correct: number;
      total: number;
      passed: boolean;
      answers: (number | null)[];
    },
  ): Promise<AttemptRow>;
  loadApplication(
    userId: string,
    clubId: string,
  ): Promise<MembershipApplication | null>;
  saveApplication(
    userId: string,
    clubId: string,
    application: MembershipApplication,
  ): Promise<MembershipApplication>;
  listApplications(clubId: string): Promise<ReviewQueueItem[]>;
  /**
   * Everyone who has ever opened the course for this club.
   *
   * Applications answer "who asked to join". This answers the different
   * question the membership team asks when someone goes quiet: who started
   * and where did they stop.
   */
  listLearners(clubId: string): Promise<LearnerProgressRow[]>;
  /** Permanently remove a learner and the academy-owned records attached to them. */
  deleteLearner(userId: string, clubId: string): Promise<LearnerRow | null>;
  findApplication(
    clubId: string,
    applicationId: string,
  ): Promise<ReviewQueueItem | null>;
  logEvent(event: {
    clubId: string;
    userId: string | null;
    actorId: string | null;
    actorEmail: string | null;
    type: string;
    detail?: Record<string, unknown>;
  }): Promise<void>;
}

const CLUB_ID = "menengai";

/**
 * Schema is created on first use rather than by a separate migration step, so
 * a fresh environment cannot serve a half-built database. Every statement is
 * `if not exists`; running this repeatedly is a no-op.
 */
const SCHEMA = `
create table if not exists academy_note (
  user_id text not null,
  club_id text not null,
  lesson_id text not null,
  text text not null check (char_length(text) <= 2000),
  updated_at timestamptz not null default now(),
  primary key (user_id, club_id, lesson_id)
);
create table if not exists academy_learner (
  user_id text not null,
  club_id text not null,
  email text,
  display_name text,
  phone text,
  course_version text not null,
  record jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, club_id)
);

alter table academy_learner add column if not exists phone text;

create table if not exists academy_attempt (
  id bigserial primary key,
  user_id text not null,
  club_id text not null,
  course_version text not null,
  correct integer not null,
  total integer not null,
  passed boolean not null,
  answers jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists academy_certificate_sequence (
  club_id text not null,
  rotary_year text not null,
  last_value integer not null default 0 check (last_value >= 0),
  updated_at timestamptz not null default now(),
  primary key (club_id, rotary_year)
);

create index if not exists academy_attempt_owner_idx
  on academy_attempt (user_id, club_id, created_at desc);

create table if not exists academy_application (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  club_id text not null,
  status text not null default 'draft',
  full_name text not null default '',
  email text not null default '',
  phone text not null default '',
  profession text not null default '',
  location text not null default '',
  motivation text not null default '',
  availability text not null default '',
  course_version text not null,
  course_score integer not null default 0,
  submitted_at timestamptz,
  decided_at timestamptz,
  decided_by text,
  decision_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, club_id)
);

create index if not exists academy_application_queue_idx
  on academy_application (club_id, status, submitted_at);

create table if not exists academy_event (
  id bigserial primary key,
  club_id text not null,
  user_id text,
  actor_id text,
  actor_email text,
  type text not null,
  detail jsonb,
  created_at timestamptz not null default now()
);
`;

let schemaReady: Promise<void> | null = null;

function pool(connectionString: string): Pool {
  const created = new Pool({
    connectionString,
    max: 5,
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 8_000,
    allowExitOnIdle: true,
  });
  // Vercel reuses function instances; this keeps connections warm between
  // requests instead of opening a new socket each time. Off-platform it is not
  // applicable, so a failure here must not stop the pool being usable.
  try {
    attachDatabasePool(created);
  } catch {
    /* running outside Vercel — the pool still works */
  }
  return created;
}

function asIso(value: unknown): string | null {
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "string") {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
  }
  return null;
}

function toApplication(row: Record<string, unknown>): MembershipApplication {
  return {
    id: String(row.id),
    status: String(row.status) as ApplicationStatus,
    fullName: String(row.full_name ?? ""),
    email: String(row.email ?? ""),
    phone: String(row.phone ?? ""),
    profession: String(row.profession ?? ""),
    location: String(row.location ?? ""),
    motivation: String(row.motivation ?? ""),
    availability: String(row.availability ?? ""),
    courseVersion: String(row.course_version ?? ""),
    courseScore: Number(row.course_score ?? 0),
    submittedAt: asIso(row.submitted_at),
    decidedAt: asIso(row.decided_at),
    decidedBy: row.decided_by ? String(row.decided_by) : null,
    decisionNote: row.decision_note ? String(row.decision_note) : null,
    updatedAt: asIso(row.updated_at),
  };
}

export function createPostgresRepository(
  connectionString: string,
): AcademyRepository {
  const database = pool(connectionString);
  const validLessonIds = FULL_COURSE.modules.map((module) => module.id);

  async function ready() {
    if (!schemaReady)
      schemaReady = database.query(SCHEMA).then(() => undefined);
    try {
      await schemaReady;
    } catch (error) {
      schemaReady = null;
      throw error;
    }
  }

  return {
    async loadNote(userId, clubId, lessonId) {
      await ready();
      const { rows } = await database.query(
        `select text, updated_at from academy_note where user_id = $1 and club_id = $2 and lesson_id = $3`,
        [userId, clubId, lessonId],
      );
      return rows[0]
        ? { text: rows[0].text, updatedAt: asIso(rows[0].updated_at)! }
        : null;
    },
    async saveNote(userId, clubId, lessonId, text) {
      await ready();
      const { rows } = await database.query(
        `insert into academy_note (user_id, club_id, lesson_id, text) values ($1,$2,$3,$4)
         on conflict (user_id, club_id, lesson_id) do update set text = excluded.text, updated_at = now()
         returning text, updated_at`,
        [userId, clubId, lessonId, text],
      );
      return { text: rows[0].text, updatedAt: asIso(rows[0].updated_at)! };
    },
    async ensureLearner({ userId, clubId, email, displayName }) {
      await ready();
      const { rows } = await database.query(
        `insert into academy_learner (user_id, club_id, email, display_name, course_version, record)
         values ($1, $2, $3, $4, $5, $6)
         on conflict (user_id, club_id) do update
           set email = coalesce(excluded.email, academy_learner.email),
               display_name = coalesce(academy_learner.display_name, excluded.display_name),
               updated_at = now()
         returning user_id, club_id, email, display_name, phone, record`,
        [
          userId,
          clubId,
          email,
          displayName,
          FULL_COURSE.version,
          JSON.stringify(emptyRecord(FULL_COURSE.version)),
        ],
      );
      const row = rows[0];
      return {
        userId: row.user_id,
        clubId: row.club_id,
        email: row.email ?? null,
        displayName: row.display_name ?? null,
        phone: row.phone ?? null,
        record: normaliseRecord(
          row.record,
          FULL_COURSE.version,
          validLessonIds,
        ),
      };
    },

    async saveRecord(userId, clubId, record) {
      await ready();
      const safe = normaliseRecord(
        withProgressStamp(record),
        FULL_COURSE.version,
        validLessonIds,
      );
      const { rows } = await database.query(
        `update academy_learner
            set record = $3, updated_at = now()
          where user_id = $1 and club_id = $2
        returning record`,
        [userId, clubId, JSON.stringify(safe)],
      );
      if (!rows[0]) throw new Error("learner-missing");
      return safe;
    },

    async updateLearnerProfile(userId, clubId, profile) {
      await ready();
      const { rows } = await database.query(
        `update academy_learner
            set display_name = $3,
                phone = $4,
                record = jsonb_set(record, '{certificateName}', to_jsonb($5::text), true),
                updated_at = now()
          where user_id = $1 and club_id = $2
        returning user_id, club_id, email, display_name, phone, record`,
        [
          userId,
          clubId,
          profile.displayName,
          profile.phone,
          profile.certificateName,
        ],
      );
      const row = rows[0];
      if (!row) return null;
      return {
        userId: row.user_id,
        clubId: row.club_id,
        email: row.email ?? null,
        displayName: row.display_name ?? null,
        phone: row.phone ?? null,
        record: normaliseRecord(
          row.record,
          FULL_COURSE.version,
          validLessonIds,
        ),
      };
    },

    async nextCertificateSequence(clubId, rotaryYear) {
      await ready();
      const { rows } = await database.query(
        `insert into academy_certificate_sequence (club_id, rotary_year, last_value)
         values ($1, $2, 1)
         on conflict (club_id, rotary_year) do update
           set last_value = academy_certificate_sequence.last_value + 1,
               updated_at = now()
         returning last_value`,
        [clubId, rotaryYear],
      );
      return Number(rows[0].last_value);
    },

    async recordAttempt(userId, clubId, attempt) {
      await ready();
      const { rows } = await database.query(
        `insert into academy_attempt
           (user_id, club_id, course_version, correct, total, passed, answers)
         values ($1, $2, $3, $4, $5, $6, $7)
         returning id, correct, total, passed, created_at`,
        [
          userId,
          clubId,
          FULL_COURSE.version,
          attempt.correct,
          attempt.total,
          attempt.passed,
          JSON.stringify(attempt.answers),
        ],
      );
      const row = rows[0];
      return {
        id: Number(row.id),
        correct: Number(row.correct),
        total: Number(row.total),
        passed: row.passed === true,
        createdAt: asIso(row.created_at) ?? new Date().toISOString(),
      };
    },

    async loadApplication(userId, clubId) {
      await ready();
      const { rows } = await database.query(
        `select * from academy_application where user_id = $1 and club_id = $2`,
        [userId, clubId],
      );
      return rows[0] ? toApplication(rows[0]) : null;
    },

    async saveApplication(userId, clubId, application) {
      await ready();
      const { rows } = await database.query(
        `insert into academy_application
           (user_id, club_id, status, full_name, email, phone, profession, location,
            motivation, availability, course_version, course_score,
            submitted_at, decided_at, decided_by, decision_note, updated_at)
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16, now())
         on conflict (user_id, club_id) do update set
           status = excluded.status,
           full_name = excluded.full_name,
           email = excluded.email,
           phone = excluded.phone,
           profession = excluded.profession,
           location = excluded.location,
           motivation = excluded.motivation,
           availability = excluded.availability,
           course_version = excluded.course_version,
           course_score = excluded.course_score,
           submitted_at = excluded.submitted_at,
           decided_at = excluded.decided_at,
           decided_by = excluded.decided_by,
           decision_note = excluded.decision_note,
           updated_at = now()
         returning *`,
        [
          userId,
          clubId,
          application.status,
          application.fullName,
          application.email,
          application.phone,
          application.profession,
          application.location,
          application.motivation,
          application.availability,
          application.courseVersion,
          application.courseScore,
          application.submittedAt,
          application.decidedAt,
          application.decidedBy,
          application.decisionNote,
        ],
      );
      return toApplication(rows[0]);
    },

    async listApplications(clubId) {
      await ready();
      const { rows } = await database.query(
        `select * from academy_application
          where club_id = $1 and status <> 'draft'
          order by
            case status when 'submitted' then 0 when 'in_review' then 1
                        when 'needs_more' then 2 when 'approved' then 3 else 4 end,
            submitted_at desc nulls last
          limit 200`,
        [clubId],
      );
      return rows.map((row) => ({
        ...toApplication(row),
        userId: String(row.user_id),
      }));
    },

    async listLearners(clubId) {
      await ready();
      const { rows } = await database.query(
        `select user_id, email, display_name, phone, record, created_at, updated_at
           from academy_learner
          where club_id = $1
          order by updated_at desc
          limit 1000`,
        [clubId],
      );
      return rows.map((row) => ({
        userId: String(row.user_id),
        email: row.email ? String(row.email) : null,
        displayName: row.display_name ? String(row.display_name) : null,
        phone: row.phone ? String(row.phone) : null,
        record: normaliseRecord(
          row.record,
          FULL_COURSE.version,
          validLessonIds,
        ),
        startedAt: asIso(row.created_at),
        lastSeenAt: asIso(row.updated_at),
      }));
    },

    async deleteLearner(userId, clubId) {
      await ready();
      const client = await database.connect();
      try {
        await client.query("begin");
        const { rows } = await client.query(
          `select user_id, club_id, email, display_name, phone, record
             from academy_learner
            where user_id = $1 and club_id = $2
            for update`,
          [userId, clubId],
        );
        const row = rows[0];
        if (!row) {
          await client.query("rollback");
          return null;
        }
        await client.query(
          `delete from academy_note where user_id = $1 and club_id = $2`,
          [userId, clubId],
        );
        await client.query(
          `delete from academy_attempt where user_id = $1 and club_id = $2`,
          [userId, clubId],
        );
        await client.query(
          `delete from academy_application where user_id = $1 and club_id = $2`,
          [userId, clubId],
        );
        await client.query(
          `delete from academy_learner where user_id = $1 and club_id = $2`,
          [userId, clubId],
        );
        await client.query("commit");
        return {
          userId: row.user_id,
          clubId: row.club_id,
          email: row.email ?? null,
          displayName: row.display_name ?? null,
          phone: row.phone ?? null,
          record: normaliseRecord(
            row.record,
            FULL_COURSE.version,
            validLessonIds,
          ),
        };
      } catch (error) {
        await client.query("rollback").catch(() => undefined);
        throw error;
      } finally {
        client.release();
      }
    },

    async findApplication(clubId, applicationId) {
      await ready();
      const { rows } = await database.query(
        `select * from academy_application where club_id = $1 and id = $2`,
        [clubId, applicationId],
      );
      return rows[0]
        ? { ...toApplication(rows[0]), userId: String(rows[0].user_id) }
        : null;
    },

    async logEvent(event) {
      await ready();
      await database.query(
        `insert into academy_event (club_id, user_id, actor_id, actor_email, type, detail)
         values ($1,$2,$3,$4,$5,$6)`,
        [
          event.clubId,
          event.userId,
          event.actorId,
          event.actorEmail,
          event.type,
          JSON.stringify(event.detail ?? {}),
        ],
      );
    },
  };
}

export { CLUB_ID };
