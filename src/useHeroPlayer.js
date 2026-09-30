import { useEffect, useRef, useState } from "react";
import { createHeroPlayer, crossfadeFrames, decodeFrame } from "./heroPlayer.js";

export function useHeroPlayer(sources) {
  const sectionRef = useRef(null);
  const frames = useRef({});
  const player = useRef(null);
  const [state, setState] = useState({ current: "night", phase: "night", busy: false, error: false });
  const [ambient, setAmbient] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const instance = createHeroPlayer({
      prepare: signal => Promise.all(Object.entries(sources).map(([key, src]) => decodeFrame(frames.current[key], src, signal))),
      transition: (from, to, duration, signal) => crossfadeFrames(frames.current[from], frames.current[to], duration, signal),
      onState: setState,
      reducedMotion: () => reduced.matches,
    });
    player.current = instance;
    let idle, timer;
    const warm = () => { void instance.warmup().catch(() => {}); };
    const schedule = () => {
      const connection = navigator.connection;
      if (connection?.saveData || /(^|-)2g$/.test(connection?.effectiveType || "")) return;
      if (window.requestIdleCallback) idle = window.requestIdleCallback(warm, { timeout: 1800 });
      else timer = window.setTimeout(warm, 800);
    };
    const night = frames.current.night;
    if (night.complete && night.naturalWidth) schedule();
    else night.addEventListener("load", schedule, { once: true });
    return () => {
      night.removeEventListener("load", schedule);
      if (idle !== undefined) window.cancelIdleCallback(idle);
      window.clearTimeout(timer);
      instance.dispose();
      player.current = null;
    };
  }, [sources]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compact = window.matchMedia("(max-width: 767px), (pointer: coarse)");
    const connection = navigator.connection;
    let visible = false;
    const update = () => setAmbient(visible && !document.hidden && !reduced.matches && !compact.matches && !connection?.saveData);
    const observer = typeof IntersectionObserver === "function" ? new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      update();
    }, { threshold: 0 }) : null;
    observer?.observe(sectionRef.current);
    reduced.addEventListener("change", update);
    compact.addEventListener("change", update);
    connection?.addEventListener?.("change", update);
    document.addEventListener("visibilitychange", update);
    update();
    return () => {
      observer?.disconnect();
      reduced.removeEventListener("change", update);
      compact.removeEventListener("change", update);
      connection?.removeEventListener?.("change", update);
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  return { ...state, ambient: ambient && !state.busy, sectionRef, frames, toggle: () => player.current?.toggle() };
}
