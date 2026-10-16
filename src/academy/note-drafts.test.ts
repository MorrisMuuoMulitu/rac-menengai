import { expect, it } from "vitest";
import {
  readNoteDraft,
  writeNoteDraft,
  acknowledgeNoteDraft,
} from "./note-drafts";

it("restores failed-save drafts after navigation without exposing them to another learner", () => {
  writeNoteDraft("amina", "roots", "My unfinished idea", null);
  expect(readNoteDraft("otieno", "roots", null)).toBeNull();
  expect(readNoteDraft("amina", "family", null)).toBeNull();
  expect(readNoteDraft("amina", "roots", null)).toBe("My unfinished idea");
});
it("does not erase newer typing when an older save finishes", () => {
  writeNoteDraft("amina", "planning", "First version", null);
  writeNoteDraft("amina", "planning", "Newer version while saving", null);
  acknowledgeNoteDraft("amina", "planning", "First version", null);
  expect(readNoteDraft("amina", "planning", null)).toBe(
    "Newer version while saving",
  );
  acknowledgeNoteDraft("amina", "planning", "Newer version while saving", null);
  expect(readNoteDraft("amina", "planning", null)).toBeNull();
});
