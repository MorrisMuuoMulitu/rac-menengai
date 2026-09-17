/**
 * First-party contact / membership-interest form.
 *
 * There is no backend (no club email/phone has been supplied — see
 * docs/CONTENT_AUDIT.md), so submission is validated client-side and the
 * success state explains exactly how to reach the club. The moment a real
 * endpoint (club email, Formspree, Web3Forms…) exists, only the `submit`
 * handler needs replacing. Nothing is silently "sent".
 */
import { useRef, useState, type FormEvent } from 'react';
import { ArrowRight, CheckCircle2, Send } from 'lucide-react';
import { CONTACT, SOCIALS } from '../data';

interface FormState {
  name: string;
  contact: string; // email or phone
  interest: string;
  message: string;
  consent: boolean;
}

type Errors = Partial<Record<keyof FormState | 'contactInvalid', string>>;

const EMPTY: FormState = { name: '', contact: '', interest: CONTACT.interests[0], message: '', consent: false };

function validate(f: FormState): Errors {
  const errors: Errors = {};
  if (!f.name.trim()) errors.name = 'Please tell us your name.';
  if (!f.contact.trim()) {
    errors.contact = 'Please add an email or phone number so we can reply.';
  } else if (f.contact.includes('@')) {
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.contact.trim());
    if (!emailOk) errors.contact = 'That email address doesn’t look right — please check it.';
  } else if (f.contact.trim().length < 7) {
    errors.contact = 'That phone number looks too short — please check it.';
  }
  if (f.message.trim().length < 10) errors.message = 'A sentence or two helps us answer you well.';
  if (!f.consent) errors.consent = 'Please tick the box so we may reply to you.';
  return errors;
}

export function ContactForm({ defaultInterest, heading = 'Message the club', lead }: { defaultInterest?: string; heading?: string; lead?: string }) {
  const [form, setForm] = useState<FormState>({ ...EMPTY, interest: defaultInterest ?? EMPTY.interest });
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);
  const [touched, setTouched] = useState(false);
  const successRef = useRef<HTMLDivElement | null>(null);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (touched) setErrors(validate({ ...form, [key]: value }));
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setTouched(true);
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setSent(true);
    requestAnimationFrame(() => successRef.current?.focus());
  };

  const reset = () => {
    setForm({ ...EMPTY, interest: defaultInterest ?? EMPTY.interest });
    setErrors({});
    setTouched(false);
    setSent(false);
  };

  if (sent) {
    return (
      <div className="form-success" ref={successRef} tabIndex={-1} role="status" aria-live="polite">
        <CheckCircle2 aria-hidden="true" />
        <h3>Thank you, {form.name.trim().split(' ')[0]}.</h3>
        <p>
          Your message is ready to go — and we’d love to reply personally. This site is run by volunteers without a
          connected inbox yet, so to make sure your message reaches us, send it to the club on Facebook or Instagram:
        </p>
        <div className="form-success-actions">
          <a className="btn btn-primary btn-md" href={SOCIALS.facebook} target="_blank" rel="noopener noreferrer">
            Message us on Facebook <ArrowRight aria-hidden="true" />
          </a>
          <a className="btn btn-secondary btn-md" href={SOCIALS.instagram} target="_blank" rel="noopener noreferrer">
            Message us on Instagram <ArrowRight aria-hidden="true" />
          </a>
        </div>
        <p className="form-success-note">
          Include your name and “{form.interest}” so the right officer picks it up.
        </p>
        <button className="form-reset" type="button" onClick={reset}>
          Send another message
        </button>
      </div>
    );
  }

  const err = (k: keyof Errors) => (errors[k] ? <span className="field-error" id={`err-${k}`}>{errors[k]}</span> : null);

  return (
    <form className="contact-form" onSubmit={onSubmit} noValidate>
      <div className="form-head">
        <h3>{heading}</h3>
        {lead ? <p>{lead}</p> : <p>{CONTACT.formNote}</p>}
      </div>

      <div className="field">
        <label htmlFor="cf-name">Your name</label>
        <input
          id="cf-name"
          type="text"
          autoComplete="name"
          value={form.name}
          onChange={(e) => set('name', e.target.value)}
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? 'err-name' : undefined}
          placeholder="e.g. Amina Wanjiru"
        />
        {err('name')}
      </div>

      <div className="field">
        <label htmlFor="cf-contact">Email or phone</label>
        <input
          id="cf-contact"
          type="text"
          autoComplete="email"
          inputMode="email"
          value={form.contact}
          onChange={(e) => set('contact', e.target.value)}
          aria-invalid={errors.contact ? true : undefined}
          aria-describedby={errors.contact ? 'err-contact' : undefined}
          placeholder="you@example.com or +254 7xx xxx xxx"
        />
        {err('contact')}
      </div>

      <div className="field">
        <label htmlFor="cf-interest">I’m interested in</label>
        <select id="cf-interest" value={form.interest} onChange={(e) => set('interest', e.target.value)}>
          {CONTACT.interests.map((i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="cf-message">Your message</label>
        <textarea
          id="cf-message"
          rows={4}
          value={form.message}
          onChange={(e) => set('message', e.target.value)}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? 'err-message' : undefined}
          placeholder="Tell us a bit about why you’re reaching out…"
        />
        {err('message')}
      </div>

      <div className="field field-check">
        <label className="check-label" htmlFor="cf-consent">
          <input
            id="cf-consent"
            type="checkbox"
            checked={form.consent}
            onChange={(e) => set('consent', e.target.checked)}
            aria-invalid={errors.consent ? true : undefined}
            aria-describedby={errors.consent ? 'err-consent' : undefined}
          />
          <span>I’m happy for the club to reply to me about this message.</span>
        </label>
        {errors.consent ? (
          <span className="field-error" id="err-consent">
            {errors.consent}
          </span>
        ) : null}
      </div>

      <div className="form-actions">
        <button className="btn btn-primary btn-lg" type="submit">
          Send message <Send aria-hidden="true" />
        </button>
        <p className="form-hint">No account needed — one of our officers will get back to you.</p>
      </div>
    </form>
  );
}