import { describe, it, expect } from 'vitest'
import { calculateLiquidationWaterfall, calculateMOIC } from './waterfall'

describe('waterfall calculations', () => {
  describe('calculateMOIC', () => {
    it('should calculate multiple on invested capital correctly', () => {
      const moic = calculateMOIC(5000000, 1000000)
      expect(moic).toBe(5)
    })

    it('should handle 1x return', () => {
      const moic = calculateMOIC(1000000, 1000000)
      expect(moic).toBe(1)
    })

    it('should handle losses', () => {
      const moic = calculateMOIC(500000, 1000000)
      expect(moic).toBe(0.5)
    })

    it('should handle zero investment', () => {
      const moic = calculateMOIC(1000000, 0)
      expect(moic).toBe(0)
    })
  })

  describe('calculateLiquidationWaterfall', () => {
    it('should distribute proceeds with 1x non-participating preference', () => {
      const exitValuation = 50000000
      const stakeholders = [
        { name: 'Founder 1', type: 'founder', ownership: 40, shares: 4000000 },
        { name: 'Founder 2', type: 'founder', ownership: 40, shares: 4000000 },
        { name: 'Series A', type: 'investor', ownership: 20, shares: 2000000 },
      ]
      const rounds = [
        {
          leadInvestors: ['Series A'],
          investment: 10000000,
          liquidationPreference: 1,
          participating: false,
        },
      ]

      const result = calculateLiquidationWaterfall(exitValuation, stakeholders, rounds)

      expect(result.totalDistributed).toBeLessThanOrEqual(exitValuation)
      expect(result.stakeholderTotals).toHaveLength(3)

      // Investor should get their preference first
      const investor = result.stakeholderTotals.find(s => s.type === 'investor')
      expect(investor.total).toBeGreaterThanOrEqual(10000000)
    })

    it('should handle participating preferred', () => {
      const exitValuation = 100000000
      const stakeholders = [
        { name: 'Founder', type: 'founder', ownership: 80, shares: 8000000 },
        { name: 'Investor', type: 'investor', ownership: 20, shares: 2000000 },
      ]
      const rounds = [
        {
          leadInvestors: ['Investor'],
          investment: 10000000,
          liquidationPreference: 1,
          participating: true,
        },
      ]

      const result = calculateLiquidationWaterfall(exitValuation, stakeholders, rounds)

      // Investor should get preference + pro-rata share
      const investor = result.stakeholderTotals.find(s => s.type === 'investor')
      expect(investor.total).toBeGreaterThan(10000000)
    })

    it('should handle 2x liquidation preference', () => {
      const exitValuation = 30000000
      const stakeholders = [
        { name: 'Founder', type: 'founder', ownership: 70, shares: 7000000 },
        { name: 'Investor', type: 'investor', ownership: 30, shares: 3000000 },
      ]
      const rounds = [
        {
          leadInvestors: ['Investor'],
          investment: 10000000,
          liquidationPreference: 2,
          participating: false,
        },
      ]

      const result = calculateLiquidationWaterfall(exitValuation, stakeholders, rounds)

      // Investor should get 2x their money (20M) before founders get anything
      const investor = result.stakeholderTotals.find(s => s.type === 'investor')
      expect(investor.total).toBeGreaterThanOrEqual(20000000)
    })

    it('should handle exit below liquidation preference', () => {
      const exitValuation = 5000000
      const stakeholders = [
        { name: 'Founder', type: 'founder', ownership: 70, shares: 7000000 },
        { name: 'Investor', type: 'investor', ownership: 30, shares: 3000000 },
      ]
      const rounds = [
        {
          leadInvestors: ['Investor'],
          investment: 10000000,
          liquidationPreference: 1,
          participating: false,
        },
      ]

      const result = calculateLiquidationWaterfall(exitValuation, stakeholders, rounds)

      // All proceeds should go to investor
      const investor = result.stakeholderTotals.find(s => s.type === 'investor')
      expect(investor).toBeDefined()
      expect(investor.total).toBe(exitValuation)

      // Founder should get nothing or minimal amount
      const founder = result.stakeholderTotals.find(s => s.type === 'founder')
      if (founder) {
        expect(founder.total).toBe(0)
      }
    })
  })
})
