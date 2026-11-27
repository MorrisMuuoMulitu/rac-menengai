import { useRef, useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { CertificateSheet } from "./CompletionCertificate";
import { downloadCertificatePdf } from "./certificate-pdf";

function nextPaint(): Promise<void> {
  return new Promise((resolve) =>
    requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
  );
}

export function CertificateDownloadButton({
  name,
  photo,
  completedAt,
  score,
  total,
  certificateNumber,
}: {
  name: string;
  photo: string | null;
  completedAt: string | null;
  score: number;
  total: number;
  certificateNumber: string | null;
}) {
  const exportRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"idle" | "working" | "error">("idle");
  const [error, setError] = useState("");

  async function download() {
    if (!exportRef.current) return;
    setStatus("working");
    setError("");
    try {
      await nextPaint();
      await downloadCertificatePdf(exportRef.current, name || "Learner");
      setStatus("idle");
    } catch {
      setStatus("error");
      setError("The certificate PDF could not be downloaded. Try again.");
    }
  }

  return (
    <div className="certificate-ready-download">
      <button
        type="button"
        className="btn btn-primary btn-md"
        disabled={status === "working"}
        onClick={() => void download()}
      >
        {status === "working" ? (
          <Loader2 className="academy-spin" size={17} aria-hidden="true" />
        ) : (
          <Download size={17} aria-hidden="true" />
        )}
        {status === "working" ? "Creating PDF…" : "Download certificate"}
      </button>
      {error ? (
        <span className="certificate-row-error" role="alert">
          {error}
        </span>
      ) : null}
      <div className="certificate-export-stage" aria-hidden="true">
        <div ref={exportRef}>
          <CertificateSheet
            name={name || "Learner"}
            photo={photo}
            completedAt={completedAt}
            score={score}
            total={total}
            certificateNumber={certificateNumber}
            exportLayout
          />
        </div>
      </div>
    </div>
  );
}
