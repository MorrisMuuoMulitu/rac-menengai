export interface Enquiry {
  name: string;
  contact: string;
  interest: string;
  message: string;
  consent: boolean;
  company: string;
}
export type ContactErrors = Partial<Record<keyof Enquiry, string>>;
export function validateContact(data: Enquiry): ContactErrors {
  const errors: ContactErrors = {};
  if (!data.name?.trim() || data.name.length > 100)
    errors.name = "Enter your name (up to 100 characters).";
  const contact = data.contact?.trim() ?? "";
  if (
    !contact ||
    contact.length > 254 ||
    !(contact.includes("@")
      ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)
      : /^\+?[\d\s()-]{7,25}$/.test(contact))
  )
    errors.contact = "Enter a valid email address or phone number.";
  if (!data.interest?.trim() || data.interest.length > 100)
    errors.interest = "Choose an enquiry topic.";
  if (
    !data.message?.trim() ||
    data.message.trim().length < 10 ||
    data.message.length > 5000
  )
    errors.message = "Write a message between 10 and 5,000 characters.";
  if (data.consent !== true)
    errors.consent = "Confirm that the club may reply to your enquiry.";
  return errors;
}
export function enquiryText(data: Enquiry): string {
  return `Name: ${data.name.trim()}\nReply to: ${data.contact.trim()}\nTopic: ${data.interest}\n\n${data.message.trim()}`;
}
export function emailDraft(data: Enquiry, inbox: string): string {
  return `mailto:${inbox}?subject=${encodeURIComponent(`Menengai enquiry: ${data.interest}`)}&body=${encodeURIComponent(enquiryText(data))}`;
}
