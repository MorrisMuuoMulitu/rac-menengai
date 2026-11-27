import { Pool } from "pg";
import { attachDatabasePool } from "@vercel/functions";
import type { Enquiry } from "../src/lib/contact.js";

export interface ContactEnquiryRecord extends Enquiry {
  id: string;
  createdAt: string;
}

export interface ContactRepository {
  consumeRateLimit(key: string): Promise<number>;
  saveEnquiry(
    input: Enquiry & { ipHash: string },
  ): Promise<ContactEnquiryRecord>;
  listEnquiries(limit?: number): Promise<ContactEnquiryRecord[]>;
  deleteEnquiry(id: string): Promise<boolean>;
}

const SCHEMA = `
create table if not exists site_contact_enquiry (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact text not null,
  interest text not null,
  message text not null,
  ip_hash text not null,
  created_at timestamptz not null default now()
);

create index if not exists site_contact_enquiry_created_idx
  on site_contact_enquiry (created_at desc);

create table if not exists site_contact_rate_limit (
  rate_key text primary key,
  window_start timestamptz not null,
  request_count integer not null check (request_count >= 0)
);
`;

let schemaReady: Promise<void> | null = null;

export function createPostgresContactRepository(
  connectionString: string,
): ContactRepository {
  const pool = new Pool({
    connectionString,
    max: 3,
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 8_000,
    allowExitOnIdle: true,
  });
  try {
    attachDatabasePool(pool);
  } catch {
    /* Running outside Vercel. */
  }

  async function ready() {
    if (!schemaReady) schemaReady = pool.query(SCHEMA).then(() => undefined);
    try {
      await schemaReady;
    } catch (error) {
      schemaReady = null;
      throw error;
    }
  }

  return {
    async consumeRateLimit(rateKey) {
      await ready();
      const { rows } = await pool.query(
        `insert into site_contact_rate_limit (rate_key, window_start, request_count)
         values ($1, date_trunc('hour', now()), 1)
         on conflict (rate_key) do update
           set request_count = case
                 when site_contact_rate_limit.window_start =
                      date_trunc('hour', now())
                 then site_contact_rate_limit.request_count + 1
                 else 1
               end,
               window_start = date_trunc('hour', now())
         returning request_count`,
        [rateKey],
      );
      return Number(rows[0].request_count);
    },

    async saveEnquiry(input) {
      await ready();
      const { rows } = await pool.query(
        `insert into site_contact_enquiry
           (name, contact, interest, message, ip_hash)
         values ($1, $2, $3, $4, $5)
         returning id, name, contact, interest, message, created_at`,
        [
          input.name.trim(),
          input.contact.trim(),
          input.interest.trim(),
          input.message.trim(),
          input.ipHash,
        ],
      );
      const row = rows[0];
      return {
        id: String(row.id),
        name: String(row.name),
        contact: String(row.contact),
        interest: String(row.interest),
        message: String(row.message),
        consent: true,
        company: "",
        createdAt: new Date(row.created_at).toISOString(),
      };
    },

    async listEnquiries(limit = 100) {
      await ready();
      const { rows } = await pool.query(
        `select id, name, contact, interest, message, created_at
           from site_contact_enquiry
          order by created_at desc
          limit $1`,
        [Math.min(Math.max(Math.floor(limit), 1), 250)],
      );
      return rows.map((row) => ({
        id: String(row.id),
        name: String(row.name),
        contact: String(row.contact),
        interest: String(row.interest),
        message: String(row.message),
        consent: true,
        company: "",
        createdAt: new Date(row.created_at).toISOString(),
      }));
    },

    async deleteEnquiry(id) {
      await ready();
      const result = await pool.query(
        `delete from site_contact_enquiry where id = $1 returning id`,
        [id],
      );
      return result.rowCount === 1;
    },
  };
}
