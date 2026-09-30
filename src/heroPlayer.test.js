import test from "node:test";
import assert from "node:assert/strict";
import { createHeroPlayer, crossfadeFrames, decodeFrame } from "./heroPlayer.js";

const deferred = () => { let resolve, reject; const promise = new Promise((yes, no) => { resolve = yes; reject = no; }); return { promise, resolve, reject }; };

test("decode gates transitions; rapid toggles are ignored; blue hour works both ways", async () => {
  const ready = deferred(), transitions = [], states = [];
  let loads = 0;
  const player = createHeroPlayer({ prepare: () => { loads++; return ready.promise; }, transition: async (...args) => transitions.push(args.slice(0, 3)), onState: value => states.push(value) });
  const first = player.toggle();
  assert.equal(await player.toggle(), false);
  assert.equal(transitions.length, 0);
  ready.resolve();
  assert.equal(await first, true);
  assert.deepEqual(transitions, [["night", "dusk", 660], ["dusk", "day", 660]]);
  assert.equal(await player.toggle(), true);
  assert.deepEqual(transitions.slice(2), [["day", "dusk", 660], ["dusk", "night", 660]]);
  assert.equal(loads, 1);
  assert.equal(states.at(-1).busy, false);
  player.dispose();
});

test("failed preparation keeps the old view and can be retried", async () => {
  let calls = 0, last;
  const transitions = [];
  const player = createHeroPlayer({ prepare: async () => { if (++calls === 1) throw Error("offline"); }, transition: async (...args) => transitions.push(args), onState: value => { last = value; } });
  assert.equal(await player.toggle(), false);
  assert.deepEqual(last, { current: "night", phase: "night", busy: false, error: true });
  assert.equal(transitions.length, 0);
  assert.equal(await player.toggle(), true);
  assert.equal(last.current, "day");
  assert.equal(last.error, false);
  player.dispose();
});

test("reduced motion skips dusk and finishes without animated delay", async () => {
  const transitions = [];
  const player = createHeroPlayer({ prepare: async () => {}, transition: async (...args) => transitions.push(args.slice(0, 3)), reducedMotion: () => true, onState: () => {} });
  await player.toggle();
  assert.deepEqual(transitions, [["night", "day", 0]]);
  player.dispose();
});

test("disposal during preparation prevents transitions and later state updates", async () => {
  const ready = deferred(), states = [], transitions = [];
  const player = createHeroPlayer({ prepare: () => ready.promise, transition: async (...args) => transitions.push(args), onState: value => states.push(value) });
  const pending = player.toggle();
  player.dispose();
  const count = states.length;
  ready.resolve();
  assert.equal(await pending, false);
  assert.equal(states.length, count);
  assert.equal(transitions.length, 0);
  assert.equal(await player.toggle(), false);
});

test("a failed second transition rolls back from dusk to the stable view", async () => {
  const transitions = []; let last;
  const player = createHeroPlayer({ prepare: async () => {}, transition: async (from, to, duration) => { transitions.push([from, to, duration]); if (to === "day") throw Error("animation failed"); }, onState: value => { last = value; } });
  assert.equal(await player.toggle(), false);
  assert.deepEqual(transitions.at(-1), ["dusk", "night", 0]);
  assert.equal(last.phase, "night");
  assert.equal(last.busy, false);
  player.dispose();
});

test("crossfade holds the outgoing frame opaque until incoming animation completes", async () => {
  const done = deferred(); let cancelled = 0;
  const outgoing = { style: {} }, incoming = { style: {}, animate: (frames, options) => {
    assert.deepEqual(frames, [{ opacity: 0 }, { opacity: 1 }]);
    assert.equal(options.fill, "forwards");
    return { finished: done.promise, cancel: () => { cancelled++; } };
  } };
  const pending = crossfadeFrames(outgoing, incoming, 660, new AbortController().signal);
  assert.equal(outgoing.style.opacity, "1");
  assert.equal(incoming.style.zIndex, "2");
  done.resolve(); await pending;
  assert.equal(outgoing.style.opacity, "0");
  assert.equal(incoming.style.opacity, "1");
  assert.equal(incoming.style.willChange, "");
  assert.equal(cancelled, 1);
});

test("cancelled crossfade retains the outgoing image and removes the promoted layer", async () => {
  const done = deferred(), controller = new AbortController();
  const outgoing = { style: {} }, incoming = { style: {}, animate: () => ({ finished: done.promise, cancel: () => done.reject(new DOMException("Aborted", "AbortError")) }) };
  const pending = crossfadeFrames(outgoing, incoming, 660, controller.signal);
  controller.abort();
  await assert.rejects(pending, { name: "AbortError" });
  assert.equal(outgoing.style.opacity, "1");
  assert.equal(incoming.style.opacity, "0");
  assert.equal(incoming.style.willChange, "");
});

test("browsers without animation support swap directly", async () => {
  const outgoing = { style: {} }, incoming = { style: {} };
  await crossfadeFrames(outgoing, incoming, 660, new AbortController().signal);
  assert.equal(incoming.style.opacity, "1");
  assert.equal(outgoing.style.opacity, "0");
});

test("image readiness waits for decode after load", async () => {
  const decoded = deferred();
  const image = new EventTarget(); image.decode = () => decoded.promise;
  let ready = false;
  const pending = decodeFrame(image, "/day.webp", new AbortController().signal).then(() => { ready = true; });
  assert.equal(image.src, "/day.webp");
  image.dispatchEvent(new Event("load"));
  await Promise.resolve();
  assert.equal(ready, false);
  decoded.resolve(); await pending;
  assert.equal(ready, true);
});

test("image errors and aborts reject without waiting for a timeout", async () => {
  const image = new EventTarget(), controller = new AbortController();
  const failed = decodeFrame(image, "/bad.webp", controller.signal);
  image.dispatchEvent(new Event("error"));
  await assert.rejects(failed, /unavailable/);
  const aborted = decodeFrame(image, "/day.webp", controller.signal);
  controller.abort();
  await assert.rejects(aborted, { name: "AbortError" });
});
