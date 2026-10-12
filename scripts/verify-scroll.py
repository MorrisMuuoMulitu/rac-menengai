#!/usr/bin/env python3
"""
Pixel analysis for the scroll verification harness (needs PIL).

Reads the screenshots + DOM samples written by scripts/verify-scroll.mjs and reports:

  1. Dead scroll — runs of consecutive scroll steps where the composited page
     barely changes, measured as mean absolute pixel difference between steps.
     On a reading site some stillness is correct; the flag is about *long*
     stretches, so the report states the raw numbers and the run length.
  2. Composited contrast — for every recorded text sample the mean colour of a
     ring just outside the glyph box is sampled from the screenshot and used as
     the background, so contrast is measured against what the reader actually
     sees (photo, gradient, plate) rather than against a design token.

Usage: node scripts/verify-scroll.py --dir docs/audit/scroll-check
"""
import argparse
import json
from pathlib import Path
from statistics import mean

from PIL import Image, ImageChops

STATIC_THRESHOLD = 1.0      # mean abs pixel diff (0-255) below this = no visible change
DEAD_RUN_STEPS = 3          # consecutive static steps that count as dead scroll
SMALL_TEXT = 24.0           # px; below this (or <18.66 bold) WCAG "normal" text


def luminance(rgb):
    def channel(c):
        c /= 255
        return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4
    r, g, b = rgb[:3]
    return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)


def contrast(a, b):
    la, lb = luminance(a), luminance(b)
    hi, lo = max(la, lb), min(la, lb)
    return (hi + 0.05) / (lo + 0.05)


def parse_rgb(css: str):
    nums = [int(n) for n in css.replace("rgba(", "").replace("rgb(", "").replace(")", "").split(",")[:3]]
    while len(nums) < 3:
        nums.append(0)
    return tuple(nums)


def opacity(css: str):
    if "rgba(" in css:
        parts = css.replace("rgba(", "").replace(")", "").split(",")
        return float(parts[3]) if len(parts) > 3 else 1.0
    return 1.0


def ring_background(img, box):
    """Composited backdrop for a text box.

    Text on a solid fill: the element's own fill *is* what the reader sees.
    Text over a photo/gradient: sample a ring just inside the box edges, which is
    dominated by the backdrop even though a few glyph pixels may fall in it.
    """
    x, y, w, h = box["x"], box["y"], box["w"], box["h"]
    pad = 12          # outside the box: avoids glyphs and underlines entirely
    x0, y0 = max(0, x - pad), max(0, y - pad)
    x1, y1 = min(img.width, x + w + pad), min(img.height, y + h + pad)
    if x1 - x0 < 2 or y1 - y0 < 2:
        return None
    region = img.crop((x0, y0, x1, y1))
    px = region.load()
    samples = []
    for sx in range(0, region.width, max(1, region.width // 12)):
        for sy in (0, region.height - 1):
            samples.append(px[sx, sy])
    for sy in range(0, region.height, max(1, region.height // 12)):
        for sx in (0, region.width - 1):
            samples.append(px[sx, sy])
    if not samples:
        return None
    return tuple(int(mean(c[i] for c in samples)) for i in range(3))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dir", default="docs/audit/scroll-check")
    args = ap.parse_args()
    root = Path(args.dir)
    data = json.loads((root / "steps.json").read_text())

    report = {"deadScroll": [], "contrast": [], "summary": {}}
    total_steps = total_flags = contrast_fails = 0

    for entry in data["routes"]:
        steps = entry["steps"]
        total_steps += len(steps)
        diffs = []
        for prev, cur in zip(steps, steps[1:]):
            a = Image.open(root / prev["file"]).convert("RGB")
            b = Image.open(root / cur["file"]).convert("RGB")
            if a.size != b.size:
                b = b.resize(a.size)
            diff = ImageChops.difference(a, b)
            hist = diff.convert("L").histogram()
            n = sum(hist)
            mean_diff = sum(i * c for i, c in enumerate(hist)) / n if n else 0
            diffs.append(mean_diff)

        run = 0
        for i, d in enumerate(diffs):
            if d < STATIC_THRESHOLD:
                run += 1
            else:
                if run >= DEAD_RUN_STEPS:
                    report["deadScroll"].append({
                        "route": entry["route"], "width": entry["width"],
                        "fromStep": i - run, "toStep": i,
                        "viewportHeights": round(run * entry["stepPx"] / entry["viewport"]["height"], 1),
                        "reason": f"{run} consecutive steps changed < {STATIC_THRESHOLD}/255 mean pixel difference",
                    })
                    total_flags += 1
                run = 0
        if run >= DEAD_RUN_STEPS:
            report["deadScroll"].append({
                "route": entry["route"], "width": entry["width"], "fromStep": len(diffs) - run, "toStep": len(diffs),
                "viewportHeights": round(run * entry["stepPx"] / entry["viewport"]["height"], 1),
                "reason": f"{run} consecutive steps changed < {STATIC_THRESHOLD}/255 mean pixel difference",
            })
            total_flags += 1

        for step in steps:
            img = Image.open(root / step["file"]).convert("RGB")
            for s in step["samples"]:
                bd = s.get("backdrop") or {}
                if bd.get("kind") == "colour" and opacity(bd.get("colour", "")) >= 0.9:
                    bg = parse_rgb(bd["colour"])          # exact ancestor fill
                else:
                    bg = ring_background(img, s["box"])   # image backdrop: sample pixels
                if bg is None:
                    continue
                ratio = contrast(parse_rgb(s["color"]), bg)
                large = s["fontSize"] >= SMALL_TEXT or (s["fontSize"] >= 18.66 and s["weight"] >= 700)
                floor = 3.0 if large else 4.5
                if ratio < floor:
                    contrast_fails += 1
                    report["contrast"].append({
                        "route": entry["route"], "width": entry["width"], "step": step["scrollY"],
                        "text": s["text"], "colour": s["color"], "sampledBackground": "rgb" + str(bg),
                        "ratio": round(ratio, 2), "floor": floor, "fontSize": s["fontSize"],
                    })

    report["summary"] = {
        "pagesChecked": len(data["routes"]),
        "scrollSteps": total_steps,
        "deadScrollRegions": total_flags,
        "contrastFailures": contrast_fails,
        "reducedMotionProblems": sum(len(r["stuck"]) for r in data.get("reducedMotion", [])),
        "note": "Stillness is not automatically a defect on a reading site; long runs are reported for review.",
    }
    (root / "scroll-verification.json").write_text(json.dumps(report, indent=1))

    print(json.dumps(report["summary"], indent=1))
    for flag in report["deadScroll"][:6]:
        print(f"  dead scroll: {flag['route']} @{flag['width']} steps {flag['fromStep']}-{flag['toStep']} ({flag['viewportHeights']} viewports)")
    for fail in report["contrast"][:10]:
        print(f"  contrast: {fail['route']} @{fail['width']} y={fail['step']} {fail['ratio']}:1 (needs {fail['floor']}) — {fail['text'][:40]!r}")
    if report["summary"]["reducedMotionProblems"]:
        print(f"  reduced motion: {report['summary']['reducedMotionProblems']} element(s) invisible with animations disabled")


if __name__ == "__main__":
    main()
