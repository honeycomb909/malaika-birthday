// ---------- CONFIG ----------
const TARGET_TIMEZONE = "Asia/Karachi";
// Dec 25, 00:00 Pakistan time
const UNLOCK_DATE = {
  year: 2025,
  month: 11,
  day: 25,
  hour: 0,
  minute: 0,
  second: 0
};

// ---------- ELEMENTS ----------
const lockScreen = document.getElementById("lockScreen");
const obbyScreen = document.getElementById("obbyScreen");
const mainScreen = document.getElementById("mainScreen");

const countdownEl = document.getElementById("countdown");
const enterBtn = document.getElementById("enterBtn");
const bgMusic = document.getElementById("bgMusic");
const musicToggle = document.getElementById("musicToggle");
const cake = document.getElementById("cake");

// ---------- TIME HELPERS ----------
function getPakistanNow() {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: TARGET_TIMEZONE,
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false
  });

  const parts = formatter.formatToParts(now);
  const get = (type) => parts.find(p => p.type === type).value;

  return new Date(
    get("year"),
    get("month") - 1,
    get("day"),
    get("hour"),
    get("minute"),
    get("second")
  );
}

function getUnlockDate() {
  return new Date(
    UNLOCK_DATE.year,
    UNLOCK_DATE.month,
    UNLOCK_DATE.day,
    UNLOCK_DATE.hour,
    UNLOCK_DATE.minute,
    UNLOCK_DATE.second
  );
}

// ---------- COUNTDOWN ----------
function updateCountdown() {
  const nowPK = getPakistanNow();
  const unlock = getUnlockDate();
  const diff = unlock - nowPK;

  if (diff <= 0) {
    countdownEl.textContent = "00 : 00 : 00";
    unlockSite();
    return;
  }

  const hrs = Math.floor(diff / (1000 * 60 * 60));
  const mins = Math.floor((diff / (1000 * 60)) % 60);
  const secs = Math.floor((diff / 1000) % 60);

  countdownEl.textContent =
    `${String(hrs).padStart(2, "0")} : ` +
    `${String(mins).padStart(2, "0")} : ` +
    `${String(secs).padStart(2, "0")}`;
}

let unlocked = false;

function unlockSite() {
  if (unlocked) return;
  unlocked = true;

  enterBtn.disabled = false;
  enterBtn.textContent = "Enter";
  enterBtn.classList.remove(
    "bg-gray-300",
    "text-gray-600",
    "cursor-not-allowed"
  );
  enterBtn.classList.add("bg-pink-400", "text-white");

  enterBtn.onclick = () => {
  switchScreen(lockScreen, obbyScreen);
    };
}

// ---------- SCREEN SWITCH ----------
function switchScreen(from, to) {
  from.classList.add("hidden");
  to.classList.remove("hidden");
}

// ---------- MUSIC ----------
// ---------- MUSIC ----------
let musicOn = false;
let fadeInterval = null;

musicToggle.onclick = () => {
  musicOn = !musicOn;

  if (musicOn) {
    bgMusic.volume = 0;
    bgMusic.play();

    let v = 0;
    clearInterval(fadeInterval);

    fadeInterval = setInterval(() => {
      v += 0.05;
      bgMusic.volume = Math.min(v, 0.3);

      if (v >= 0.3) {
        clearInterval(fadeInterval);
        fadeInterval = null;
      }
    }, 100);

    musicToggle.textContent = "pause music";
  } else {
    clearInterval(fadeInterval);
    fadeInterval = null;

    bgMusic.pause();
    musicToggle.textContent = "music";
  }
};

// ---------- CAKE INTERACTION ----------
const robloxSound = document.getElementById("robloxSound");

cake.addEventListener("click", () => {
  cake.classList.add("blown");

  // play roblox-style sound
  robloxSound.currentTime = 0;
  robloxSound.volume = 0.6;
  robloxSound.play();

  setTimeout(() => {
    launchConfetti();
  }, 300);
});

// ---------- CONFETTI ----------
function launchConfetti() {
  const count = 60;
  for (let i = 0; i < count; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti";
    piece.style.left = Math.random() * 100 + "vw";
    piece.style.animationDelay = Math.random() * 0.5 + "s";
    document.body.appendChild(piece);

    setTimeout(() => piece.remove(), 3000);
  }
}

// ---------- INIT ----------
setInterval(updateCountdown, 1000);
updateCountdown();

// ---------- DTI LOGIC ----------
const dollTop = document.getElementById("dollTop");
const dollBottom = document.getElementById("dollBottom");
const runwayBtn = document.getElementById("runwayBtn");
const judgingText = document.getElementById("judgingText");
const dtiScreen = document.getElementById("dtiScreen");

let selectedTop = null;
let selectedBottom = null;

// ----- TOP SELECTION -----
document.querySelectorAll(".top-option").forEach(btn => {
  btn.onclick = () => {
    selectedTop = btn.dataset.top;
    applyTop(selectedTop);
    checkOutfitReady();
  };
});

// ----- BOTTOM SELECTION -----
document.querySelectorAll(".bottom-option").forEach(btn => {
  btn.onclick = () => {
    selectedBottom = btn.dataset.bottom;
    applyBottom(selectedBottom);
    checkOutfitReady();
  };
});

// ----- APPLY OUTFITS -----
function applyTop(type) {
  dollTop.className = "doll-top " + type;
}

function applyBottom(type) {
  dollBottom.className = "doll-bottom " + type;
}

// ----- CHECK IF READY -----
function checkOutfitReady() {
  if (selectedTop && selectedBottom) {
    runwayBtn.classList.remove("hidden");
  }
}

// ----- RUNWAY MOMENT -----
runwayBtn.onclick = () => {
  runwayBtn.classList.add("hidden");
  judgingText.classList.remove("hidden");

  // fake judging delay
  setTimeout(() => {
    judgingText.textContent = "⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐";
  }, 1200);

  setTimeout(() => {
    judgingText.textContent = "10 / 10 — no notes 💅";
  }, 2200);

  // transition to birthday page
  setTimeout(() => {
    dtiScreen.classList.add("hidden");
    mainScreen.classList.remove("hidden");

    // show dancer now (correct place)
    const dancer = document.getElementById("robloxDancer");
    dancer.classList.remove("hidden");
    dancer.onclick = () => dancer.style.display = "none";

  }, 3500);
};
