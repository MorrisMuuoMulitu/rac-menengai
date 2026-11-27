import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ClipboardCheck,
  Loader2,
  Mail,
  MessageSquare,
  ShieldAlert,
  Trash2,
  Users,
} from "lucide-react";
import { PageMeta } from "../components/ui";
import { AccountChip } from "../academy/AccountChip";
import { useAccount } from "../academy/account";
import { AcademyError } from "../lib/academy";
import {
  deleteContactEnquiry,
  loadContactEnquiries,
  type ContactEnquiry,
} from "../lib/contact-admin";
import "../academy.css";

function when(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date not recorded";
  return date.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function EnquiriesPage() {
  const account = useAccount();
  const [rows, setRows] = useState<ContactEnquiry[] | null>(null);
  const [status, setStatus] = useState<
    "loading" | "ready" | "denied" | "signed-out" | "error"
  >("loading");
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");

  const load = useCallback(async () => {
    try {
      const result = await loadContactEnquiries(await account.token());
      setRows(result.enquiries);
      setStatus("ready");
    } catch (cause) {
      if (cause instanceof AcademyError && cause.status === 403) {
        setStatus("denied");
        return;
      }
      setError(
        cause instanceof AcademyError
          ? cause.message
          : "We could not load the enquiries.",
      );
      setStatus("error");
    }
  }, [account]);

  useEffect(() => {
    if (!account.ready) return;
    if (!account.signedIn) {
      setStatus("signed-out");
      return;
    }
    void load();
  }, [account.ready, account.signedIn, load]);

  return (
    <>
      <PageMeta
        title="Website enquiries"
        description="Contact enquiries sent through the Rotaract Club of Menengai website."
        robots="noindex"
      />
      <section className="section academy-queue">
        <div className="container">
          <Link className="academy-back" to="/membership/academy">
            <ArrowLeft size={15} aria-hidden="true" /> Back to the academy
          </Link>
          <h1 className="academy-h1">
            <MessageSquare size={26} aria-hidden="true" /> Website enquiries
          </h1>
          <AccountChip tone="light" />
          <p className="academy-lede">
            Messages submitted through the contact form. Only verified club
            officers can see this page.
          </p>
          <p className="academy-queue-links">
            <Link to="/membership/queue">
              <ClipboardCheck size={15} aria-hidden="true" /> Membership
              applications
            </Link>
            <Link to="/membership/learners">
              <Users size={15} aria-hidden="true" /> Learner progress
            </Link>
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

          {status === "signed-out" ? (
            <div className="academy-notice info">
              <ShieldAlert size={18} aria-hidden="true" />
              <span>
                Sign in with an approved club email to read website enquiries.{" "}
                <Link to="/membership/sign-in">Sign in</Link>
              </span>
            </div>
          ) : null}

          {status === "denied" ? (
            <div className="academy-notice info">
              <ShieldAlert size={18} aria-hidden="true" />
              <span>
                This page is for club officers. Ask the club to add your
                verified email address to the reviewer list.
              </span>
            </div>
          ) : null}

          {status === "ready" && rows?.length === 0 ? (
            <p>No website enquiries yet.</p>
          ) : null}

          {status === "ready" && rows?.length ? (
            <div className="academy-enquiry-list">
              {rows.map((row) => (
                <article className="academy-enquiry-card" key={row.id}>
                  <header>
                    <div>
                      <h2>{row.name}</h2>
                      <p>{row.interest}</p>
                    </div>
                    <time dateTime={row.createdAt}>{when(row.createdAt)}</time>
                  </header>
                  <a
                    className="academy-enquiry-contact"
                    href={
                      row.contact.includes("@")
                        ? `mailto:${row.contact}`
                        : row.contact.replace(/[^\d+]/g, "").length > 6
                          ? `tel:${row.contact.replace(/[^\d+]/g, "")}`
                          : undefined
                    }
                  >
                    <Mail size={14} aria-hidden="true" /> {row.contact}
                  </a>
                  <p className="academy-enquiry-message">{row.message}</p>
                  <button
                    type="button"
                    className="academy-enquiry-remove"
                    disabled={busyId === row.id}
                    onClick={async () => {
                      if (!window.confirm("Remove this enquiry permanently?"))
                        return;
                      setBusyId(row.id);
                      setError("");
                      try {
                        await deleteContactEnquiry(
                          await account.token(),
                          row.id,
                        );
                        setRows(
                          (current) =>
                            current?.filter((item) => item.id !== row.id) ??
                            null,
                        );
                      } catch (cause) {
                        setError(
                          cause instanceof AcademyError
                            ? cause.message
                            : "That enquiry could not be removed.",
                        );
                      } finally {
                        setBusyId("");
                      }
                    }}
                  >
                    {busyId === row.id ? (
                      <Loader2
                        className="academy-spin"
                        size={14}
                        aria-hidden="true"
                      />
                    ) : (
                      <Trash2 size={14} aria-hidden="true" />
                    )}
                    Remove
                  </button>
                </article>
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}
