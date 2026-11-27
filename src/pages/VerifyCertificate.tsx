import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { BadgeCheck, Loader2, Mail, ShieldX } from "lucide-react";
import { PageMeta } from "../components/ui";
import {
  AcademyError,
  verifyCertificate,
  type PublicCertificate,
} from "../lib/academy";

function dateLabel(value: string | null): string {
  if (!value) return "Date not recorded";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date not recorded";
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function VerifyCertificatePage() {
  const [params] = useSearchParams();
  const number = (params.get("number") ?? "").trim().toUpperCase();
  const [status, setStatus] = useState<
    "loading" | "valid" | "invalid" | "missing" | "error"
  >(number ? "loading" : "missing");
  const [certificate, setCertificate] = useState<PublicCertificate | null>(
    null,
  );

  useEffect(() => {
    let active = true;
    if (!number) {
      setStatus("missing");
      return () => {
        active = false;
      };
    }
    setStatus("loading");
    verifyCertificate(number)
      .then((result) => {
        if (!active) return;
        setCertificate(result.certificate);
        setStatus("valid");
      })
      .catch((cause) => {
        if (!active) return;
        setStatus(
          cause instanceof AcademyError && cause.status === 404
            ? "invalid"
            : "error",
        );
      });
    return () => {
      active = false;
    };
  }, [number]);

  return (
    <>
      <PageMeta
        title="Verify a certificate"
        description="Verify a completion certificate issued by the Rotaract Club of Menengai."
        robots="noindex"
      />
      <section className="section certificate-verify-page">
        <div className="container certificate-verify-shell">
          <header className="certificate-verify-head">
            <img
              src="/images/branding/rotaract-menengai-lockup.webp"
              alt="Rotaract Club of Menengai"
              width={320}
              height={138}
            />
            <span>Official certificate verification</span>
          </header>

          {status === "loading" ? (
            <div className="certificate-verify-state" role="status">
              <Loader2 className="academy-spin" size={24} aria-hidden="true" />
              <h1>Checking certificate</h1>
              <p>Confirming the number against the club’s records.</p>
            </div>
          ) : null}

          {status === "valid" && certificate ? (
            <div className="certificate-verify-result is-valid">
              <div className="certificate-verify-state">
                <BadgeCheck size={34} aria-hidden="true" />
                <p className="certificate-verify-kicker">Verified</p>
                <h1>{certificate.name}</h1>
                <p>
                  completed <strong>{certificate.courseTitle}</strong> through
                  the Rotaract Club of Menengai Membership Academy.
                </p>
              </div>
              <dl className="certificate-verify-details">
                <div>
                  <dt>Certificate number</dt>
                  <dd>{certificate.number}</dd>
                </div>
                <div>
                  <dt>Completed</dt>
                  <dd>{dateLabel(certificate.completedAt)}</dd>
                </div>
                <div>
                  <dt>Rotary year</dt>
                  <dd>{certificate.rotaryYear}</dd>
                </div>
                <div>
                  <dt>Issued by</dt>
                  <dd>
                    {certificate.issuedBy}
                    <span>Signed by {certificate.president}, President</span>
                  </dd>
                </div>
              </dl>
              <p className="certificate-verify-note">
                This confirms that the certificate number is present in the
                club’s records. It is not proof of Rotaract membership or a
                Rotary qualification.
              </p>
            </div>
          ) : null}

          {status === "invalid" || status === "missing" ? (
            <div className="certificate-verify-result">
              <div className="certificate-verify-state">
                <ShieldX size={34} aria-hidden="true" />
                <p className="certificate-verify-kicker">Not verified</p>
                <h1>Certificate not found</h1>
                <p>
                  {status === "missing"
                    ? "Scan the QR code on the certificate to open its verification link."
                    : "The certificate number is not in the club’s current records. Check the number or contact the club."}
                </p>
              </div>
            </div>
          ) : null}

          {status === "error" ? (
            <div className="certificate-verify-result">
              <div className="certificate-verify-state">
                <ShieldX size={34} aria-hidden="true" />
                <p className="certificate-verify-kicker">Unable to check</p>
                <h1>Verification is temporarily unavailable</h1>
                <p>Try again in a moment or contact the club directly.</p>
              </div>
            </div>
          ) : null}

          <footer className="certificate-verify-foot">
            <span>Rotaract Club of Menengai · Rotary year 2026-2027</span>
            <a href="mailto:menengairc@gmail.com">
              <Mail size={15} aria-hidden="true" /> menengairc@gmail.com
            </a>
          </footer>
        </div>
      </section>
    </>
  );
}
