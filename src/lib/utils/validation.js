/**
 * Validation utilities and smart warnings
 */

/**
 * Check for excessive dilution in a single round
 * @param {number} dilutionPercent - Dilution percentage from the round
 * @returns {Object} Warning object or null
 */
export function checkExcessiveDilution(dilutionPercent) {
  if (dilutionPercent > 40) {
    return {
      type: 'warning',
      severity: 'high',
      message: `This round dilutes existing shareholders by ${dilutionPercent.toFixed(1)}%. Dilution over 40% in a single round is unusually high and may indicate unfavorable terms.`,
      suggestion: 'Consider negotiating a higher valuation or smaller investment amount.'
    }
  } else if (dilutionPercent > 30) {
    return {
      type: 'warning',
      severity: 'medium',
      message: `This round dilutes existing shareholders by ${dilutionPercent.toFixed(1)}%. This is on the higher end of typical dilution.`,
      suggestion: 'Review your valuation and investment terms to ensure they align with market standards.'
    }
  }
  return null
}

/**
 * Check option pool size
 * @param {number} poolSize - Total option pool size
 * @param {number} allocated - Allocated options
 * @returns {Object} Warning object or null
 */
export function checkOptionPool(poolSize, allocated) {
  const available = poolSize - allocated
  const utilizationPercent = (allocated / poolSize) * 100

  if (poolSize < 1000000 && poolSize > 0) {
    return {
      type: 'warning',
      severity: 'medium',
      message: 'Your option pool seems small. A typical early-stage startup reserves 10-20% of fully diluted shares for employees.',
      suggestion: 'Consider increasing your option pool to attract top talent.'
    }
  }

  if (utilizationPercent > 90) {
    return {
      type: 'warning',
      severity: 'high',
      message: `Your option pool is ${utilizationPercent.toFixed(0)}% utilized. You may not have enough options to make competitive offers.`,
      suggestion: 'Consider refreshing your option pool in your next funding round.'
    }
  }

  if (utilizationPercent > 75) {
    return {
      type: 'info',
      severity: 'low',
      message: `Your option pool is ${utilizationPercent.toFixed(0)}% utilized. Start planning for a refresh.`,
      suggestion: 'Discuss option pool expansion with your board and investors.'
    }
  }

  return null
}

/**
 * Check founder equity split for fairness
 * @param {Array} founders - Array of founder objects
 * @returns {Object} Warning object or null
 */
export function checkFounderSplit(founders) {
  if (founders.length === 0) return null

  const equities = founders.map(f => f.equity).sort((a, b) => b - a)

  if (founders.length === 2) {
    const diff = Math.abs(equities[0] - equities[1])
    if (diff > 30) {
      return {
        type: 'info',
        severity: 'medium',
        message: `There's a ${diff.toFixed(0)}% difference in equity between co-founders. Large disparities can cause tension.`,
        suggestion: 'Ensure equity splits reflect long-term contributions and commitment.'
      }
    }
  } else if (founders.length > 2) {
    // Check if one founder has overwhelming majority
    if (equities[0] > 60) {
      return {
        type: 'info',
        severity: 'low',
        message: `One founder holds ${equities[0].toFixed(0)}% equity. This is fine if intentional, but ensure all founders feel fairly compensated.`,
        suggestion: 'Use the contribution weighting tool to objectively assess equity splits.'
      }
    }
  }

  return null
}

/**
 * Check vesting schedule
 * @param {number} cliffMonths - Cliff period in months
 * @param {number} vestingMonths - Total vesting period in months
 * @returns {Object} Warning object or null
 */
export function checkVestingSchedule(cliffMonths, vestingMonths) {
  if (vestingMonths < 36) {
    return {
      type: 'warning',
      severity: 'medium',
      message: `Vesting period of ${vestingMonths} months is shorter than the typical 48 months.`,
      suggestion: 'Standard vesting is 4 years with a 1-year cliff. Shorter periods reduce long-term alignment.'
    }
  }

  if (cliffMonths === 0) {
    return {
      type: 'info',
      severity: 'low',
      message: 'No cliff period. Equity starts vesting immediately.',
      suggestion: 'A 12-month cliff is standard to ensure commitment before equity is earned.'
    }
  }

  if (cliffMonths > 12) {
    return {
      type: 'info',
      severity: 'low',
      message: `Cliff period of ${cliffMonths} months is longer than the standard 12 months.`,
      suggestion: 'Extended cliffs may make offers less competitive.'
    }
  }

  return null
}

/**
 * Check liquidation preference multiples
 * @param {number} multiple - Liquidation preference multiple (e.g., 1x, 2x)
 * @param {boolean} participating - Whether preferred stock is participating
 * @returns {Object} Warning object or null
 */
export function checkLiquidationPreference(multiple, participating) {
  if (multiple > 1 && participating) {
    return {
      type: 'warning',
      severity: 'high',
      message: `${multiple}x liquidation preference with participating preferred is very investor-favorable and rare.`,
      suggestion: 'This structure significantly reduces founder returns in exit scenarios. Seek legal counsel.'
    }
  }

  if (multiple > 2) {
    return {
      type: 'warning',
      severity: 'high',
      message: `${multiple}x liquidation preference is extremely high and very uncommon.`,
      suggestion: 'This is highly unfavorable to founders. Consider walking away or negotiating better terms.'
    }
  }

  if (multiple > 1) {
    return {
      type: 'info',
      severity: 'medium',
      message: `${multiple}x liquidation preference means investors get ${multiple}x their money back before others in an exit.`,
      suggestion: 'Understand how this impacts exit scenarios. Standard is 1x non-participating.'
    }
  }

  if (participating) {
    return {
      type: 'info',
      severity: 'low',
      message: 'Participating preferred means investors get their preference AND pro-rata share of remaining proceeds.',
      suggestion: 'This reduces founder returns. Non-participating is more founder-friendly.'
    }
  }

  return null
}

/**
 * Check cumulative founder dilution
 * @param {Array} founders - Array of founders with initial equity
 * @param {number} currentOwnership - Current ownership after rounds
 * @returns {Object} Warning object or null
 */
export function checkCumulativeDilution(initialEquity, currentEquity) {
  const totalDilution = ((initialEquity - currentEquity) / initialEquity) * 100

  if (totalDilution > 60) {
    return {
      type: 'warning',
      severity: 'high',
      message: `Founders have been diluted by ${totalDilution.toFixed(0)}%. Cumulative dilution over 60% is concerning.`,
      suggestion: 'Consider whether additional funding rounds are necessary or if alternative financing is available.'
    }
  } else if (totalDilution > 40) {
    return {
      type: 'info',
      severity: 'medium',
      message: `Founders have been diluted by ${totalDilution.toFixed(0)}%. This is typical after multiple rounds.`,
      suggestion: 'Ensure your ownership still provides meaningful upside in exit scenarios.'
    }
  }

  return null
}

/**
 * Validate company data completeness
 * @param {Object} company - Company object
 * @returns {Array} Array of validation errors
 */
export function validateCompanyData(company) {
  const errors = []

  if (!company.name || company.name.trim() === '') {
    errors.push({
      field: 'company.name',
      message: 'Company name is required'
    })
  }

  if (!company.foundedDate) {
    errors.push({
      field: 'company.foundedDate',
      message: 'Founded date is required'
    })
  }

  return errors
}

/**
 * Get all warnings for current state
 * @param {Object} store - Calculator store state
 * @returns {Array} Array of warning objects
 */
export function getAllWarnings(store) {
  const warnings = []

  // Check founder split
  const founderWarning = checkFounderSplit(store.founders)
  if (founderWarning) warnings.push({ source: 'founders', ...founderWarning })

  // Check option pool
  const poolWarning = checkOptionPool(store.optionPool.size, store.optionPool.allocated)
  if (poolWarning) warnings.push({ source: 'optionPool', ...poolWarning })

  // Check each round for dilution and terms
  store.rounds.forEach((round, index) => {
    // Dilution check would need to be calculated
    // Liquidation preference check
    const lpWarning = checkLiquidationPreference(round.liquidationPreference, round.participating)
    if (lpWarning) warnings.push({ source: `round-${index}`, round: round.type, ...lpWarning })
  })

  return warnings
}
