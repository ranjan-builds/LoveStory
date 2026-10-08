// Global App State
let isAudioPlaying = false;
let isScootyAnimating = false;
let scootyAnimationFrame = null;

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

// Canvas Particle System for Atmosphere
const particleCanvas = document.getElementById("particleCanvas");
const pCtx = particleCanvas.getContext("2d");
let particles = [];

function resizeParticleCanvas() {
  particleCanvas.width = window.innerWidth;
  particleCanvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeParticleCanvas);
resizeParticleCanvas();

class Particle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * particleCanvas.width;
    this.y = Math.random() * particleCanvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.3;
    this.speedY = -Math.random() * 0.4 - 0.1;
    this.opacity = Math.random() * 0.5 + 0.2;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.y < 0 || this.x < 0 || this.x > particleCanvas.width) {
      this.reset();
      this.y = particleCanvas.height;
    }
  }
  draw() {
    pCtx.fillStyle = `rgba(240, 168, 182, ${this.opacity})`;
    pCtx.beginPath();
    pCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    pCtx.fill();
  }
}

for (let i = 0; i < 40; i++) {
  particles.push(new Particle());
}

function animateParticles() {
  pCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
  particles.forEach((p) => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animateParticles);
}
animateParticles();

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
  if (target) {
    target.scrollIntoView({ behavior: "smooth" });
  }
}

// Scroll Progress Bar & Navigation Indicator update
window.addEventListener("scroll", () => {
  const winScroll =
    document.body.scrollTop || document.documentElement.scrollTop;
  const height =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;
  document.getElementById("progressBar").style.width = scrolled + "%";

  // Active Chapter Detection
  const chapters = [
    "ch1",
    "ch2",
    "ch3",
    "ch4",
    "ch5",
    "ch6",
    "ch7",
    "ch8",
    "ch9",
    "ch10",
  ];
  const names = [
    "Chapter 1: The Beginning",
    "Chapter 2: 17 Aug PDF",
    "Chapter 3: Her Apology",
    "Chapter 4: 20 August",
    "Chapter 5: Meeting Plans",
    "Chapter 6: 9 Sept Meeting",
    "Chapter 7: Growing Closer",
    "Chapter 8: Doubts & Questions",
    "Chapter 9: Love Letter",
    "Chapter 10: Unwritten Future",
  ];

  for (let i = chapters.length - 1; i >= 0; i--) {
    const el = document.getElementById(chapters[i]);
    if (el && el.getBoundingClientRect().top <= 200) {
      document.getElementById("currentChapterIndicator").innerText = names[i];
      break;
    }
  }
});

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

const jCanvas = document.getElementById("journeyCanvas");
const jCtx = jCanvas.getContext("2d");
let scootyProgress = 0;

function renderJourneyCanvas() {
  jCanvas.width = jCanvas.offsetWidth;
  jCanvas.height = jCanvas.offsetHeight;

  const w = jCanvas.width;
  const h = jCanvas.height;

  // Background Scenic Gradient
  const skyGrad = jCtx.createLinearGradient(0, 0, 0, h);
  skyGrad.addColorStop(0, "#1a050d");
  skyGrad.addColorStop(0.6, "#380a14");
  skyGrad.addColorStop(1, "#0e0306");
  jCtx.fillStyle = skyGrad;
  jCtx.fillRect(0, 0, w, h);

  // Winding Road path
  jCtx.beginPath();
  jCtx.moveTo(40, h / 2);
  jCtx.bezierCurveTo(w * 0.3, h * 0.2, w * 0.6, h * 0.8, w - 50, h / 2);
  jCtx.strokeStyle = "rgba(212, 175, 55, 0.4)";
  jCtx.lineWidth = 12;
  jCtx.stroke();

  // Location Nodes (Korba & Nagargda Waterfall)
  // Node 1: Korba
  jCtx.fillStyle = "#be3154";
  jCtx.beginPath();
  jCtx.arc(40, h / 2, 8, 0, Math.PI * 2);
  jCtx.fill();
  jCtx.fillStyle = "#fbe5e8";
  jCtx.font = "10px Plus Jakarta Sans";
  jCtx.fillText("Korba", 25, h / 2 - 15);

  // Node 2: Champa
  jCtx.fillStyle = "#d4af37";
  jCtx.beginPath();
  jCtx.arc(w * 0.45, h * 0.52, 6, 0, Math.PI * 2);
  jCtx.fill();
  jCtx.fillStyle = "#fbe5e8";
  jCtx.fillText("Champa", w * 0.45 - 18, h * 0.52 - 12);

  // Node 3: Nagargda Waterfall
  jCtx.fillStyle = "#38bdf8";
  jCtx.beginPath();
  jCtx.arc(w - 50, h / 2, 10, 0, Math.PI * 2);
  jCtx.fill();
  jCtx.fillStyle = "#38bdf8";
  jCtx.fillText("Nagargda Waterfall", w - 90, h / 2 - 18);

  // Calculate Scooty Position along Curve
  const t = scootyProgress;
  const px =
    (1 - t) * (1 - t) * 40 + 2 * (1 - t) * t * (w * 0.5) + t * t * (w - 50);
  const py =
    (1 - t) * (1 - t) * (h / 2) + 2 * (1 - t) * t * (h * 0.7) + t * t * (h / 2);

  // Draw Scooty Icon / Marker
  jCtx.fillStyle = "#f6e05e";
  jCtx.shadowColor = "#d4af37";
  jCtx.shadowBlur = 10;
  jCtx.beginPath();
  jCtx.arc(px, py, 7, 0, Math.PI * 2);
  jCtx.fill();
  jCtx.shadowBlur = 0;

  // Update Label text depending on position
  const locLabel = document.getElementById("locationLabel");
  if (t < 0.4) {
    locLabel.innerText = "Departing Korba towards Champa...";
  } else if (t < 0.8) {
    locLabel.innerText = "Riding together on scooty through scenic greenery...";
  } else {
    locLabel.innerText = "Arrived at Nagargda Waterfall (9 Sept Memory)";
  }
}

function toggleScootyAnimation() {
  isScootyAnimating = !isScootyAnimating;
  const btnText = document.getElementById("scootyBtnText");

  if (isScootyAnimating) {
    btnText.innerText = "Pause Journey";
    function loop() {
      scootyProgress += 0.003;
      if (scootyProgress > 1) scootyProgress = 0;
      renderJourneyCanvas();
      if (isScootyAnimating) {
        scootyAnimationFrame = requestAnimationFrame(loop);
      }
    }
    loop();
  } else {
    btnText.innerText = "Resume Journey Animation";
    cancelAnimationFrame(scootyAnimationFrame);
  }
}
renderJourneyCanvas();

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
    title: "Our Togather Photo",
    date: "9 September 2026",
    file: "./memories/images/we.jpg",
    caption: "The day we finally went to devriside road trip.",
  },
  {
    type: "image",
    title: "She was so happy to see canal side view.",
    date: "9 September 2026",
    file: "./memories/images/anjaliatcanal.jpg",
    caption: "She was just so happy",
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
    type: "audio",
    title: "The Song That Reminds Me of You",
    date: "Our Song",
    file: "memories\\audios\\Teri Baaten.mp3",
    caption: "This one will always remind me of you.",
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

renderMemoryBox();
