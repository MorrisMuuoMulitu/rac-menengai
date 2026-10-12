#!/usr/bin/env node
/**
 * Scroll verification harness — inspired by scroll-craft's verification tools.
 *
 * Walks every scroll position of a page in headless Chrome and records:
 *   - a screenshot per step (for visual-change / "dead scroll" analysis)
 *   - the text samples visible at that step, with colour, size, weight and box
 *     (so contrast can be measured on the *composited* page, not from tokens)
 *   - a reduced-motion pass that asserts nothing is left invisible when
 *     animations are disabled
 *
 * The pixel analysis (dead scroll + composited contrast) runs in
 * scripts/verify-scroll.py, which needs PIL.
 *
 * Usage:
 *   node scripts/verify-scroll.mjs --base http://127.0.0.1:5173 \
 *     --routes /,/membership --widths 1440,390
 *
 * Requires Chrome already listening on $CDP_URL (default http://127.0.0.1:9222):
 *   google-chrome --headless=new --remote-debugging-port=9222 --no-sandbox about:blank
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
};
const CDP = process.env.CDP_URL ?? 'http://127.0.0.1:9222';
const BASE = arg('base', 'http://127.0.0.1:5173');
const ROUTES = arg('routes', '/').split(',').map((r) => r.trim()).filter(Boolean);
const WIDTHS = arg('widths', '1440,390').split(',').map((w) => Number(w.trim()));
const OUT = arg('out', 'docs/audit/scroll-check');
const STEP_RATIO = Number(arg('step', '0.75')); // fraction of viewport per step

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function connect() {
  const target = await (await fetch(`${CDP}/json/new?${encodeURIComponent('about:blank')}`, { method: 'PUT' })).json();
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  const pending = new Map();
  let id = 0;
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
  ws.onmessage = (e) => {
    const m = JSON.parse(e.data);
    if (m.id && pending.has(m.id)) { pending.get(m.id)(m.error ? { error: m.error.message } : m.result); pending.delete(m.id); }
  };
  const send = (method, params = {}) => new Promise((res) => { const mid = ++id; pending.set(mid, res); ws.send(JSON.stringify({ id: mid, method, params })); });
  const evaluate = async (expression) => {
    const r = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (r?.exceptionDetails) {
      const d = r.exceptionDetails.exception?.description ?? r.exceptionDetails.text;
      const where = (r.exceptionDetails.stackTrace?.callFrames ?? []).slice(0, 3)
        .map((f) => `${f.functionName || '(anon)'}:${f.lineNumber + 1}`).join(' <- ');
      throw new Error(`probe threw: ${d}${where ? ' | ' + where : ''}`);
    }
    return r?.result?.value;
  };
  return { send, evaluate, close: () => { ws.close(); fetch(`${CDP}/json/close/${target.id}`); } };
}

/** Text samples + a content signature for the current viewport. */
const PROBE = `(() => {
  const vis = (el) => {
    const r = el.getBoundingClientRect(); const s = getComputedStyle(el);
    if (r.width < 8 || r.height < 8) return false;                 // sr-only 1px boxes
    if (s.visibility === 'hidden' || Number(s.opacity) <= 0.05) return false;
    if (s.clipPath && s.clipPath !== 'none') return false;         // clip-path hidden text
    if (s.clip && s.clip.indexOf('rect(0px') === 0) return false;  // legacy sr-only clip
    return true;
  };
  // The backdrop is the nearest opaque ancestor fill, or an ancestor image.
  const backdropOf = (el) => {
    let node = el;
    while (node && node !== document.documentElement) {
      const s = getComputedStyle(node);
      const bg = s.backgroundColor || '';
      const alpha = bg.startsWith('rgba(') ? parseFloat(bg.split(',')[3]) : 1;
      if (bg && alpha >= 0.9) return { kind: 'colour', colour: bg };
      if (s.backgroundImage && s.backgroundImage !== 'none') return { kind: 'image' };
      node = node.parentElement;
    }
    return { kind: 'colour', colour: getComputedStyle(document.body).backgroundColor || 'rgb(255,255,255)' };
  };
  const samples = [];
  for (const el of document.querySelectorAll('h1,h2,h3,h4,p,li,a,span,button,figcaption,label,td,th')) {
    const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 2);
    if (!own || !vis(el)) continue;
    const r = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    samples.push({
      text: el.textContent.trim().slice(0, 48),
      color: s.color,
      backdrop: backdropOf(el),
      fontSize: parseFloat(s.fontSize),
      weight: Number(s.fontWeight) || 400,
      box: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
    });
  }
  const sig = samples.map((s) => s.text).join('|');
  return {
    scrollY: Math.round(window.scrollY),
    scrollHeight: Math.round(document.documentElement.scrollHeight),
    innerHeight: window.innerHeight,
    samples: samples.filter((s) => s.box.y > -60 && s.box.y < window.innerHeight + 60).slice(0, 90),
    signature: sig.length,
  };
})()`;

/** Elements that a scroll-entrance animation could leave invisible. */
const HIDDEN_PROBE = `(() => {
  const stuck = [];
  for (const el of document.querySelectorAll('body *')) {
    const s = getComputedStyle(el);
    if (Number(s.opacity) < 0.9 && el.textContent.trim().length > 20) {
      stuck.push({ tag: el.tagName.toLowerCase(), cls: String(el.className).slice(0, 40), opacity: s.opacity, text: el.textContent.trim().slice(0, 40) });
    }
  }
  return stuck.slice(0, 25);
})()`;

const results = { base: BASE, startedAt: new Date().toISOString(), routes: [], reducedMotion: [] };
mkdirSync(OUT, { recursive: true });

for (const route of ROUTES) {
  for (const width of WIDTHS) {
    const { send, evaluate, close } = await connect();
    await send('Page.enable');
    await send('Runtime.enable');
    await send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: width < 600 });
    await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] });
    await send('Page.navigate', { url: `${BASE}${route}` });
    await sleep(3200);

    const first = await evaluate(PROBE);
    const stepPx = Math.round(first.innerHeight * STEP_RATIO);
    const steps = [];
    const slug = `${route === '/' ? 'home' : route.replace(/^\//, '').replace(/\//g, '-')}-${width}`;
    for (let y = 0; y <= first.scrollHeight - first.innerHeight + stepPx; y += stepPx) {
      await evaluate(`window.scrollTo({ top: ${y}, behavior: 'instant' })`);
      await sleep(320);
      const probe = await evaluate(PROBE);
      const shot = await send('Page.captureScreenshot', { format: 'jpeg', quality: 55 });
      const file = `${slug}-step${String(steps.length).padStart(3, '0')}.jpg`;
      writeFileSync(join(OUT, file), Buffer.from(shot.data, 'base64'));
      steps.push({ file, scrollY: probe.scrollY, samples: probe.samples });
    }

    // reduced-motion pass: nothing may be left invisible when animations are off
    await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
    await send('Page.navigate', { url: `${BASE}${route}` });
    await sleep(2600);
    const stuck = await evaluate(HIDDEN_PROBE);
    results.reducedMotion.push({ route, width, stuck });

    results.routes.push({ route, width, slug, viewport: { width, height: 900 }, stepPx, steps });
    console.log(`${route} @${width}px → ${steps.length} steps, ${stuck.length} elements invisible under reduced motion`);
    close();
  }
}

writeFileSync(join(OUT, 'steps.json'), JSON.stringify(results, null, 1));
console.log(`\nWrote ${OUT}/steps.json — now run: node scripts/verify-scroll.py --dir ${OUT}`);
