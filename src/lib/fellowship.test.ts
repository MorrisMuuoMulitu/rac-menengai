/**
 * Unit tests for the recurring fellowship event system. All fixtures are
 * expressed as Nairobi wall-clock times (EAT = UTC+3, no DST) so the tests
 * are independent of the runner's timezone.
 */
import { describe, expect, it } from 'vitest';
import {
  countdownParts,
  describeCountdown,
  fellowship,
  fellowshipLine,
  fellowshipStatus,
  formatMeetingDate,
  isFellowshipLive,
  meetingDayLabel,
  meetingTimeLabel,
  nextFellowshipDate,
  wallClock,
} from './fellowship';

/** Build the absolute instant for a Nairobi wall-clock time. */
function nairobi(y: number, mo: number, d: number, h: number, min: number): Date {
  return new Date(Date.UTC(y, mo - 1, d, h - 3, min));
}

describe('fellowship status machine', () => {
  it('is upcoming on the Wednesday before', () => {
    const now = nairobi(2026, 3, 4, 10, 0); // Wed
    const s = fellowshipStatus(now);
    expect(s.kind).toBe('upcoming');
    if (s.kind === 'upcoming') {
      expect(formatMeetingDate(s.start)).toContain('Thursday');
      expect(s.start.getTime()).toBeGreaterThan(now.getTime());
      expect(wallClock(s.start).h).toBe(17);
      expect(wallClock(s.start).min).toBe(30);
    }
  });

  it('says "today" on Thursday before 5:30 PM', () => {
    const now = nairobi(2026, 3, 5, 10, 0); // Thu 10:00
    const s = fellowshipStatus(now);
    expect(s.kind).toBe('today');
    expect(fellowshipLine(s)).toContain('Fellowship today at 5:30 PM');
    if (s.kind === 'today') {
      expect(s.start.getTime()).toBe(now.getTime() - (10 * 60 + 0) * 60_000 + (17 * 60 + 30) * 60_000);
    }
  });

  it('is live at 17:45 on Thursday', () => {
    const now = nairobi(2026, 3, 5, 17, 45);
    const s = fellowshipStatus(now);
    expect(s.kind).toBe('live');
    expect(isFellowshipLive(now)).toBe(true);
    expect(fellowshipLine(s)).toContain('Fellowship is happening now');
  });

  it('is live exactly at 17:30 and over exactly at 18:30', () => {
    expect(isFellowshipLive(nairobi(2026, 3, 5, 17, 30))).toBe(true);
    expect(isFellowshipLive(nairobi(2026, 3, 5, 17, 29))).toBe(false);
    expect(isFellowshipLive(nairobi(2026, 3, 5, 18, 29))).toBe(true);
    expect(isFellowshipLive(nairobi(2026, 3, 5, 18, 30))).toBe(false);
  });

  it('rolls to the following Thursday after 6:30 PM', () => {
    const now = nairobi(2026, 3, 5, 20, 0); // Thu 20:00
    const s = fellowshipStatus(now);
    expect(s.kind).toBe('upcoming');
    if (s.kind === 'upcoming') {
      expect(s.start.getTime() - now.getTime()).toBeGreaterThan(6 * 86_400_000);
      const start = wallClock(s.start);
      expect([start.y, start.m, start.d]).toEqual([2026, 3, 12]);
    }
    expect(fellowshipLine(s)).toContain('Next fellowship: Thursday');
  });

  it('never returns a past start for upcoming/today states', () => {
    for (const now of [nairobi(2026, 3, 4, 9, 0), nairobi(2026, 3, 5, 16, 0), nairobi(2026, 3, 5, 19, 0), nairobi(2026, 3, 6, 8, 0)]) {
      const s = fellowshipStatus(now);
      if (s.kind !== 'override' && s.kind !== 'live') {
        expect(s.start.getTime()).toBeGreaterThan(now.getTime());
      }
    }
  });

  it('supports a holiday/special-event override', () => {
    const cfg = { ...fellowship, override: { message: 'No fellowship this week — see you next Thursday!' } };
    const s = fellowshipStatus(nairobi(2026, 3, 5, 17, 45), cfg);
    expect(s.kind).toBe('override');
    expect(fellowshipLine(s)).toContain('No fellowship this week');
  });
});

describe('fellowship display helpers', () => {
  it('builds the time label from config', () => {
    expect(meetingTimeLabel()).toBe('5:30–6:30 PM');
  });

  it('formats the real date', () => {
    const start = nairobi(2026, 3, 5, 17, 30);
    expect(formatMeetingDate(start)).toBe('Thursday, 5 March 2026');
  });

  it('labels Today vs Tomorrow correctly', () => {
    const thu = nairobi(2026, 3, 5, 17, 30);
    expect(meetingDayLabel(thu, nairobi(2026, 3, 5, 9, 0))).toBe('Today');
    expect(meetingDayLabel(thu, nairobi(2026, 3, 4, 9, 0))).toBe('Tomorrow');
  });

  it('countdowns are never negative and describe live sessions', () => {
    // after the session: countdown toward the NEXT session must be ~1 week, never stale
    const after = nairobi(2026, 3, 5, 19, 0); // Thu 19:00 EAT
    const status = fellowshipStatus(after);
    expect(status.kind).toBe('upcoming');
    if (status.kind === 'upcoming') {
      const parts = countdownParts(status.start, after);
      expect(parts.d).toBeGreaterThanOrEqual(6);
      expect(parts.ms).toBeGreaterThan(0);
      expect(describeCountdown(status.start, status.end, after)).toMatch(/in \d+ days/);
    }
    // during the session
    const start = nairobi(2026, 3, 5, 17, 30);
    const end = nairobi(2026, 3, 5, 18, 30);
    expect(describeCountdown(start, end, nairobi(2026, 3, 5, 17, 40))).toContain('live');
    // pre-session countdown is a small positive number, never negative
    const partsPre = countdownParts(start, nairobi(2026, 3, 5, 17, 15));
    expect(partsPre.ms).toBeGreaterThan(0);
    expect(partsPre.m).toBeLessThanOrEqual(15);
  });
});

describe('production state matrix (exact audit states)', () => {
  it('Wednesday before the meeting → upcoming', () => {
    const s = fellowshipStatus(nairobi(2026, 9, 23, 12, 0)); // Wed 23 Sep later in 2026
    expect(s.kind).toBe('upcoming');
    if (s.kind === 'upcoming') expect(wallClock(s.start).d).toBe(24);
  });

  it('Thursday at 4:00 PM → today', () => {
    const s = fellowshipStatus(nairobi(2026, 9, 24, 16, 0)); // Thu 24 Sep
    expect(s.kind).toBe('today');
    if (s.kind === 'today') {
      expect(wallClock(s.start).h).toBe(17);
      expect(wallClock(s.start).min).toBe(30);
      expect(fellowshipLine(s)).toContain('Fellowship today at 5:30 PM');
    }
  });

  it('Thursday at 5:45 PM → live', () => {
    const now = nairobi(2026, 9, 24, 17, 45);
    expect(fellowshipStatus(now).kind).toBe('live');
    expect(isFellowshipLive(now)).toBe(true);
    expect(fellowshipLine(fellowshipStatus(now))).toContain('Fellowship is happening now');
  });

  it('Thursday at 7:00 PM → following Thursday (upcoming)', () => {
    const now = nairobi(2026, 9, 24, 19, 0);
    const s = fellowshipStatus(now);
    expect(s.kind).toBe('upcoming');
    if (s.kind === 'upcoming') expect(wallClock(s.start).d).toBe(1); // next Thursday 1 Oct
    expect(fellowshipLine(s)).toContain('Next fellowship: Thursday');
  });

  it('Friday after the meeting → upcoming', () => {
    const s = fellowshipStatus(nairobi(2026, 9, 25, 9, 0)); // Fri
    expect(s.kind).toBe('upcoming');
    if (s.kind === 'upcoming') expect(wallClock(s.start).d).toBe(1); // 1 Oct
  });

  it('is independent of a daylight-saving-observing visitor timezone', () => {
    // Absolute instant: Thursday 24 Sep 2026 17:45 East Africa Time.
    // Whatever the visitor's local zone (EDT, BST, …), the state must be "live"
    // because the calculation always reads the Nairobi wall clock.
    const instant = nairobi(2026, 9, 24, 17, 45);
    const wall = wallClock(instant);
    expect(wall.h).toBe(17);
    expect(wall.min).toBe(45);
    expect(fellowshipStatus(instant).kind).toBe('live');
    // Same absolute instant passed in again (simulating a different client clock).
    expect(fellowshipStatus(new Date(instant.getTime())).kind).toBe('live');
  });

  it('does not crash on an invalid system clock; falls back to a sane state', () => {
    const bad = new Date(NaN);
    expect(() => wallClock(bad)).not.toThrow();
    const s = fellowshipStatus(bad);
    expect(['upcoming', 'today', 'live']).toContain(s.kind === 'override' ? 'upcoming' : s.kind);
    if (s.kind === 'upcoming' || s.kind === 'today') expect(s.start.getTime()).toBeGreaterThan(0);
    // countdown from a broken clock is never negative
    expect(countdownParts(new Date(NaN), new Date(NaN)).ms).toBe(0);
  });
});

describe('nextFellowshipDate convenience', () => {
  it('is never in the past when the session has ended', () => {
    const after = nairobi(2026, 3, 5, 19, 0);
    const next = nextFellowshipDate(after);
    expect(next.getTime()).toBeGreaterThan(after.getTime());
  });
});