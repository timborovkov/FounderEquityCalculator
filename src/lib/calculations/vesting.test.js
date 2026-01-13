import { describe, it, expect } from 'vitest'
import { subMonths, addMonths } from 'date-fns'
import { calculateVestedShares } from './vesting'

describe('vesting calculations', () => {
  const now = new Date('2024-01-01')
  const totalShares = 1000000

  describe('calculateVestedShares', () => {
    it('should return 0 shares before cliff', () => {
      const grantDate = subMonths(now, 6)
      const result = calculateVestedShares(grantDate, now, totalShares, 12, 48)

      expect(result.vestedShares).toBe(0)
      expect(result.unvestedShares).toBe(totalShares)
      expect(result.percentVested).toBe(0)
    })

    it('should vest proportionally after cliff', () => {
      const grantDate = subMonths(now, 24)
      const result = calculateVestedShares(grantDate, now, totalShares, 12, 48)

      // Should vest approximately 50% after 24 months
      expect(result.vestedShares).toBeGreaterThan(400000)
      expect(result.vestedShares).toBeLessThan(600000)
    })

    it('should cap at 100% vested', () => {
      const grantDate = subMonths(now, 60)
      const result = calculateVestedShares(grantDate, now, totalShares, 12, 48)

      expect(result.vestedShares).toBe(totalShares)
      expect(result.percentVested).toBe(100)
    })

    it('should handle grant date in the future', () => {
      const grantDate = addMonths(now, 6)
      const result = calculateVestedShares(grantDate, now, totalShares, 12, 48)

      expect(result.vestedShares).toBe(0)
      expect(result.percentVested).toBe(0)
    })
  })
})
