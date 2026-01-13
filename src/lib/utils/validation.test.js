import { describe, it, expect } from 'vitest'
import {
  checkExcessiveDilution,
  checkOptionPool,
  checkFounderSplit,
  checkVestingSchedule,
  checkLiquidationPreference,
  validateCompanyData,
} from './validation'

describe('validation utilities', () => {
  describe('checkExcessiveDilution', () => {
    it('should warn about dilution over 40%', () => {
      const result = checkExcessiveDilution(45)

      expect(result).not.toBeNull()
      expect(result.severity).toBe('high')
      expect(result.message).toContain('45')
    })

    it('should warn about dilution over 30%', () => {
      const result = checkExcessiveDilution(35)

      expect(result).not.toBeNull()
      expect(result.severity).toBe('medium')
    })

    it('should not warn for normal dilution', () => {
      const result = checkExcessiveDilution(20)
      expect(result).toBeNull()
    })
  })

  describe('checkOptionPool', () => {
    it('should warn about small option pools', () => {
      const result = checkOptionPool(500000, 100000)

      expect(result).not.toBeNull()
      expect(result.severity).toBe('medium')
    })

    it('should warn about highly utilized pools', () => {
      const result = checkOptionPool(1000000, 950000)

      expect(result).not.toBeNull()
      expect(result.severity).toBe('high')
      expect(result.message).toContain('95')
    })

    it('should provide info for pools over 75% utilized', () => {
      const result = checkOptionPool(1000000, 800000)

      expect(result).not.toBeNull()
      expect(result.severity).toBe('low')
    })

    it('should not warn for healthy pools', () => {
      const result = checkOptionPool(2000000, 500000)
      expect(result).toBeNull()
    })
  })

  describe('checkFounderSplit', () => {
    it('should warn about large disparities with 2 founders', () => {
      const founders = [{ equity: 70 }, { equity: 30 }]

      const result = checkFounderSplit(founders)

      expect(result).not.toBeNull()
      expect(result.severity).toBe('medium')
    })

    it('should warn about overwhelming majority', () => {
      const founders = [{ equity: 65 }, { equity: 20 }, { equity: 15 }]

      const result = checkFounderSplit(founders)

      expect(result).not.toBeNull()
      expect(result.message).toContain('65')
    })

    it('should not warn for balanced splits', () => {
      const founders = [{ equity: 50 }, { equity: 50 }]

      const result = checkFounderSplit(founders)
      expect(result).toBeNull()
    })

    it('should handle empty founders array', () => {
      const result = checkFounderSplit([])
      expect(result).toBeNull()
    })
  })

  describe('checkVestingSchedule', () => {
    it('should warn about short vesting periods', () => {
      const result = checkVestingSchedule(12, 24)

      expect(result).not.toBeNull()
      expect(result.severity).toBe('medium')
    })

    it('should provide info about no cliff', () => {
      const result = checkVestingSchedule(0, 48)

      expect(result).not.toBeNull()
      expect(result.severity).toBe('low')
    })

    it('should provide info about long cliff', () => {
      const result = checkVestingSchedule(18, 48)

      expect(result).not.toBeNull()
      expect(result.message).toContain('18')
    })

    it('should not warn for standard schedule', () => {
      const result = checkVestingSchedule(12, 48)
      expect(result).toBeNull()
    })
  })

  describe('checkLiquidationPreference', () => {
    it('should warn about participating preferred with >1x', () => {
      const result = checkLiquidationPreference(2, true)

      expect(result).not.toBeNull()
      expect(result.severity).toBe('high')
    })

    it('should warn about very high multiples', () => {
      const result = checkLiquidationPreference(3, false)

      expect(result).not.toBeNull()
      expect(result.severity).toBe('high')
    })

    it('should provide info about participating preferred', () => {
      const result = checkLiquidationPreference(1, true)

      expect(result).not.toBeNull()
      expect(result.severity).toBe('low')
    })

    it('should not warn for standard 1x non-participating', () => {
      const result = checkLiquidationPreference(1, false)
      expect(result).toBeNull()
    })
  })

  describe('validateCompanyData', () => {
    it('should validate company name is required', () => {
      const errors = validateCompanyData({ name: '', foundedDate: new Date() })

      expect(errors).toHaveLength(1)
      expect(errors[0].field).toBe('company.name')
    })

    it('should validate founded date is required', () => {
      const errors = validateCompanyData({ name: 'Test Co', foundedDate: null })

      expect(errors).toHaveLength(1)
      expect(errors[0].field).toBe('company.foundedDate')
    })

    it('should return no errors for valid data', () => {
      const errors = validateCompanyData({ name: 'Test Co', foundedDate: new Date() })

      expect(errors).toHaveLength(0)
    })
  })
})
