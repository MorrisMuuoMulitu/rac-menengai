import { expect, it } from "vitest";
import { filterGlossary } from "./glossary";
const terms = [
  {
    term: "District representative",
    abbreviation: "DRR",
    definition: "A Rotaract district leader.",
    category: "People",
  },
  {
    term: "Fellowship",
    abbreviation: "",
    definition: "Members’ time together in Nakuru.",
    category: "Club life",
  },
];
it("finds abbreviations without requiring case or exact spacing", () => {
  expect(filterGlossary(terms, "  drr  ", "All")).toEqual([terms[0]]);
});
it("matches words across definitions and names", () => {
  expect(filterGlossary(terms, "nakuru fellowship", "All")).toEqual([terms[1]]);
});
it("combines the query and topic filter", () => {
  expect(filterGlossary(terms, "district", "Club life")).toEqual([]);
  expect(filterGlossary(terms, "", "People")).toEqual([terms[0]]);
});
it("handles punctuation, empty queries and no matches", () => {
  expect(filterGlossary(terms, "members time", "All")).toEqual([terms[1]]);
  expect(filterGlossary(terms, "   ", "All")).toEqual(terms);
  expect(filterGlossary(terms, "unknown", "All")).toEqual([]);
});
