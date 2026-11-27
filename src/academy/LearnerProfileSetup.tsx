import { useState } from "react";
import { Loader2, UserRoundCheck } from "lucide-react";
import type { AcademyBootstrap } from "../lib/academy";

export function LearnerProfileSetup({
  profile,
  busy,
  onSave,
}: {
  profile: NonNullable<AcademyBootstrap["profile"]>;
  busy: boolean;
  onSave: (phone: string, officialName: string) => void;
}) {
  const [phone, setPhone] = useState(profile.phone ?? "");
  const [officialName, setOfficialName] = useState(
    profile.officialName ?? profile.displayName ?? "",
  );

  if (profile.complete) return null;

  return (
    <section
      id="learner-profile-setup"
      className="learner-profile-setup"
      aria-labelledby="learner-profile-setup-title"
    >
      <div className="container learner-profile-setup-inner">
        <div className="learner-profile-setup-copy">
          <span>
            <UserRoundCheck size={15} aria-hidden="true" /> Your learner record
          </span>
          <h2 id="learner-profile-setup-title">
            How should the club reach you?
          </h2>
          <p>
            Add a phone number and the official name you want printed on your
            certificate. You only need to do this once.
          </p>
        </div>
        <form
          className="learner-profile-setup-form"
          onSubmit={(event) => {
            event.preventDefault();
            onSave(phone.trim(), officialName.trim());
          }}
        >
          <label>
            <span>Phone number</span>
            <input
              type="tel"
              autoComplete="tel"
              required
              minLength={7}
              maxLength={40}
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="+254…"
            />
          </label>
          <label>
            <span>Official name on certificate</span>
            <input
              type="text"
              autoComplete="name"
              required
              minLength={2}
              maxLength={120}
              value={officialName}
              onChange={(event) => setOfficialName(event.target.value)}
            />
          </label>
          <button
            type="submit"
            className="btn btn-primary btn-md"
            disabled={busy}
          >
            {busy ? (
              <Loader2 className="academy-spin" size={16} aria-hidden="true" />
            ) : null}
            Save learner details
          </button>
        </form>
      </div>
    </section>
  );
}
