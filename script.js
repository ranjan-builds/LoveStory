// Global App State
let isAudioPlaying = false;

const playlist = [
  { title: "The song that reminds me of you", file: "candy.mp3" },
];
let currentSongIndex = 0;

function togglePlaylist() {
  document.getElementById("playlistPanel").classList.toggle("hidden");
}

async function playPlaylistSong(index) {
  const audio = document.getElementById("ambientAudio");
  const icon = document.getElementById("audioIcon");
  const statusText = document.getElementById("audioStatusText");
  const song = playlist[index];
  currentSongIndex = index;
  audio.src = song.file;

  try {
    if (isAudioPlaying && currentSongIndex === index) {
      audio.pause();
      isAudioPlaying = false;
      icon.className = "fa-solid fa-play";
      statusText.innerText = "Paused · " + song.title;
      return;
    }
    await audio.play();
    isAudioPlaying = true;
    icon.className = "fa-solid fa-pause";
    statusText.innerText = song.title;
    document
      .querySelectorAll(".playlist-item")
      .forEach((item, i) => item.classList.toggle("ring-1", i === index));
  } catch {
    isAudioPlaying = false;
    icon.className = "fa-solid fa-play";
    statusText.innerText = "Add " + song.file + " to enable";
  }
}

async function toggleAudio() {
  const audio = document.getElementById("ambientAudio");
  if (!isAudioPlaying) {
    await playPlaylistSong(currentSongIndex);
  } else {
    audio.pause();
    isAudioPlaying = false;
    document.getElementById("audioIcon").className = "fa-solid fa-play";
    document.getElementById("audioStatusText").innerText = "Music Paused";
  }
}

document.getElementById("ambientAudio").addEventListener("ended", () => {
  isAudioPlaying = false;
  document.getElementById("audioIcon").className = "fa-solid fa-play";
  document.getElementById("audioStatusText").innerText = "Song finished";
});
particlesJS("snow-particles", {
  particles: {
    number: {
      value: 50,
      density: {
        enable: true,
        value_area: 900,
      },
    },
    color: {
      value: "#ffffff",
    },
    shape: {
      type: "circle",
    },
    opacity: {
      value: 0.65,
      random: true,
      anim: {
        enable: true,
      },
    },
    size: {
      value: 4,
      random: true,
    },
    line_linked: {
      enable: false,
    },
    move: {
      enable: true,
      speed: 1.5,
      direction: "top",
      random: true,
      straight: false,
      out_mode: "out",
      bounce: false,
    },
  },
  interactivity: {
    detect_on: "canvas",
    events: {
      onhover: {
        enable: true,
        mode: "repulse",
      },
      onclick: {
        enable: true,
        mode: "repulse",
      },
      resize: true,
    },
  },
  retina_detect: true,
});
// Canvas Particle System for Atmosphere
// const particleCanvas = document.getElementById("particleCanvas");
// const pCtx = particleCanvas.getContext("2d");
// let particles = [];

// function resizeParticleCanvas() {
//   particleCanvas.width = window.innerWidth;
//   particleCanvas.height = window.innerHeight;
// }
// window.addEventListener("resize", resizeParticleCanvas);
// resizeParticleCanvas();

// class Particle {
//   constructor() {
//     this.reset();
//   }
//   reset() {
//     this.x = Math.random() * particleCanvas.width;
//     this.y = Math.random() * particleCanvas.height;
//     this.size = Math.random() * 2 + 0.5;
//     this.speedX = (Math.random() - 0.5) * 0.3;
//     this.speedY = -Math.random() * 0.4 - 0.1;
//     this.opacity = Math.random() * 0.5 + 0.2;
//   }
//   update() {
//     this.x += this.speedX;
//     this.y += this.speedY;
//     if (this.y < 0 || this.x < 0 || this.x > particleCanvas.width) {
//       this.reset();
//       this.y = particleCanvas.height;
//     }
//   }
//   draw() {
//     pCtx.fillStyle = `rgba(240, 168, 182, ${this.opacity})`;
//     pCtx.beginPath();
//     pCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
//     pCtx.fill();
//   }
// }

// for (let i = 0; i < 40; i++) {
//   particles.push(new Particle());
// }

// function animateParticles() {
//   pCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
//   particles.forEach((p) => {
//     p.update();
//     p.draw();
//   });
//   requestAnimationFrame(animateParticles);
// }
// animateParticles();

function openEnvelope() {
  const card = document.getElementById("envelopeCard");
  card.style.transform = "scale(0.95) rotateY(180deg)";
  card.style.opacity = "0";
  setTimeout(() => {
    scrollToChapter("ch1");
  }, 500);
}

function scrollToChapter(chapterId) {
  const target = document.getElementById(chapterId);
  if (!target) return;

  const nav = document.getElementById("mainNav");
  const navOffset = nav ? nav.getBoundingClientRect().height : 0;
  const top = target.getBoundingClientRect().top + window.scrollY - navOffset - 12;
  const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "auto"
    : "smooth";
  window.scrollTo({ top, behavior });
}

const chapterNavButtons = Array.from(
  document.querySelectorAll("#chapterNav [data-chapter]"),
);
let chapterVoiceEnabled = false;
let activeStoryChapterButton = null;
let requestedVoiceChapterId = null;
const chapterTitleAudios = new Map();

function setChapterVoiceStatus(message) {
  const status = document.getElementById("chapterVoiceStatus");
  if (!status) return;
  status.textContent = message;
  status.hidden = false;
}

chapterNavButtons.forEach((button) => {
  const source = button.dataset.voiceSrc;
  if (!source) return;

  const audio = new Audio(source);
  audio.preload = "auto";
  audio.addEventListener("error", () => {
    if (
      !chapterVoiceEnabled ||
      !activeStoryChapterButton ||
      requestedVoiceChapterId !== button.dataset.chapter
    ) {
      return;
    }
    setChapterVoiceStatus(
      `Couldn't load ${source}. Check that the recording exists in the myVoice folder.`,
    );
  });
  chapterTitleAudios.set(button.dataset.chapter, audio);
  audio.load();
});

function playChapterVoice(button) {
  if (!button || !button.dataset.voiceSrc) return;

  const audio = chapterTitleAudios.get(button.dataset.chapter);
  if (!audio) {
    setChapterVoiceStatus(
      `No voice recording is configured for ${button.getAttribute("aria-label")}.`,
    );
    return;
  }

  requestedVoiceChapterId = button.dataset.chapter;
  chapterTitleAudios.forEach((chapterAudio) => {
    if (chapterAudio === audio) return;
    chapterAudio.pause();
    chapterAudio.currentTime = 0;
  });
  audio.pause();
  audio.currentTime = 0;
  setChapterVoiceStatus(
    `Playing voice title for ${button.getAttribute("aria-label")}.`,
  );

  audio.play().catch(() => {
    if (
      !chapterVoiceEnabled ||
      requestedVoiceChapterId !== button.dataset.chapter
    ) {
      return;
    }
    setChapterVoiceStatus(
      `Couldn't play ${button.dataset.voiceSrc}. Check that the recording exists and is a supported audio file.`,
    );
  });
}

function toggleChapterVoice() {
  chapterVoiceEnabled = !chapterVoiceEnabled;
  const toggle = document.getElementById("chapterVoiceToggle");
  const toggleText = document.getElementById("chapterVoiceToggleText");
  const icon = toggle && toggle.querySelector("i");
  if (!toggle || !toggleText || !icon) return;

  toggle.setAttribute("aria-pressed", String(chapterVoiceEnabled));
  toggle.setAttribute(
    "aria-label",
    chapterVoiceEnabled ? "Turn chapter voice off" : "Turn chapter voice on",
  );
  toggle.classList.toggle("is-enabled", chapterVoiceEnabled);
  toggleText.textContent = chapterVoiceEnabled ? "Voice on" : "Voice off";
  icon.className = chapterVoiceEnabled
    ? "fa-solid fa-volume-high"
    : "fa-solid fa-volume-xmark";

  if (chapterVoiceEnabled) {
    if (activeStoryChapterButton) {
      playChapterVoice(activeStoryChapterButton);
    } else {
      setChapterVoiceStatus(
        "Voice guide on. Add Chapter5.wav through Chapter13.wav to the myVoice folder as you record them.",
      );
    }
    return;
  }

  chapterTitleAudios.forEach((audio) => {
    audio.pause();
    audio.currentTime = 0;
  });
  requestedVoiceChapterId = null;
  setChapterVoiceStatus("Chapter voice is off.");
}

function updateStoryNavigation() {
  const winScroll = window.scrollY;
  const height =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  const progressBar = document.getElementById("progressBar");
  if (progressBar) {
    const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
    progressBar.style.width = `${Math.min(100, Math.max(0, scrolled))}%`;
  }

  const nav = document.getElementById("mainNav");
  const activeThreshold = (nav ? nav.getBoundingClientRect().height : 0) + 32;
  let activeButton = null;
  chapterNavButtons.forEach((button) => {
    const chapter = document.getElementById(button.dataset.chapter);
    if (chapter && chapter.getBoundingClientRect().top <= activeThreshold) {
      activeButton = button;
    }
  });

  if (!activeButton && winScroll > 0) {
    activeButton = chapterNavButtons[0] || null;
  }
  if (!activeButton) {
    activeStoryChapterButton = null;
    if (chapterVoiceEnabled) {
      chapterTitleAudios.forEach((audio) => audio.pause());
      requestedVoiceChapterId = null;
      setChapterVoiceStatus(
        "Voice guide on. Scroll to a chapter to hear its title.",
      );
    }
    return;
  }

  const chapterChanged = activeStoryChapterButton !== activeButton;
  activeStoryChapterButton = activeButton;

  const currentIndicator = document.getElementById("currentChapterIndicator");
  if (currentIndicator) {
    currentIndicator.textContent = activeButton.getAttribute("aria-label");
  }

  const wasAlreadyActive =
    activeButton.getAttribute("aria-current") === "location";
  chapterNavButtons.forEach((button) => {
    const isActive = button === activeButton;
    button.classList.toggle("is-active", isActive);
    if (isActive) {
      button.setAttribute("aria-current", "location");
    } else {
      button.removeAttribute("aria-current");
    }
  });

  if (chapterChanged && chapterVoiceEnabled) {
    playChapterVoice(activeButton);
  }

  if (!wasAlreadyActive) {
    const track = document.querySelector(".chapter-nav-track");
    const trackRect = track && track.getBoundingClientRect();
    const buttonRect = activeButton.getBoundingClientRect();
    if (
      track &&
      trackRect &&
      (buttonRect.left < trackRect.left || buttonRect.right > trackRect.right)
    ) {
      const offset =
        buttonRect.left +
        buttonRect.width / 2 -
        (trackRect.left + trackRect.width / 2);
      const behavior = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches
        ? "auto"
        : "smooth";
      track.scrollBy({ left: offset, behavior });
    }
  }
}

let storyNavigationFrame = null;
window.addEventListener(
  "scroll",
  () => {
    if (storyNavigationFrame !== null) return;
    storyNavigationFrame = window.requestAnimationFrame(() => {
      updateStoryNavigation();
      storyNavigationFrame = null;
    });
  },
  { passive: true },
);
updateStoryNavigation();

function togglePdfSummary() {
  const excerpts = document.getElementById("pdfExcerpts");
  const text = document.getElementById("pdfToggleText");
  if (excerpts.classList.contains("hidden")) {
    excerpts.classList.remove("hidden");
    text.innerText = "Hide Excerpts";
  } else {
    excerpts.classList.add("hidden");
    text.innerText = "Expand Full Excerpts";
  }
}

function switchPerspective(type) {
  const myTab = document.getElementById("perspectiveMy");
  const unknownTab = document.getElementById("perspectiveUnknown");
  const myBtn = document.getElementById("tabMyPerspectiveBtn");
  const unknownBtn = document.getElementById("tabUnknownPerspectiveBtn");

  if (type === "my") {
    myTab.classList.remove("hidden");
    unknownTab.classList.add("hidden");
    myBtn.className =
      "flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all bg-burgundy-800 text-gold-300 shadow";
    unknownBtn.className =
      "flex-1 py-2 px-4 rounded-xl text-xs font-bold text-burgundy-300 transition-all hover:text-white";
  } else {
    myTab.classList.add("hidden");
    unknownTab.classList.remove("hidden");
    unknownBtn.className =
      "flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all bg-burgundy-800 text-gold-300 shadow";
    myBtn.className =
      "flex-1 py-2 px-4 rounded-xl text-xs font-bold text-burgundy-300 transition-all hover:text-white";
  }
}

function flipCard(cardEl) {
  const inner = cardEl.querySelector(".card-inner");
  inner.classList.toggle("rotate-y-180");
}

let memoryRideFrame = null;

function positionMemoryScooty(progress) {
  const scene = document.getElementById("memoryRideScene");
  const road = scene?.querySelector(".memory-ride-road");
  const path = document.getElementById("memoryRidePath");
  const scooty = scene?.querySelector(".memory-ride-scooty");

  if (!scene || !road || !path || !scooty) {
    console.error("The scooty ride scene is missing its road path or marker.");
    return false;
  }

  const pathLength = path.getTotalLength();
  const distance = pathLength * progress;
  const matrix = road.getScreenCTM();
  if (!matrix) {
    console.error("The scooty ride road has no screen position.");
    return false;
  }
  const point = path.getPointAtLength(distance);
  const screenPoint = new DOMPoint(point.x, point.y).matrixTransform(matrix);
  const before = path.getPointAtLength(Math.max(0, distance - 2)).matrixTransform(
    matrix,
  );
  const after = path
    .getPointAtLength(Math.min(pathLength, distance + 2))
    .matrixTransform(matrix);
  const sceneBounds = scene.getBoundingClientRect();
  scooty.style.left = `${screenPoint.x - sceneBounds.left}px`;
  scooty.style.top = `${screenPoint.y - sceneBounds.top}px`;
  const angle = (Math.atan2(after.y - before.y, after.x - before.x) * 180) / Math.PI;
  scooty.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
  return true;
}

function playMemoryRide() {
  const scene = document.getElementById("memoryRideScene");
  const button = document.getElementById("memoryRideButton");
  const buttonText = document.getElementById("memoryRideButtonText");
  const status = document.getElementById("memoryRideStatus");
  if (!scene || !button || !buttonText || !status) return;

  scene.classList.remove("is-riding", "has-arrived");
  if (memoryRideFrame !== null) {
    window.cancelAnimationFrame(memoryRideFrame);
    memoryRideFrame = null;
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    if (!positionMemoryScooty(1)) return;
    scene.classList.add("has-arrived");
    buttonText.textContent = "Journey remembered";
    status.textContent =
      "Korba to Champa, then together on her scooty to Nagargda.";
    return;
  }

  if (!positionMemoryScooty(0)) return;
  scene.classList.add("is-riding");
  button.disabled = true;
  buttonText.textContent = "Riding together...";
  status.textContent = "Leaving Korba behind, on our way to Champa.";

  const duration = 5200;
  let startTime = null;
  let announcedChampa = false;

  function rideFrame(timestamp) {
    if (startTime === null) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    if (!positionMemoryScooty(progress)) {
      scene.classList.remove("is-riding");
      button.disabled = false;
      buttonText.textContent = "Try the ride again";
      status.textContent = "The ride could not start. Please try again.";
      memoryRideFrame = null;
      return;
    }

    if (progress >= 0.48 && !announcedChampa) {
      announcedChampa = true;
      status.textContent =
        "Together at Champa, then off on her scooty toward Nagargda.";
    }

    if (progress < 1) {
      memoryRideFrame = window.requestAnimationFrame(rideFrame);
      return;
    }

    scene.classList.remove("is-riding");
    scene.classList.add("has-arrived");
    button.disabled = false;
    buttonText.textContent = "Ride again";
    status.textContent =
      "We made it to Nagargda — and found a memory to keep.";
    memoryRideFrame = null;
  }

  memoryRideFrame = window.requestAnimationFrame(rideFrame);
}

window.addEventListener("resize", () => {
  const scene = document.getElementById("memoryRideScene");
  if (!scene || scene.classList.contains("is-riding")) return;
  positionMemoryScooty(scene.classList.contains("has-arrived") ? 1 : 0);
});

const endingText =
  "Our story is still being written. We don't know what tomorrow holds, but every honest conversation, every effort, every shared smile, and every moment of understanding becomes a part of our journey. Perhaps the most beautiful part of our story is not knowing exactly how it ends, but discovering how we choose to write it together.";

let typewriterIndex = 0;
function typeWriter() {
  const container = document.getElementById("typewriterText");
  if (typewriterIndex < endingText.length) {
    container.innerHTML += endingText.charAt(typewriterIndex);
    typewriterIndex++;
    setTimeout(typeWriter, 35);
  }
}

// Trigger Typewriter when Chapter 10 comes into view
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && typewriterIndex === 0) {
        typeWriter();
      }
    });
  },
  { threshold: 0.3 },
);

observer.observe(document.getElementById("ch10"));

function openLetter() {
  const modal = document.getElementById("letterModal");
  modal.classList.remove("hidden");
  modal.classList.add("flex");
  document.body.style.overflow = "hidden";
}

function closeLetter(event) {
  // Close only when clicking the backdrop or close button.
  if (event && event.target !== event.currentTarget) return;

  const modal = document.getElementById("letterModal");
  modal.classList.add("hidden");
  modal.classList.remove("flex");
  document.body.style.overflow = "";
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    const modal = document.getElementById("letterModal");
    if (modal && !modal.classList.contains("hidden")) {
      closeLetter();
    }
  }
});

function replayStory() {
  window.scrollTo({ top: 0, behavior: "smooth" });
  typewriterIndex = 0;
  document.getElementById("typewriterText").innerHTML = "";
}

let revealedConversations = 0;
function revealMoreConversations() {
  const cards = [...document.querySelectorAll(".conversation-extra")];
  const next = Math.min(revealedConversations + 4, cards.length);
  cards
    .slice(revealedConversations, next)
    .forEach((card) => card.classList.add("is-visible"));
  revealedConversations = next;
  const count = document.getElementById("conversationCount");
  const btn = document.getElementById("revealConversationsBtn");
  const hint = document.getElementById("conversationHint");
  count.textContent = `${revealedConversations + 20} / 100`;
  if (revealedConversations >= cards.length) {
    btn.innerHTML =
      '<i class="fa-solid fa-heart"></i> All Our Top Picks Revealed';
    btn.disabled = true;
    btn.classList.add("opacity-60", "cursor-default");
    hint.textContent =
      "100 little pieces of our conversations — kept here for us.";
  }
}

/* ================= PASSWORD PROTECTION ================= */
(() => {
  // No password, login state, or unlock flag is written to browser storage.
  // A fresh page load ALWAYS asks for the password again.
  // Only a SHA-256 digest is embedded for client-side verification.
  // Set to true to skip the password during development.
  let DEVELOPER_MODE = false;
  const PASSWORD_SHA256 =
    "0890930cbc82a905bd28dec28ba7db90a3e9bec2231003288497fc943ed1e99f";
  const gate = document.getElementById("passwordGate");
  const form = document.getElementById("passwordForm");
  const input = document.getElementById("diaryPassword");
  const error = document.getElementById("passwordError");
  const toggle = document.getElementById("togglePasswordVisibility");

  async function sha256(value) {
    const data = new TextEncoder().encode(value);
    const hash = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hash))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  }

  function unlockDiary() {
    document.body.classList.remove("site-locked");
    gate.classList.add("is-unlocking");
    input.value = "";
    window.setTimeout(() => gate.remove(), 700);
  }

  if (typeof DEVELOPER_MODE !== "undefined" && DEVELOPER_MODE) {
    unlockDiary();
    return;
  }

  function showError() {
    error.textContent = "That password isn't right. Try again, love.";
    gate.classList.remove("shake");
    void gate.offsetWidth;
    gate.classList.add("shake");
    input.select();
  }

  window.setTimeout(() => input.focus(), 120);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const submittedPassword = input.value;
    input.value = "";

    try {
      const submittedHash = await sha256(submittedPassword);
      if (submittedHash === PASSWORD_SHA256) {
        error.textContent = "";
        unlockDiary();
      } else {
        showError();
      }
    } catch {
      error.textContent = "Unable to verify right now. Please try again.";
      showError();
    }
  });

  toggle.addEventListener("click", () => {
    const showing = input.type === "text";
    input.type = showing ? "password" : "text";
    toggle.innerHTML = showing
      ? '<i class="fa-solid fa-eye"></i>'
      : '<i class="fa-solid fa-eye-slash"></i>';
    toggle.setAttribute(
      "aria-label",
      showing ? "Show password" : "Hide password",
    );
  });
})();

/* =========================================================
         MEMORY BOX DATA
         Add/edit memories here. The UI is generated automatically.
         Supported types: image, place, audio, file, video, note
         ========================================================= */

const memories = [
  {
    type: "image",
    title: "Connecting the dots",
    date: "19 October 2026",
    file: "./memories/images/dots.png",
    caption:
      "When we connect all the dots, it shows a story of real connection, affection, and effort from both sides. but with uncertainty",
  },

  {
    type: "place",
    title: "Nagargda Waterfall",
    date: "9 September 2026",
    file: "./memories/images/nagardahill.png",
    location: "Nagargda Waterfall, Chhattisgarh",
    maps: "https://www.google.com/maps/search/?api=1&query=Nagargda+Waterfall",
  },
  {
    type: "place",
    title: "Devri Side of Nagargda",
    date: "9 September 2026",
    file: "./memories/images/devriSide.jpeg",
    location: "Devri, Chhattisgarh",
    maps: "https://maps.app.goo.gl/QJ53m7wn1nbjreow5",
  },
  {
    type: "place",
    title: "You came my home to meet me when i was not well",
    date: "9 October 2026",
    file: "./memories/images/myHome.jpg",
    location: "Gaud, Chhattisgarh",
    maps: "https://maps.app.goo.gl/ppBJu3ZgcFYHVLWK6",
  },
  {
    type: "audio",
    title: "The Song That Reminds Me of You",
    date: "Our Song",
    file: "memories\\audios\\Teri Baaten.mp3",
    caption: "This one will always remind me of you.",
  },
  {
    type: "audio",
    title: "Tere Efforts Mein Chhupa Mera Pyaar",
    date: "Our Song",
    file: "memories\\audios\\gharSeNikaltiHoon.mp3",
    caption:
      "Tere pyaar ki sabse khoobsurat baat ye hai ki tu sirf kehti nahi, kabhi-kabhi apne actions se bhi mehsoos karwa deti hai. ❤️",
  },
  {
    type: "audio",
    title: "Teri nazron ke sadke main apni har khushi vaar doon",
    date: "Our Song",
    file: "memories\\audios\\HokeRupoosh.mp3",
    caption:
      "Tu saamne ho toh bas tujhe dekhta rahoon Aur tu nazron se ojhal ho toh har jagah tujhe hi dhoondhta rahoon. 🫶🏻",
  },
  // {
  //   type: "note",
  //   title: "You came for me",
  //   date: "9 October 2026",
  //   text: " ❤️ Anjali, kal tum 60 km door se mujhse milne aayi, aur tab se tumhari yaadein dil se jaa hi nahi rahi. I love you, hamesha mere saath rehna. 🫶🏻💗",
  // },
  {
    type: "video",
    title: "Her Mood swings be like ☝️ Meri mood swing wali cute si ladki",
    date: "2026",
    file: "memories\\videos\\HerMood.mp4",
  },
  {
    type: "file",
    title: "A Letter for the Future",
    date: "14 October 2026",
    file: "memories\\doc\\futureLetter.pdf",
    caption:
      "Jab tum ready feel karo tab padhna. Turant reply dene ki koi zaroorat nahi hai.",
  },
];

const memoryMeta = {
  image: { icon: "fa-image", label: "Photo" },
  place: { icon: "fa-location-dot", label: "Place" },
  audio: { icon: "fa-music", label: "Song" },
  file: { icon: "fa-file", label: "Little Thing" },
  video: { icon: "fa-video", label: "Video" },
  note: { icon: "fa-note-sticky", label: "Note" },
};

function escapeMemoryText(value) {
  return String(value ?? "").replace(
    /[&<>"\']/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "\'": "&#039;",
      })[char],
  );
}

function memoryIcon(type) {
  return memoryMeta[type]?.icon || "fa-heart";
}

function memoryLabel(type) {
  return memoryMeta[type]?.label || "Memory";
}

function renderMemoryBox() {
  const grid = document.getElementById("memoryGrid");
  const empty = document.getElementById("memoryEmpty");
  if (!grid || !empty) return;

  grid.innerHTML = "";

  if (!memories.length) {
    empty.classList.remove("hidden");
    return;
  }
  empty.classList.add("hidden");

  memories.forEach((memory, index) => {
    const type = memory.type || "note";
    const title = escapeMemoryText(memory.title || "Untitled Memory");
    const date = escapeMemoryText(memory.date || "");
    const caption = escapeMemoryText(memory.caption || "");
    const file = escapeMemoryText(memory.file || "");
    const location = escapeMemoryText(memory.location || "");

    let media = "";
    let action = "";

    if (type === "image") {
      media = `<img class="memory-card-media" src="${file}" alt="${title}" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling?.classList.remove('hidden')"><div class="memory-file-icon hidden"><i class="fa-solid fa-image"></i></div>`;
      action = `<button class="memory-card-button" onclick="openMemoryViewer(${index})"><i class="fa-solid fa-expand"></i> View photo</button>`;
    } else if (type === "place") {
      media = memory.file
        ? `<img class="memory-card-media" src="${file}" alt="${title}" loading="lazy">`
        : `<div class="memory-place-media"><i class="fa-solid fa-location-dot"></i></div>`;
      action = memory.maps
        ? `<a class="memory-card-button block text-center" href="${memory.maps}" target="_blank" rel="noopener noreferrer"><i class="fa-solid fa-map-location-dot"></i> Open location</a>`
        : `<button class="memory-card-button" onclick="openMemoryViewer(${index})"><i class="fa-solid fa-location-dot"></i> View place</button>`;
    } else if (type === "audio") {
      media = `<div class="memory-file-icon"><i class="fa-solid fa-headphones"></i></div>`;
      action = `<audio class="memory-audio" controls preload="none"><source src="${file}" type="audio/mpeg">Your browser does not support audio.</audio>`;
    } else if (type === "video") {
      media = `<video class="memory-video" controls preload="metadata"><source src="${file}" type="video/mp4">Your browser does not support video.</video>`;
    } else if (type === "file") {
      media = `<div class="memory-file-icon"><i class="fa-solid fa-file-lines"></i></div>`;
      action = `<a class="memory-card-button block text-center" href="${file}" target="_blank" rel="noopener noreferrer"><i class="fa-solid fa-arrow-up-right-from-square"></i> Open file</a>`;
    } else {
      media = `<div class="memory-note">${escapeMemoryText(memory.text || caption || "")}</div>`;
    }

    const card = document.createElement("article");
    card.className = "memory-card";
    card.innerHTML = `${media}<div class="memory-card-body"><span class="memory-card-type"><i class="fa-solid ${memoryIcon(type)}"></i>${memoryLabel(type)}</span><h3 class="memory-card-title">${title}</h3>${date ? `<span class="memory-card-date">${date}</span>` : ""}${location ? `<p class="memory-card-caption"><i class="fa-solid fa-location-dot text-gold-400 mr-1"></i>${location}</p>` : ""}${caption && type !== "note" ? `<p class="memory-card-caption">${caption}</p>` : ""}${action}</div>`;
    grid.appendChild(card);
  });
}

function openMemoryViewer(index) {
  const memory = memories[index];
  if (!memory) return;
  const viewer = document.getElementById("memoryViewer");
  const content = document.getElementById("memoryViewerContent");
  const file = escapeMemoryText(memory.file || "");

  if (memory.type === "image" || memory.type === "place") {
    content.innerHTML = `<img src="${file}" alt="${escapeMemoryText(memory.title || "Memory")}">`;
  } else if (memory.type === "audio") {
    content.innerHTML = `<audio controls autoplay><source src="${file}" type="audio/mpeg"></audio>`;
  } else if (memory.type === "video") {
    content.innerHTML = `<video controls autoplay><source src="${file}" type="video/mp4"></video>`;
  } else if (memory.type === "file") {
    content.innerHTML = `<iframe src="${file}" title="${escapeMemoryText(memory.title || "Memory file")}"></iframe>`;
  } else {
    content.innerHTML = `<div class="memory-note-view">${escapeMemoryText(memory.text || memory.caption || "")}</div>`;
  }

  viewer.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeMemoryViewer() {
  const viewer = document.getElementById("memoryViewer");
  const content = document.getElementById("memoryViewerContent");
  viewer.classList.add("hidden");
  content.innerHTML = "";
  document.body.style.overflow = "";
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMemoryViewer();
});

function startTogetherCountdown() {
  const countdown = document.getElementById("togetherCountdown");
  if (!countdown) return;

  const milestone = new Date(`${countdown.dataset.milestone}T00:00:00`);
  const units = {
    days: document.getElementById("countdownDays"),
    hours: document.getElementById("countdownHours"),
    minutes: document.getElementById("countdownMinutes"),
    seconds: document.getElementById("countdownSeconds"),
  };

  if (
    Number.isNaN(milestone.getTime()) ||
    Object.values(units).some((unit) => !unit)
  ) {
    console.error("Unable to initialize the time-together countdown.");
    return;
  }

  function updateCountdown() {
    const elapsedSeconds = Math.max(
      0,
      Math.floor((Date.now() - milestone.getTime()) / 1000),
    );
    const days = Math.floor(elapsedSeconds / 86400);
    const hours = Math.floor((elapsedSeconds % 86400) / 3600);
    const minutes = Math.floor((elapsedSeconds % 3600) / 60);
    const seconds = elapsedSeconds % 60;

    units.days.textContent = String(days);
    units.hours.textContent = String(hours).padStart(2, "0");
    units.minutes.textContent = String(minutes).padStart(2, "0");
    units.seconds.textContent = String(seconds).padStart(2, "0");
  }

  updateCountdown();
  window.setInterval(updateCountdown, 1000);
}

function startLoveMeter() {
  const form = document.getElementById("loveMeterForm");
  const nameOneInput = document.getElementById("loveNameOne");
  const nameTwoInput = document.getElementById("loveNameTwo");
  const submitButton = document.getElementById("loveMeterSubmit");
  const result = document.getElementById("loveMeterResult");
  const status = document.getElementById("loveMeterStatus");
  const progress = document.getElementById("loveMeterProgress");
  const progressFill = document.getElementById("loveMeterProgressFill");
  const scoreText = document.getElementById("loveMeterScore");
  const message = document.getElementById("loveMeterMessage");
  const exportButton = document.getElementById("loveMeterExport");
  const exportStatus = document.getElementById("loveMeterExportStatus");

  if (
    !form ||
    !nameOneInput ||
    !nameTwoInput ||
    !submitButton ||
    !result ||
    !status ||
    !progress ||
    !progressFill ||
    !scoreText ||
    !message ||
    !exportButton ||
    !exportStatus
  ) {
    console.error("Unable to initialize the playful love meter.");
    return;
  }

  let latestResult = null;

  const messages = [
    {
      minimum: 0,
      text: "Impossible  💀😭 Is janam toh kya, agle janam mein bhi koi chance nahi! 😂💔",
    },
    {
      minimum: 10,
      text: "Kuch toh gadbad hai Daya 😂 Dil ka connection abhi weak signal pe hai!",
    },
    {
      minimum: 20,
      text: "Abhi toh kahaani shuru hui hai 😏 Thoda time do, picture abhi baaki hai!",
    },
    {
      minimum: 30,
      text: "Baat ban sakti hai 😜 Bas thodi flirting aur thoda effort chahiye!",
    },
    {
      minimum: 40,
      text: "Cute si chemistry hai ❤️ Ab dekhte hain pehle blush kaun karta hai!",
    },
    {
      minimum: 50,
      text: "50-50 ka chakkar hai 😅 Dil bhi confused hai, dimaag bhi!",
    },
    {
      minimum: 60,
      text: "Oho! 👀 Kuch toh chal raha hai boss! Nazar na lage 🧿❤️",
    },
    {
      minimum: 70,
      text: "Strong connection hai jaan! 🫶 Ab bas ek cute si date ho jaaye!",
    },
    {
      minimum: 75,
      text: "Dil ki frequency match ho rahi hai 📶💕 Lagta hai kuch special hai!",
    },
    {
      minimum: 80,
      text: "Arey waah! 😍 Chemistry toh full power mein hai, bas nazar na lage!",
    },
    {
      minimum: 85,
      text: "Ek dusre ki smile ki wajah banne wale lagte ho 🥹❤️",
    },
    {
      minimum: 90,
      text: "Soulmate wali vibes aa rahi hain! 🫂❤️ Ek tum, ek main, aur dher saari memories!",
    },
    {
      minimum: 95,
      text: "Itna strong connection? Wi-Fi bhi sharma jaaye! 📶❤️😂",
    },
    {
      minimum: 98,
      text: "Haiii! 🥹💗 Itna pyaar? Nazar utaaro koi! 🧿 Made for each other vibes!♾️",
    },
    {
      minimum: 100,
      text: "100% ISHQ! 💍❤️ Tum dono ki jodi ekdum Rab Ne Bana Di Jodi! 🧿♾️",
    },
  ];

  function getCompatibilityScore(firstName, secondName) {
    const normalizeName = (name) =>
      name.normalize("NFKC").trim().replace(/\s+/gu, " ").toLowerCase();
    const normalizedNames = [
      normalizeName(firstName),
      normalizeName(secondName),
    ].sort();
    const [first, second] = normalizedNames;

    if (first === "anjali" && second === "ranjan") return 98;
    if (
      normalizedNames.includes("anjali") ||
      normalizedNames.includes("ranjan")
    ) {
      return 0;
    }

    const input = normalizedNames
      .map((name) => `${name.length}:${name}`)
      .join("|");
    let hash = 0x811c9dc5;

    for (let index = 0; index < input.length; index += 1) {
      hash = Math.imul(hash ^ input.charCodeAt(index), 0x01000193);
    }

    return (hash >>> 0) % 101;
  }

  function drawRoundedRect(context, x, y, width, height, radius) {
    context.beginPath();
    context.moveTo(x + radius, y);
    context.arcTo(x + width, y, x + width, y + height, radius);
    context.arcTo(x + width, y + height, x, y + height, radius);
    context.arcTo(x, y + height, x, y, radius);
    context.arcTo(x, y, x + width, y, radius);
    context.closePath();
  }

  function drawHeart(context, x, y, size) {
    context.save();
    context.translate(x, y);
    context.scale(size / 100, size / 100);
    context.beginPath();
    context.moveTo(0, 30);
    context.bezierCurveTo(-50, 0, -50, -35, -25, -35);
    context.bezierCurveTo(-10, -35, 0, -20, 0, -10);
    context.bezierCurveTo(0, -20, 10, -35, 25, -35);
    context.bezierCurveTo(50, -35, 50, 0, 0, 30);
    context.closePath();
    context.fill();
    context.restore();
  }

  function drawWrappedText(
    context,
    text,
    centerX,
    startY,
    maxWidth,
    lineHeight,
  ) {
    const words = text.split(/\s+/u);
    let line = "";
    let y = startY;

    for (const word of words) {
      const nextLine = line ? `${line} ${word}` : word;
      if (line && context.measureText(nextLine).width > maxWidth) {
        context.fillText(line, centerX, y);
        line = word;
        y += lineHeight;
      } else {
        line = nextLine;
      }
    }

    if (line) context.fillText(line, centerX, y);
    return y;
  }

  function renderLoveResultImage(resultData) {
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 1500;
    const context = canvas.getContext("2d");

    if (!context) {
      exportStatus.textContent =
        "Could not create the result image in this browser.";
      console.error(
        "Canvas 2D context is unavailable for the love result export.",
      );
      return;
    }

    const { firstName, secondName, score, message: resultMessage } = resultData;
    const centerX = canvas.width / 2;
    const background = context.createLinearGradient(
      0,
      0,
      canvas.width,
      canvas.height,
    );
    background.addColorStop(0, "#2a050b");
    background.addColorStop(0.52, "#120508");
    background.addColorStop(1, "#090204");
    context.fillStyle = background;
    context.fillRect(0, 0, canvas.width, canvas.height);

    const glow = context.createRadialGradient(
      centerX,
      360,
      20,
      centerX,
      360,
      720,
    );
    glow.addColorStop(0, "rgba(159, 36, 67, 0.42)");
    glow.addColorStop(1, "rgba(159, 36, 67, 0)");
    context.fillStyle = glow;
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.strokeStyle = "rgba(212, 175, 55, 0.52)";
    context.lineWidth = 3;
    drawRoundedRect(context, 42, 42, canvas.width - 84, canvas.height - 84, 42);
    context.stroke();
    context.strokeStyle = "rgba(240, 168, 182, 0.2)";
    context.lineWidth = 1;
    drawRoundedRect(
      context,
      62,
      62,
      canvas.width - 124,
      canvas.height - 124,
      32,
    );
    context.stroke();

    context.save();
    context.globalAlpha = 0.26;
    context.fillStyle = "#d4af37";
    drawHeart(context, 175, 225, 70);
    drawHeart(context, 1025, 270, 48);
    drawHeart(context, 180, 1270, 44);
    drawHeart(context, 1025, 1230, 68);
    context.restore();

    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillStyle = "#f6e05e";
    context.font = '700 24px "Plus Jakarta Sans", sans-serif';
    context.letterSpacing = "7px";
    context.fillText("OUR UNWRITTEN STORY", centerX, 180);
    context.letterSpacing = "4px";
    context.fillStyle = "#f0a8b6";
    context.font = '600 20px "Plus Jakarta Sans", sans-serif';
    context.fillText("THE VERY SCIENTIFIC LOVE METER", centerX, 255);

    context.letterSpacing = "0";
    context.fillStyle = "#fff0f3";
    context.font = '600 56px "Cormorant Garamond", Georgia, serif';
    context.fillText(firstName, centerX, 420, 920);
    context.fillStyle = "#ecc94b";
    context.font = '400 42px "Cormorant Garamond", Georgia, serif';
    context.fillText("&", centerX, 505);
    context.fillStyle = "#fff0f3";
    context.font = '600 56px "Cormorant Garamond", Georgia, serif';
    context.fillText(secondName, centerX, 590, 920);

    const scoreGradient = context.createLinearGradient(300, 0, 900, 0);
    scoreGradient.addColorStop(0, "#f8a3b7");
    scoreGradient.addColorStop(0.55, "#fff0f3");
    scoreGradient.addColorStop(1, "#f6e05e");
    context.fillStyle = scoreGradient;
    context.font = '700 220px "Cormorant Garamond", Georgia, serif';
    context.fillText(`${score}%`, centerX, 845);

    const barX = 190;
    const barY = 980;
    const barWidth = 820;
    const barHeight = 22;
    context.fillStyle = "rgba(9, 2, 4, 0.88)";
    drawRoundedRect(context, barX, barY, barWidth, barHeight, barHeight / 2);
    context.fill();
    if (score > 0) {
      const barGradient = context.createLinearGradient(
        barX,
        0,
        barX + barWidth,
        0,
      );
      barGradient.addColorStop(0, "#be3154");
      barGradient.addColorStop(0.72, "#e5778f");
      barGradient.addColorStop(1, "#ecc94b");
      context.fillStyle = barGradient;
      const fillWidth = (barWidth * score) / 100;
      drawRoundedRect(
        context,
        barX,
        barY,
        fillWidth,
        barHeight,
        Math.min(barHeight / 2, fillWidth / 2),
      );
      context.fill();
    }

    context.fillStyle = "#f7ced5";
    context.font = '500 28px "Plus Jakarta Sans", sans-serif';
    const messageEndY = drawWrappedText(
      context,
      resultMessage,
      centerX,
      1100,
      820,
      42,
    );

    context.fillStyle = "#f6e05e";
    context.font = '600 22px "Plus Jakarta Sans", sans-serif';
    context.fillText(
      "A PLAYFUL READING · JUST FOR FUN",
      centerX,
      Math.max(1255, messageEndY + 95),
    );
    context.fillStyle = "rgba(247, 206, 213, 0.74)";
    context.font = '400 20px "Plus Jakarta Sans", sans-serif';
    context.fillText("Made with love, not science.", centerX, 1320);
    context.fillStyle = "#d4af37";
    context.font = '600 18px "Plus Jakarta Sans", sans-serif';
    context.letterSpacing = "3px";
    context.fillText("YOU & ME", centerX, 1390);
    context.letterSpacing = "0";

    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), "image/png");
    });
  }

  function createNameSlug(name) {
    return (
      name
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/gu, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/gu, "-")
        .replace(/^-|-$/gu, "") || "name"
    );
  }

  exportButton.addEventListener("click", async () => {
    if (!latestResult) {
      exportStatus.textContent = "Calculate a result before exporting it.";
      return;
    }

    const shouldExport = window.confirm(
      `Save this love result as an image?\n\n${latestResult.firstName} + ${latestResult.secondName}: ${latestResult.score}%`,
    );
    if (!shouldExport) return;

    exportStatus.textContent = "Preparing your image…";
    await document.fonts.ready;
    const blob = await renderLoveResultImage(latestResult);

    if (!blob) {
      exportStatus.textContent =
        "Could not create the result image. Please try again.";
      console.error("The browser could not encode the love result as a PNG.");
      return;
    }

    const downloadUrl = URL.createObjectURL(blob);
    const downloadLink = document.createElement("a");
    downloadLink.href = downloadUrl;
    downloadLink.download = `love-match-${createNameSlug(latestResult.firstName)}-and-${createNameSlug(latestResult.secondName)}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();
    window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
    exportStatus.textContent = "Your love result image has been downloaded.";
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const firstName = nameOneInput.value.trim();
    const secondName = nameTwoInput.value.trim();
    nameOneInput.setCustomValidity(
      firstName ? "" : "Please enter the first name.",
    );
    nameTwoInput.setCustomValidity(
      secondName ? "" : "Please enter the second name.",
    );

    if (!form.reportValidity()) return;

    const score = getCompatibilityScore(firstName, secondName);
    const reading = [...messages]
      .reverse()
      .find((item) => score >= item.minimum);
    const animationDuration = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches
      ? 0
      : 1400;

    result.hidden = false;
    submitButton.disabled = true;
    exportButton.hidden = true;
    exportStatus.textContent = "";
    status.textContent = "Consulting the extremely unserious love algorithms…";
    progress.setAttribute("aria-valuenow", "0");
    progressFill.style.width = "0";
    scoreText.textContent = "";
    message.textContent = "";

    window.requestAnimationFrame(() => {
      progressFill.style.width = `${score}%`;
    });

    window.setTimeout(() => {
      progress.setAttribute("aria-valuenow", String(score));
      status.textContent = `${firstName} + ${secondName}`;
      scoreText.textContent = `${score}%`;
      message.textContent = reading.text;
      latestResult = { firstName, secondName, score, message: reading.text };
      exportButton.hidden = false;
      submitButton.disabled = false;
    }, animationDuration);
  });

  nameOneInput.addEventListener("input", () =>
    nameOneInput.setCustomValidity(""),
  );
  nameTwoInput.addEventListener("input", () =>
    nameTwoInput.setCustomValidity(""),
  );
}

startTogetherCountdown();
startLoveMeter();
renderMemoryBox();

// (() => {
//   const canvas = document.querySelector(".cursor-trail");
//   const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
//   const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

//   if (!canvas || !finePointer.matches) return;

//   const ctx = canvas.getContext("2d");
//   if (!ctx) return;

//   // Romantic pink + rose-gold theme
//   const COLORS = [
//     [255, 105, 180], // Hot pink
//     [255, 182, 193], // Light pink
//     [255, 228, 235], // Soft blush
//     [255, 215, 170], // Rose gold
//   ];

//   const LIFE = 550;
//   const MAX_POINTS = 55;

//   let points = [];
//   let frame = 0;
//   let width = 0;
//   let height = 0;

//   function resize() {
//     const ratio = Math.min(window.devicePixelRatio || 1, 2);

//     width = window.innerWidth;
//     height = window.innerHeight;

//     canvas.width = Math.round(width * ratio);
//     canvas.height = Math.round(height * ratio);
//     canvas.style.width = `${width}px`;
//     canvas.style.height = `${height}px`;

//     ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
//   }

//   function clear() {
//     ctx.clearRect(0, 0, width, height);
//   }

//   function draw() {
//     const now = performance.now();

//     points = points.filter((point) => now - point.time < LIFE);

//     clear();

//     // Smooth, glowing trail
//     for (let i = 1; i < points.length; i++) {
//       const from = points[i - 1];
//       const to = points[i];

//       const life = Math.max(0, 1 - (now - to.time) / LIFE);
//       const color = COLORS[to.colorIndex];

//       ctx.save();
//       ctx.lineCap = "round";
//       ctx.lineJoin = "round";
//       ctx.shadowBlur = 12 * life;
//       ctx.shadowColor = `rgba(${color.join(",")}, 0.6)`;
//       ctx.strokeStyle = `rgba(${color.join(",")}, ${life * 0.7})`;
//       ctx.lineWidth = 0.8 + life * 5;

//       ctx.beginPath();
//       ctx.moveTo(from.x, from.y);
//       ctx.lineTo(to.x, to.y);
//       ctx.stroke();
//       ctx.restore();

//       // Tiny sparkle at selected trail points
//       if (i % 4 === 0 && life > 0.25) {
//         ctx.save();
//         ctx.globalAlpha = life;
//         ctx.fillStyle = "#fff0f5";
//         ctx.shadowBlur = 8 * life;
//         ctx.shadowColor = "#ff69b4";
//         ctx.beginPath();
//         ctx.arc(to.x, to.y, 1.2 + life, 0, Math.PI * 2);
//         ctx.fill();
//         ctx.restore();
//       }
//     }

//     frame = points.length > 1 ? requestAnimationFrame(draw) : 0;
//   }

//   function handleMove(event) {
//     if (event.pointerType !== "mouse" || reduceMotion.matches) {
//       return;
//     }

//     const colorIndex = Math.floor(Math.random() * COLORS.length);

//     points.push({
//       x: event.clientX,
//       y: event.clientY,
//       time: performance.now(),
//       colorIndex,
//     });

//     if (points.length > MAX_POINTS) points.shift();

//     if (!frame) frame = requestAnimationFrame(draw);
//   }

//   function handleMotionChange() {
//     if (reduceMotion.matches) {
//       points = [];

//       if (frame) cancelAnimationFrame(frame);
//       frame = 0;

//       clear();
//     }
//   }

//   window.addEventListener("pointermove", handleMove, {
//     passive: true,
//   });

//   window.addEventListener("resize", resize);
//   reduceMotion.addEventListener("change", handleMotionChange);

//   resize();
// })();
