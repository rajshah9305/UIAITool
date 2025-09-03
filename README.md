# Magic UI Elite

AI-powered multi-agent UI generator with live previews and collaborative iteration.

## Features

- **Multi-Agent System**: Architect, Style Curator, Code Generator, Previewer, QA, Exporter
- **Live Previews**: 4 simultaneous variant previews with real-time updates
- **Agent Chat**: Collaborate with AI agents to refine designs
- **Modern Tech Stack**: Next.js 14, TypeScript, Tailwind CSS, CrewAI
- **Export Ready**: One-click export to production-ready projects

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Visit http://localhost:3000
```

## Usage

1. Enter your UI brief in the input field (e.g., "dashboard with sidebar and stats")
2. Click "Generate" to create 4 design variants
3. Chat with agents to refine specific aspects
4. Select your preferred variant and export

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run export:variant` - Export selected variant as zip

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/magic-ui-elite)

### Manual Deployment

1. Push to GitHub
2. Connect repository to Vercel
3. Deploy automatically

## Project Structure

```
magic-ui-elite/
├── app/                    # Next.js app router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main dashboard
├── components/            # React components
│   └── ui/                # Reusable UI components
├── public/               # Static assets
│   └── previews/         # Generated preview files
├── styles/               # CSS files
└── package.json          # Dependencies and scripts
```

## Environment Variables

### Optional Configuration
```bash
# Copy the example environment file
cp .env.example .env.local

# Add your Cerebras API key (optional)
CEREBRAS_API_KEY=your_api_key_here
```

**Note**: The application works without API keys using intelligent fallback responses. Add a Cerebras API key for enhanced AI-powered generation.

## Contributing

This is a personal project. Feel free to fork and customize for your needs.

## License

MIT License - see LICENSE file for details.