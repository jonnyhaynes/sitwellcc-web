# Homepage "Club rides" card — looping drone video

**Status:** implemented, awaiting review
**Date:** 2026-10-12
**Slug:** `homepage-drone-video`
**Repo:** `sitwellcc` (single repo — no Studio change)

## Goal

Replace the static photo in the homepage **Club rides** promo card
(`src/pages/index.astro`) with a compressed, silent, looping drone video. Decided
with the requester: **the video always wins** — it renders regardless of what (if
anything) is authored for the `rides` feature in Sanity.

## What we started with

`public/video/drone.mp4` was dropped into `public/` (so it would have shipped
as-is) at full size:

| Property | Value |
|---|---|
| Container / codec | MP4 / H.264 (video) + AAC (audio) |
| Resolution / fps | 1280×720 / 30 |
| Duration | 26.4 s |
| Bitrate | ~9.5 Mbps |
| Size | **31.3 MB** |

Far too heavy for a decorative background loop, and it carried an audio track.

## Result (committed to `public/video/`)

Matches the existing kit-clip convention (`public/video/{jersey,bib-shorts,cap,socks}.mp4`):

| File | Codec | Notes | Size |
|---|---|---|---|
| `drone.webm` | VP9 | silent, served first | **3.03 MB** |
| `drone.mp4` | H.264 (High) | silent, `+faststart`, universal fallback | **3.53 MB** |
| `drone-poster.webp` | WebP | still frame for `poster` | 43 KB |

31.3 MB → 3.0/3.5 MB (~9× smaller). A visitor downloads the poster plus **one**
video, ~3–3.6 MB, and the video loads after render (`preload="metadata"`), so it
isn't on the critical path.

Also dropped the frame rate 30 → 24 fps (imperceptible on a slow drone shot) and
stripped audio, which together did most of the work beyond the obvious CRF hit.

### Commands used

```bash
# WebM (VP9), no audio, 24fps
ffmpeg -y -i <master> -an -r 24 \
  -c:v libvpx-vp9 -crf 44 -b:v 0 -deadline good -cpu-used 2 -row-mt 1 \
  -tile-columns 2 -pix_fmt yuv420p public/video/drone.webm

# Poster — a frame ~1s in (avoids a possible fade-in first frame)
ffmpeg -y -ss 1 -i <master> -frames:v 1 -c:v libwebp -quality 80 \
  public/video/drone-poster.webp

# MP4 (H.264), no audio, 24fps, progressive download — temp name, then swap in
ffmpeg -y -i <master> -an -r 24 \
  -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 32 -preset slow \
  -movflags +faststart public/video/drone.tmp.mp4
mv public/video/drone.tmp.mp4 public/video/drone.mp4
```

First attempts (CRF 25/34 at 30 fps) landed at 8.6/7.4 MB, so CRF and frame rate
were pushed until both formats sat comfortably under the ~4 MB target.

## Markup change — `src/pages/index.astro`

The rides card's `<SanityImage … />` is replaced by a `<video>`; everything else
in the card (eyebrow, heading, body, `<span class="btn">`, the wrapping
`<a href={rides.linkHref}>`) is unchanged.

```astro
<video
  class="absolute inset-0 object-cover w-full h-full pointer-events-none"
  data-decorative-video
  muted loop playsinline
  preload="metadata"
  poster="/video/drone-poster.webp"
  aria-hidden="true"
  tabindex="-1"
>
  <source src="/video/drone.webm" type="video/webm" />
  <source src="/video/drone.mp4" type="video/mp4" />
</video>
```

- `muted` + `loop` + `playsinline` → silent, continuous background loop, no controls.
  `muted` is also required for programmatic playback under browser autoplay policies.
- `object-cover` + `inset-0 w-full h-full` mirrors the old image sizing so the crop
  is unchanged.
- `aria-hidden="true"` + `tabindex="-1"` → the clip is decorative; the card's text
  carries the meaning. This also retires the hand-written `fallbackAlt`, which
  described the old sunset photo.
- `pointer-events-none` → the video sits inside the card's `<a>`; ignoring pointer
  events keeps the whole card one click target to `/rides`.
- `<source>` order: WebM first, MP4 second — browsers take the first format they
  support, so Chrome/Firefox/Edge get the smaller VP9 file and Safari falls through
  to H.264.

`rides.image` / `rides.fallbackSrc` / `rides.fallbackAlt` are now unused on this
card; the `CARD_DEFAULTS.rides` entry and `Feature` type are left untouched (shared
card shape), with a comment explaining the deliberate replacement.

## Reduced motion

No `autoplay` attribute. A small inline script starts playback only when the
visitor hasn't asked for reduced motion, so reduced-motion users keep the still
(and a looping autoplay video is exactly what WCAG 2.2.2 covers). Because the
`poster` is already on screen, there's no flash of a paused frame.

```astro
<script is:inline>
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document
      .querySelectorAll('video[data-decorative-video]')
      .forEach((video) => video.play().catch(() => {}));
  }
</script>
```

The page stays static-by-default — this is a tiny enhancement, not a React island.

## Files changed

| File | Change |
|---|---|
| `public/video/drone.mp4` | Overwritten with compressed, silent H.264 (31.3 MB → 3.53 MB) |
| `public/video/drone.webm` | New — VP9, silent (3.03 MB) |
| `public/video/drone-poster.webp` | New — still frame (43 KB) |
| `src/pages/index.astro` | Rides card: `SanityImage` → `<video>`; reduced-motion inline script |
| `docs/plans/2026-10-12-homepage-drone-video.md` | This plan |

No changes to `SanityImage.astro`, `sanity.ts`, schema, or any other page. No SSR,
no new dependencies.

## Verification

- `ffprobe` on both outputs: **no audio stream**, codecs `vp9` / `h264`, 1280×720,
  24 fps, duration ≈ 26.4 s.
- `npm run astro check` and `npm run build` green.
- `npm run dev` visual smoke test: the card plays the clip, loops, is silent, the
  overlay text/CTA sit on top, and clicking the card goes to `/rides`.
- Reduced-motion emulation: poster shows, clip does not play.
- No 31 MB file remains under `public/`.

## Risks / notes

- **Binary in git.** ~3 MB per format is consistent with the existing kit clips;
  fine at this size.
- **Sanity `rides` image is now inert on the homepage.** Flagged rather than
  silently changed; the Studio schema lives in the separate `sitwellcc-api` repo.
- **Autoplay policies.** Covered by `muted`; if a browser still refuses, the poster
  remains.

## PR

Branch off `main`, open a PR with the `[ai-assisted]` title prefix, reference this
plan doc, keep the `Co-Authored-By: CommandCodeBot <noreply@commandcode.ai>`
trailer, and leave the merge to a human (merging to `main` deploys to production).
