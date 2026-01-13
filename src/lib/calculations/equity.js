/**
 * Calculate time-weighted equity split based on founder contributions
 * @param {Array} founders - Array of founder objects with contributionWeights
 * @returns {Array} - Array of founders with calculated equity percentages
 */
export function calculateTimeWeightedEquity(founders) {
  if (!founders || founders.length === 0) return []

  // Calculate total weighted contribution
  const totalWeight = founders.reduce((sum, founder) => {
    const { idea = 0, execution = 0, capital = 0 } = founder.contributionWeights || {}
    return sum + (idea + execution + capital)
  }, 0)

  if (totalWeight === 0) {
    // Equal split if no weights specified
    const equalSplit = 100 / founders.length
    return founders.map(f => ({ ...f, equity: equalSplit }))
  }

  // Calculate weighted equity for each founder
  return founders.map(founder => {
    const { idea = 0, execution = 0, capital = 0 } = founder.contributionWeights || {}
    const founderWeight = idea + execution + capital
    const equity = (founderWeight / totalWeight) * 100
    return { ...founder, equity }
  })
}

/**
 * Calculate shares from ownership percentage
 * @param {number} percentage - Ownership percentage (0-100)
 * @param {number} totalShares - Total shares outstanding
 * @returns {number} - Number of shares
 */
export function percentageToShares(percentage, totalShares) {
  return Math.round((percentage / 100) * totalShares)
}

/**
 * Calculate ownership percentage from shares
 * @param {number} shares - Number of shares
 * @param {number} totalShares - Total shares outstanding
 * @returns {number} - Ownership percentage (0-100)
 */
export function sharesToPercentage(shares, totalShares) {
  if (totalShares === 0) return 0
  return (shares / totalShares) * 100
}

/**
 * Calculate fully diluted shares including option pool
 * @param {number} commonShares - Common shares issued
 * @param {number} optionPoolSize - Option pool size as percentage
 * @returns {number} - Fully diluted shares
 */
export function calculateFullyDilutedShares(commonShares, optionPoolSize = 0) {
  // Option pool is calculated on post-money basis
  // If pool is 10% of fully diluted, then:
  // fullyDiluted = commonShares / (1 - poolPercentage)
  const poolDecimal = optionPoolSize / 100
  if (poolDecimal >= 1) return commonShares

  return Math.round(commonShares / (1 - poolDecimal))
}

/**
 * Validate equity split adds up to 100%
 * @param {Array} stakeholders - Array with equity percentages
 * @returns {Object} - { valid: boolean, total: number, error: string }
 */
export function validateEquitySplit(stakeholders) {
  const total = stakeholders.reduce((sum, s) => sum + (s.equity || 0), 0)
  const valid = Math.abs(total - 100) < 0.01 // Allow for floating point errors

  return {
    valid,
    total,
    error: valid ? null : `Equity split must equal 100% (currently ${total.toFixed(2)}%)`
  }
}
