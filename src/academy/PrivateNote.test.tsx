// @vitest-environment jsdom
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { PrivateNote } from "./PrivateNote";

const api = vi.hoisted(() => ({
  load: vi.fn(),
  save: vi.fn(),
  account: {
    ready: true,
    available: true,
    signedIn: true,
    name: "Test learner",
    email: "note-fixture@example.com",
    token: async () => "isolated-test-token",
    signOut: null,
  },
}));
vi.mock("./account", () => ({ useAccount: () => api.account }));
vi.mock("../lib/academy", () => ({
  loadLessonNote: api.load,
  saveLessonNote: api.save,
}));

const open = (lessonId: string) =>
  render(
    <MemoryRouter>
      <PrivateNote lessonId={lessonId} activity="Explain what you learned." />
    </MemoryRouter>,
  );
const textbox = async () => {
  const field = (await screen.findByRole("textbox")) as HTMLTextAreaElement;
  await waitFor(() => expect(field.disabled).toBe(false));
  return field;
};
beforeEach(() => {
  api.load.mockReset().mockResolvedValue({ note: null });
  api.save.mockReset();
  window.localStorage.clear();
});
afterEach(cleanup);

it("restores a failed-save draft when the learner returns to the lesson", async () => {
  api.save.mockRejectedValue(new Error("Connection unavailable"));
  const first = open("roots");
  fireEvent.change(await textbox(), {
    target: { value: "Keep this reflection after a failed save" },
  });
  fireEvent.blur(await textbox());
  await screen.findByRole("alert");
  first.unmount();
  const other = open("family");
  expect((await textbox()).value).toBe("");
  other.unmount();
  open("roots");
  expect((await textbox()).value).toBe(
    "Keep this reflection after a failed save",
  );
  expect(screen.getByRole("status").textContent).toBe("Unsaved draft");
});

it("retains new edits when an earlier pending save finishes after navigation", async () => {
  let finish!: (result: unknown) => void;
  api.save.mockImplementation(
    () =>
      new Promise((resolve) => {
        finish = resolve;
      }),
  );
  const first = open("planning");
  fireEvent.change(await textbox(), { target: { value: "First version" } });
  fireEvent.blur(await textbox());
  await screen.findByText("Saving your note…");
  fireEvent.change(await textbox(), {
    target: { value: "More detail typed while saving" },
  });
  first.unmount();
  finish({
    note: { text: "First version", updatedAt: "2026-10-16T00:00:00Z" },
  });
  api.load.mockResolvedValue({
    note: { text: "First version", updatedAt: "2026-10-16T00:00:00Z" },
  });
  open("planning");
  expect((await textbox()).value).toBe("More detail typed while saving");
  expect(screen.getByRole("status").textContent).toBe("Unsaved draft");
});
