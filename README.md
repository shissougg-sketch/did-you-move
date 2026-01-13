# Mobble

A minimal fitness awareness app - no shame, no streaks, just honest self-awareness.

**Live at**: [gomobble.com](https://gomobble.com)

## Philosophy

This is NOT a traditional workout logger. It's a 30-second daily check-in that asks:

1. **Did you move today?** (Yes / Kind of / No)
2. **How hard was it?** (Easy / Moderate / Hard / Exhausting)
3. **How do you feel now?** (Better / Same / Worse)

### Core Values

- **No shame**: Gray for "no", never red
- **No streaks**: Unless you explicitly opt in
- **No percentages**: "X out of Y days" only
- **No social**: This is personal, not competitive
- **No macros/calories**: This is about movement awareness
- **Gentle defaults**: Tone is encouraging, never judgmental

For people who:
- Work out inconsistently
- Get overwhelmed by fitness data
- Still care about feeling better
- Don't want to be "a fitness person"

## Features

- **30-second daily log**: Three simple questions, done
- **AI-generated responses**: Contextual, tone-aware feedback after each entry
- **Calming design**: Soft colors, generous spacing, no harsh red colors
- **History view**: See past entries with color-coding
- **Simple trends**: "You moved X out of Y days" (no percentages)
- **Tone selection**: Gentle, Neutral, or Direct communication style
- **Data export**: Export your entries as JSON or CSV
- **PWA-ready**: Works offline, can be installed as an app

## Tech Stack

- **Frontend**: React + Vite + TypeScript
- **Styling**: Tailwind CSS
- **State**: Zustand
- **Storage**: localStorage (Phase 1)
- **Routing**: React Router
- **Icons**: Lucide React
- **Dates**: date-fns

## Development

### Prerequisites

- Node.js 18+ and npm
- Git

### Setup

```bash
# Clone the repository
git clone https://github.com/shissougg-sketch/mobble.git
cd mobble

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Project Structure

```
mobble/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components (Home, History, Trends, Settings)
│   ├── stores/         # Zustand state management
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Helper functions
│   ├── App.tsx         # Main app with routing
│   ├── main.tsx        # Entry point
│   └── index.css       # Global styles
├── public/             # Static assets
├── api/                # Serverless functions (Phase 2)
└── index.html          # HTML template
```

## Roadmap

### Phase 1 (Current) ✅
- Web app with manual 3-question entry
- AI-generated contextual responses (placeholder)
- History and trends pages
- Settings with tone selection
- Point system with rewards
- Cosmetics store for mascot customization
- PWA-ready (can install on phone)

### Phase 2 (Deployment & Backend)
- Deploy to Cloudflare Pages (gomobble.com)
- Cloudflare Workers for AI responses
- Claude API integration via Anthropic SDK

### Phase 3 (Future)
- iOS companion app
- HealthKit auto-sync (calories → movement detection)
- Backend database (Cloudflare D1) for multi-device sync
- User accounts

## License

MIT

## Contributing

This is a personal project, but suggestions and feedback are welcome! Open an issue if you have ideas that align with the core philosophy.

---

*Built with thoughtfulness. No shame, no streaks, just awareness.*
