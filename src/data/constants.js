// Funding round types
export const ROUND_TYPES = [
  { value: 'pre-seed', label: 'Pre-Seed', color: '#10b981' },
  { value: 'seed', label: 'Seed', color: '#3b82f6' },
  { value: 'series-a', label: 'Series A', color: '#8b5cf6' },
  { value: 'series-b', label: 'Series B', color: '#ec4899' },
  { value: 'series-c', label: 'Series C', color: '#f59e0b' },
  { value: 'series-d', label: 'Series D', color: '#ef4444' },
]

// Liquidation preference options
export const LIQUIDATION_PREFERENCES = [
  { value: 1, label: '1x' },
  { value: 2, label: '2x' },
  { value: 3, label: '3x' },
]

// Vesting schedule defaults
export const DEFAULT_VESTING = {
  cliffMonths: 12, // 1 year cliff
  vestingMonths: 48, // 4 year vesting
}

// Option pool defaults
export const DEFAULT_OPTION_POOL = {
  size: 10, // 10% of fully diluted
  allocated: 0,
}

// Contribution weight categories
export const CONTRIBUTION_CATEGORIES = [
  { value: 'idea', label: 'Idea', default: 0.2 },
  { value: 'execution', label: 'Execution', default: 0.5 },
  { value: 'capital', label: 'Capital', default: 0.3 },
]

// Exit scenario templates
export const EXIT_SCENARIOS = [
  { value: 'modest', label: 'Modest Exit', multiplier: 2 },
  { value: 'good', label: 'Good Exit', multiplier: 5 },
  { value: 'great', label: 'Great Exit', multiplier: 10 },
  { value: 'unicorn', label: 'Unicorn Exit', multiplier: 20 },
]

// Validation limits
export const VALIDATION = {
  maxEquityPercentage: 100,
  minEquityPercentage: 0,
  maxDilutionWarning: 40, // Warn if single round dilutes by >40%
  minOptionPoolWarning: 10, // Warn if option pool <10%
  maxFounders: 10,
  maxRounds: 20,
  maxEmployees: 1000,
}
