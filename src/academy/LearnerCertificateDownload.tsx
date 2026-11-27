import { useRef, useState } from "react";
import { Download, Loader2 } from "lucide-react";
import {
  AcademyError,
  loadLearnerCertificate,
  type LearnerCertificateDetails,
} from "../lib/academy";
import { CertificateSheet } from "./CompletionCertificate";
import { downloadCertificatePdf } from "./certificate-pdf";

function nextPaint(): Promise<void> {
  return new Promise((resolve) =>
    requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
  );
}

export function LearnerCertificateDownload({
  userId,
  learnerName,
  token,
}: {
  userId: string;
  learnerName: string;
  token: () => Promise<string | null>;
}) {
  const [certificate, setCertificate] =
    useState<LearnerCertificateDetails | null>(null);
  const [status, setStatus] = useState<"idle" | "working" | "error">("idle");
  const [error, setError] = useState("");
  const exportRef = useRef<HTMLDivElement>(null);

  async function download() {
    setStatus("working");
    setError("");
    try {
      const details =
        certificate ??
        (await loadLearnerCertificate(await token(), userId)).certificate;
      if (!certificate) setCertificate(details);
      await nextPaint();
      if (!exportRef.current) throw new Error("Certificate not ready.");
      await downloadCertificatePdf(exportRef.current, details.name);
      setStatus("idle");
    } catch (cause) {
      setStatus("error");
      setError(
        cause instanceof AcademyError
          ? cause.message
          : "The certificate PDF could not be created.",
      );
    }
  }

  return (
    <div className="certificate-row-download">
      <button
        type="button"
        disabled={status === "working"}
        onClick={() => void download()}
        aria-label={`Download ${learnerName}'s certificate PDF`}
      >
        {status === "working" ? (
          <Loader2 className="academy-spin" size={14} aria-hidden="true" />
        ) : (
          <Download size={14} aria-hidden="true" />
        )}
        {status === "working" ? "Creating PDF…" : "Download PDF"}
      </button>
      {error ? (
        <span className="certificate-row-error" role="alert">
          {error}
        </span>
      ) : null}
      {certificate ? (
        <div className="certificate-export-stage" aria-hidden="true">
          <div ref={exportRef}>
            <CertificateSheet
              name={certificate.name}
              photo={certificate.photo}
              completedAt={certificate.completedAt}
              score={certificate.score}
              total={certificate.total}
              certificateNumber={certificate.certificateNumber}
              exportLayout
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
