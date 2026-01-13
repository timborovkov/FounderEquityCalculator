import { describe, it, expect } from 'vitest'
import {
  calculateRoundDilution,
  calculateCurrentOwnership,
  calculateTotalDilution,
} from './dilution'

describe('dilution calculations', () => {
  describe('calculateRoundDilution', () => {
    it('should calculate correct dilution for a funding round', () => {
      const result = calculateRoundDilution(8000000, 2000000, 10000000)

      expect(result.postMoneyValuation).toBe(10000000)
      expect(result.pricePerShare).toBe(0.8)
      expect(result.newShares).toBe(2500000)
      expect(result.totalSharesAfter).toBe(12500000)
      expect(result.dilutionPercentage).toBe(20)
    })

    it('should handle zero investment', () => {
      const result = calculateRoundDilution(10000000, 0, 10000000)

      expect(result.postMoneyValuation).toBe(10000000)
      expect(result.newShares).toBe(0)
      expect(result.dilutionPercentage).toBe(0)
    })

    it('should calculate high dilution rounds correctly', () => {
      const result = calculateRoundDilution(5000000, 5000000, 10000000)

      expect(result.postMoneyValuation).toBe(10000000)
      expect(result.dilutionPercentage).toBe(50)
    })
  })

  describe('calculateTotalDilution', () => {
    it('should return 0 for no rounds', () => {
      const totalDilution = calculateTotalDilution([])
      expect(totalDilution).toBe(0)
    })

    it('should calculate dilution for single round', () => {
      const rounds = [{ dilutionPercentage: 20 }]

      const totalDilution = calculateTotalDilution(rounds)
      expect(totalDilution).toBe(20)
    })
  })

  describe('calculateCurrentOwnership', () => {
    it('should calculate ownership for founders only', () => {
      const founders = [
        { id: '1', name: 'Founder 1', equity: 50 },
        { id: '2', name: 'Founder 2', equity: 50 },
      ]

      const result = calculateCurrentOwnership(founders, [], [])

      expect(result.stakeholders).toHaveLength(2)
      expect(result.stakeholders[0].ownership).toBeCloseTo(50, 0)
      expect(result.stakeholders[1].ownership).toBeCloseTo(50, 0)
    })

    it('should calculate ownership with funding rounds', () => {
      const founders = [
        { id: '1', name: 'Founder 1', equity: 50 },
        { id: '2', name: 'Founder 2', equity: 50 },
      ]

      const rounds = [
        {
          id: 'r1',
          investment: 2000000,
          preMoneyValuation: 8000000,
          postMoneyValuation: 10000000,
          leadInvestors: ['VC Fund'],
        },
      ]

      const result = calculateCurrentOwnership(founders, rounds, [])

      // Should have 2 founders + 1 investor
      expect(result.stakeholders.filter(s => s.type === 'founder')).toHaveLength(2)
      expect(result.stakeholders.filter(s => s.type === 'investor')).toHaveLength(1)

      // Total ownership should sum to close to 100% (allowing for rounding)
      const totalOwnership = result.stakeholders.reduce((sum, s) => sum + s.ownership, 0)
      expect(totalOwnership).toBeGreaterThan(80)
      expect(totalOwnership).toBeLessThan(120)
    })
  })
})
