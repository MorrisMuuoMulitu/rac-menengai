import { useEffect, useRef, useState } from "react";
import {
  Check,
  Download,
  ImagePlus,
  Loader2,
  Printer,
  Trash2,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { downloadCertificatePdf } from "./certificate-pdf";
import { prepareCertificatePhoto } from "./certificate-photo";

function formatDate(value: string | null): string {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime()))
    return new Date().toLocaleDateString("en-GB");
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export type CertificateSheetProps = {
  name: string;
  photo: string | null;
  completedAt: string | null;
  score: number;
  total: number;
  certificateNumber: string | null;
  headingId?: string;
  exportLayout?: boolean;
};

export function CertificateSheet({
  name,
  photo,
  completedAt,
  score,
  total,
  certificateNumber,
  headingId,
  exportLayout = false,
}: CertificateSheetProps) {
  const verificationUrl = certificateNumber
    ? `https://rotaractmenengai.org/verify?number=${encodeURIComponent(certificateNumber)}`
    : null;
  return (
    <div
      className={`certificate-sheet${exportLayout ? " certificate-sheet--export" : ""}`}
    >
      <header className="certificate-head">
        <img
          src="/images/branding/rotaract-menengai-lockup.webp"
          alt="Rotaract Club of Menengai"
          width={320}
          height={138}
        />
        <span>Rotary year 2026-2027</span>
      </header>

      <div className="certificate-rule" aria-hidden="true" />
      <div className={`certificate-content${photo ? " has-photo" : ""}`}>
        <div className="certificate-story">
          <p className="certificate-kicker">Rotaract Club of Menengai</p>
          <h3 id={headingId}>Certificate of Completion</h3>
          <p className="certificate-awarded">Awarded to</p>
          <p
            className={`certificate-name${name.length > 34 ? " is-long" : ""}`}
          >
            {name || "Learner"}
          </p>
          <p className="certificate-body">
            for completing <strong>Rotaract, from the ground up</strong>,
            including the twenty lessons, chapter learning and final assessment.
          </p>
          <ul className="certificate-values" aria-label="Course themes">
            <li>Learning</li>
            <li>Service</li>
            <li>Leadership</li>
            <li>Fellowship</li>
          </ul>
        </div>

        {photo ? (
          <figure className="certificate-portrait">
            <img
              src={photo}
              alt={exportLayout ? "" : `Portrait of ${name || "the learner"}`}
            />
            <figcaption>Graduate</figcaption>
          </figure>
        ) : null}
      </div>

      <dl className="certificate-meta">
        <div>
          <dt>Completed</dt>
          <dd>{formatDate(completedAt)}</dd>
        </div>
        <div>
          <dt>Assessment</dt>
          <dd>
            Passed · {score}/{total}
          </dd>
        </div>
        <div>
          <dt>Issued by</dt>
          <dd>Rotaract Club of Menengai</dd>
        </div>
        <div>
          <dt>Certificate number</dt>
          <dd>{certificateNumber ?? "Issued on completion"}</dd>
        </div>
      </dl>

      <footer className="certificate-foot">
        <div className="certificate-signature">
          <img
            src="/images/branding/president-wanjiku-signature.png"
            alt={exportLayout ? "" : "Signature of Wanjiku Nguru, President"}
            width={900}
            height={273}
          />
          <p>
            Wanjiku Nguru
            <span>President, Rotaract Club of Menengai</span>
          </p>
        </div>
        <div className="certificate-pledge">
          Service Above Self
          <span>Nakuru, Kenya · Rotary District 9215</span>
        </div>
        <div className="certificate-marks">
          {verificationUrl ? (
            <div
              className="certificate-qr"
              role={exportLayout ? undefined : "img"}
              aria-label={
                exportLayout ? undefined : "QR code to verify this certificate"
              }
            >
              <QRCodeSVG
                value={verificationUrl}
                size={72}
                level="M"
                bgColor="#fffdf7"
                fgColor="#222b31"
              />
              <span>Scan to verify</span>
            </div>
          ) : null}
          <div className="certificate-mantra-mark">
            <img
              src="/images/branding/thee-magicals.webp"
              alt={exportLayout ? "" : "Thee Magicals, the club mantra"}
              width={202}
              height={218}
            />
          </div>
        </div>
      </footer>
    </div>
  );
}

export function CompletionCertificate({
  name,
  email,
  photo,
  completedAt,
  score,
  total,
  certificateNumber,
  busy,
  onSave,
}: {
  name: string;
  email: string | null;
  photo: string | null;
  completedAt: string | null;
  score: number;
  total: number;
  certificateNumber: string | null;
  busy: boolean;
  onSave: (name: string, photo: string | null) => void;
}) {
  const [draft, setDraft] = useState(name);
  const [draftPhoto, setDraftPhoto] = useState(photo);
  const [nameDirty, setNameDirty] = useState(false);
  const [photoDirty, setPhotoDirty] = useState(false);
  const [saved, setSaved] = useState(false);
  const [photoStatus, setPhotoStatus] = useState<"idle" | "working" | "error">(
    "idle",
  );
  const [photoError, setPhotoError] = useState("");
  const [pdfStatus, setPdfStatus] = useState<"idle" | "working" | "error">(
    "idle",
  );
  const [pdfError, setPdfError] = useState("");
  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!nameDirty && name) setDraft(name);
  }, [nameDirty, name]);

  useEffect(() => {
    if (!photoDirty) setDraftPhoto(photo);
  }, [photo, photoDirty]);

  const cleanName = draft.trim();
  const validName = cleanName.length >= 2;
  const canSave = validName && (cleanName !== name || draftPhoto !== photo);
  const displayName = cleanName || name || "Learner";

  async function choosePhoto(file: File) {
    setPhotoStatus("working");
    setPhotoError("");
    try {
      const prepared = await prepareCertificatePhoto(file);
      setDraftPhoto(prepared);
      setPhotoDirty(true);
      setSaved(false);
      setPhotoStatus("idle");
    } catch (cause) {
      setPhotoStatus("error");
      setPhotoError(
        cause instanceof Error
          ? cause.message
          : "That photo could not be prepared.",
      );
    }
  }

  async function downloadPdf() {
    if (!exportRef.current) return;
    setPdfStatus("working");
    setPdfError("");
    try {
      await downloadCertificatePdf(exportRef.current, displayName);
      setPdfStatus("idle");
    } catch {
      setPdfStatus("error");
      setPdfError(
        "The PDF could not be downloaded. Check your connection and try again.",
      );
    }
  }

  return (
    <section
      id="certificate"
      className="academy-certificate"
      aria-labelledby="completion-certificate-title"
    >
      <CertificateSheet
        name={displayName}
        photo={draftPhoto}
        completedAt={completedAt}
        score={score}
        total={total}
        certificateNumber={certificateNumber}
        headingId="completion-certificate-title"
      />

      <div className="certificate-export-stage" aria-hidden="true">
        <div ref={exportRef}>
          <CertificateSheet
            name={displayName}
            photo={draftPhoto}
            completedAt={completedAt}
            score={score}
            total={total}
            certificateNumber={certificateNumber}
            exportLayout
          />
        </div>
      </div>

      <div className="certificate-editor no-print">
        <div className="certificate-details-fields">
          <label className="academy-field">
            <span className="academy-field-label">Name on certificate</span>
            <input
              type="text"
              value={draft}
              maxLength={120}
              autoComplete="name"
              onChange={(event) => {
                setDraft(event.target.value);
                setNameDirty(true);
                setSaved(false);
              }}
            />
            <span className="academy-hint">
              This is separate from your sign-in email
              {email ? ` (${email})` : ""}. You can update it later.
            </span>
          </label>

          <div className="certificate-photo-field">
            <span className="academy-field-label">Certificate photo</span>
            <div className="certificate-photo-row">
              <div
                className={`certificate-photo-preview${draftPhoto ? " has-photo" : ""}`}
              >
                {draftPhoto ? (
                  <img src={draftPhoto} alt="" />
                ) : (
                  <ImagePlus size={22} aria-hidden="true" />
                )}
              </div>
              <div className="certificate-photo-actions">
                <label
                  className={`btn btn-secondary btn-sm${photoStatus === "working" ? " is-disabled" : ""}`}
                >
                  {photoStatus === "working" ? (
                    <Loader2
                      className="academy-spin"
                      size={15}
                      aria-hidden="true"
                    />
                  ) : (
                    <ImagePlus size={15} aria-hidden="true" />
                  )}
                  {draftPhoto ? "Replace photo" : "Add a photo"}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    disabled={photoStatus === "working"}
                    onChange={(event) => {
                      const file = event.currentTarget.files?.[0];
                      event.currentTarget.value = "";
                      if (file) void choosePhoto(file);
                    }}
                  />
                </label>
                {draftPhoto ? (
                  <button
                    type="button"
                    className="certificate-remove-photo"
                    onClick={() => {
                      setDraftPhoto(null);
                      setPhotoDirty(true);
                      setPhotoError("");
                      setPhotoStatus("idle");
                      setSaved(false);
                    }}
                  >
                    <Trash2 size={14} aria-hidden="true" /> Remove
                  </button>
                ) : null}
              </div>
            </div>
            <p className="academy-hint">
              Optional. We crop it locally and remove camera metadata. Save the
              certificate details to keep it for your next visit.
            </p>
            {photoError ? (
              <p className="certificate-error" role="alert">
                {photoError}
              </p>
            ) : null}
          </div>
        </div>

        <div className="certificate-actions">
          <button
            type="button"
            className="btn btn-secondary btn-md"
            disabled={busy || photoStatus === "working" || !canSave}
            onClick={() => {
              if (!canSave) return;
              onSave(cleanName, draftPhoto);
              setNameDirty(false);
              setPhotoDirty(false);
              setSaved(true);
            }}
          >
            {saved && !canSave ? (
              <>
                <Check size={16} aria-hidden="true" /> Details saved
              </>
            ) : (
              "Save certificate details"
            )}
          </button>
          <button
            type="button"
            className="btn btn-primary btn-md"
            disabled={
              busy || photoStatus === "working" || pdfStatus === "working"
            }
            onClick={() => void downloadPdf()}
          >
            {pdfStatus === "working" ? (
              <>
                <Loader2
                  className="academy-spin"
                  size={17}
                  aria-hidden="true"
                />
                Creating PDF…
              </>
            ) : (
              <>
                <Download size={17} aria-hidden="true" /> Download PDF
              </>
            )}
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-md"
            onClick={() => window.print()}
          >
            <Printer size={16} aria-hidden="true" /> Print instead
          </button>
        </div>

        {pdfError ? (
          <p className="certificate-error" role="alert">
            {pdfError}
          </p>
        ) : null}
        <p className="certificate-note">
          This records completion of the club’s learning course. The practical
          proposal remains part of the joining journey. This certificate is not
          Rotaract membership or a Rotary qualification.
        </p>
      </div>
    </section>
  );
}
