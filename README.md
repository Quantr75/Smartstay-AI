# SmartStay AI — Hotel Booking Assistant

**Project by:** Trinh Van Quan (Student ID: 24012975)

A fully functional AI-powered hotel booking assistant website built with vanilla HTML, CSS, and JavaScript using the Anthropic Claude API.

---

## How to Run

### Option 1 — Open directly in browser (simplest)
1. Open the `smartstay-ai` folder
2. Double-click `index.html`
3. It will open in your browser

### Option 2 — Use a local server (recommended for best experience)
If you have Node.js installed:
```bash
cd smartstay-ai
npx serve .
```
Then open http://localhost:3000

Or with Python:
```bash
cd smartstay-ai
python -m http.server 8000
```
Then open http://localhost:8000

---

## Setup — API Key

1. Go to https://console.anthropic.com and create an account
2. Generate an API key
3. On the website, paste your API key into the **"Anthropic API Key"** field in the chat sidebar
4. Your key is saved locally in your browser — you only need to enter it once

---

## Project Structure

```
smartstay-ai/
├── index.html        ← Main website page
├── css/
│   └── style.css     ← All styles and layout
├── js/
│   └── app.js        ← AI chat logic and API calls
└── README.md         ← This file
```

---

## Features

- **AI Concierge Chat** — powered by Claude (claude-sonnet-4)
- **4 Room Types** — Standard, Deluxe, Family Suite, Executive Suite
- **Room Cards** — click "Ask AI" to query the AI about any room
- **Quick Questions** — pre-built shortcuts for common queries
- **Booking Flow** — AI guides users through name → dates → confirmation
- **Cost Calculator** — AI automatically calculates total stay cost
- **Responsive Design** — works on desktop and mobile
- **Chat History** — full multi-turn conversation memory

---

## Technologies Used

- HTML5, CSS3, Vanilla JavaScript
- Anthropic Claude API (claude-sonnet-4-20250514)
- Google Fonts (DM Sans + Playfair Display)
- Tabler Icons

---

## AI System Capabilities

The AI concierge can:
- Recommend rooms based on budget and guest count
- Calculate total costs (price × nights)
- Answer questions about amenities and policies
- Guide users through the complete booking process
- Handle natural language requests (e.g. "cheap room for 3 nights")
