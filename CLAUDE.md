# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
npm run dev          # Start dev server at http://localhost:5173
npm run build        # Production build to dist/
npm run lint         # ESLint (fails on warnings)

npm test             # Run unit tests with Vitest
npm test:ui          # Interactive test UI
npm test:coverage    # Generate coverage reports

npm run test:e2e     # Playwright E2E tests
npm run test:e2e:ui  # Interactive E2E debugging
```

## Architecture Overview

This is a React 18 + Vite application for startup equity planning with Zustand state management.

### Core Data Flow

```
useCalculatorStore (Zustand) ──► Calculator Components ──► UI
        │                              │
        │                              ▼
        │                    lib/calculations/
        │                    (equity, dilution, vesting, valuation, waterfall)
        │
        ▼
localStorage persistence + URL sharing (LZ-string compression)
```

### Key Directories

- `src/store/useCalculatorStore.js` - Central Zustand store with history (undo/redo), auto-persistence to localStorage
- `src/lib/calculations/` - Pure functions for equity math: `equity.js`, `dilution.js`, `vesting.js`, `valuation.js`, `waterfall.js`
- `src/lib/utils/validation.js` - Smart validation rules for equity splits, vesting, funding rounds
- `src/components/calculator/` - Main calculator UI (Timeline, FoundersSection, FundingRounds, CapTable, ExitScenarios)
- `src/components/ui/` - Shadcn UI primitives (do not modify directly)

### State Structure

The store manages: `company`, `founders`, `rounds`, `employees`, `optionPool`, `scenarios`, `settings`, plus `history` for undo/redo.

### Routing

- `/` - Landing page
- `/calculator` - Main app (supports `?share=` parameter for URL-based state loading)

## Code Conventions

- Path alias: `@` maps to `./src` (configured in vite.config.js and jsconfig.json)
- Tests colocated with source: `filename.test.js`
- Prettier: no semicolons, single quotes, 2-space indent, 100 char width
- Components use hooks + Zustand, no class components

## Testing

Unit tests in Vitest cover calculation logic. E2E tests in Playwright cover user workflows. Run both before submitting changes:

```bash
npm test && npm run test:e2e
```
