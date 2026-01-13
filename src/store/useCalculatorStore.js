import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { produce } from 'immer'

// Initial state
const initialState = {
  company: {
    name: '',
    foundedDate: new Date(),
    currentDate: new Date()
  },
  founders: [],
  rounds: [],
  employees: [],
  optionPool: {
    size: 10,
    allocated: 0
  },
  scenarios: [],
  settings: {
    theme: 'light',
    autoSave: true
  },
  history: {
    past: [],
    future: []
  }
}

const useCalculatorStore = create(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Company Actions
        setCompanyInfo: (info) =>
          set(
            produce((state) => {
              state.company = { ...state.company, ...info }
            }),
            false,
            'setCompanyInfo'
          ),

        // Founder Actions
        addFounder: (founder) =>
          set(
            produce((state) => {
              state.founders.push({
                id: crypto.randomUUID(),
                name: '',
                equity: 0,
                vestingStart: new Date(),
                cliffMonths: 12,
                vestingMonths: 48,
                contributionWeights: {
                  idea: 0,
                  execution: 0,
                  capital: 0
                },
                departed: false,
                ...founder
              })
            }),
            false,
            'addFounder'
          ),

        updateFounder: (id, updates) =>
          set(
            produce((state) => {
              const index = state.founders.findIndex((f) => f.id === id)
              if (index !== -1) {
                state.founders[index] = { ...state.founders[index], ...updates }
              }
            }),
            false,
            'updateFounder'
          ),

        removeFounder: (id) =>
          set(
            produce((state) => {
              state.founders = state.founders.filter((f) => f.id !== id)
            }),
            false,
            'removeFounder'
          ),

        markFounderDeparted: (id, departureDate) =>
          set(
            produce((state) => {
              const index = state.founders.findIndex((f) => f.id === id)
              if (index !== -1) {
                state.founders[index].departed = true
                state.founders[index].departureDate = departureDate
              }
            }),
            false,
            'markFounderDeparted'
          ),

        // Round Actions
        addRound: (round) =>
          set(
            produce((state) => {
              state.rounds.push({
                id: crypto.randomUUID(),
                date: new Date(),
                type: 'seed',
                preMoneyValuation: 0,
                investment: 0,
                postMoneyValuation: 0,
                leadInvestors: [],
                liquidationPreference: 1,
                participating: false,
                proRataRights: false,
                ...round
              })
              // Sort rounds by date
              state.rounds.sort((a, b) => new Date(a.date) - new Date(b.date))
            }),
            false,
            'addRound'
          ),

        updateRound: (id, updates) =>
          set(
            produce((state) => {
              const index = state.rounds.findIndex((r) => r.id === id)
              if (index !== -1) {
                state.rounds[index] = { ...state.rounds[index], ...updates }
                // Recalculate post-money if pre-money or investment changed
                if (updates.preMoneyValuation !== undefined || updates.investment !== undefined) {
                  const round = state.rounds[index]
                  round.postMoneyValuation = round.preMoneyValuation + round.investment
                }
                // Re-sort after update
                state.rounds.sort((a, b) => new Date(a.date) - new Date(b.date))
              }
            }),
            false,
            'updateRound'
          ),

        removeRound: (id) =>
          set(
            produce((state) => {
              state.rounds = state.rounds.filter((r) => r.id !== id)
            }),
            false,
            'removeRound'
          ),

        // Employee Actions
        addEmployee: (employee) =>
          set(
            produce((state) => {
              state.employees.push({
                id: crypto.randomUUID(),
                name: '',
                role: '',
                optionsGranted: 0,
                grantDate: new Date(),
                strikePrice: 0,
                vestingMonths: 48,
                cliffMonths: 12,
                ...employee
              })
              // Update option pool allocation
              state.optionPool.allocated = state.employees.reduce(
                (sum, emp) => sum + emp.optionsGranted,
                0
              )
            }),
            false,
            'addEmployee'
          ),

        updateEmployee: (id, updates) =>
          set(
            produce((state) => {
              const index = state.employees.findIndex((e) => e.id === id)
              if (index !== -1) {
                state.employees[index] = { ...state.employees[index], ...updates }
                // Update option pool allocation
                state.optionPool.allocated = state.employees.reduce(
                  (sum, emp) => sum + emp.optionsGranted,
                  0
                )
              }
            }),
            false,
            'updateEmployee'
          ),

        removeEmployee: (id) =>
          set(
            produce((state) => {
              state.employees = state.employees.filter((e) => e.id !== id)
              // Update option pool allocation
              state.optionPool.allocated = state.employees.reduce(
                (sum, emp) => sum + emp.optionsGranted,
                0
              )
            }),
            false,
            'removeEmployee'
          ),

        // Option Pool Actions
        setOptionPool: (pool) =>
          set(
            produce((state) => {
              state.optionPool = { ...state.optionPool, ...pool }
            }),
            false,
            'setOptionPool'
          ),

        // Scenario Actions
        addScenario: (scenario) =>
          set(
            produce((state) => {
              state.scenarios.push({
                id: crypto.randomUUID(),
                name: '',
                exitValuation: 0,
                calculations: null,
                ...scenario
              })
            }),
            false,
            'addScenario'
          ),

        updateScenario: (id, updates) =>
          set(
            produce((state) => {
              const index = state.scenarios.findIndex((s) => s.id === id)
              if (index !== -1) {
                state.scenarios[index] = { ...state.scenarios[index], ...updates }
              }
            }),
            false,
            'updateScenario'
          ),

        removeScenario: (id) =>
          set(
            produce((state) => {
              state.scenarios = state.scenarios.filter((s) => s.id !== id)
            }),
            false,
            'removeScenario'
          ),

        // Settings Actions
        setTheme: (theme) =>
          set(
            produce((state) => {
              state.settings.theme = theme
            }),
            false,
            'setTheme'
          ),

        toggleAutoSave: () =>
          set(
            produce((state) => {
              state.settings.autoSave = !state.settings.autoSave
            }),
            false,
            'toggleAutoSave'
          ),

        // History Actions (Undo/Redo)
        saveToHistory: () => {
          const state = get()
          set(
            produce((draft) => {
              draft.history.past.push({
                company: state.company,
                founders: state.founders,
                rounds: state.rounds,
                employees: state.employees,
                optionPool: state.optionPool,
                scenarios: state.scenarios
              })
              draft.history.future = []
            }),
            false,
            'saveToHistory'
          )
        },

        undo: () => {
          const state = get()
          if (state.history.past.length === 0) return

          set(
            produce((draft) => {
              const previous = draft.history.past.pop()
              draft.history.future.push({
                company: state.company,
                founders: state.founders,
                rounds: state.rounds,
                employees: state.employees,
                optionPool: state.optionPool,
                scenarios: state.scenarios
              })
              Object.assign(draft, previous)
            }),
            false,
            'undo'
          )
        },

        redo: () => {
          const state = get()
          if (state.history.future.length === 0) return

          set(
            produce((draft) => {
              const next = draft.history.future.pop()
              draft.history.past.push({
                company: state.company,
                founders: state.founders,
                rounds: state.rounds,
                employees: state.employees,
                optionPool: state.optionPool,
                scenarios: state.scenarios
              })
              Object.assign(draft, next)
            }),
            false,
            'redo'
          )
        },

        // Utility Actions
        reset: () => set(initialState, false, 'reset'),

        loadData: (data) =>
          set(
            produce((state) => {
              Object.assign(state, data)
            }),
            false,
            'loadData'
          ),

        // Template Actions
        loadTemplate: (template) =>
          set(
            produce((state) => {
              Object.assign(state, { ...initialState, ...template })
            }),
            false,
            'loadTemplate'
          ),
      }),
      {
        name: 'equity-calculator-storage',
        partialize: (state) => ({
          company: state.company,
          founders: state.founders,
          rounds: state.rounds,
          employees: state.employees,
          optionPool: state.optionPool,
          scenarios: state.scenarios,
          settings: state.settings
        })
      }
    )
  )
)

export default useCalculatorStore
