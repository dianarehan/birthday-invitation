/* ===== Diana's invitation — audio-synced sequence ===== */

const body        = document.body;
const song        = document.getElementById("song");
const openBtn     = document.getElementById("openBtn");
const helloWord   = document.getElementById("helloWord");
const phoneImg    = document.getElementById("phoneImg");
const card        = document.getElementById("card");
const decor       = document.getElementById("decor");
const soundToggle = document.getElementById("soundToggle");
const replayBtn   = document.getElementById("replayBtn");

/* timeline (ms) — synced to the clip: rings ~13s, "Hello" drops ~14s */
const T = {
  hello:   13500,   // elegant "Hello" lands on the vocal drop
  invited: 17200,   // → You're Invited
  main:    20400,   // → the invitation card
};
let timers = [];
const clearTimers = () => { timers.forEach(clearTimeout); timers = []; };
const at = (ms, fn) => timers.push(setTimeout(fn, ms));

/* graceful fallbacks if an asset isn't in /assets yet */
phoneImg.addEventListener("error", () => phoneImg.style.display = "none");
(function checkFrame() {
  const img = new Image();
  img.onerror = () => card.classList.add("no-frame");
  img.src = "assets/frame.png";
})();

/* soft floating petals in muted pastels */
const COLORS = ["var(--blush)", "var(--lilac)", "var(--sage)", "var(--peach)", "var(--accent)"];
function spawnDecor(count = 22) {
  const frag = document.createDocumentFragment();
  for (let i = 0; i < count; i++) {
    const s = document.createElement("span");
    s.style.left = Math.random() * 100 + "vw";
    s.style.setProperty("--sz",   8 + Math.random() * 14 + "px");
    s.style.setProperty("--op",   0.25 + Math.random() * 0.4);
    s.style.setProperty("--dur",  9 + Math.random() * 9 + "s");
    s.style.setProperty("--delay",-Math.random() * 12 + "s");
    s.style.setProperty("--drift",(Math.random() * 120 - 60) + "px");
    s.style.setProperty("--c",    COLORS[(Math.random() * COLORS.length) | 0]);
    frag.appendChild(s);
  }
  decor.appendChild(frag);
}

/* run the show */
function play() {
  clearTimers();
  helloWord.classList.remove("show");

  song.currentTime = 0;
  song.play().catch(() => { /* blocked or missing — visuals still run */ });

  body.dataset.stage = "phone";                       // phone drops & rings
  at(T.hello,   () => helloWord.classList.add("show"));// "Hello" on the drop
  at(T.invited, () => { body.dataset.stage = "invited"; });
  at(T.main,    () => { body.dataset.stage = "main"; spawnDecor(); });
}

openBtn.addEventListener("click", play);

replayBtn.addEventListener("click", () => {
  decor.innerHTML = "";
  play();
});

soundToggle.addEventListener("click", () => {
  song.muted = !song.muted;
  soundToggle.innerHTML = song.muted ? "&#128263;" : "&#9835;";
});
