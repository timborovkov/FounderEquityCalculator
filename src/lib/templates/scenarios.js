import { subMonths } from 'date-fns'

/**
 * Pre-configured template scenarios for quick start
 * Each template includes company info, founders, rounds, employees, and option pool
 */

const now = new Date()

export const TEMPLATES = {
  'yc-standard': {
    name: 'YC Standard Deal',
    description: 'Standard Y Combinator investment structure with 2 co-founders',
    data: {
      company: {
        name: 'My Startup',
        foundedDate: subMonths(now, 18),
        currentDate: now,
      },
      founders: [
        {
          id: 'f1',
          name: 'Founder 1 (CEO)',
          equity: 50,
          vestingStart: subMonths(now, 18),
          cliffMonths: 12,
          vestingMonths: 48,
          contributionWeights: {
            idea: 40,
            execution: 35,
            capital: 25,
          },
          departed: false,
        },
        {
          id: 'f2',
          name: 'Founder 2 (CTO)',
          equity: 50,
          vestingStart: subMonths(now, 18),
          cliffMonths: 12,
          vestingMonths: 48,
          contributionWeights: {
            idea: 30,
            execution: 45,
            capital: 25,
          },
          departed: false,
        },
      ],
      rounds: [
        {
          id: 'r1',
          date: subMonths(now, 6),
          type: 'pre-seed',
          preMoneyValuation: 5000000,
          investment: 500000,
          postMoneyValuation: 5500000,
          leadInvestors: ['Y Combinator'],
          liquidationPreference: 1,
          participating: false,
          proRataRights: true,
        },
      ],
      employees: [
        {
          id: 'e1',
          name: 'First Engineer',
          role: 'Senior Engineer',
          optionsGranted: 50000,
          grantDate: subMonths(now, 3),
          strikePrice: 0.11,
          vestingMonths: 48,
          cliffMonths: 12,
        },
      ],
      optionPool: {
        size: 1000000,
        allocated: 50000,
      },
      scenarios: [],
    },
  },

  'series-a': {
    name: 'Typical Series A',
    description: 'Company that has raised pre-seed, seed, and Series A',
    data: {
      company: {
        name: 'My Startup',
        foundedDate: subMonths(now, 36),
        currentDate: now,
      },
      founders: [
        {
          id: 'f1',
          name: 'Founder 1 (CEO)',
          equity: 40,
          vestingStart: subMonths(now, 36),
          cliffMonths: 12,
          vestingMonths: 48,
          contributionWeights: {
            idea: 45,
            execution: 35,
            capital: 20,
          },
          departed: false,
        },
        {
          id: 'f2',
          name: 'Founder 2 (CTO)',
          equity: 35,
          vestingStart: subMonths(now, 36),
          cliffMonths: 12,
          vestingMonths: 48,
          contributionWeights: {
            idea: 30,
            execution: 50,
            capital: 20,
          },
          departed: false,
        },
        {
          id: 'f3',
          name: 'Founder 3 (CPO)',
          equity: 25,
          vestingStart: subMonths(now, 32),
          cliffMonths: 12,
          vestingMonths: 48,
          contributionWeights: {
            idea: 25,
            execution: 40,
            capital: 35,
          },
          departed: false,
        },
      ],
      rounds: [
        {
          id: 'r1',
          date: subMonths(now, 30),
          type: 'pre-seed',
          preMoneyValuation: 3000000,
          investment: 500000,
          postMoneyValuation: 3500000,
          leadInvestors: ['Angel Investor Group'],
          liquidationPreference: 1,
          participating: false,
          proRataRights: true,
        },
        {
          id: 'r2',
          date: subMonths(now, 18),
          type: 'seed',
          preMoneyValuation: 8000000,
          investment: 2000000,
          postMoneyValuation: 10000000,
          leadInvestors: ['Seed Fund A', 'Seed Fund B'],
          liquidationPreference: 1,
          participating: false,
          proRataRights: true,
        },
        {
          id: 'r3',
          date: subMonths(now, 6),
          type: 'series-a',
          preMoneyValuation: 25000000,
          investment: 10000000,
          postMoneyValuation: 35000000,
          leadInvestors: ['Venture Capital Fund'],
          liquidationPreference: 1,
          participating: false,
          proRataRights: true,
        },
      ],
      employees: [
        {
          id: 'e1',
          name: 'VP Engineering',
          role: 'VP Engineering',
          optionsGranted: 150000,
          grantDate: subMonths(now, 20),
          strikePrice: 0.8,
          vestingMonths: 48,
          cliffMonths: 12,
        },
        {
          id: 'e2',
          name: 'Senior Engineer 1',
          role: 'Senior Engineer',
          optionsGranted: 75000,
          grantDate: subMonths(now, 15),
          strikePrice: 0.8,
          vestingMonths: 48,
          cliffMonths: 12,
        },
        {
          id: 'e3',
          name: 'Senior Engineer 2',
          role: 'Senior Engineer',
          optionsGranted: 75000,
          grantDate: subMonths(now, 12),
          strikePrice: 1.0,
          vestingMonths: 48,
          cliffMonths: 12,
        },
        {
          id: 'e4',
          name: 'Product Designer',
          role: 'Senior Designer',
          optionsGranted: 50000,
          grantDate: subMonths(now, 10),
          strikePrice: 1.0,
          vestingMonths: 48,
          cliffMonths: 12,
        },
      ],
      optionPool: {
        size: 2500000,
        allocated: 350000,
      },
      scenarios: [
        {
          id: 's1',
          name: 'Conservative Exit',
          exitValuation: 100000000,
        },
        {
          id: 's2',
          name: 'Good Exit',
          exitValuation: 200000000,
        },
      ],
    },
  },

  bootstrap: {
    name: 'Bootstrap to Profitability',
    description: 'Self-funded company growing without external investment',
    data: {
      company: {
        name: 'My Startup',
        foundedDate: subMonths(now, 24),
        currentDate: now,
      },
      founders: [
        {
          id: 'f1',
          name: 'Founder 1',
          equity: 55,
          vestingStart: subMonths(now, 24),
          cliffMonths: 0,
          vestingMonths: 48,
          contributionWeights: {
            idea: 50,
            execution: 30,
            capital: 20,
          },
          departed: false,
        },
        {
          id: 'f2',
          name: 'Founder 2',
          equity: 45,
          vestingStart: subMonths(now, 24),
          cliffMonths: 0,
          vestingMonths: 48,
          contributionWeights: {
            idea: 30,
            execution: 50,
            capital: 20,
          },
          departed: false,
        },
      ],
      rounds: [],
      employees: [
        {
          id: 'e1',
          name: 'First Employee',
          role: 'Full Stack Engineer',
          optionsGranted: 100000,
          grantDate: subMonths(now, 12),
          strikePrice: 0.01,
          vestingMonths: 48,
          cliffMonths: 12,
        },
        {
          id: 'e2',
          name: 'Second Employee',
          role: 'Product Manager',
          optionsGranted: 75000,
          grantDate: subMonths(now, 8),
          strikePrice: 0.01,
          vestingMonths: 48,
          cliffMonths: 12,
        },
      ],
      optionPool: {
        size: 1500000,
        allocated: 175000,
      },
      scenarios: [
        {
          id: 's1',
          name: 'Acquisition',
          exitValuation: 50000000,
        },
      ],
    },
  },

  'hardware-startup': {
    name: 'Hardware Startup Path',
    description: 'Capital-intensive hardware startup with multiple rounds',
    data: {
      company: {
        name: 'My Startup',
        foundedDate: subMonths(now, 48),
        currentDate: now,
      },
      founders: [
        {
          id: 'f1',
          name: 'Founder 1 (CEO)',
          equity: 35,
          vestingStart: subMonths(now, 48),
          cliffMonths: 12,
          vestingMonths: 48,
          contributionWeights: {
            idea: 50,
            execution: 30,
            capital: 20,
          },
          departed: false,
        },
        {
          id: 'f2',
          name: 'Founder 2 (CTO)',
          equity: 35,
          vestingStart: subMonths(now, 48),
          cliffMonths: 12,
          vestingMonths: 48,
          contributionWeights: {
            idea: 30,
            execution: 50,
            capital: 20,
          },
          departed: false,
        },
        {
          id: 'f3',
          name: 'Founder 3 (COO)',
          equity: 30,
          vestingStart: subMonths(now, 44),
          cliffMonths: 12,
          vestingMonths: 48,
          contributionWeights: {
            idea: 20,
            execution: 40,
            capital: 40,
          },
          departed: false,
        },
      ],
      rounds: [
        {
          id: 'r1',
          date: subMonths(now, 42),
          type: 'pre-seed',
          preMoneyValuation: 4000000,
          investment: 1000000,
          postMoneyValuation: 5000000,
          leadInvestors: ['Hardware Fund'],
          liquidationPreference: 1.5,
          participating: false,
          proRataRights: true,
        },
        {
          id: 'r2',
          date: subMonths(now, 30),
          type: 'seed',
          preMoneyValuation: 12000000,
          investment: 3000000,
          postMoneyValuation: 15000000,
          leadInvestors: ['Deep Tech Ventures'],
          liquidationPreference: 1,
          participating: true,
          proRataRights: true,
        },
        {
          id: 'r3',
          date: subMonths(now, 18),
          type: 'series-a',
          preMoneyValuation: 35000000,
          investment: 15000000,
          postMoneyValuation: 50000000,
          leadInvestors: ['Industrial Growth Partners'],
          liquidationPreference: 1,
          participating: false,
          proRataRights: true,
        },
        {
          id: 'r4',
          date: subMonths(now, 6),
          type: 'series-b',
          preMoneyValuation: 100000000,
          investment: 30000000,
          postMoneyValuation: 130000000,
          leadInvestors: ['Late Stage Capital'],
          liquidationPreference: 1,
          participating: false,
          proRataRights: true,
        },
      ],
      employees: [
        {
          id: 'e1',
          name: 'VP Engineering',
          role: 'VP Engineering',
          optionsGranted: 200000,
          grantDate: subMonths(now, 32),
          strikePrice: 1.2,
          vestingMonths: 48,
          cliffMonths: 12,
        },
        {
          id: 'e2',
          name: 'VP Operations',
          role: 'VP Operations',
          optionsGranted: 150000,
          grantDate: subMonths(now, 28),
          strikePrice: 1.2,
          vestingMonths: 48,
          cliffMonths: 12,
        },
        {
          id: 'e3',
          name: 'Hardware Engineer',
          role: 'Senior Engineer',
          optionsGranted: 100000,
          grantDate: subMonths(now, 24),
          strikePrice: 1.5,
          vestingMonths: 48,
          cliffMonths: 12,
        },
        {
          id: 'e4',
          name: 'Supply Chain Lead',
          role: 'Director',
          optionsGranted: 80000,
          grantDate: subMonths(now, 20),
          strikePrice: 2.0,
          vestingMonths: 48,
          cliffMonths: 12,
        },
        {
          id: 'e5',
          name: 'Manufacturing Lead',
          role: 'Director',
          optionsGranted: 80000,
          grantDate: subMonths(now, 16),
          strikePrice: 2.0,
          vestingMonths: 48,
          cliffMonths: 12,
        },
      ],
      optionPool: {
        size: 3500000,
        allocated: 610000,
      },
      scenarios: [
        {
          id: 's1',
          name: 'IPO Scenario',
          exitValuation: 500000000,
        },
        {
          id: 's2',
          name: 'Strategic Acquisition',
          exitValuation: 300000000,
        },
      ],
    },
  },
}

/**
 * Get all available templates
 */
export function getTemplates() {
  return Object.entries(TEMPLATES).map(([key, template]) => ({
    key,
    name: template.name,
    description: template.description,
  }))
}

/**
 * Load a template by key
 */
export function loadTemplate(key) {
  const template = TEMPLATES[key]
  if (!template) {
    throw new Error(`Template "${key}" not found`)
  }
  return template.data
}
