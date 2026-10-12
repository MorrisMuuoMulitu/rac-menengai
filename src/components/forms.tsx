import { useRef, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { CONTACT, contactConfig, SOCIALS } from "../data";
import {
  emailDraft,
  enquiryText,
  validateContact,
  type Enquiry,
  type ContactErrors,
} from "../lib/contact";
const DELIVERY_ENABLED = import.meta.env.VITE_CONTACT_DELIVERY === "true";
export function ContactForm({
  defaultInterest,
  heading = "Message the club",
  lead,
}: {
  defaultInterest?: string;
  heading?: string;
  lead?: string;
}) {
  const [form, setForm] = useState<Enquiry>({
    name: "",
    contact: "",
    interest: defaultInterest ?? CONTACT.interests[0],
    message: "",
    consent: false,
    company: "",
  });
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<
    "editing" | "draft" | "sending" | "sent"
  >("editing");
  const [failure, setFailure] = useState("");
  const [copied, setCopied] = useState(false);
  const result = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const update = (key: keyof Enquiry, value: string | boolean) => {
    setForm((old) => ({ ...old, [key]: value }));
    setFailure("");
  };
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (status === "sending") return;
    const errs = validateContact(form);
    setErrors(errs);
    if (Object.keys(errs).length) {
      setFailure("Check the highlighted fields.");
      requestAnimationFrame(() =>
        formRef.current
          ?.querySelector<HTMLElement>('[aria-invalid="true"]')
          ?.focus(),
      );
      return;
    }
    if (form.company) return;
    if (!DELIVERY_ENABLED) {
      setStatus("draft");
      requestAnimationFrame(() => result.current?.focus());
      return;
    }
    setStatus("sending");
    setFailure("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        signal: AbortSignal.timeout(15000),
      });
      const payload = await response.json();
      if (!response.ok || payload.delivered !== true) throw new Error();
      setStatus("sent");
      requestAnimationFrame(() => result.current?.focus());
    } catch {
      setStatus("editing");
      setFailure(
        "Your message was not sent. Your details are still here. Try again or use the email link below.",
      );
    }
  }
  if (status === "draft" || status === "sent")
    return (
      <div className="form-success" ref={result} tabIndex={-1} role="status">
        <h3>
          {status === "sent" ? "Message sent" : "Your email draft is ready"}
        </h3>
        <p>
          {status === "sent"
            ? "The message has been accepted by the club’s email delivery service. An officer will reply when available."
            : "Nothing has been sent yet. Open this draft in your email app, check it, then send it to the club. You can also copy it into a social message."}
        </p>
        {status === "draft" && (
          <>
            <pre className="message-draft">{enquiryText(form)}</pre>
            <a
              className="btn btn-primary btn-md"
              href={emailDraft(form, contactConfig.email)}
            >
              Open email draft
            </a>
            <button
              type="button"
              className="btn btn-secondary btn-md"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(enquiryText(form));
                  setCopied(true);
                } catch {
                  setFailure(
                    "Copy is unavailable. Select the message above and copy it manually.",
                  );
                }
              }}
            >
              {copied ? "Copied" : "Copy message"}
            </button>
            <a
              className="text-link"
              href={SOCIALS.instagram}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open club Instagram
            </a>
          </>
        )}
        {failure && <p role="alert">{failure}</p>}
        <button
          type="button"
          className="form-reset"
          onClick={() => setStatus("editing")}
        >
          {status === "draft" ? "Edit draft" : "Write another message"}
        </button>
      </div>
    );
  const error = (key: keyof Enquiry) =>
    errors[key] ? (
      <span className="field-error" id={`err-${key}`}>
        {errors[key]}
      </span>
    ) : null;
  return (
    <form ref={formRef} className="contact-form" onSubmit={submit} noValidate>
      <div className="form-head">
        <h3>{heading}</h3>
        <p>
          {lead ??
            (DELIVERY_ENABLED
              ? "Send an enquiry to the club."
              : "Prepare an email to menengairc@gmail.com. You’ll send it from your own email app.")}
        </p>
      </div>
      <div className="field">
        <label htmlFor="cf-name">Your name</label>
        <input
          id="cf-name"
          autoComplete="name"
          maxLength={100}
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "err-name" : undefined}
        />
        {error("name")}
      </div>
      <div className="field">
        <label htmlFor="cf-contact">Email or phone</label>
        <input
          id="cf-contact"
          autoComplete="email"
          maxLength={254}
          value={form.contact}
          onChange={(e) => update("contact", e.target.value)}
          aria-invalid={!!errors.contact}
          aria-describedby={errors.contact ? "err-contact" : undefined}
        />
        {error("contact")}
      </div>
      <div className="field">
        <label htmlFor="cf-interest">Enquiry topic</label>
        <select
          id="cf-interest"
          value={form.interest}
          onChange={(e) => update("interest", e.target.value)}
        >
          {CONTACT.interests.map((i) => (
            <option key={i}>{i}</option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor="cf-message">Your message</label>
        <textarea
          id="cf-message"
          rows={5}
          maxLength={5000}
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "err-message" : undefined}
        />
        {error("message")}
      </div>
      <div hidden aria-hidden="true">
        <label htmlFor="cf-company">Company website</label>
        <input
          id="cf-company"
          tabIndex={-1}
          autoComplete="off"
          value={form.company}
          onChange={(e) => update("company", e.target.value)}
        />
      </div>
      <div className="field">
        <label className="check-label">
          <input
            type="checkbox"
            checked={form.consent}
            onChange={(e) => update("consent", e.target.checked)}
            aria-invalid={!!errors.consent}
            aria-describedby={errors.consent ? "err-consent" : undefined}
          />
          <span>The club may use these details to reply to my enquiry.</span>
        </label>
        {error("consent")}
      </div>
      <p className="form-hint">
        Details stay on this page until you choose to send them.{" "}
        <Link to="/privacy">Privacy notice</Link>
      </p>
      {failure && (
        <p className="field-error" role="alert">
          {failure}
        </p>
      )}
      <button
        className="btn btn-primary btn-md"
        disabled={status === "sending"}
      >
        {status === "sending"
          ? "Sending…"
          : DELIVERY_ENABLED
            ? "Send enquiry"
            : "Prepare email draft"}
      </button>
      <p className="form-hint">
        Replies are handled by volunteers. Please allow time for an officer to
        respond.
      </p>
    </form>
  );
}
