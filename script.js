/* ==========================================================================
         GSAP MASTER ANIMATION SYSTEM
         Professional-grade animations for Our Unwritten Story
      ========================================================================== */

gsap.registerPlugin(ScrollTrigger, TextPlugin);

// Global state
let isAudioPlaying = false;
let isScootyAnimating = false;
let scootyAnimationFrame = null;
let typewriterTriggered = false;
let particlesInstance = null;

const cursor = Cursorly.init({
  effect: { name: "sparkle", color: "snow" },
});

const playlist = [
  { title: "The song that reminds me of you", file: "candy.mp3" },
];
let currentSongIndex = 0;

/* ==========================================================================
         GSAP ANIMATION SETUP
      ========================================================================== */

// Set initial states via GSAP for smooth animations
function setupInitialStates() {
  // Hero elements
  gsap.set("#heroLabel, #heroTitle, #heroSubtitle", { opacity: 0, y: 40 });
  gsap.set("#envelopeWrapper", { opacity: 0, y: 60, scale: 0.95 });
  gsap.set("#scrollHint", { opacity: 0, y: 20 });

  // Navigation
  gsap.set("#mainNav", { opacity: 0, y: -20 });

  // Chapter headings
  gsap.set(".chapter-heading", { opacity: 0, y: 40 });
  gsap.set(".chapter-text-left", { opacity: 0, x: -50 });
  gsap.set(".chapter-chat-box", { opacity: 0, x: 50 });
  gsap.set(".chapter-card", { opacity: 0, y: 50 });
  gsap.set(".chapter-reflection", { opacity: 0, y: 40 });

  // Feature cards
  gsap.set(".feature-card", { opacity: 0, y: 40, scale: 0.95 });

  // Timeline items
  gsap.set(".timeline-item", { opacity: 0, y: 60 });
  gsap.set(".timeline-node", { scale: 0 });
  gsap.set(".timeline-line", { scaleY: 0, transformOrigin: "top" });

  // Letter
  gsap.set(".letter-container", { opacity: 0, scale: 0.9 });
  gsap.set(".letter-card", { opacity: 0, y: 50 });
  gsap.set(".letter-tagline", { opacity: 0, y: 30 });

  // Conversations
  gsap.set(".conversation-item", { opacity: 0, y: 50, scale: 0.95 });
  gsap.set(".conversation-tagline", { opacity: 0, y: 30 });

  // Memory box
  gsap.set(".memory-lid-icon", { opacity: 0, scale: 0.5, rotation: -20 });
  gsap.set(".memory-pills-row", { opacity: 0, y: 30 });

  // Footer
  gsap.set(".footer-content", { opacity: 0, y: 40 });

  // Password gate
  gsap.set("#passwordCard", { opacity: 0, scale: 0.9, y: 30 });
}

// Run initial states immediately
setupInitialStates();

/* ==========================================================================
         PASSWORD GATE ANIMATION
      ========================================================================== */

function animatePasswordGate() {
  const tl = gsap.timeline({ delay: 0.2 });

  tl.to("#passwordCard", {
    opacity: 1,
    scale: 1,
    y: 0,
    duration: 1,
    ease: "power3.out",
  })
    .from(
      "#passwordHeart",
      {
        scale: 0,
        rotation: -180,
        duration: 0.8,
        ease: "back.out(1.7)",
      },
      "-=0.5",
    )
    .from(
      "#passwordCard > p:first-of-type",
      {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: "power2.out",
      },
      "-=0.3",
    )
    .from(
      "#passwordGateTitle",
      {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: "power2.out",
      },
      "-=0.4",
    )
    .from(
      "#passwordCard > p:nth-of-type(2)",
      {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: "power2.out",
      },
      "-=0.4",
    )
    .from(
      "#passwordForm",
      {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: "power2.out",
      },
      "-=0.3",
    );
}

// Start password gate animation
animatePasswordGate();

/* ==========================================================================
         HERO SECTION ANIMATION
      ========================================================================== */

function animateHero() {
  const tl = gsap.timeline({ delay: 0.3 });

  tl.to("#heroLabel", {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: "power3.out",
  })
    .to(
      "#heroTitle",
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
      },
      "-=0.5",
    )
    .to(
      "#heroSubtitle",
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
      },
      "-=0.6",
    )
    .to(
      "#envelopeWrapper",
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: "back.out(1.4)",
      },
      "-=0.4",
    )
    .to(
      "#scrollHint",
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
      },
      "-=0.3",
    )
    .to(
      "#mainNav",
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
      },
      "-=0.3",
    );

  // Envelope floating animation
  gsap.to("#envelopeWrapper", {
    y: -8,
    duration: 2.5,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
    delay: 1.5,
  });

  // Envelope icon pulse
  gsap.to("#envelopeIcon", {
    scale: 1.08,
    duration: 1.2,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });

  // Scroll hint bounce
  gsap.to("#scrollHint", {
    y: 8,
    duration: 1.5,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });
}

/* ==========================================================================
         SCROLL-TRIGGERED CHAPTER ANIMATIONS
      ========================================================================== */

function setupScrollAnimations() {
  // Chapter headings
  gsap.utils.toArray(".chapter-heading").forEach((heading) => {
    gsap.to(heading, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: heading,
        start: "top 85%",
        toggleActions: "play none none none",
      },
    });
  });

  // Chapter text left
  gsap.utils.toArray(".chapter-text-left").forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      x: 0,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 80%",
        toggleActions: "play none none none",
      },
    });
  });

  // Chapter chat boxes
  gsap.utils.toArray(".chapter-chat-box").forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      x: 0,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 80%",
        toggleActions: "play none none none",
      },
    });
  });

  // Chapter cards
  gsap.utils.toArray(".chapter-card").forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 82%",
        toggleActions: "play none none none",
      },
    });
  });

  // Reflection boxes
  gsap.utils.toArray(".chapter-reflection").forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 88%",
        toggleActions: "play none none none",
      },
    });
  });

  // Feature cards with stagger
  gsap.utils.toArray(".feature-card").forEach((card, i) => {
    gsap.to(card, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.7,
      delay: i * 0.15,
      ease: "power3.out",
      scrollTrigger: {
        trigger: card.parentElement,
        start: "top 80%",
        toggleActions: "play none none none",
      },
    });
  });

  // Flip cards
  gsap.utils.toArray(".flip-card").forEach((card, i) => {
    gsap.from(card, {
      opacity: 0,
      y: 50,
      rotationY: -15,
      duration: 0.8,
      delay: i * 0.12,
      ease: "power3.out",
      scrollTrigger: {
        trigger: card,
        start: "top 85%",
        toggleActions: "play none none none",
      },
    });
  });

  // PDF card
  gsap.from(".pdf-card", {
    opacity: 0,
    y: 50,
    scale: 0.98,
    duration: 1,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".pdf-card",
      start: "top 80%",
      toggleActions: "play none none none",
    },
  });

  // Question box
  gsap.from(".question-box", {
    opacity: 0,
    y: 40,
    duration: 0.9,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".question-box",
      start: "top 85%",
      toggleActions: "play none none none",
    },
  });

  // Timeline items
  gsap.utils.toArray(".timeline-item").forEach((item, i) => {
    const node = item.querySelector(".timeline-node");
    const card = item.querySelector(".timeline-card");

    gsap.to(item, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: {
        trigger: item,
        start: "top 80%",
        toggleActions: "play none none none",
      },
    });

    if (node) {
      gsap.to(node, {
        scale: 1,
        duration: 0.6,
        delay: 0.3,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: item,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });
    }

    if (card) {
      gsap.from(card, {
        rotationY: i % 2 === 0 ? 8 : -8,
        duration: 1,
        delay: 0.4,
        ease: "power3.out",
        scrollTrigger: {
          trigger: item,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });
    }
  });

  // Timeline ending
  gsap.from(".timeline-ending", {
    opacity: 0,
    y: 40,
    duration: 0.8,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".timeline-ending",
      start: "top 88%",
      toggleActions: "play none none none",
    },
  });

  // Letter section
  gsap.to(".letter-container", {
    opacity: 1,
    scale: 1,
    duration: 1,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".letter-container",
      start: "top 80%",
      toggleActions: "play none none none",
    },
  });

  gsap.to(".letter-card", {
    opacity: 1,
    y: 0,
    duration: 0.9,
    delay: 0.2,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".letter-container",
      start: "top 80%",
      toggleActions: "play none none none",
    },
  });

  gsap.to(".letter-tagline", {
    opacity: 1,
    y: 0,
    duration: 0.8,
    delay: 0.4,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".letter-tagline",
      start: "top 90%",
      toggleActions: "play none none none",
    },
  });

  // Conversations with stagger
  gsap.utils.toArray(".conversation-item").forEach((card, i) => {
    gsap.to(card, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.7,
      delay: (i % 4) * 0.1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: card,
        start: "top 88%",
        toggleActions: "play none none none",
      },
    });
  });

  gsap.to(".conversation-tagline", {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".conversation-tagline",
      start: "top 90%",
      toggleActions: "play none none none",
    },
  });

  // Memory box lid
  gsap.to(".memory-lid-icon", {
    opacity: 1,
    scale: 1,
    rotation: 0,
    duration: 1,
    ease: "back.out(1.7)",
    scrollTrigger: {
      trigger: ".memory-lid-icon",
      start: "top 85%",
      toggleActions: "play none none none",
    },
  });

  // Memory pills
  gsap.to(".memory-pills-row", {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".memory-pills-row",
      start: "top 92%",
      toggleActions: "play none none none",
    },
  });

  // Footer
  gsap.to(".footer-content", {
    opacity: 1,
    y: 0,
    duration: 0.9,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".footer-content",
      start: "top 92%",
      toggleActions: "play none none none",
    },
  });
}

/* ==========================================================================
         TYPEWRITER ANIMATION FOR CHAPTER 10
      ========================================================================== */

const endingText =
  "Our story is still being written. We don't know what tomorrow holds, but every honest conversation, every effort, every shared smile, and every moment of understanding becomes a part of our journey. Perhaps the most beautiful part of our story is not knowing exactly how it ends, but discovering how we choose to write it together.";

function setupTypewriter() {
  ScrollTrigger.create({
    trigger: "#ch10",
    start: "top 60%",
    onEnter: () => {
      if (!typewriterTriggered) {
        typewriterTriggered = true;
        gsap.to("#typewriterText", {
          text: endingText,
          duration: endingText.length * 0.04,
          ease: "none",
        });
      }
    },
  });
}

/* ==========================================================================
         PASSWORD GATE LOGIC
      ========================================================================== */

(() => {
  const DEVELOPER_MODE = false;
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
    input.value = "";

    // GSAP unlock animation
    gsap.to("#passwordCard", {
      opacity: 0,
      scale: 0.9,
      y: -30,
      duration: 0.5,
      ease: "power2.in",
      onComplete: () => {
        gsap.to("#passwordGate", {
          opacity: 0,
          duration: 0.4,
          ease: "power2.in",
          onComplete: () => {
            gate.remove();

            // Initialize hero animations after unlock
            animateHero();
            setupScrollAnimations();
            setupTypewriter();
            initParticles();
            renderJourneyCanvas();
          },
        });
      },
    });
  }

  if (DEVELOPER_MODE) {
    document.body.classList.remove("site-locked");
    gate.remove();
    animateHero();
    setupScrollAnimations();
    setupTypewriter();
    initParticles();
    renderJourneyCanvas();
    return;
  }

  function showError() {
    error.textContent = "That password isn't right. Try again, love.";

    gsap.fromTo(
      "#passwordCard",
      { x: 0 },
      {
        x: 8,
        duration: 0.08,
        repeat: 5,
        yoyo: true,
        ease: "power2.inOut",
        onComplete: () => {
          gsap.set("#passwordCard", { x: 0 });
        },
      },
    );

    input.select();
  }

  window.setTimeout(() => input.focus(), 500);

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

/* ==========================================================================
         PARTICLES
      ========================================================================== */

function initParticles() {
  particlesJS("snow-particles", {
    particles: {
      number: {
        value: 100,
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
}

/* ==========================================================================
         MUSIC PLAYER
      ========================================================================== */

function togglePlaylist() {
  const panel = document.getElementById("playlistPanel");
  const isHidden = panel.classList.contains("hidden");

  if (isHidden) {
    panel.classList.remove("hidden");
    gsap.from(panel, {
      opacity: 0,
      y: 20,
      scale: 0.95,
      duration: 0.4,
      ease: "power3.out",
    });
  } else {
    gsap.to(panel, {
      opacity: 0,
      y: 20,
      scale: 0.95,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => panel.classList.add("hidden"),
    });
  }
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

/* ==========================================================================
         NAVIGATION & SCROLL
      ========================================================================== */

function openEnvelope() {
  const card = document.getElementById("envelopeCard");

  gsap.to(card, {
    scale: 0.9,
    rotationY: 180,
    opacity: 0,
    duration: 0.6,
    ease: "power2.in",
    onComplete: () => {
      gsap.set(card, { clearProps: "all" });
      scrollToChapter("ch1");
    },
  });
}

function scrollToChapter(chapterId) {
  const target = document.getElementById(chapterId);
  if (target) {
    target.scrollIntoView({ behavior: "smooth" });
  }
}

// Progress bar and chapter indicator
window.addEventListener("scroll", () => {
  const winScroll =
    document.body.scrollTop || document.documentElement.scrollTop;
  const height =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;
  document.getElementById("progressBar").style.width = scrolled + "%";

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

/* ==========================================================================
         PDF TOGGLE
      ========================================================================== */

function togglePdfSummary() {
  const excerpts = document.getElementById("pdfExcerpts");
  const text = document.getElementById("pdfToggleText");

  if (excerpts.classList.contains("hidden")) {
    excerpts.classList.remove("hidden");
    text.innerText = "Hide Excerpts";
    gsap.from(excerpts.children, {
      opacity: 0,
      y: 20,
      duration: 0.5,
      stagger: 0.1,
      ease: "power3.out",
    });
  } else {
    gsap.to(excerpts, {
      opacity: 0,
      y: -10,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        excerpts.classList.add("hidden");
        gsap.set(excerpts, { clearProps: "all" });
        text.innerText = "Expand Full Excerpts";
      },
    });
  }
}

/* ==========================================================================
         PERSPECTIVE SWITCHER
      ========================================================================== */

function switchPerspective(type) {
  const myTab = document.getElementById("perspectiveMy");
  const unknownTab = document.getElementById("perspectiveUnknown");
  const myBtn = document.getElementById("tabMyPerspectiveBtn");
  const unknownBtn = document.getElementById("tabUnknownPerspectiveBtn");

  if (type === "my") {
    unknownTab.classList.add("hidden");
    myTab.classList.remove("hidden");
    myBtn.className =
      "flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all bg-burgundy-800 text-gold-300 shadow";
    unknownBtn.className =
      "flex-1 py-2 px-4 rounded-xl text-xs font-bold text-burgundy-300 transition-all hover:text-white";

    gsap.from(myTab, {
      opacity: 0,
      y: 15,
      duration: 0.4,
      ease: "power3.out",
    });
  } else {
    myTab.classList.add("hidden");
    unknownTab.classList.remove("hidden");
    unknownBtn.className =
      "flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all bg-burgundy-800 text-gold-300 shadow";
    myBtn.className =
      "flex-1 py-2 px-4 rounded-xl text-xs font-bold text-burgundy-300 transition-all hover:text-white";

    gsap.from(unknownTab, {
      opacity: 0,
      y: 15,
      duration: 0.4,
      ease: "power3.out",
    });
  }
}

/* ==========================================================================
         FLIP CARDS WITH GSAP
      ========================================================================== */

function flipCard(cardEl) {
  const inner = cardEl.querySelector(".card-inner");
  const isFlipped = inner.classList.contains("rotate-y-180");

  gsap.to(inner, {
    rotationY: isFlipped ? 0 : 180,
    duration: 0.7,
    ease: "power2.inOut",
    onComplete: () => {
      inner.classList.toggle("rotate-y-180");
    },
  });
}

/* ==========================================================================
         JOURNEY CANVAS
      ========================================================================== */

const jCanvas = document.getElementById("journeyCanvas");
const jCtx = jCanvas.getContext("2d");
let scootyProgress = 0;

function renderJourneyCanvas() {
  if (!jCanvas) return;

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

  // Scooty Position
  const t = scootyProgress;
  const px =
    (1 - t) * (1 - t) * 40 + 2 * (1 - t) * t * (w * 0.5) + t * t * (w - 50);
  const py =
    (1 - t) * (1 - t) * (h / 2) + 2 * (1 - t) * t * (h * 0.7) + t * t * (h / 2);

  jCtx.fillStyle = "#f6e05e";
  jCtx.shadowColor = "#d4af37";
  jCtx.shadowBlur = 10;
  jCtx.beginPath();
  jCtx.arc(px, py, 7, 0, Math.PI * 2);
  jCtx.fill();
  jCtx.shadowBlur = 0;

  const locLabel = document.getElementById("locationLabel");
  if (locLabel) {
    if (t < 0.4) {
      locLabel.innerText = "Departing Korba towards Champa...";
    } else if (t < 0.8) {
      locLabel.innerText =
        "Riding together on scooty through scenic greenery...";
    } else {
      locLabel.innerText = "Arrived at Nagargda Waterfall (9 Sept Memory)";
    }
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

/* ==========================================================================
         LETTER MODAL
      ========================================================================== */

function openLetter() {
  const modal = document.getElementById("letterModal");
  modal.classList.remove("hidden");
  modal.classList.add("flex");
  document.body.style.overflow = "hidden";

  gsap.from(modal, {
    opacity: 0,
    duration: 0.4,
    ease: "power2.out",
  });

  gsap.from(modal.querySelector("img"), {
    scale: 0.9,
    opacity: 0,
    duration: 0.5,
    delay: 0.1,
    ease: "back.out(1.4)",
  });
}

function closeLetter(event) {
  if (event && event.target !== event.currentTarget) return;

  const modal = document.getElementById("letterModal");

  gsap.to(modal, {
    opacity: 0,
    duration: 0.3,
    ease: "power2.in",
    onComplete: () => {
      modal.classList.add("hidden");
      modal.classList.remove("flex");
      document.body.style.overflow = "";
      gsap.set(modal, { clearProps: "all" });
    },
  });
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

  // Reset typewriter
  typewriterTriggered = false;
  document.getElementById("typewriterText").innerHTML = "";

  // Reset scroll trigger
  ScrollTrigger.getAll().forEach((trigger) => {
    if (trigger.trigger === document.getElementById("ch10")) {
      trigger.kill();
    }
  });

  setTimeout(() => {
    setupTypewriter();
  }, 500);
}

/* ==========================================================================
         REVEAL MORE CONVERSATIONS
      ========================================================================== */

let revealedConversations = 0;

function revealMoreConversations() {
  const cards = [...document.querySelectorAll(".conversation-extra")];
  const next = Math.min(revealedConversations + 4, cards.length);

  cards.slice(revealedConversations, next).forEach((card, i) => {
    card.classList.add("is-visible");

    gsap.from(card, {
      opacity: 0,
      y: 50,
      scale: 0.95,
      duration: 0.6,
      delay: i * 0.1,
      ease: "power3.out",
    });
  });

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

/* ==========================================================================
         MEMORY BOX
      ========================================================================== */

const memories = [
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
    /[&<>"']/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
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

  // Update count
  document.getElementById("memoryCount").textContent =
    `${memories.length} memories`;
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

  gsap.from(viewer, {
    opacity: 0,
    duration: 0.4,
    ease: "power2.out",
  });

  gsap.from(content, {
    scale: 0.9,
    opacity: 0,
    duration: 0.5,
    delay: 0.1,
    ease: "back.out(1.4)",
  });
}

function closeMemoryViewer() {
  const viewer = document.getElementById("memoryViewer");
  const content = document.getElementById("memoryViewerContent");

  gsap.to(viewer, {
    opacity: 0,
    duration: 0.3,
    ease: "power2.in",
    onComplete: () => {
      viewer.classList.add("hidden");
      content.innerHTML = "";
      document.body.style.overflow = "";
      gsap.set(viewer, { clearProps: "all" });
    },
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMemoryViewer();
});

// Memory filters
document.querySelectorAll(".memory-filter").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".memory-filter")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const filter = btn.dataset.memoryFilter;
    const cards = document.querySelectorAll(".memory-card");

    cards.forEach((card) => {
      const type = card
        .querySelector(".memory-card-type")
        ?.textContent?.toLowerCase()
        .includes("photo")
        ? "image"
        : card
              .querySelector(".memory-card-type")
              ?.textContent?.toLowerCase()
              .includes("place")
          ? "place"
          : card
                .querySelector(".memory-card-type")
                ?.textContent?.toLowerCase()
                .includes("song")
            ? "audio"
            : card
                  .querySelector(".memory-card-type")
                  ?.textContent?.toLowerCase()
                  .includes("video")
              ? "video"
              : card
                    .querySelector(".memory-card-type")
                    ?.textContent?.toLowerCase()
                    .includes("file")
                ? "file"
                : "note";

      if (filter === "all" || type === filter) {
        card.style.display = "";
        gsap.from(card, {
          opacity: 0,
          scale: 0.95,
          duration: 0.4,
          ease: "power2.out",
        });
      } else {
        card.style.display = "none";
      }
    });
  });
});

// Render memory box
renderMemoryBox();

// Handle resize for journey canvas
window.addEventListener("resize", () => {
  renderJourneyCanvas();
});

/* ==========================================================================
         ADDITIONAL GSAP ENHANCEMENTS
      ========================================================================== */

// Smooth nav button animations
document.querySelectorAll(".nav-btn").forEach((btn) => {
  btn.addEventListener("mouseenter", () => {
    gsap.to(btn, { scale: 1.05, duration: 0.2, ease: "power2.out" });
  });
  btn.addEventListener("mouseleave", () => {
    gsap.to(btn, { scale: 1, duration: 0.2, ease: "power2.out" });
  });
});

// Chat bubble entrance animations
gsap.utils.toArray(".chat-msg").forEach((msg, i) => {
  gsap.from(msg, {
    opacity: 0,
    x: i % 2 === 0 ? -20 : 20,
    duration: 0.5,
    delay: 0.2 + i * 0.1,
    ease: "power3.out",
    scrollTrigger: {
      trigger: msg,
      start: "top 90%",
      toggleActions: "play none none none",
    },
  });
});

// Memory card hover effects
document.addEventListener(
  "mouseenter",
  (e) => {
    if (!(e.target instanceof Element)) return;
    const memoryCard = e.target.closest(".memory-card");
    if (!memoryCard) return;

    gsap.to(memoryCard, {
      scale: 1.02,
      duration: 0.3,
      ease: "power2.out",
    });
  },
  true,
);

document.addEventListener(
  "mouseleave",
  (e) => {
    if (!(e.target instanceof Element)) return;
    const memoryCard = e.target.closest(".memory-card");
    if (!memoryCard) return;

    gsap.to(memoryCard, {
      scale: 1,
      duration: 0.3,
      ease: "power2.out",
    });
  },
  true,
);

// Add resize observer for journey canvas
if (window.ResizeObserver) {
  const resizeObserver = new ResizeObserver(() => {
    renderJourneyCanvas();
  });
  const canvasContainer = jCanvas?.parentElement;
  if (canvasContainer) {
    resizeObserver.observe(canvasContainer);
  }
}

/* ==========================================================================
         CLEANUP
      ========================================================================== */

// Refresh ScrollTrigger on window resize
let resizeTimeout;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    ScrollTrigger.refresh();
  }, 250);
});

console.log("🎬 GSAP Master Animation System initialized successfully!");
