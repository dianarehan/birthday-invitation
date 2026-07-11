# Diana's Birthday Invitation — Project Handoff / Context

A single-page, mobile-first **animated birthday invitation** website with a second gift-ideas page.
Static site (plain HTML/CSS/JS), intended to be shared via a link. This doc captures everything
needed to continue the work.

---

## 1. Concept & the animated sequence

A recipient opens the page and taps **Open**. Then, synced to a PinkPantheress ringtone track:

1. **Tap screen** (clean, no phone): `you have / an invitation / [Open] / best experienced with sound on`.
2. On tap → the track plays and a **pink retro phone drops in from the top and dangles**, swinging slowly.
3. The phone **rings** — coral **ring-waves pulse out of the phone's bottom circle (mouthpiece)**, one **every beat (0.429 s @ 140 BPM)**.
4. At **~14.3 s** a **"HELLO?" speech bubble** pops out of the bottom circle.
5. On the **beat drop (~15 s)**, **"you're / Invited"** — the word **"Invited" falls hard from above and lands heavy** with a **vertical impact shake** (no left/right sway).
6. **~17.2 s** → the **main invitation card** appears (the framed card), with floating petals + sparkles.
7. A **Gift Ideas →** button links to `gifts.html`.

There's a **↺ replay** button and a **♪ mute** toggle on the main screen.

### Exact timeline (in `script.js`, object `T`, milliseconds)
- `hello: 14300` — HELLO? bubble shows (user tuned: +0.4s then +0.1s from an original ~13.8s)
- `invited: 15000` — "Invited" stomp/drop lands on the beat
- `main: 17200` — main card reveals (fast exit off the invited screen)

**Audio autoplay note:** browsers block audio until a user gesture, so the **tap on Open is required** — it starts both the music and the sequence. This is intentional/unavoidable.

---

## 2. Files

```
Project/
├── index.html              # the whole animated experience (single page, staged)
├── styles.css              # all styling + animations
├── script.js               # sequence controller (timeline, decor, controls)
├── gifts.html              # gift-ideas page (self-contained styles inline)
├── PROJECT_CONTEXT.md      # this file
├── Music/
│   ├── illegal-ringtone.mp3                 # CURRENT audio (renamed copy, clean filename)
│   ├── PinkPantheress- Illegal (Ringtone ver.) full.mp3   # original of the above
│   └── pinkpantheress_ringotne_song.mp3     # OLD/first track (no longer used)
└── assets/
    ├── frame-gen.svg                 # CURRENT card frame (generated, see §7)
    ├── phone-removebg-preview.png    # transparent dangling phone (447×558)
    ├── hello-removebg-preview.png    # transparent "HELLO?" bubble (447×558, same canvas)
    ├── 70fc8ebf...jpg                # original source image the two PNGs were cut from
    └── frames/image.png              # OLD raster frame (no longer used; replaced by SVG)
```

**Stage system:** `<body data-stage="intro|phone|invited|main">`. CSS shows the matching `<section>`
and gates animations per stage. JS flips `data-stage` on the timeline.

**Deep-link preview (dev aid, harmless in prod):** `index.html#phone`, `#hello`, `#invited`, `#main`
jump straight to a stage. Handled at the bottom of `script.js`.

---

## 3. Party details / copy (as shown on the card)

- **Headline:** HAPPY BDAY
- **Name:** Diana
- **Where:** Home
- **When:** 17 · 07 · 2026  (17 July 2026)
- **The two little rules:** _bring a gift_ · _wear pastel colours_

## 4. Gift ideas (`gifts.html`, final list, numbered)
1. Silver necklaces
2. Vanilla scented candle
3. Headphones
4. Shoulder bag — _anything but burgundy_
5. Centella Ampoule
6. Dr. Baby matcha powder

---

## 5. Visual identity

**Vibe:** warm, playful, slightly pastel, "coquette/retro" scalloped frame on a harlequin (argyle) wall.
Went through iterations: bright pastel-rainbow → "too childish" → elevated pastel → **warm harlequin
(current)** → senior-designer polish (softer pastels + grain + hierarchy).

### Palette (`:root` in `styles.css`) — softened/pastel
```
--orange:    #ee8a5f   --yellow:   #f7c86e   --pink:  #f6bcd1   --pink-soft: #fad4e0
--coral:     #e58379   --coral-deep:#cf6258 (headline/accents)
--cream:     #fdf6ea   --blue: #bcd2e8 (harlequin)
--ink:       #67432f (warm espresso body)   --ink-soft: #a9836b   --caramel: #c67a48 (labels)
--accent:    #e58379
```
Harlequin wall bg color behind the frame: `#f4ead6` with soft-blue diamonds.

### Type (Google Fonts)
- **Playfair Display** (serif) — headline "HAPPY BDAY", "an invitation"
- **Great Vibes** (script) — "Diana", "you're", gift-page script bits
- **Jost** (sans) — labels, buttons, small caps
- **Cormorant Garamond** — meta values, rule lines

### Card hierarchy (main screen, biggest → smallest)
`HAPPY BDAY` (bold uppercase, `--coral-deep`) › `Diana` (script, `--ink`) › `WHERE/WHEN` labels
(`--caramel`, prominent) + values (`--ink`) › `the two little rules` title (small) › rule lines
(smaller, italic) with **animated shape bullets** › **Gift Ideas** button (dropped lower).

---

## 6. Animations (all in `styles.css` keyframes)
- `dropIn` — phone drops from above on tap (gated to `data-stage="phone"`).
- `sway` — phone dangles/swings slowly (±10°, 2.8 s) while ringing.
- `ringPulse` — ring-waves from the mouthpiece; 3 `.ring-wave i` elements at `left:56% top:84%` of the phone canvas, staggered 0/0.429/0.858 s → one pulse per beat (140 BPM).
- `helloPop` — HELLO? bubble scales in from the bottom circle.
- `drophard` — "Invited" heavy fall: from `translateY(-52vh)` accelerating (gravity ease-in) → hard land → small rebound. **Vertical only.**
- `shake` — vertical-only impact tremor on the whole `.invited` block, delayed to hit on landing.
- `cardPop` / `fadeUp` — card + staggered text reveal.
- `spin` (bullet flower), `breathe` (bullet star), `twinkle` (sparkles), `rise` (petals).
- Grain: static overlay `.grain` (feTurbulence SVG data-URI, opacity .05, `mix-blend-mode: multiply`, z-index 7).

**⚠️ Animation gotcha (learned the hard way):** stage-entry animations MUST be gated under
`body[data-stage="X"] .el { animation… }`. If put directly on the element they fire on page LOAD
(while the stage is hidden) and are over before the stage appears. Also pin `opacity:1` on the final
keyframe so `forwards` fill keeps it visible. This bit the "Invited" block (it was invisible until fixed).

### Z-index layering (important)
`.wall` (harlequin, z0, only on main) < `.decor` (petals/sparkles, z1) < stages/card (z2) < controls (z5) < `.grain` (z7).
The harlequin lives on its OWN `.wall` layer (not on `.stage-main`) specifically so the floating
sparkles render ABOVE the wall but BEHIND the card. Moving it broke sparkle visibility before.

---

## 7. The frame is a GENERATED SVG (`assets/frame-gen.svg`)

The original raster frame made text fight the busy loops/scallops, so the frame is now generated with
a clean, centered cream window (inset 74 of 500 ≈ 70% wide). The card uses it as `background: contain`
and overlays text in `.card__inner { width:70% }` (matches the window).

**Regeneration script** (was in the session scratchpad — reproduce as needed). Run with `py genframe.py`:
```python
W, H = 500, 660
def scallop(x0,y0,x1,y1,r,sweep=0):
    w,h=x1-x0,y1-y0; nx=max(3,round(w/(2*r))); ny=max(3,round(h/(2*r)))
    rx=w/(2*nx); ry=h/(2*ny); d=[f"M {x0:.1f} {y0:.1f}"]; x=x0
    for _ in range(nx): x+=2*rx; d.append(f"A {rx:.1f} {rx:.1f} 0 0 {sweep} {x:.1f} {y0:.1f}")
    y=y0
    for _ in range(ny): y+=2*ry; d.append(f"A {ry:.1f} {ry:.1f} 0 0 {sweep} {x1:.1f} {y:.1f}")
    x=x1
    for _ in range(nx): x-=2*rx; d.append(f"A {rx:.1f} {rx:.1f} 0 0 {sweep} {x:.1f} {y1:.1f}")
    y=y1
    for _ in range(ny): y-=2*ry; d.append(f"A {ry:.1f} {ry:.1f} 0 0 {sweep} {x0:.1f} {y:.1f}")
    d.append("Z"); return " ".join(d)
ORANGE,YELLOW,PINK,CORAL,CREAM = "#ee8a5f","#f7c86e","#f6bcd1","#e58379","#fdf6ea"
yellow=scallop(18,18,482,642,20); pink=scallop(40,40,460,620,18); coral=scallop(60,60,440,600,15)
svg=f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}">
  <rect x="0" y="0" width="{W}" height="{H}" rx="30" fill="{ORANGE}"/>
  <path d="{yellow}" fill="{YELLOW}" stroke="{CREAM}" stroke-width="5" stroke-linejoin="round"/>
  <path d="{pink}" fill="{PINK}" stroke="{CREAM}" stroke-width="5" stroke-linejoin="round"/>
  <path d="{coral}" fill="none" stroke="{CORAL}" stroke-width="3.5" stroke-linejoin="round"/>
  <rect x="74" y="74" width="352" height="512" rx="22" fill="{CREAM}"/>
</svg>'''
open(r"d:/Hobbies/Birthday Invitation/Project/assets/frame-gen.svg","w",encoding="utf-8").write(svg)
```
Card `aspect-ratio: 500/660` matches the viewBox so `background: contain` fills exactly and the cream window stays centered.

---

## 8. Audio timing (measured, not guessed)

Track: **PinkPantheress – Illegal (Ringtone ver.)**, `Music/illegal-ringtone.mp3`, ~165 s, **140 BPM**
(beat = 0.429 s). Sparse/ringing intro until ~13 s, **beat kicks in ~14 s**. The old track was 30 s;
same timing/tempo. Analyzed via a bundled ffmpeg + numpy onset autocorrelation:
```bash
py -m pip install imageio-ffmpeg   # gives a bundled ffmpeg binary; numpy already present
```
Then decode to raw PCM with ffmpeg (`-f s16le`), compute RMS envelope per 512-sample hop, onset =
positive diff, tempo = argmax of onset autocorrelation over 70–190 BPM. (Full script was in scratchpad.)

---

## 9. Local preview, mobile testing, deploy

### Preview locally
```bash
cd "d:/Hobbies/Birthday Invitation/Project"
py -m http.server 8080 --bind 127.0.0.1      # http://localhost:8080
```

### View on phone (same Wi-Fi) — currently set up
- Server bound to all interfaces on **port 8000**: `py -m http.server 8000 --bind 0.0.0.0`
- PC LAN IP: **192.168.1.9** → phone URL **http://192.168.1.9:8000**
- Windows Firewall blocks inbound by default; allow once (Run as admin):
  `netsh advfirewall firewall add rule name="Diana Invite 8000" dir=in action=allow protocol=TCP localport=8000`
  (or click "Allow access" on the Windows Firewall popup). Remove later with the same command using `delete rule`.
- Only works while the server runs and phone is on the same Wi-Fi.

### Deploy (planned, NOT done yet)
- Target: **GitHub Pages**, repo name **`dianas-birthday`** → URL `https://<username>.github.io/dianas-birthday`.
- Need from user: a GitHub account + username. A true bare domain (e.g. dianas-birthday.com) would
  cost ~$10–15/yr and be pointed at Pages; the free github.io path link works fine for sharing.
- Repo already `git init`'d locally; nothing committed/pushed yet.

### Screenshot tooling (headless Edge) + a key caveat
Edge is at `C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`. Example:
```bash
msedge --headless=new --disable-gpu --no-sandbox --hide-scrollbars \
  --user-data-dir="C:\path\to\fresh-profile" --window-size=480,940 \
  --virtual-time-budget=2600 --screenshot="OUT.png" "http://127.0.0.1:8080/index.html#main"
```
- Use a **fresh `--user-data-dir` + a `?v=RANDOM` cache-bust** each run (Edge caches hard).
- **CAVEAT:** headless Edge ignores the mobile `<meta viewport>`, so it lays the page out wide; the
  card hits its `min(92vw,430px)` = 430px max and can overflow a narrow (e.g. 360px) screenshot. This
  is a SCREENSHOT ARTIFACT, not a real-device bug — the card is genuinely centered (verified with a
  temporary `outline` on `.card__inner`). Screenshot at **≥480px window width** to see the true full
  composition; trust real phones for narrow widths.

---

## 10. User preferences learned (apply going forward)
- Dislikes anything that reads **childish** — no Android emojis; wants **mature/elegant + playful**, soft pastel.
- Cares a lot about **animation feel & audio sync** (asked for beat-synced waves, precise HELLO timing,
  a heavy vertical "stomp" for Invited — explicitly NOT a left/right sway).
- Wants things **centered and not clipped** on mobile; balanced side spacing.
- Iterates visually — **screenshot changes before declaring done**. Non-technical-ish on deploy/git.
- Provides real assets (phone/hello PNGs, frame image, audio) when the drawn/generated versions aren't good enough.

---

## 11. Status & possible next steps
**Done:** full sequence works and is timed to the track; real phone image + HELLO from the bottom
circle; generated scalloped SVG frame with clean centered text; softer pastel palette + subtle grain;
refined hierarchy (HAPPY BDAY headline, prominent Where/When, smaller rules); animated shape bullets;
button dropped lower; floating petals + sparkles; gifts page. Verified via screenshots at 360–480px.

**Not done / open:**
- Deploy to GitHub Pages as `dianas-birthday` (needs the user's GitHub username).
- Final on-real-phone sign-off (user testing via the LAN URL).
- Optional ideas offered but not built: countdown ("X days to go"), guest RSVP button (WhatsApp/SMS),
  denser/sparser sparkles, stronger grain — all easy tweaks.
- Consider adding a `.nojekyll` file and a proper commit before pushing to Pages.

**Contact/context:** user email on file `Embeddedproject2022@gmail.com`; today's date in-session was 2026-07-11.
```
