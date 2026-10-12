import { describe, it, expect } from "vitest";
import { validateContact, emailDraft } from "./contact";
const valid = {
  name: "Amina",
  contact: "amina@example.com",
  interest: "Join the club",
  message: "I would like to attend a fellowship.",
  consent: true,
  company: "",
};
describe("enquiry validation", () => {
  it("accepts a valid enquiry", () =>
    expect(validateContact(valid)).toEqual({}));
  it("rejects an invalid address and missing consent", () => {
    const errors = validateContact({
      ...valid,
      contact: "broken@",
      consent: false,
    });
    expect(errors.contact).toBeTruthy();
    expect(errors.consent).toBeTruthy();
  });
  it("rejects arbitrary text as a phone number", () =>
    expect(
      validateContact({ ...valid, contact: "abcdefghi" }).contact,
    ).toBeTruthy());
  it("bounds payload lengths", () =>
    expect(
      validateContact({ ...valid, message: "x".repeat(5001) }).message,
    ).toBeTruthy());
  it("encodes an email draft to the verified inbox without sending it", () => {
    const url = emailDraft(valid, "menengairc@gmail.com");
    expect(url).toMatch(/^mailto:menengairc@gmail.com\?/);
    expect(decodeURIComponent(url)).toContain(valid.message);
  });
});
