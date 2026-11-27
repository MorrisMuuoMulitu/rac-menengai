/**
 * Who started the course, and where they stopped.
 *
 * The applications queue answers "who asked to join". This answers the other
 * question the membership team asks: a learner put in three evenings and then
 * went quiet, and nobody noticed. Everything here is derived from the same
 * progress record the learner sees, so the two screens cannot disagree.
 *
 * Officer-only, enforced on the server. This page adds no decision of its own.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ClipboardCheck,
  Loader2,
  Mail,
  Pencil,
  Search,
  ShieldAlert,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { PageMeta } from "../components/ui";
import { useAccount } from "../academy/account";
import { AccountChip } from "../academy/AccountChip";
import { LearnerCertificateDownload } from "../academy/LearnerCertificateDownload";
import {
  AcademyError,
  deleteLearnerRecord,
  loadLearnerProgress,
  saveLearnerProfile,
  type LearnerProgressResponse,
  type LearnerProgressRow,
} from "../lib/academy";
import { APPLICATION_STATUS_LABEL } from "../../shared/rotaract-academy/application";
import "../academy.css";

type LoadState = "loading" | "ready" | "denied" | "signed-out" | "error";
type Filter = "all" | "needs-nudge" | "in-progress" | "not-started" | "done";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "Everyone" },
  { id: "needs-nudge", label: "Needs a nudge" },
  { id: "in-progress", label: "Moving" },
  { id: "not-started", label: "Not started" },
  { id: "done", label: "Finished" },
];

const COHORT_LABEL: Record<LearnerProgressRow["cohort"], string> = {
  "needs-nudge": "Needs a nudge",
  "in-progress": "Moving",
  "not-started": "Not started",
  done: "Finished",
};

function when(value: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function idle(days: number | null): string {
  if (days === null) return "no activity recorded";
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  return `${days} days ago`;
}

/**
 * "Where did they stop" in words a person can act on, taken from the counts
 * rather than invented.
 */
function whereTheyStopped(row: LearnerProgressRow): string {
  if (row.assessmentPassed && !row.proposalSubmitted)
    return "Passed the assessment, still to write the proposal";
  if (row.stage === "proposal" && row.proposalSubmitted)
    return "Proposal written, joining steps not sent";
  if (row.assessmentPassed) return "Assessment passed";
  if (row.lessonsDone > 0 && row.checksDone < row.checksTotal)
    return `Lesson ${row.lessonsDone} of ${row.lessonsTotal}, ${row.checksDone} of ${row.checksTotal} chapter checks`;
  if (row.lessonsDone > 0)
    return `Lesson ${row.lessonsDone} of ${row.lessonsTotal}`;
  return "Opened the course, no lesson finished";
}

export default function LearnerProgressPage() {
  const account = useAccount();
  const [data, setData] = useState<LearnerProgressResponse | null>(null);
  const [status, setStatus] = useState<LoadState>("loading");
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [displayNameDraft, setDisplayNameDraft] = useState("");
  const [certificateNameDraft, setCertificateNameDraft] = useState("");
  const [phoneDraft, setPhoneDraft] = useState("");
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [profileBusy, setProfileBusy] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    try {
      const token = await account.token();
      setData(await loadLearnerProgress(token));
      setStatus("ready");
    } catch (cause) {
      if (cause instanceof AcademyError && cause.status === 403) {
        setStatus("denied");
        return;
      }
      setError(
        cause instanceof AcademyError
          ? cause.message
          : "We could not load learner progress.",
      );
      setStatus("error");
    }
  }, [account]);

  useEffect(() => {
    if (!account.ready) return;
    /*
     * Asking the API while signed out can only ever produce the officer-only
     * refusal, which reads as an accusation rather than an invitation. Say
     * what is actually missing instead.
     */
    if (!account.signedIn) {
      setStatus("signed-out");
      return;
    }
    void load();
  }, [account.ready, account.signedIn, load]);

  const rows = useMemo(() => {
    const all = data?.learners ?? [];
    const needle = query.trim().toLowerCase();
    return all.filter((row) => {
      if (filter !== "all" && row.cohort !== filter) return false;
      if (!needle) return true;
      return `${row.displayName ?? ""} ${row.email ?? ""} ${row.phone ?? ""}`
        .toLowerCase()
        .includes(needle);
    });
  }, [data, filter, query]);

  const nudgeDays = data?.nudgeAfterDays ?? 21;

  async function saveProfile(learner: LearnerProgressRow) {
    setProfileBusy(true);
    setError("");
    try {
      const result = await saveLearnerProfile(
        await account.token(),
        learner.userId,
        displayNameDraft,
        certificateNameDraft,
        phoneDraft,
      );
      setData((current) =>
        current
          ? {
              ...current,
              learners: current.learners.map((row) =>
                row.userId === learner.userId
                  ? {
                      ...row,
                      displayName: result.learner.displayName,
                      certificateName: result.learner.certificateName,
                      phone: result.learner.phone,
                    }
                  : row,
              ),
            }
          : current,
      );
      setEditingId(null);
      setConfirmingId(null);
    } catch (cause) {
      setError(
        cause instanceof AcademyError
          ? cause.message
          : "That learner’s details did not save.",
      );
    } finally {
      setProfileBusy(false);
    }
  }

  async function deleteLearner(learner: LearnerProgressRow) {
    if (deleteConfirmation !== "DELETE") return;
    setDeleteBusy(true);
    setError("");
    setNotice("");
    try {
      const result = await deleteLearnerRecord(
        await account.token(),
        learner.userId,
        deleteConfirmation,
      );
      setDeletingId(null);
      setDeleteConfirmation("");
      await load();
      setNotice(
        `Learner record deleted. Learner email: ${
          result.notifications.learner ? "sent" : "not sent"
        }. Admin confirmation: ${
          result.notifications.admin ? "sent" : "not sent"
        }.`,
      );
    } catch (cause) {
      setError(
        cause instanceof AcademyError
          ? cause.message
          : "That learner could not be deleted.",
      );
    } finally {
      setDeleteBusy(false);
    }
  }

  return (
    <>
      <PageMeta
        title="Learner progress"
        description="Where every learner on the Rotaract Club of Menengai course has reached."
        robots="noindex"
      />
      <section className="section academy-queue">
        <div className="container">
          <Link className="academy-back" to="/membership/academy">
            <ArrowLeft size={15} aria-hidden="true" /> Back to the academy
          </Link>
          <h1 className="academy-h1">
            <Users size={26} aria-hidden="true" /> Learner progress
          </h1>
          <AccountChip tone="light" />
          <p className="academy-lede">
            Everyone who has opened the course. “Needs a nudge” means they
            finished at least one lesson, have not finished the course, and
            nothing has been recorded for {nudgeDays} days or more.
          </p>
          <p className="academy-queue-links">
            <Link to="/membership/queue">
              <ClipboardCheck size={15} aria-hidden="true" /> Applications
              waiting for a decision
            </Link>
          </p>

          {error ? (
            <p className="academy-notice error" role="alert">
              <ShieldAlert size={18} aria-hidden="true" /> {error}
            </p>
          ) : null}

          {notice ? (
            <p className="academy-notice good" role="status">
              {notice}
            </p>
          ) : null}

          {status === "loading" ? (
            <p className="academy-saving" role="status">
              <Loader2 className="academy-spin" size={16} aria-hidden="true" />{" "}
              Loading…
            </p>
          ) : null}

          {status === "denied" ? (
            <div className="academy-notice info">
              <ShieldAlert size={18} aria-hidden="true" />
              <span>
                This page is for the club’s membership officers. If you should
                have access, ask the club to add the email address you sign in
                with to the reviewer list.
              </span>
            </div>
          ) : null}

          {status === "signed-out" ? (
            <div className="academy-notice info">
              <ShieldAlert size={18} aria-hidden="true" />
              <span>
                Sign in with the club’s membership officer account to see
                learner progress. <Link to="/membership/sign-in">Sign in</Link>
              </span>
            </div>
          ) : null}

          {status === "ready" && data ? (
            <>
              <dl className="academy-cohort-totals">
                <div>
                  <dt>On the course</dt>
                  <dd>{data.totals.all}</dd>
                </div>
                <div className={data.totals.needsNudge ? "is-attention" : ""}>
                  <dt>Needs a nudge</dt>
                  <dd>{data.totals.needsNudge}</dd>
                </div>
                <div>
                  <dt>Moving</dt>
                  <dd>{data.totals.inProgress}</dd>
                </div>
                <div>
                  <dt>Not started</dt>
                  <dd>{data.totals.notStarted}</dd>
                </div>
                <div>
                  <dt>Finished</dt>
                  <dd>{data.totals.done}</dd>
                </div>
              </dl>

              <div className="academy-progress-controls">
                <div
                  className="academy-filter-row"
                  role="group"
                  aria-label="Filter learners"
                >
                  {FILTERS.map((item) => {
                    const count =
                      item.id === "all"
                        ? data.totals.all
                        : item.id === "needs-nudge"
                          ? data.totals.needsNudge
                          : item.id === "in-progress"
                            ? data.totals.inProgress
                            : item.id === "not-started"
                              ? data.totals.notStarted
                              : data.totals.done;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        aria-pressed={filter === item.id}
                        onClick={() => setFilter(item.id)}
                      >
                        {item.label} <span>{count}</span>
                      </button>
                    );
                  })}
                </div>
                <label className="academy-search">
                  <Search size={15} aria-hidden="true" />
                  <span className="sr-only">
                    Search by name, email or phone
                  </span>
                  <input
                    type="search"
                    value={query}
                    placeholder="Name, email or phone"
                    onChange={(event) => setQuery(event.target.value)}
                  />
                </label>
              </div>

              {rows.length === 0 ? (
                <p>
                  {data.totals.all === 0
                    ? "Nobody has opened the course yet."
                    : "No learners match this filter."}
                </p>
              ) : null}

              <ul className="academy-learner-list">
                {rows.map((row) => (
                  <li
                    className={`academy-learner is-${row.cohort}`}
                    key={row.userId}
                  >
                    <div className="academy-learner-head">
                      <div>
                        <h2>{row.displayName ?? row.email ?? "Learner"}</h2>
                        {row.email ? (
                          <a
                            className="academy-learner-mail"
                            href={`mailto:${row.email}`}
                          >
                            <Mail size={13} aria-hidden="true" /> {row.email}
                          </a>
                        ) : null}
                        {row.phone ? (
                          <a
                            className="academy-learner-mail"
                            href={`tel:${row.phone}`}
                          >
                            {row.phone}
                          </a>
                        ) : null}
                      </div>
                      <div className="academy-learner-head-actions">
                        <span className={`academy-cohort is-${row.cohort}`}>
                          {COHORT_LABEL[row.cohort]}
                        </span>
                        <button
                          type="button"
                          className="academy-learner-edit-button"
                          onClick={() => {
                            setEditingId(
                              editingId === row.userId ? null : row.userId,
                            );
                            setDisplayNameDraft(
                              row.displayName ?? row.email ?? "",
                            );
                            setCertificateNameDraft(
                              row.certificateName ??
                                row.displayName ??
                                row.email ??
                                "",
                            );
                            setPhoneDraft(row.phone ?? "");
                            setConfirmingId(null);
                            setDeletingId(null);
                            setError("");
                          }}
                          aria-expanded={editingId === row.userId}
                        >
                          <Pencil size={13} aria-hidden="true" /> Edit details
                        </button>
                        {!account.email ||
                        row.email?.toLowerCase() !==
                          account.email.toLowerCase() ? (
                          <button
                            type="button"
                            className="academy-learner-delete-button"
                            onClick={() => {
                              setEditingId(null);
                              setConfirmingId(null);
                              setDeletingId(
                                deletingId === row.userId ? null : row.userId,
                              );
                              setDeleteConfirmation("");
                              setError("");
                              setNotice("");
                            }}
                            aria-expanded={deletingId === row.userId}
                          >
                            <Trash2 size={13} aria-hidden="true" /> Delete
                            learner
                          </button>
                        ) : null}
                      </div>
                    </div>

                    {editingId === row.userId ? (
                      <form
                        className="academy-learner-edit"
                        onSubmit={(event) => {
                          event.preventDefault();
                          setConfirmingId(row.userId);
                        }}
                      >
                        <div className="academy-learner-edit-fields">
                          <label className="academy-field">
                            <span className="academy-field-label">
                              Display name
                            </span>
                            <input
                              required
                              minLength={1}
                              maxLength={120}
                              value={displayNameDraft}
                              onChange={(event) =>
                                setDisplayNameDraft(event.target.value)
                              }
                            />
                          </label>
                          <label className="academy-field">
                            <span className="academy-field-label">
                              Name on certificate
                            </span>
                            <input
                              required
                              minLength={2}
                              maxLength={120}
                              value={certificateNameDraft}
                              onChange={(event) =>
                                setCertificateNameDraft(event.target.value)
                              }
                            />
                          </label>
                          <label className="academy-field">
                            <span className="academy-field-label">Phone</span>
                            <input
                              required
                              type="tel"
                              minLength={7}
                              maxLength={40}
                              value={phoneDraft}
                              onChange={(event) =>
                                setPhoneDraft(event.target.value)
                              }
                            />
                          </label>
                        </div>
                        <p className="academy-learner-edit-note">
                          Sign-in email: {row.email ?? "none on file"}. This is
                          managed by the learner’s signed-in account.
                        </p>
                        <div className="academy-learner-edit-actions">
                          <button
                            type="submit"
                            className="btn btn-secondary btn-sm"
                            disabled={profileBusy}
                          >
                            Review changes
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            disabled={profileBusy}
                            onClick={() => setEditingId(null)}
                          >
                            <X size={14} aria-hidden="true" /> Cancel
                          </button>
                        </div>
                        {confirmingId === row.userId ? (
                          <div
                            className="academy-learner-confirm"
                            role="status"
                          >
                            <strong>Confirm these learner details</strong>
                            <p>
                              Display name: {displayNameDraft.trim()}
                              <br />
                              Certificate name: {certificateNameDraft.trim()}
                              <br />
                              Phone: {phoneDraft.trim()}
                            </p>
                            <div className="academy-learner-edit-actions">
                              <button
                                type="button"
                                className="btn btn-primary btn-sm"
                                disabled={profileBusy}
                                onClick={() => void saveProfile(row)}
                              >
                                {profileBusy ? (
                                  <Loader2
                                    className="academy-spin"
                                    size={14}
                                    aria-hidden="true"
                                  />
                                ) : null}
                                Confirm and save
                              </button>
                              <button
                                type="button"
                                className="btn btn-secondary btn-sm"
                                disabled={profileBusy}
                                onClick={() => setConfirmingId(null)}
                              >
                                Keep editing
                              </button>
                            </div>
                          </div>
                        ) : null}
                      </form>
                    ) : null}

                    {deletingId === row.userId ? (
                      <div className="academy-learner-delete" role="alert">
                        <strong>Permanently delete this learner?</strong>
                        <p>
                          This removes their academy progress, assessment
                          attempts, notes and any membership application. Their
                          sign-in account will not be deleted.
                        </p>
                        <label className="academy-field">
                          <span className="academy-field-label">
                            Type DELETE to confirm
                          </span>
                          <input
                            value={deleteConfirmation}
                            onChange={(event) =>
                              setDeleteConfirmation(event.target.value)
                            }
                            autoComplete="off"
                          />
                        </label>
                        <div className="academy-learner-edit-actions">
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            disabled={
                              deleteBusy || deleteConfirmation !== "DELETE"
                            }
                            onClick={() => void deleteLearner(row)}
                          >
                            {deleteBusy ? (
                              <Loader2
                                className="academy-spin"
                                size={14}
                                aria-hidden="true"
                              />
                            ) : (
                              <Trash2 size={14} aria-hidden="true" />
                            )}
                            Delete learner
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            disabled={deleteBusy}
                            onClick={() => {
                              setDeletingId(null);
                              setDeleteConfirmation("");
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : null}

                    <div
                      className="academy-learner-bar"
                      role="progressbar"
                      aria-valuemin={0}
                      aria-valuemax={row.total}
                      aria-valuenow={row.completed}
                      aria-valuetext={`${row.completed} of ${row.total} steps complete`}
                    >
                      <span style={{ width: `${row.percent}%` }} />
                    </div>

                    <p className="academy-learner-where">
                      {whereTheyStopped(row)}
                      <span>
                        {row.percent}% · last activity {idle(row.daysIdle)}
                      </span>
                    </p>

                    <dl className="academy-learner-meta">
                      <div>
                        <dt>Lessons</dt>
                        <dd>
                          {row.lessonsDone}/{row.lessonsTotal}
                        </dd>
                      </div>
                      <div>
                        <dt>Chapter checks</dt>
                        <dd>
                          {row.checksDone}/{row.checksTotal}
                        </dd>
                      </div>
                      <div>
                        <dt>Assessment</dt>
                        <dd>
                          {row.attempts === 0
                            ? "not sat"
                            : row.assessmentPassed
                              ? `passed · ${row.bestScore}/${row.assessmentTotal}`
                              : `best ${row.bestScore}/${row.assessmentTotal} · ${row.attempts} ${
                                  row.attempts === 1 ? "attempt" : "attempts"
                                }`}
                        </dd>
                      </div>
                      <div>
                        <dt>Proposal</dt>
                        <dd>{row.proposalSubmitted ? "written" : "not yet"}</dd>
                      </div>
                      <div>
                        <dt>Certificate</dt>
                        <dd>
                          {row.assessmentPassed ? (
                            <LearnerCertificateDownload
                              userId={row.userId}
                              learnerName={
                                row.displayName ?? row.email ?? "learner"
                              }
                              token={account.token}
                            />
                          ) : (
                            "Available after assessment"
                          )}
                        </dd>
                      </div>
                      <div>
                        <dt>Started</dt>
                        <dd>{when(row.startedAt)}</dd>
                      </div>
                      <div>
                        <dt>Last progress</dt>
                        <dd>{when(row.lastProgressAt)}</dd>
                      </div>
                    </dl>

                    {row.applicationStatus ? (
                      <p className="academy-learner-application">
                        Application:{" "}
                        <strong>
                          {APPLICATION_STATUS_LABEL[row.applicationStatus]}
                        </strong>
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </div>
      </section>
    </>
  );
}
