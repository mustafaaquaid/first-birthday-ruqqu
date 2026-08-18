// ============================================================
// EASILY CUSTOMIZE HERE
// ============================================================
const HER_NAME = "Ruqqu"; // optional: set her name e.g. "Ava" — leave blank to skip

if (HER_NAME) {
  document.getElementById("subtitleText").textContent =
    `${HER_NAME}, hope your day is as lovely as your smile 🌸✨`;
}

// stagger the "Happy Birthday" letters
document.querySelectorAll(".title-3d span").forEach((el, i) => {
  el.style.setProperty("--d", i);
});

// ============================================================
// BACKGROUND: floating hearts / sparkles canvas
// ============================================================
const bgCanvas = document.getElementById("bg-canvas");
const bgCtx = bgCanvas.getContext("2d");
let bgW, bgH;

function resizeBg() {
  bgW = bgCanvas.width = window.innerWidth;
  bgH = bgCanvas.height = window.innerHeight;
}
resizeBg();
window.addEventListener("resize", resizeBg);

const particles = [];
const PARTICLE_COUNT = window.innerWidth < 600 ? 22 : 40;
const shapes = ["heart", "spark"];

function makeParticle() {
  return {
    x: Math.random() * bgW,
    y: Math.random() * bgH,
    size: 6 + Math.random() * 14,
    speed: 0.3 + Math.random() * 0.8,
    drift: (Math.random() - 0.5) * 0.6,
    opacity: 0.15 + Math.random() * 0.35,
    shape: shapes[Math.random() > 0.7 ? 1 : 0],
    rot: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.02,
  };
}
for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(makeParticle());

function drawHeart(ctx, x, y, size, opacity, rot) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.beginPath();
  const s = size / 2;
  ctx.moveTo(0, s * 0.3);
  ctx.bezierCurveTo(-s, -s * 0.6, -s * 1.6, s * 0.5, 0, s * 1.4);
  ctx.bezierCurveTo(s * 1.6, s * 0.5, s, -s * 0.6, 0, s * 0.3);
  ctx.closePath();
  ctx.fillStyle = `rgba(155, 135, 224, ${opacity})`;
  ctx.fill();
  ctx.restore();
}

function drawSpark(ctx, x, y, size, opacity, rot) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.beginPath();
  ctx.moveTo(0, -size);
  ctx.lineTo(size * 0.25, -size * 0.25);
  ctx.lineTo(size, 0);
  ctx.lineTo(size * 0.25, size * 0.25);
  ctx.lineTo(0, size);
  ctx.lineTo(-size * 0.25, size * 0.25);
  ctx.lineTo(-size, 0);
  ctx.lineTo(-size * 0.25, -size * 0.25);
  ctx.closePath();
  ctx.fillStyle = `rgba(255, 209, 102, ${opacity})`;
  ctx.fill();
  ctx.restore();
}

function animateBg() {
  bgCtx.clearRect(0, 0, bgW, bgH);
  for (const p of particles) {
    p.y -= p.speed;
    p.x += p.drift;
    p.rot += p.rotSpeed;
    if (p.y < -20) {
      p.y = bgH + 20;
      p.x = Math.random() * bgW;
    }
    if (p.shape === "heart") drawHeart(bgCtx, p.x, p.y, p.size, p.opacity, p.rot);
    else drawSpark(bgCtx, p.x, p.y, p.size * 0.6, p.opacity, p.rot);
  }
  requestAnimationFrame(animateBg);
}
animateBg();

// ============================================================
// NAV DOTS (active section tracking + click to scroll)
// ============================================================
const dots = document.querySelectorAll(".dot");
const sections = document.querySelectorAll(".section");

dots.forEach((dot) => {
  dot.addEventListener("click", () => {
    document.getElementById(dot.dataset.target).scrollIntoView({ behavior: "smooth" });
  });
});

const dotObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        dots.forEach((d) => d.classList.remove("active"));
        const match = document.querySelector(`.dot[data-target="${entry.target.id}"]`);
        if (match) match.classList.add("active");
      }
    });
  },
  { threshold: 0.5 }
);
sections.forEach((s) => dotObserver.observe(s));

// ============================================================
// CAKE: blow out candles
// ============================================================
const candles = document.querySelectorAll(".candle");
const cakeReveal = document.getElementById("cakeReveal");
const cakeHint = document.getElementById("cakeHint");
let blownCount = 0;

candles.forEach((candle) => {
  candle.addEventListener("click", () => {
    if (candle.classList.contains("blown")) return;
    candle.classList.add("blown");
    blownCount++;
    if (blownCount === 1) cakeHint.textContent = "keep going...";
    if (blownCount === 2) cakeHint.textContent = "almost there...";
    if (blownCount === candles.length) {
      cakeHint.textContent = "🎉 wish made!";
      setTimeout(() => cakeReveal.classList.add("show"), 300);
      burstConfettiAt(candle, 14);
    }
  });
});

function burstConfettiAt(el) {
  const rect = el.getBoundingClientRect();
  for (let i = 0; i < 10; i++) {
    const bit = document.createElement("div");
    bit.textContent = ["✨", "💗", "🎉"][Math.floor(Math.random() * 3)];
    bit.style.position = "fixed";
    bit.style.left = rect.left + "px";
    bit.style.top = rect.top + "px";
    bit.style.fontSize = "14px";
    bit.style.zIndex = 999;
    bit.style.pointerEvents = "none";
    bit.style.transition = "all 0.9s ease-out";
    document.body.appendChild(bit);
    requestAnimationFrame(() => {
      bit.style.transform = `translate(${(Math.random() - 0.5) * 160}px, ${
        -80 - Math.random() * 80
      }px) rotate(${Math.random() * 360}deg)`;
      bit.style.opacity = "0";
    });
    setTimeout(() => bit.remove(), 950);
  }
}

// ============================================================
// FLIP NOTE CARD
// ============================================================
const flipCard = document.getElementById("flipCard");
flipCard.addEventListener("click", () => {
  flipCard.classList.toggle("flipped");
});

// ============================================================
// GAME: Catch the Hearts
// ============================================================
const gameCanvas = document.getElementById("gameCanvas");
const gCtx = gameCanvas.getContext("2d");
const scoreEl = document.getElementById("score");
const targetEl = document.getElementById("target");
const targetLabel = document.getElementById("targetLabel");
const startBtn = document.getElementById("startGameBtn");
const gameOverlay = document.getElementById("gameOverlay");
const TARGET_SCORE = 15;
targetEl.textContent = TARGET_SCORE;
targetLabel.textContent = TARGET_SCORE;

let gW, gH, dpr;
function resizeGameCanvas() {
  dpr = window.devicePixelRatio || 1;
  const rect = gameCanvas.getBoundingClientRect();
  gW = rect.width;
  gH = rect.height;
  gameCanvas.width = gW * dpr;
  gameCanvas.height = gH * dpr;
  gCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
resizeGameCanvas();
window.addEventListener("resize", resizeGameCanvas);

let fallingHearts = [];
let score = 0;
let gameRunning = false;
let spawnTimer = null;
let missedStreak = 0;

function spawnHeart() {
  const size = 26 + Math.random() * 16;
  fallingHearts.push({
    x: Math.random() * (gW - size) + size / 2,
    y: -size,
    size,
    speed: 1.4 + Math.random() * 1.8,
    caught: false,
    wobble: Math.random() * Math.PI * 2,
  });
}

function drawGameHeart(x, y, size, wobble) {
  const wx = x + Math.sin(wobble) * 4;
  gCtx.save();
  gCtx.translate(wx, y);
  gCtx.beginPath();
  const s = size / 2;
  gCtx.moveTo(0, s * 0.3);
  gCtx.bezierCurveTo(-s, -s * 0.6, -s * 1.6, s * 0.5, 0, s * 1.4);
  gCtx.bezierCurveTo(s * 1.6, s * 0.5, s, -s * 0.6, 0, s * 0.3);
  gCtx.closePath();
  const grad = gCtx.createLinearGradient(0, -s, 0, s * 1.4);
  grad.addColorStop(0, "#c2a4f4");
  grad.addColorStop(1, "#6c4fc7");
  gCtx.fillStyle = grad;
  gCtx.fill();
  gCtx.restore();
}

function gameLoop() {
  if (!gameRunning) return;
  gCtx.clearRect(0, 0, gW, gH);

  for (let i = fallingHearts.length - 1; i >= 0; i--) {
    const h = fallingHearts[i];
    h.y += h.speed;
    h.wobble += 0.05;
    drawGameHeart(h.x, h.y, h.size, h.wobble);
    if (h.y - h.size > gH) {
      fallingHearts.splice(i, 1);
    }
  }

  requestAnimationFrame(gameLoop);
}

function handleGameTap(clientX, clientY) {
  if (!gameRunning) return;
  const rect = gameCanvas.getBoundingClientRect();
  const x = clientX - rect.left;
  const y = clientY - rect.top;

  for (let i = fallingHearts.length - 1; i >= 0; i--) {
    const h = fallingHearts[i];
    const dx = x - (h.x + Math.sin(h.wobble) * 4);
    const dy = y - h.y;
    if (Math.sqrt(dx * dx + dy * dy) < h.size * 0.9) {
      fallingHearts.splice(i, 1);
      score++;
      scoreEl.textContent = score;
      popScoreFx(clientX, clientY);
      if (score >= TARGET_SCORE) {
        endGame(true);
      }
      break;
    }
  }
}

function popScoreFx(x, y) {
  const el = document.createElement("div");
  el.textContent = "+1 💗";
  el.style.position = "fixed";
  el.style.left = x + "px";
  el.style.top = y + "px";
  el.style.color = "#6c4fc7";
  el.style.fontWeight = "600";
  el.style.fontSize = "14px";
  el.style.zIndex = 999;
  el.style.pointerEvents = "none";
  el.style.transition = "all 0.6s ease-out";
  document.body.appendChild(el);
  requestAnimationFrame(() => {
    el.style.transform = "translateY(-30px)";
    el.style.opacity = "0";
  });
  setTimeout(() => el.remove(), 650);
}

gameCanvas.addEventListener("click", (e) => handleGameTap(e.clientX, e.clientY));
gameCanvas.addEventListener(
  "touchstart",
  (e) => {
    e.preventDefault();
    const t = e.touches[0];
    handleGameTap(t.clientX, t.clientY);
  },
  { passive: false }
);

function startGame() {
  score = 0;
  fallingHearts = [];
  scoreEl.textContent = 0;
  gameRunning = true;
  gameOverlay.classList.add("hidden");
  startBtn.textContent = "Restart";
  clearInterval(spawnTimer);
  spawnTimer = setInterval(spawnHeart, 650);
  requestAnimationFrame(gameLoop);
}

function endGame(won) {
  gameRunning = false;
  clearInterval(spawnTimer);
  gameOverlay.classList.remove("hidden");
  gameOverlay.innerHTML = won
    ? `<p>💗 You caught them all! Scroll down for your surprise...</p>`
    : `<p>Press start to try again</p>`;
  if (won) {
    unlockFinale();
    setTimeout(() => {
      document.getElementById("finale").scrollIntoView({ behavior: "smooth" });
    }, 900);
  }
}

startBtn.addEventListener("click", startGame);

// ============================================================
// FINALE: unlock + confetti
// ============================================================
let finaleUnlocked = false;
function unlockFinale() {
  if (finaleUnlocked) return;
  finaleUnlocked = true;
  document.getElementById("lockState").classList.add("hidden");
  document.getElementById("unlockedState").classList.remove("hidden");
  launchConfetti();
}

const confettiCanvas = document.getElementById("confettiCanvas");
const cCtx = confettiCanvas.getContext("2d");
let cW, cH;
function resizeConfetti() {
  const finale = document.getElementById("finale");
  cW = confettiCanvas.width = finale.offsetWidth;
  cH = confettiCanvas.height = finale.offsetHeight;
}
window.addEventListener("resize", resizeConfetti);

function launchConfetti() {
  resizeConfetti();
  const colors = ["#9b87e0", "#ffd166", "#ff8fb1", "#7ee787", "#ffffff"];
  const pieces = Array.from({ length: 140 }, () => ({
    x: Math.random() * cW,
    y: -20 - Math.random() * cH * 0.5,
    size: 6 + Math.random() * 6,
    speed: 2 + Math.random() * 3,
    drift: (Math.random() - 0.5) * 2,
    rot: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.2,
    color: colors[Math.floor(Math.random() * colors.length)],
  }));

  let frame = 0;
  const maxFrames = 420;

  function loop() {
    frame++;
    cCtx.clearRect(0, 0, cW, cH);
    pieces.forEach((p) => {
      p.y += p.speed;
      p.x += p.drift;
      p.rot += p.rotSpeed;
      if (p.y > cH + 20) {
        p.y = -20;
        p.x = Math.random() * cW;
      }
      cCtx.save();
      cCtx.translate(p.x, p.y);
      cCtx.rotate(p.rot);
      cCtx.fillStyle = p.color;
      cCtx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      cCtx.restore();
    });
    if (frame < maxFrames) requestAnimationFrame(loop);
    else cCtx.clearRect(0, 0, cW, cH);
  }
  loop();
}
