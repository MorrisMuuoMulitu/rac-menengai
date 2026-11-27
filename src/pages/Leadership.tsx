/**
 * Leadership — the club's official board, supplied by the club, plus the
 * presidents who built the club.
 *
 * Everything on this page comes from the leadership cards the club issued on
 * 12 October 2026 (names, titles, portraits and biographies), so there is no
 * roster guessing here: the only entry still withheld is the unconfirmed
 * 2025/26 DEI role, which stays in the data as a record.
 */
import { ArrowRight, Mail } from "lucide-react";
import { CLUB, LEADERS, PAGE_INTROS, PRESIDENTIAL_LINE } from "../data";
import { ButtonLink, PageHero, PageMeta } from "../components/ui";
import { LeaderCard } from "../components/cards";

export default function LeadershipPage() {
  const intro = PAGE_INTROS.leadership;
  const board = LEADERS.filter((l) => l.kind === "board");
  const executive = board.filter((l) => l.group === "executive");
  const officers = board.filter((l) => l.group === "officers");
  const service = board.filter((l) => l.group === "service");
  const president = executive.find((l) => l.standing === "President");
  const rest = executive.filter((l) => l !== president);

  return (
    <>
      <PageMeta title="Leadership" description={intro.description} />
      <PageHero eyebrow={intro.eyebrow} title={intro.title} lead={intro.lead} />

      <section className="section section-tint">
        <div className="container">
          <div className="section-head-block">
            <span className="eyebrow">2026–2027 Rotary year</span>
            <h2 className="sec-title">The board, in full</h2>
            <p className="section-lead">
              Twelve officers, one club. Every portfolio below is held by a
              member you can meet at a Thursday fellowship.
            </p>
          </div>

          {/* The whole board at a glance; each chip anchors to its card */}
          <nav className="board-index" aria-label="Board members">
            {board.map((l) => (
              <a key={l.slug} href={`#${l.slug}`} className="board-chip">
                <span className="board-chip-name">{l.name}</span>
                <span className="board-chip-role">
                  {l.abbreviation
                    ? `${l.abbreviation} · ${l.standing}`
                    : (l.standing ?? l.portfolio)}
                </span>
              </a>
            ))}
          </nav>

          {president ? (
            <div className="president-feature">
              <LeaderCard leader={president} featured />
              <div className="president-aside">
                <span className="eyebrow">Leading the club</span>
                <p>
                  The President sets the year’s direction, chairs the board and
                  carries the club’s voice into {CLUB.district}.
                </p>
                <p className="president-aside-note">
                  Want to raise something with the board? Come to a fellowship
                  or send the club a message — both reach an officer.
                </p>
                <div className="president-actions">
                  <ButtonLink to="/contact" variant="primary" size="sm">
                    Contact the club <Mail size={17} aria-hidden="true" />
                  </ButtonLink>
                  <ButtonLink to="/events" variant="ghost" size="sm">
                    Thursday fellowship{" "}
                    <ArrowRight size={17} aria-hidden="true" />
                  </ButtonLink>
                </div>
              </div>
            </div>
          ) : null}

          {rest.length ? (
            <>
              <h3 className="board-subhead">Executive</h3>
              <div className="leaders-grid leaders-grid--two">
                {rest.map((l, i) => (
                  <LeaderCard key={l.slug} leader={l} delay={i * 80} />
                ))}
              </div>
            </>
          ) : null}

          <h3 className="board-subhead">Club officers</h3>
          <div className="leaders-grid">
            {officers.map((l, i) => (
              <LeaderCard key={l.slug} leader={l} delay={i * 80} />
            ))}
          </div>

          <h3 className="board-subhead">Service directors</h3>
          <div className="leaders-grid">
            {service.map((l, i) => (
              <LeaderCard key={l.slug} leader={l} delay={i * 80} />
            ))}
          </div>

          <p className="board-source">
            Current roles and the presidential line were confirmed by the club
            on 27 November 2026. Portraits use the club-supplied leadership
            photographs. The two historical presidents without a matching
            supplied image are shown with initials rather than an unidentified
            photograph.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head-block">
            <span className="eyebrow">Presidential line</span>
            <h2 className="sec-title">Who built the club</h2>
            <p className="section-lead">
              The club was chartered on 1 January 2015. This is the supplied
              presidential record from the first charter year onward.
            </p>
          </div>
          <div className="presidential-table-wrap">
            <table className="presidential-table">
              <caption className="sr-only">
                Charter and past presidents of the Rotaract Club of Menengai
              </caption>
              <thead>
                <tr>
                  <th scope="col">President</th>
                  <th scope="col">Office</th>
                  <th scope="col">Term</th>
                </tr>
              </thead>
              <tbody>
                {PRESIDENTIAL_LINE.map((president) => (
                  <tr
                    key={president.slug}
                    className={president.current ? "is-current" : ""}
                  >
                    <th scope="row">
                      <span className="presidential-person">
                        {president.photo ? (
                          <img
                            src={`${president.photo}-320.webp`}
                            alt=""
                            width={320}
                            height={420}
                            loading="lazy"
                            decoding="async"
                          />
                        ) : (
                          <span
                            className="presidential-initials"
                            aria-hidden="true"
                          >
                            {president.initials}
                          </span>
                        )}
                        <span>
                          <strong>{president.name}</strong>
                          {president.current ? (
                            <small>Current term</small>
                          ) : null}
                        </span>
                      </span>
                    </th>
                    <td>
                      {president.abbreviation ? (
                        <strong>{president.abbreviation}</strong>
                      ) : null}{" "}
                      {president.role}
                    </td>
                    <td>{president.term}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="leadership-key" aria-label="Leadership abbreviations">
            <span>
              <strong>CP</strong> Charter President
            </span>
            <span>
              <strong>PP</strong> Past President
            </span>
            <span>
              <strong>IPP</strong> Immediate Past President
            </span>
            <span>
              <strong>PN</strong> President Nominee
            </span>
            <span>
              <strong>PE</strong> President Elect
            </span>
          </div>
          <div className="section-more">
            <ButtonLink to="/membership" variant="primary" size="sm">
              Attend a fellowship <ArrowRight aria-hidden="true" />
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
