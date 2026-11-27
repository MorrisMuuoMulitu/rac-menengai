import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, BookOpen, Loader2, Search, X } from "lucide-react";
import { PageMeta } from "../components/ui";
import { useAccount } from "../academy/account";
import {
  searchAcademySections,
  searchGlossary,
} from "../academy/course-search";
import {
  AcademyError,
  loadAcademy,
  type AcademyBootstrap,
} from "../lib/academy";
import { FLASHCARDS } from "../../shared/rotaract-academy/flashcards";
import { CHAPTERS } from "../course-info";
import "../academy.css";

export default function AcademySearchPage() {
  const account = useAccount();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [data, setData] = useState<AcademyBootstrap | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const deferredQuery = useDeferredValue(query);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const token = account.ready ? await account.token() : null;
        const next = await loadAcademy(token);
        if (!cancelled) setData(next);
      } catch (cause) {
        if (!cancelled)
          setError(
            cause instanceof AcademyError
              ? cause.message
              : "The course search could not load. Try again.",
          );
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [account]);

  const chapterNames = useMemo(() => {
    const names = new Map<string, string>(
      CHAPTERS.map((chapter) => [chapter.id, chapter.title]),
    );
    data?.course?.chapters.forEach((chapter) =>
      names.set(chapter.id, chapter.title),
    );
    return names;
  }, [data?.course]);

  const results = useMemo(
    () =>
      data?.course ? searchAcademySections(data.course, deferredQuery) : [],
    [data?.course, deferredQuery],
  );
  const glossaryMatches = useMemo(
    () => searchGlossary(FLASHCARDS, chapterNames, deferredQuery),
    [chapterNames, deferredQuery],
  );
  const hasQuery = deferredQuery.trim().length >= 2;
  const groupedGlossary = CHAPTERS.map((chapter) => ({
    id: chapter.id,
    title: chapter.title,
    cards: FLASHCARDS.filter((card) => card.chapterId === chapter.id),
  })).filter((chapter) => chapter.cards.length > 0);

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next = new URLSearchParams(searchParams);
    if (query.trim()) next.set("q", query.trim());
    else next.delete("q");
    setSearchParams(next, { replace: true });
  };

  const useSearchTerm = (term: string) => {
    setQuery(term);
    setSearchParams({ q: term }, { replace: true });
  };

  return (
    <>
      <PageMeta
        title="Search the academy"
        description="Search every lesson section and browse the Rotaract Club of Menengai academy glossary."
      />

      <header className="academy-search-hero">
        <div className="container academy-search-hero-inner">
          <div>
            <span className="academy-eyebrow">
              <BookOpen size={15} aria-hidden="true" /> Academy search
            </span>
            <h1>Find the idea again.</h1>
            <p>
              Search the lessons by topic, term or question. Every result opens
              the exact reading section, not just the beginning of a lesson.
            </p>
          </div>

          <form className="academy-search-form" role="search" onSubmit={submit}>
            <Search size={20} aria-hidden="true" />
            <label className="sr-only" htmlFor="academy-search-input">
              Search the course and glossary
            </label>
            <input
              id="academy-search-input"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Try “Four-Way Test”, “quorum” or “follow-up”"
              autoComplete="off"
              spellCheck={false}
            />
            {query ? (
              <button
                type="button"
                className="academy-search-clear"
                onClick={() => {
                  setQuery("");
                  setSearchParams({}, { replace: true });
                  document.getElementById("academy-search-input")?.focus();
                }}
                aria-label="Clear search"
              >
                <X size={18} aria-hidden="true" />
              </button>
            ) : null}
            <button type="submit" className="btn btn-primary btn-sm">
              Search
            </button>
          </form>

          <div className="academy-search-suggestions" aria-label="Try a search">
            <span>Try:</span>
            {["Four-Way Test", "Foundation", "quorum", "consent"].map(
              (term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => useSearchTerm(term)}
                >
                  {term}
                </button>
              ),
            )}
          </div>
        </div>
      </header>

      <div className="container academy-search-workspace">
        {loading ? (
          <p className="academy-search-status" role="status">
            <Loader2 className="academy-spin" size={16} aria-hidden="true" />
            Opening the course index…
          </p>
        ) : null}
        {error ? (
          <p className="academy-notice error" role="alert">
            {error}
          </p>
        ) : null}

        {hasQuery ? (
          <>
            <section
              className="academy-search-results"
              aria-labelledby="lesson-results-title"
            >
              <div className="academy-search-section-head">
                <div>
                  <span>Lesson sections</span>
                  <h2 id="lesson-results-title">
                    {results.length
                      ? `${results.length} place${results.length === 1 ? "" : "s"} in the course`
                      : "No matching lesson section"}
                  </h2>
                </div>
              </div>
              {results.length ? (
                <ol>
                  {results.map((result) => (
                    <li key={`${result.lessonId}-${result.sectionIndex}`}>
                      <Link to={result.href}>
                        <span className="academy-search-result-path">
                          {result.chapterTitle} / {result.lessonTitle}
                        </span>
                        <strong>{result.sectionTitle}</strong>
                        <p>{result.snippet}</p>
                        <span className="academy-search-result-open">
                          Open section{" "}
                          <ArrowRight size={15} aria-hidden="true" />
                        </span>
                      </Link>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="academy-search-empty">
                  Try a shorter phrase, or search the glossary below.
                </p>
              )}
            </section>

            <section
              className="academy-search-results academy-glossary-results"
              aria-labelledby="glossary-results-title"
            >
              <div className="academy-search-section-head">
                <div>
                  <span>Glossary</span>
                  <h2 id="glossary-results-title">
                    {glossaryMatches.length
                      ? `${glossaryMatches.length} matching term${glossaryMatches.length === 1 ? "" : "s"}`
                      : "No matching glossary term"}
                  </h2>
                </div>
              </div>
              {glossaryMatches.length ? (
                <dl>
                  {glossaryMatches.map((card) => (
                    <div key={card.term}>
                      <dt>{card.term}</dt>
                      <dd>
                        <span>{card.chapterTitle}</span>
                        {card.definition}
                      </dd>
                    </div>
                  ))}
                </dl>
              ) : null}
            </section>
          </>
        ) : null}

        {!hasQuery ? (
          <section
            className="academy-glossary-browser"
            aria-labelledby="glossary-browser-title"
          >
            <div className="academy-glossary-browser-head">
              <div>
                <span>Course glossary</span>
                <h2 id="glossary-browser-title">
                  The words members actually use.
                </h2>
              </div>
              <p>
                Definitions follow the lessons. They do not add rules or claims
                that are not already taught in the course.
              </p>
            </div>
            <div className="academy-glossary-groups">
              {groupedGlossary.map((chapter) => (
                <section key={chapter.id}>
                  <h3>{chapter.title}</h3>
                  <dl>
                    {chapter.cards.map((card) => (
                      <div key={card.term}>
                        <dt>{card.term}</dt>
                        <dd>{card.definition}</dd>
                      </div>
                    ))}
                  </dl>
                </section>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </>
  );
}
