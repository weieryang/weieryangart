"""Build the aligned blueprint-to-sculpture hero loop.

The script deliberately works from two finished, geometrically aligned stills.
It adds only light, exposure and camera motion, so the sculpture itself never
morphs or develops impossible geometry.
"""

from __future__ import annotations

import argparse
import math
from pathlib import Path

import cv2
import numpy as np


def smoothstep(value: float) -> float:
    value = min(1.0, max(0.0, value))
    return value * value * (3.0 - 2.0 * value)


def ease_in_out(value: float) -> float:
    return 0.5 - 0.5 * math.cos(math.pi * min(1.0, max(0.0, value)))


def cover_frame(image: np.ndarray, width: int, height: int, scale: float, shift_x: float, shift_y: float) -> np.ndarray:
    source_h, source_w = image.shape[:2]
    cover = max(width / source_w, height / source_h) * scale
    resized_w = max(width, int(round(source_w * cover)))
    resized_h = max(height, int(round(source_h * cover)))
    resized = cv2.resize(image, (resized_w, resized_h), interpolation=cv2.INTER_LANCZOS4)

    center_x = resized_w / 2 + shift_x * resized_w
    center_y = resized_h / 2 + shift_y * resized_h
    left = int(round(center_x - width / 2))
    top = int(round(center_y - height / 2))
    left = min(max(left, 0), resized_w - width)
    top = min(max(top, 0), resized_h - height)
    return resized[top : top + height, left : left + width]


def light_sweep(width: int, height: int, center: float) -> np.ndarray:
    x = np.linspace(0.0, 1.0, width, dtype=np.float32)
    y = np.linspace(0.0, 1.0, height, dtype=np.float32)
    xx, yy = np.meshgrid(x, y)
    diagonal = xx * 0.84 + yy * 0.16
    band = np.exp(-((diagonal - center) ** 2) / (2.0 * 0.115**2))
    sculpture_bias = smoothstep((center - 0.18) / 0.62)
    vignette = np.clip(1.12 - (((xx - 0.58) / 0.84) ** 2 + ((yy - 0.48) / 1.08) ** 2) * 0.31, 0.72, 1.0)
    return (1.0 + band * (0.28 + sculpture_bias * 0.12)) * vignette


def compose_frame(photo: np.ndarray, blueprint: np.ndarray, time_s: float, duration: float, width: int, height: int) -> np.ndarray:
    progress = time_s / duration

    if progress < 0.19:
        photo_mix = 0.0
    elif progress < 0.45:
        photo_mix = smoothstep((progress - 0.19) / 0.26)
    elif progress < 0.80:
        photo_mix = 1.0
    else:
        photo_mix = 1.0 - smoothstep((progress - 0.80) / 0.20)

    orbit = ease_in_out(min(max((progress - 0.36) / 0.48, 0.0), 1.0))
    return_orbit = 1.0 - smoothstep(min(max((progress - 0.82) / 0.18, 0.0), 1.0))
    orbit *= return_orbit
    scale = 1.0 + 0.032 * orbit
    shift_x = 0.008 * orbit
    shift_y = -0.004 * orbit

    photo_frame = cover_frame(photo, width, height, scale, shift_x, shift_y)
    blueprint_frame = cover_frame(blueprint, width, height, scale, shift_x, shift_y)
    frame = cv2.addWeighted(blueprint_frame, 1.0 - photo_mix, photo_frame, photo_mix, 0.0)

    if 0.16 <= progress <= 0.61:
        sweep_position = -0.10 + ((progress - 0.16) / 0.45) * 1.38
        illumination = light_sweep(width, height, sweep_position)
        strength = math.sin(min(1.0, max(0.0, (progress - 0.16) / 0.45)) * math.pi)
        frame = np.clip(frame.astype(np.float32) * (1.0 + (illumination[..., None] - 1.0) * strength), 0, 255).astype(np.uint8)

    # Very restrained photographic breathing; this adds life without moving geometry.
    breathe = 1.0 + math.sin(progress * math.tau) * 0.012 * photo_mix
    frame = np.clip(frame.astype(np.float32) * breathe, 0, 255).astype(np.uint8)
    return frame


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--photo", required=True)
    parser.add_argument("--blueprint", required=True)
    parser.add_argument("--output", required=True)
    parser.add_argument("--width", type=int, default=1600)
    parser.add_argument("--height", type=int, default=900)
    parser.add_argument("--fps", type=int, default=24)
    parser.add_argument("--duration", type=float, default=9.0)
    args = parser.parse_args()

    photo = cv2.imread(str(Path(args.photo)), cv2.IMREAD_COLOR)
    blueprint = cv2.imread(str(Path(args.blueprint)), cv2.IMREAD_COLOR)
    if photo is None or blueprint is None:
        raise RuntimeError("Unable to read the aligned hero source images.")

    output = Path(args.output)
    output.parent.mkdir(parents=True, exist_ok=True)
    codec = "VP90" if output.suffix.lower() == ".webm" else "mp4v"
    writer = cv2.VideoWriter(
        str(output),
        cv2.VideoWriter_fourcc(*codec),
        float(args.fps),
        (args.width, args.height),
    )
    if not writer.isOpened():
        raise RuntimeError("OpenCV could not open the MP4 writer.")

    total_frames = int(round(args.fps * args.duration))
    for index in range(total_frames):
        frame_time = (index / total_frames) * args.duration
        writer.write(compose_frame(photo, blueprint, frame_time, args.duration, args.width, args.height))
    writer.release()
    print(f"Wrote {output} ({total_frames} frames, {args.duration:.1f}s)")


if __name__ == "__main__":
    main()
