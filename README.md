# Founder Equity Calculator

A comprehensive web application for startup founders to plan equity splits, model funding rounds, track dilution, and analyze exit scenarios with an interactive timeline-based visualization.

![Equity Calculator](https://via.placeholder.com/800x400/0ea5e9/ffffff?text=Equity+Calculator+Screenshot)

## Features

### 🎯 Core Functionality

- **Interactive Timeline View** - Visualize your startup's lifecycle with funding rounds, vesting milestones, and key events on a beautiful drag-and-drop timeline
- **Founder Equity Calculator** - Calculate fair equity splits based on contribution weighting, handle vesting schedules, and manage co-founder departures
- **Funding Rounds Manager** - Model multiple funding rounds (Pre-seed, Seed, Series A-D) with automatic dilution calculations and liquidation preference tracking
- **Real-Time Cap Table** - See ownership breakdown at any point in time with fully diluted calculations
- **Stock Option Pool** - Manage employee equity grants, track pool utilization, and plan for refreshes
- **Exit Scenario Modeling** - Waterfall analysis at different exit valuations with liquidation preferences
- **Valuation Tools** - Pre/post-money calculators, price per share, and valuation evolution charts
- **Export & Share** - Generate PDF reports, export CSV data, and share scenarios via URL

### 🎨 User Experience

- **Clean, Professional Design** - Fintech-inspired aesthetic with blue/purple gradients
- **Dark Mode** - Full dark mode support with theme toggle
- **Responsive** - Works beautifully on desktop, tablet, and mobile
- **Smart Warnings** - Alerts for excessive dilution, small option pools, and common mistakes
- **Template Scenarios** - Pre-loaded examples (YC standard, typical Series A, etc.)
- **Auto-Save** - Never lose your work with automatic localStorage persistence
- **Undo/Redo** - Full history tracking with keyboard shortcuts

## Tech Stack

- **Frontend Framework**: React 18 + Hooks
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **State Management**: Zustand
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Date Handling**: date-fns
- **PDF Export**: jsPDF + html2canvas
- **Routing**: React Router

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/founder-equity-calculator.git
cd founder-equity-calculator
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── landing/          # Landing page components
│   │   ├── Hero.jsx
│   │   ├── Features.jsx
│   │   ├── UseCases.jsx
│   │   ├── Testimonials.jsx
│   │   └── Footer.jsx
│   ├── calculator/       # Calculator components
│   │   ├── Timeline.jsx
│   │   ├── FoundersSection.jsx
│   │   ├── FundingRounds.jsx
│   │   ├── CapTable.jsx
│   │   └── ...
│   ├── charts/           # Chart components
│   ├── shared/           # Shared components
│   └── ui/              # Shadcn UI components
├── lib/
│   ├── calculations/     # Core calculation logic
│   │   ├── equity.js
│   │   ├── dilution.js
│   │   ├── vesting.js
│   │   ├── valuation.js
│   │   └── waterfall.js
│   └── utils/           # Utility functions
├── store/               # Zustand state management
├── data/               # Constants and templates
├── hooks/              # Custom React hooks
├── pages/              # Page components
└── App.jsx
```

## Key Concepts

### Equity Dilution

When new shares are issued during a funding round, existing shareholders' ownership percentage decreases proportionally. The calculator automatically computes dilution across multiple rounds.

### Vesting Schedules

Equity is earned over time (typically 4 years with a 1-year cliff) to protect against early departures. The calculator visualizes vesting progress on the timeline.

### Liquidation Preferences

Determines who gets paid first (and how much) in an exit scenario. The waterfall analysis accounts for 1x, 2x, and participating preferred structures.

### Fully Diluted

Total shares including common stock, preferred stock, all options (granted and ungranted pool), warrants, and convertible notes.

## Usage Examples

### Basic Workflow

1. **Set up company info** - Enter company name and founding date
2. **Add founders** - Define initial equity splits and vesting schedules
3. **Model funding rounds** - Add rounds with valuations and investment amounts
4. **Grant employee options** - Allocate options from the pool
5. **Create exit scenarios** - Model different exit valuations
6. **Export report** - Generate PDF with cap table, charts, and timeline

### Keyboard Shortcuts

- `Cmd/Ctrl + S` - Save current state
- `Cmd/Ctrl + Z` - Undo
- `Cmd/Ctrl + Shift + Z` - Redo
- `Cmd/Ctrl + K` - Quick command menu

## Calculations

All calculations are performed client-side using industry-standard formulas:

- **Post-money valuation** = Pre-money + Investment
- **Dilution %** = New shares / Total shares after
- **Vesting** = (Months since grant - Cliff) / Total months × Total shares
- **Waterfall** = Apply liquidation preferences, then distribute remaining proceeds

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Disclaimer

This calculator is an **educational tool** for planning and modeling purposes only. It does not constitute legal, financial, or tax advice. Always consult with qualified professionals before making equity decisions or signing agreements. Calculations are estimates and may not reflect all complexities of your specific situation.

## License

MIT License - see LICENSE file for details

## Acknowledgments

- Built with [Vite](https://vitejs.dev/)
- UI components from [Shadcn UI](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Inspired by the needs of first-time founders navigating equity decisions

## Support

For questions, issues, or feature requests, please open an issue on GitHub.

---

Made with ❤️ for founders

