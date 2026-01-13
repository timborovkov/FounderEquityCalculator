/**
 * Calculate dilution from a new funding round
 * @param {number} preMoneyValuation - Pre-money valuation
 * @param {number} investment - Investment amount
 * @param {number} totalSharesBefore - Total shares before investment
 * @returns {Object} - Dilution calculations
 */
export function calculateRoundDilution(preMoneyValuation, investment, totalSharesBefore) {
  const postMoneyValuation = preMoneyValuation + investment
  const pricePerShare = preMoneyValuation / totalSharesBefore
  const newShares = Math.round(investment / pricePerShare)
  const totalSharesAfter = totalSharesBefore + newShares
  const dilutionPercentage = (newShares / totalSharesAfter) * 100

  return {
    postMoneyValuation,
    pricePerShare,
    newShares,
    totalSharesAfter,
    dilutionPercentage,
    investorOwnership: (newShares / totalSharesAfter) * 100,
  }
}

/**
 * Apply dilution to existing stakeholders
 * @param {Array} stakeholders - Array of stakeholders with shares
 * @param {number} dilutionFactor - Dilution factor (0-1)
 * @returns {Array} - Stakeholders with updated ownership
 */
export function applyDilution(stakeholders, dilutionFactor) {
  return stakeholders.map(stakeholder => ({
    ...stakeholder,
    ownership: stakeholder.ownership * (1 - dilutionFactor),
  }))
}

/**
 * Calculate ownership after multiple rounds
 * @param {number} initialOwnership - Initial ownership percentage
 * @param {Array} rounds - Array of rounds with dilution percentages
 * @returns {number} - Final ownership percentage
 */
export function calculateOwnershipAfterRounds(initialOwnership, rounds) {
  return rounds.reduce((ownership, round) => {
    const dilutionFactor = round.dilutionPercentage / 100
    return ownership * (1 - dilutionFactor)
  }, initialOwnership)
}

/**
 * Calculate total dilution from multiple rounds
 * @param {Array} rounds - Array of rounds with dilution percentages
 * @returns {number} - Total dilution percentage
 */
export function calculateTotalDilution(rounds) {
  const remainingOwnership = rounds.reduce((remaining, round) => {
    const dilutionFactor = round.dilutionPercentage / 100
    return remaining * (1 - dilutionFactor)
  }, 100)

  return 100 - remainingOwnership
}

/**
 * Check if dilution exceeds warning threshold
 * @param {number} dilutionPercentage - Dilution from this round
 * @param {number} threshold - Warning threshold (default 40%)
 * @returns {Object} - { warning: boolean, message: string }
 */
export function checkDilutionWarning(dilutionPercentage, threshold = 40) {
  const warning = dilutionPercentage > threshold

  return {
    warning,
    message: warning ? `High dilution: ${dilutionPercentage.toFixed(1)}% in a single round` : null,
  }
}

/**
 * Calculate ownership breakdown at a specific point in time
 * @param {Array} founders - Founders with initial equity
 * @param {Array} rounds - Funding rounds up to this point
 * @param {Array} employees - Employees with vested options
 * @returns {Object} - Current ownership breakdown
 */
export function calculateCurrentOwnership(founders, rounds, employees = []) {
  // Start with founder equity
  let totalShares = 10000000 // Start with 10M shares
  let stakeholders = founders.map(f => ({
    ...f,
    shares: Math.round((f.equity / 100) * totalShares),
    type: 'founder',
  }))

  // Apply dilution from each round
  rounds.forEach(round => {
    const dilution = calculateRoundDilution(round.preMoneyValuation, round.investment, totalShares)

    // Dilute existing stakeholders
    stakeholders = stakeholders.map(s => ({
      ...s,
      shares: Math.round(s.shares * (1 - dilution.dilutionPercentage / 100)),
    }))

    // Add new investors
    const investorShares = dilution.newShares
    stakeholders.push({
      id: round.id,
      name: round.leadInvestors?.join(', ') || 'Investor',
      shares: investorShares,
      type: 'investor',
      round: round.type,
    })

    totalShares = dilution.totalSharesAfter
  })

  // Add employee options (vested)
  employees.forEach(emp => {
    if (emp.vestedShares > 0) {
      stakeholders.push({
        ...emp,
        shares: emp.vestedShares,
        type: 'employee',
      })
      totalShares += emp.vestedShares
    }
  })

  // Calculate ownership percentages
  stakeholders = stakeholders.map(s => ({
    ...s,
    ownership: (s.shares / totalShares) * 100,
  }))

  return {
    stakeholders,
    totalShares,
  }
}
