/* ===== Diana's invitation - audio-synced sequence ===== */

const body = document.body;
const song = document.getElementById("song");
const openBtn = document.getElementById("openBtn");
const helloImg = document.getElementById("helloImg");
const envelopeName = document.getElementById("envelopeName");
const decor = document.getElementById("decor");
const soundToggle = document.getElementById("soundToggle");
const replayBtn = document.getElementById("replayBtn");

/* timeline (ms) - analysed track: 140 BPM, beat kicks ~14s */
const T = {
  hello: 14300,    // "HELLO?" bubble
  invited: 15000,  // stomp lands on the beat
  main: 16400,     // card reveal after the invited beat
};
const ENVELOPE_BEAT = 1180;
const DEFAULT_ENVELOPE_NAME = "from Diana";
let timers = [];
const clearTimers = () => { timers.forEach(clearTimeout); timers = []; };
const at = (ms, fn) => timers.push(setTimeout(fn, ms));

function getEnvelopeCopy() {
  const params = new URLSearchParams(window.location.search);
  const rawName = params.get("for") || params.get("name") || params.get("guest");
  const cleanName = rawName ? rawName.trim().replace(/\s+/g, " ") : "";
  return cleanName ? `for ${cleanName}` : DEFAULT_ENVELOPE_NAME;
}

if (envelopeName) {
  envelopeName.textContent = getEnvelopeCopy();
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
