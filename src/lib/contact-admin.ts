import { AcademyError } from "./academy";

export interface ContactEnquiry {
  id: string;
  name: string;
  contact: string;
  interest: string;
  message: string;
  createdAt: string;
}

export async function loadContactEnquiries(
  token: string | null,
): Promise<{ signedIn: true; enquiries: ContactEnquiry[] }> {
  const response = await fetch("/api/contact", {
    method: "GET",
    credentials: "same-origin",
    cache: "no-store",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  const body = (await response.json()) as {
    error?: string;
    signedIn?: true;
    enquiries?: ContactEnquiry[];
  };
  if (!response.ok || !body.enquiries)
    throw new AcademyError(
      body.error ?? "We could not load the enquiries.",
      response.status,
    );
  return { signedIn: true, enquiries: body.enquiries };
}

export async function deleteContactEnquiry(
  token: string | null,
  id: string,
): Promise<void> {
  const response = await fetch(`/api/contact?id=${encodeURIComponent(id)}`, {
    method: "DELETE",
    credentials: "same-origin",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  const body = (await response.json()) as { error?: string };
  if (!response.ok)
    throw new AcademyError(
      body.error ?? "That enquiry could not be removed.",
      response.status,
    );
}
