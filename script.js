/* ===== Diana's invitation — audio-synced sequence ===== */

const body        = document.body;
const song        = document.getElementById("song");
const openBtn     = document.getElementById("openBtn");
const helloImg    = document.getElementById("helloImg");
const decor       = document.getElementById("decor");
const soundToggle = document.getElementById("soundToggle");
const replayBtn   = document.getElementById("replayBtn");

/* timeline (ms) — analysed track: 140 BPM, beat kicks ~14s */
const T = {
  hello:   14300,   // "HELLO?" bubble (user asked +0.4s, then +0.1s)
  invited: 15000,   // stomp lands on the beat, right after Hello
  main:    17200,   // → the framed invitation (moves away fast)
};
let timers = [];
const clearTimers = () => { timers.forEach(clearTimeout); timers = []; };
const at = (ms, fn) => timers.push(setTimeout(fn, ms));

/* floating decorations — rising petals + softly twinkling sparkles */
const COLORS = ["var(--pink)", "var(--yellow)", "var(--coral)", "var(--orange)", "var(--blue)"];
function spawnDecor() {
  const frag = document.createDocumentFragment();
  // rising petals
  for (let i = 0; i < 18; i++) {
    const s = document.createElement("span");
    s.className = "petal";
    s.style.left = Math.random() * 100 + "vw";
    s.style.setProperty("--sz",   8 + Math.random() * 13 + "px");
    s.style.setProperty("--op",   0.28 + Math.random() * 0.35);
    s.style.setProperty("--dur",  10 + Math.random() * 9 + "s");
    s.style.setProperty("--delay",-Math.random() * 14 + "s");
    s.style.setProperty("--drift",(Math.random() * 120 - 60) + "px");
    s.style.setProperty("--c",    COLORS[(Math.random() * COLORS.length) | 0]);
    frag.appendChild(s);
  }
  // scattered twinkling sparkles (kept away from the vertical centre band)
  for (let i = 0; i < 10; i++) {
    const s = document.createElement("span");
    s.className = "spark";
    const x = Math.random() * 100;
    s.style.left = x + "vw";
    s.style.top  = (Math.random() * 92 + 3) + "vh";
    s.style.setProperty("--sz",   7 + Math.random() * 11 + "px");
    s.style.setProperty("--dur",  3 + Math.random() * 3.5 + "s");
    s.style.setProperty("--delay",-Math.random() * 5 + "s");
    s.style.setProperty("--c",    ["var(--yellow)", "var(--coral)", "var(--orange)"][(Math.random() * 3) | 0]);
    frag.appendChild(s);
  }
  decor.appendChild(frag);
}

/* run the show — phone drops in on tap, then rings */
function play() {
  clearTimers();
  helloImg.classList.remove("show");

  song.currentTime = 0;
  song.play().catch(() => { /* blocked or missing — visuals still run */ });

  body.dataset.stage = "phone";                          // phone drops in & rings
  at(T.hello,   () => helloImg.classList.add("show"));    // "HELLO?" from the bottom circle
  at(T.invited, () => { body.dataset.stage = "invited"; });
  at(T.main,    () => { body.dataset.stage = "main"; spawnDecor(); });
}

openBtn.addEventListener("click", play);

/* deep-link for previewing a stage directly: #phone / #hello / #invited / #main */
const jump = location.hash.replace("#", "");
if (["phone", "hello", "invited", "main"].includes(jump)) {
  body.dataset.stage = jump === "hello" ? "phone" : jump;
  if (jump === "hello") helloImg.classList.add("show");
  if (jump === "main") spawnDecor();
}

replayBtn.addEventListener("click", () => {
  decor.innerHTML = "";
  body.dataset.stage = "intro";     // re-dangle the phone, then replay
  requestAnimationFrame(play);
});

soundToggle.addEventListener("click", () => {
  song.muted = !song.muted;
  soundToggle.innerHTML = song.muted ? "&#128263;" : "&#9835;";
});
