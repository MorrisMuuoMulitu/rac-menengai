// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, expect, it, vi } from "vitest";
import EnquiriesPage from "./Enquiries";

const api = vi.hoisted(() => ({
  load: vi.fn(),
  account: {
    ready: true,
    available: true,
    signedIn: true,
    name: "Club inbox",
    email: "menengairc@gmail.com",
    token: async () => "test-token",
    signOut: null,
  },
}));

vi.mock("../academy/account", () => ({ useAccount: () => api.account }));
vi.mock("../lib/contact-admin", () => ({
  loadContactEnquiries: api.load,
  deleteContactEnquiry: vi.fn(),
}));

afterEach(() => {
  cleanup();
  api.load.mockReset();
});

it("shows stored website enquiries to an officer", async () => {
  api.load.mockResolvedValue({
    signedIn: true,
    enquiries: [
      {
        id: "enquiry-1",
        name: "Amina Wanjiru",
        contact: "amina@example.com",
        interest: "Join the club",
        message: "I would like to visit a Thursday fellowship.",
        createdAt: "2026-11-27T12:00:00.000Z",
      },
    ],
  });

  render(
    <MemoryRouter>
      <EnquiriesPage />
    </MemoryRouter>,
  );

  expect(await screen.findByText("Amina Wanjiru")).toBeTruthy();
  expect(screen.getByText("Join the club")).toBeTruthy();
  expect(
    screen.getByText("I would like to visit a Thursday fellowship."),
  ).toBeTruthy();
  expect(
    screen
      .getByRole("link", { name: /amina@example.com/ })
      .getAttribute("href"),
  ).toBe("mailto:amina@example.com");
});
