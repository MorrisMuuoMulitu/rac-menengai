// @vitest-environment jsdom
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import LearnerProgressPage from "./LearnerProgress";
import {
  AcademyError,
  type LearnerProgressResponse,
  type LearnerProgressRow,
} from "../lib/academy";

const api = vi.hoisted(() => ({
  load: vi.fn(),
  account: {
    ready: true,
    available: true,
    signedIn: true,
    name: "Membership team",
    email: "officer@example.com",
    token: async () => "isolated-test-token",
    signOut: null,
  },
}));
vi.mock("../academy/account", () => ({ useAccount: () => api.account }));
vi.mock("../lib/academy", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../lib/academy")>()),
  loadLearnerProgress: api.load,
}));

function row(patch: Partial<LearnerProgressRow>): LearnerProgressRow {
  return {
    userId: "u1",
    displayName: "Amina Wanjiru",
    email: "amina@example.com",
    startedAt: "2026-09-01T09:00:00.000Z",
    lastProgressAt: "2026-09-10T09:00:00.000Z",
    lastSeenAt: "2026-09-10T09:00:00.000Z",
    completed: 7,
    total: 30,
    percent: 23,
    stage: "lessons",
    lessonsDone: 5,
    lessonsTotal: 20,
    checksDone: 2,
    checksTotal: 7,
    bestScore: 0,
    attempts: 0,
    assessmentPassed: false,
    proposalSubmitted: false,
    canApply: false,
    applicationStatus: null,
    cohort: "needs-nudge",
    daysIdle: 36,
    ...patch,
  };
}

function payload(rows: LearnerProgressRow[]): LearnerProgressResponse {
  const count = (cohort: LearnerProgressRow["cohort"]) =>
    rows.filter((item) => item.cohort === cohort).length;
  return {
    signedIn: true,
    reviewer: true,
    nudgeAfterDays: 21,
    totals: {
      all: rows.length,
      needsNudge: count("needs-nudge"),
      inProgress: count("in-progress"),
      notStarted: count("not-started"),
      done: count("done"),
    },
    learners: rows,
  };
}

const renderPage = () =>
  render(
    <MemoryRouter>
      <LearnerProgressPage />
    </MemoryRouter>,
  );

beforeEach(() => api.load.mockReset());
afterEach(cleanup);

it("shows where a stalled learner stopped, and says how long they have been quiet", async () => {
  api.load.mockResolvedValue(payload([row({})]));
  renderPage();
  expect(await screen.findByText("Amina Wanjiru")).toBeTruthy();
  expect(
    screen.getByText("Lesson 5 of 20, 2 of 7 chapter checks"),
  ).toBeTruthy();
  expect(screen.getByText(/last activity 36 days ago/)).toBeTruthy();
  const card = screen.getByText("Amina Wanjiru").closest("li")!;
  expect(within(card).getByText("Needs a nudge")).toBeTruthy();
  /* The threshold is stated on the page rather than left as a magic number. */
  expect(screen.getByText(/21 days or more/)).toBeTruthy();
});

it("separates a finished learner from one who needs chasing", async () => {
  api.load.mockResolvedValue(
    payload([
      row({}),
      row({
        userId: "u2",
        displayName: "Otieno",
        email: "otieno@example.com",
        completed: 30,
        percent: 100,
        stage: "complete",
        lessonsDone: 20,
        checksDone: 7,
        attempts: 1,
        bestScore: 18,
        assessmentPassed: true,
        proposalSubmitted: true,
        canApply: true,
        cohort: "done",
        daysIdle: 300,
      }),
    ]),
  );
  renderPage();
  const finished = (await screen.findByText("Otieno")).closest("li")!;
  expect(within(finished).getByText("Finished")).toBeTruthy();
  /* A finished learner is never called stalled, however long ago they stopped. */
  expect(within(finished).queryByText("Needs a nudge")).toBeNull();
  expect(within(finished).getByText(/passed · 18\/30/)).toBeTruthy();
});

it("filters to the learners who need a nudge", async () => {
  api.load.mockResolvedValue(
    payload([
      row({}),
      row({
        userId: "u2",
        displayName: "Racheal",
        email: "racheal@example.com",
        cohort: "in-progress",
        daysIdle: 2,
      }),
    ]),
  );
  renderPage();
  await screen.findByText("Amina Wanjiru");
  fireEvent.click(screen.getByRole("button", { name: /Needs a nudge/ }));
  expect(screen.getByText("Amina Wanjiru")).toBeTruthy();
  expect(screen.queryByText("Racheal")).toBeNull();
});

it("searches by the address an officer would actually use", async () => {
  api.load.mockResolvedValue(
    payload([
      row({}),
      row({
        userId: "u2",
        displayName: "Racheal",
        email: "racheal@example.com",
        cohort: "in-progress",
      }),
    ]),
  );
  renderPage();
  await screen.findByText("Amina Wanjiru");
  fireEvent.change(screen.getByRole("searchbox"), {
    target: { value: "racheal@" },
  });
  expect(screen.getByText("Racheal")).toBeTruthy();
  expect(screen.queryByText("Amina Wanjiru")).toBeNull();
});

it("tells a non-officer plainly instead of showing an empty list", async () => {
  api.load.mockRejectedValueOnce(
    new AcademyError("Learner progress is for club officers.", 403),
  );
  renderPage();
  /* Wait for the rejection to settle, then read what an officer sees. */
  await new Promise((resolve) => setTimeout(resolve, 60));
  expect(
    screen.getByText(/This page is for the club’s membership officers/),
  ).toBeTruthy();
  expect(screen.queryByText("Nobody has opened the course yet.")).toBeNull();
});

it("says so when nobody has opened the course yet", async () => {
  api.load.mockResolvedValue(payload([]));
  renderPage();
  expect(
    await screen.findByText("Nobody has opened the course yet."),
  ).toBeTruthy();
});
