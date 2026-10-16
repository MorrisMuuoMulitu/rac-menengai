import { describe, expect, it } from "vitest";
import {
  markTerms,
  parseInline,
  splitSentences,
  toParagraphs,
} from "./prose";

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

  it("does not split after an initial", () => {
    const text =
      "Herbert J. Taylor wrote it in 1932. Rotary International adopted it in 1943.";
    const sentences = splitSentences(text);
    expect(sentences).toHaveLength(2);
    expect(sentences[0]).toBe("Herbert J. Taylor wrote it in 1932.");
    expect(sentences.join(" ")).toBe(text);
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

describe("terms of art", () => {
  it("marks a term once per lesson, at its first mention", () => {
    const marked = markTerms([
      "Rotary clubs and Rotaract clubs are different.",
      "Rotary clubs appear again here.",
    ]);
    expect(marked[0]).toContain("**Rotary**");
    expect(marked[0]).toContain("**Rotaract**");
    /* Second mention is left alone, so the page is not a wall of bold. */
    expect(marked[1]).toBe("Rotary clubs appear again here.");
  });

  it("prefers the longer term when several could match", () => {
    const [marked] = markTerms(["Rotary International sets policy."]);
    expect(marked).toContain("**Rotary International**");
  });

  it("does not match inside a longer word", () => {
    const [marked] = markTerms(["Rotaractors are members."]);
    expect(marked).toBe("Rotaractors are members.");
  });
});

describe("inline emphasis", () => {
  it("splits marked runs out of plain text", () => {
    expect(parseInline("a **b** c")).toEqual([
      { text: "a ", strong: false },
      { text: "b", strong: true },
      { text: " c", strong: false },
    ]);
  });

  it("returns the text unchanged when nothing is marked", () => {
    expect(parseInline("plain")).toEqual([{ text: "plain", strong: false }]);
  });
});
