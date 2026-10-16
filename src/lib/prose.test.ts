import { describe, expect, it } from "vitest";
import { splitSentences, toParagraphs } from "./prose";

describe("splitting lesson prose", () => {
  it("splits on sentence boundaries and keeps every word", () => {
    const text =
      "Rotary began in Chicago. The first Rotaract club was certified in 1968. Membership is open to adults aged 18 and over.";
    const sentences = splitSentences(text);
    expect(sentences).toHaveLength(3);
    expect(sentences.join(" ")).toBe(text);
  });

  it("does not split inside an abbreviation", () => {
    const sentences = splitSentences(
      "Use one of the frameworks, e.g. the avenues of service. Confirm the details first.",
    );
    expect(sentences).toHaveLength(2);
    expect(sentences[0]).toContain("e.g. the avenues of service.");
  });

  it("does not split before a number or a quoted opening", () => {
    expect(
      splitSentences("From 1 July 2020 the rules changed. 18 is the minimum age."),
    ).toHaveLength(2);
  });

  it("groups sentences into short paragraphs without changing them", () => {
    const text = "One. Two. Three. Four. Five.";
    const paragraphs = toParagraphs(text, 2);
    expect(paragraphs).toEqual(["One. Two.", "Three. Four.", "Five."]);
    expect(paragraphs.join(" ")).toBe(text);
  });

  it("leaves a single sentence as one paragraph", () => {
    expect(toParagraphs("Just the one sentence.", 2)).toEqual([
      "Just the one sentence.",
    ]);
  });

  it("returns nothing for empty input", () => {
    expect(toParagraphs("   ")).toEqual([]);
  });
});
