# NOVA — Navigational Oracle for Vast Astronomy

A sleek, mission-control-inspired AI chatbot about space exploration. NOVA knows everything about space: planets, missions, rockets, astronauts, black holes, exoplanets, the ISS, SpaceX, NASA history, cosmology, and more.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS + custom CSS variables
- **AI:** Groq (`llama-3.3-70b-versatile`) via `/api/chat` — free tier available
- **Fonts:** Orbitron (headings) + IBM Plex Mono (body)
- **Animations:** Framer Motion
- **Icons:** Lucide React

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` and add your Gemini API key (get a free key at [Google AI Studio](https://aistudio.google.com/apikey)):
   ```
   GEMINI_API_KEY=your_key_here
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).


## Features

-  Animated star field background
-  Hero section with suggestion chips
-  Streaming AI responses
-  Responsive (mobile, tablet, desktop)
-  Conversation persistence (localStorage)
-  Copy-to-clipboard for NOVA responses
-  Keyboard shortcuts (Enter to send, Shift+Enter for new line)
