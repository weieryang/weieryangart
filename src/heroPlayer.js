// Decode first, then layer the incoming frame over an opaque outgoing frame.
// No double fade, image transform, or timer that assumes the network is ready.
export async function decodeFrame(image, src, signal) {
  if (signal.aborted) throw new DOMException("Aborted", "AbortError");
  await new Promise((resolve, reject) => {
    const finish = (error) => {
      clearTimeout(timeout);
      image.removeEventListener("load", loaded);
      image.removeEventListener("error", failed);
      signal.removeEventListener("abort", aborted);
      error ? reject(error) : resolve();
    };
    const loaded = () => finish();
    const failed = () => finish(new Error("Hero image unavailable"));
    const aborted = () => finish(new DOMException("Aborted", "AbortError"));
    const timeout = setTimeout(() => finish(new Error("Hero image timed out")), 15000);
    image.addEventListener("load", loaded, { once: true });
    image.addEventListener("error", failed, { once: true });
    signal.addEventListener("abort", aborted, { once: true });
    image.src = src;
    if (image.complete && image.naturalWidth) finish();
  });
  if (typeof image.decode === "function") await image.decode();
  if (signal.aborted) throw new DOMException("Aborted", "AbortError");
}

export async function crossfadeFrames(outgoing, incoming, duration, signal) {
  if (signal.aborted) throw new DOMException("Aborted", "AbortError");
  outgoing.style.opacity = "1";
  outgoing.style.zIndex = "1";
  incoming.style.zIndex = "2";
  let animation;
  const abort = () => animation?.cancel();
  try {
    if (duration && typeof incoming.animate === "function") {
      incoming.style.willChange = "opacity";
      animation = incoming.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration, easing: "cubic-bezier(.4,0,.2,1)", fill: "forwards",
      });
      signal.addEventListener("abort", abort, { once: true });
      await animation.finished;
    }
    if (signal.aborted) throw new DOMException("Aborted", "AbortError");
    incoming.style.opacity = "1";
    incoming.style.zIndex = "1";
    outgoing.style.opacity = "0";
    outgoing.style.zIndex = "0";
  } catch (error) {
    incoming.style.opacity = "0";
    incoming.style.zIndex = "0";
    throw error;
  } finally {
    signal.removeEventListener("abort", abort);
    animation?.cancel();
    incoming.style.willChange = "";
  }
}

export function createHeroPlayer({ prepare, transition, onState, reducedMotion = () => false }) {
  const controller = new AbortController();
  let current = "night", phase = "night", busy = false, prepared;
  const emit = (extra = {}) => {
    if (!controller.signal.aborted) onState({ current, phase, busy, error: false, ...extra });
  };
  const warmup = () => {
    if (controller.signal.aborted) return Promise.reject(new DOMException("Aborted", "AbortError"));
    if (!prepared) prepared = Promise.resolve().then(() => prepare(controller.signal)).catch(error => {
      prepared = undefined;
      throw error;
    });
    return prepared;
  };
  return {
    warmup,
    async toggle() {
      if (busy || controller.signal.aborted) return false;
      busy = true;
      emit();
      const target = current === "night" ? "day" : "night";
      try {
        await warmup();
        if (controller.signal.aborted) return false;
        const frames = reducedMotion() ? [target] : ["dusk", target];
        for (const next of frames) {
          await transition(phase, next, reducedMotion() ? 0 : 660, controller.signal);
          phase = next;
          emit();
        }
        current = target;
        busy = false;
        emit();
        return true;
      } catch {
        if (!controller.signal.aborted) {
          if (phase !== current) await transition(phase, current, 0, controller.signal).catch(() => {});
          phase = current;
          busy = false;
          emit({ error: true });
        }
        return false;
      }
    },
    dispose() { controller.abort(); },
  };
}
