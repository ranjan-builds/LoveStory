# LoveStory

A romantic interactive love diary and story website built as a single-page experience with HTML, CSS, and JavaScript.

This project presents a handcrafted digital story with:

- A password-protected diary entrance
- Elegant romantic visual design
- Memory cards and story chapters
- Photo and audio moments
- A warm, cinematic single-page layout

## Project overview

LoveStory is an immersive web experience designed to feel like a private keepsake — a story told through chapter sections, conversation snippets, memory images, and emotional moments.

The app is primarily static and can be opened directly in a browser, or served locally through a lightweight web server.

## Repository structure

- `index.html` — main page and app layout
- `script.js` — interactivity, memory logic, and story behavior
- `candy.mp3` — background music/ambient audio
- `chatBg.png` — background texture used in chat-style sections
- `letter.png`, `og-image.png` — visual assets used by the story
- `memories/` — memory media directory
- `favicons/` — browser icons and manifest files

## Features

- Responsive romantic layout
- Interactive chapter flow
- Optional chapter voice guide that plays a recording when each chapter is reached
- Memory gallery with filters
- Photo and video viewing modal
- Audio player support
- Private password gate for the diary experience
- Lightweight static site structure

## Running locally

Because this is a static frontend, you can run it in any of the following ways:

### Option 1: Open directly

Open `index.html` in a browser.

### Option 2: Use a local server

From the project folder, run:

```bash
python3 -m http.server 8000
```

Then visit:

```text
http://localhost:8000
```

## Customization

You can personalize the site by editing:

- `index.html` for text, chapters, and content layout
- `script.js` for interactive logic, story behavior, and the `timelineEvents` array
- asset files in the root or `memories/` folder for images and media
- colors/fonts in the inline Tailwind configuration and CSS blocks in `index.html`

### Adding a timeline event

Add another object to the `timelineEvents` array in `script.js`. Each event
supports `day`, `month`, `dateLabel`, `badge`, `badgeIcon`, `badgeClasses`,
`icon`, `glowClass`, `title`, `description`, and `quote`. Add a `route` with a
`title` and `stops` array for a journey, or a `highlights` array for detail
cards; both are optional. Timeline cards alternate sides automatically. For
example:

```js
{
  day: "14",
  month: "February",
  dateLabel: "A special day",
  badge: "Our Anniversary",
  badgeIcon: "fa-heart",
  badgeClasses: "border-gold-500/25 bg-gold-500/10 text-gold-200",
  icon: "fa-heart",
  glowClass: "bg-gold-500/10",
  title: "Another Beautiful Memory",
  description: "Add the story of this day here.",
  quote: "A favorite line to remember.",
}
```

### Website memories

Add a website to the `memories` array in `script.js` with `type: "link"` and a
public `http://` or `https://` URL. The Websites filter shows these entries;
Microlink fetches the page title, description, and Open Graph image when the
diary loads.

```js
{
  type: "link",
  title: "A page we love",
  date: "9 November 2026",
  url: "https://example.com",
  caption: "Optional note to show if the page has no description.",
},
```

Link previews require an internet connection and send each saved URL to
Microlink's public API. If a preview cannot be fetched, the website link remains
available to open directly.

### Chapter voice recordings

To use the optional voice guide, add one WAV recording per chapter to the
`myVoice/` folder in the project root. Name them `Chapter1.wav`,
`Chapter2.wav`, and so on through `Chapter13.wav`, then turn on **Voice off**
in the chapter navigation. All configured recordings are preloaded when the
page opens, and the matching recording plays as each chapter becomes active
while scrolling.

## Notes

This project is designed as a personal/romantic web experience rather than a general-purpose app. If you plan to adapt it for another story or occasion, most of the content and styling can be updated in `index.html` and `script.js` without changing the overall structure.

## License

This project does not currently include a license file. If you intend to publish or share it publicly, consider adding a license that matches your usage rights.
