/**
 * The membership team's queue.
 *
 * Only a signed-in officer whose verified email is on the club's reviewer list
 * sees this. Everything shown here came from the server; every decision goes
 * back to the server, is checked against the legal transitions, and is
 * recorded with who made it and when.
 */

import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ClipboardCheck,
  Loader2,
  ShieldAlert,
  ThumbsUp,
  Undo2,
} from "lucide-react";
import { PageMeta } from "../components/ui";
import { useAccount } from "../academy/account";
import {
  AcademyError,
  loadReviewQueue,
  recordDecision,
  type MembershipApplication,
} from "../lib/academy";
import { APPLICATION_STATUS_LABEL } from "../../shared/rotaract-academy/application";
import "../academy.css";

type QueueItem = MembershipApplication & { userId: string };

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

export default function ReviewQueuePage() {
  const account = useAccount();
  const [queue, setQueue] = useState<QueueItem[] | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "denied" | "error">(
    "loading",
  );
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");
  const [notes, setNotes] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    try {
      const token = await account.token();
      const result = await loadReviewQueue(token);
      setQueue(result.queue);
      setStatus("ready");
    } catch (cause) {
      if (cause instanceof AcademyError && cause.status === 403) {
        setStatus("denied");
        return;
      }
      setError(
        cause instanceof AcademyError
          ? cause.message
          : "We could not load the queue.",
      );
      setStatus("error");
    }
  }, [account]);

  /* The queue is useless before sign-in has resolved, so wait for it. */
  useEffect(() => {
    if (!account.ready) return;
    void load();
  }, [account.ready, load]);

  const decide = async (
    item: QueueItem,
    next: MembershipApplication["status"],
  ) => {
    setBusyId(item.id);
    setError("");
    try {
      const token = await account.token();
      await recordDecision(token, item.id, next, notes[item.id] ?? "");
      await load();
    } catch (cause) {
      setError(
        cause instanceof AcademyError
          ? cause.message
          : "That decision did not save.",
      );
    } finally {
      setBusyId("");
    }
  };

  return (
    <>
      <PageMeta
        title="Membership applications"
        description="The Rotaract Club of Menengai membership team’s application queue."
        robots="noindex"
      />
      <section className="section academy-queue">
        <div className="container">
          <Link className="academy-back" to="/membership/academy">
            <ArrowLeft size={15} aria-hidden="true" /> Back to the academy
          </Link>
          <h1 className="academy-h1">
            <ClipboardCheck size={26} aria-hidden="true" /> Applications
          </h1>
          <p className="academy-lede">
            People who have finished the course and asked to join. Reading one
            is not a decision; record the decision here so the applicant sees
            it, and so the club has a record of who did what.
          </p>

          {error ? (
            <p className="academy-notice error" role="alert">
              <ShieldAlert size={18} aria-hidden="true" /> {error}
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

          {status === "ready" && queue?.length === 0 ? (
            <p>Nothing waiting. Applications appear here once they are sent.</p>
          ) : null}

          {queue?.map((item) => (
            <article className="academy-application-card" key={item.id}>
              <header>
                <div>
                  <h2>{item.fullName || "Unnamed applicant"}</h2>
                  <p>
                    {item.profession} · {item.location}
                  </p>
                </div>
                <span className={`academy-status ${item.status}`}>
                  {APPLICATION_STATUS_LABEL[item.status]}
                </span>
              </header>
              <dl className="academy-application-meta">
                <div>
                  <dt>Email</dt>
                  <dd>
                    <a href={`mailto:${item.email}`}>{item.email}</a>
                  </dd>
                </div>
                <div>
                  <dt>Phone</dt>
                  <dd>{item.phone}</dd>
                </div>
                <div>
                  <dt>Availability</dt>
                  <dd>{item.availability}</dd>
                </div>
                <div>
                  <dt>Sent</dt>
                  <dd>{when(item.submittedAt)}</dd>
                </div>
                <div>
                  <dt>Course score</dt>
                  <dd>
                    {item.courseScore} · {item.courseVersion}
                  </dd>
                </div>
                <div>
                  <dt>Last decided by</dt>
                  <dd>{item.decidedBy ?? "—"}</dd>
                </div>
              </dl>
              <div className="academy-application-motivation">
                <h3>In their words</h3>
                <p>{item.motivation}</p>
              </div>
              {item.decisionNote ? (
                <p className="academy-note">{item.decisionNote}</p>
              ) : null}
              <label className="academy-field">
                <span className="academy-field-label">
                  Note for the applicant
                </span>
                <span className="academy-hint">
                  Required if you need something back from them.
                </span>
                <textarea
                  rows={3}
                  maxLength={500}
                  value={notes[item.id] ?? item.decisionNote ?? ""}
                  onChange={(event) =>
                    setNotes((previous) => ({
                      ...previous,
                      [item.id]: event.target.value,
                    }))
                  }
                />
              </label>
              <div className="academy-actions">
                {item.status === "submitted" ? (
                  <button
                    type="button"
                    className="btn btn-secondary btn-md"
                    disabled={busyId === item.id}
                    onClick={() => decide(item, "in_review")}
                  >
                    Take it on
                  </button>
                ) : null}
                {item.status === "in_review" ? (
                  <>
                    <button
                      type="button"
                      className="btn btn-primary btn-md"
                      disabled={busyId === item.id}
                      onClick={() => decide(item, "approved")}
                    >
                      <ThumbsUp aria-hidden="true" /> Approve
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary btn-md"
                      disabled={busyId === item.id}
                      onClick={() => decide(item, "needs_more")}
                    >
                      <Undo2 aria-hidden="true" /> Ask for something
                    </button>
                  </>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
