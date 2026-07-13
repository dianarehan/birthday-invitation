/* ===== Diana's invitation - audio-synced sequence ===== */

const body = document.body;
const song = document.getElementById("song");
const openBtn = document.getElementById("openBtn");
const helloImg = document.getElementById("helloImg");
const envelopeName = document.getElementById("envelopeName");
const rsvpLink = document.getElementById("rsvpLink");
const decor = document.getElementById("decor");
const soundToggle = document.getElementById("soundToggle");
const replayBtn = document.getElementById("replayBtn");

/* timeline (ms) - analysed track: 140 BPM, beat kicks ~14s */
const T = {
  hello: 14600,    // "HELLO?" bubble
  invited: 15300,  // stomp lands on the beat
  main: 16700,     // card reveal after the invited beat
};
const ENVELOPE_BEAT = 1180;
const DEFAULT_ENVELOPE_NAME = "from Diana";
const RSVP_NUMBER = "201016119915";
let timers = [];
const clearTimers = () => { timers.forEach(clearTimeout); timers = []; };
const at = (ms, fn) => timers.push(setTimeout(fn, ms));

function cleanText(value) {
  return value ? value.trim().replace(/\s+/g, " ") : "";
}

function getGuestToken() {
  const params = new URLSearchParams(window.location.search);
  const keys = ["f", "for", "guest", "id", "name"];

  // Support both the new numeric links and any older shared formats.
  for (const key of keys) {
    const value = cleanText(params.get(key) || "");
    if (value) return value;
  }

  return "";
}

function getGuestName() {
  const guestToken = getGuestToken();
  const guestMap = window.GUEST_NAME_MAP || {};

  if (!guestToken) return "";

  const normalizedKey = /^\d+$/.test(guestToken)
    ? String(parseInt(guestToken, 10))
    : guestToken;
  const rawName = guestMap[normalizedKey] || guestMap[guestToken];

  if (rawName) return cleanText(rawName);
  return /^\d+$/.test(guestToken) ? "" : guestToken;
}

function getEnvelopeCopy() {
  const cleanName = getGuestName();
  return cleanName ? `for ${cleanName}` : DEFAULT_ENVELOPE_NAME;
}

function getRsvpHref() {
  const guestName = getGuestName();
  const message = guestName
    ? `Hi Diana, this is ${guestName}. I confirm that I am coming.`
    : "Hi Diana, I'd love to RSVP for your birthday at Camp Cafe.";
  return `https://wa.me/${RSVP_NUMBER}?text=${encodeURIComponent(message)}`;
}

if (envelopeName) {
  envelopeName.textContent = getEnvelopeCopy();
}

if (rsvpLink) {
  rsvpLink.href = getRsvpHref();
}

/* floating decorations - rising petals + softly twinkling sparkles */
const COLORS = ["var(--pink)", "var(--yellow)", "var(--coral)", "var(--orange)", "var(--blue)"];
function spawnDecor() {
  const frag = document.createDocumentFragment();

  for (let i = 0; i < 18; i++) {
    const s = document.createElement("span");
    s.className = "petal";
    s.style.left = Math.random() * 100 + "vw";
    s.style.setProperty("--sz", 8 + Math.random() * 13 + "px");
    s.style.setProperty("--op", 0.28 + Math.random() * 0.35);
    s.style.setProperty("--dur", 10 + Math.random() * 9 + "s");
    s.style.setProperty("--delay", -Math.random() * 14 + "s");
    s.style.setProperty("--drift", Math.random() * 120 - 60 + "px");
    s.style.setProperty("--c", COLORS[(Math.random() * COLORS.length) | 0]);
    frag.appendChild(s);
  }

  for (let i = 0; i < 10; i++) {
    const s = document.createElement("span");
    s.className = "spark";
    s.style.left = Math.random() * 100 + "vw";
    s.style.top = Math.random() * 92 + 3 + "vh";
    s.style.setProperty("--sz", 7 + Math.random() * 11 + "px");
    s.style.setProperty("--dur", 3 + Math.random() * 3.5 + "s");
    s.style.setProperty("--delay", -Math.random() * 5 + "s");
    s.style.setProperty("--c", ["var(--yellow)", "var(--coral)", "var(--orange)"][(Math.random() * 3) | 0]);
    frag.appendChild(s);
  }

  decor.appendChild(frag);
}

/* run the show - phone drops in on tap, then rings */
function play() {
  clearTimers();
  helloImg.classList.remove("show");

  song.currentTime = 0;
  song.play().catch(() => { /* blocked or missing - visuals still run */ });

  body.dataset.stage = "envelope";
  at(ENVELOPE_BEAT, () => { body.dataset.stage = "phone"; });
  at(T.hello, () => helloImg.classList.add("show"));
  at(T.invited, () => { body.dataset.stage = "invited"; });
  at(T.main, () => {
    body.dataset.stage = "main";
    spawnDecor();
  });
}

openBtn.addEventListener("click", play);

/* deep-link for previewing a stage directly: #envelope / #phone / #hello / #invited / #main */
const jump = location.hash.replace("#", "");
if (["envelope", "phone", "hello", "invited", "main"].includes(jump)) {
  body.dataset.stage = jump === "hello" ? "phone" : jump;
  if (jump === "hello") helloImg.classList.add("show");
  if (jump === "main") spawnDecor();
}

replayBtn.addEventListener("click", () => {
  decor.innerHTML = "";
  body.dataset.stage = "intro";
  requestAnimationFrame(play);
});

soundToggle.addEventListener("click", () => {
  song.muted = !song.muted;
  soundToggle.innerHTML = song.muted ? "&#128263;" : "&#9835;";
});
