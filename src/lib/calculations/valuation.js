/**
 * Calculate post-money valuation
 * @param {number} preMoneyValuation - Pre-money valuation
 * @param {number} investment - Investment amount
 * @returns {number} - Post-money valuation
 */
export function calculatePostMoney(preMoneyValuation, investment) {
  return preMoneyValuation + investment
}

/**
 * Calculate pre-money valuation from post-money and investment
 * @param {number} postMoneyValuation - Post-money valuation
 * @param {number} investment - Investment amount
 * @returns {number} - Pre-money valuation
 */
export function calculatePreMoney(postMoneyValuation, investment) {
  return postMoneyValuation - investment
}

/**
 * Calculate price per share
 * @param {number} postMoneyValuation - Post-money valuation
 * @param {number} fullyDilutedShares - Fully diluted shares
 * @returns {number} - Price per share
 */
export function calculatePricePerShare(postMoneyValuation, fullyDilutedShares) {
  if (fullyDilutedShares === 0) return 0
  return postMoneyValuation / fullyDilutedShares
}

/**
 * Calculate investor ownership percentage
 * @param {number} investment - Investment amount
 * @param {number} postMoneyValuation - Post-money valuation
 * @returns {number} - Ownership percentage
 */
export function calculateInvestorOwnership(investment, postMoneyValuation) {
  if (postMoneyValuation === 0) return 0
  return (investment / postMoneyValuation) * 100
}

/**
 * Calculate valuation from price per share
 * @param {number} pricePerShare - Price per share
 * @param {number} fullyDilutedShares - Fully diluted shares
 * @returns {number} - Valuation
 */
export function calculateValuationFromPrice(pricePerShare, fullyDilutedShares) {
  return pricePerShare * fullyDilutedShares
}

/**
 * Calculate company valuation evolution over time
 * @param {Array} rounds - Array of funding rounds
 * @returns {Array} - Valuation history
 */
export function calculateValuationHistory(rounds) {
  return rounds.map((round, index) => ({
    date: round.date,
    round: round.type,
    preMoneyValuation: round.preMoneyValuation,
    investment: round.investment,
    postMoneyValuation:
      round.postMoneyValuation || calculatePostMoney(round.preMoneyValuation, round.investment),
    previousValuation: index > 0 ? rounds[index - 1].postMoneyValuation : 0,
    growth:
      index > 0
        ? ((round.postMoneyValuation - rounds[index - 1].postMoneyValuation) /
            rounds[index - 1].postMoneyValuation) *
          100
        : 0,
  }))
}

/**
 * Calculate implied valuation based on comparable companies
 * @param {Object} metrics - Company metrics
 * @param {Object} multiples - Industry multiples
 * @returns {Object} - Implied valuation ranges
 */
export function calculateImpliedValuation(metrics, multiples) {
  const { revenue, users, mrr } = metrics
  const { revenueMultiple, userMultiple, mrrMultiple } = multiples

  const valuations = []

  if (revenue && revenueMultiple) {
    valuations.push({
      method: 'Revenue Multiple',
      valuation: revenue * revenueMultiple,
    })
  }

  if (users && userMultiple) {
    valuations.push({
      method: 'User Multiple',
      valuation: users * userMultiple,
    })
  }

  if (mrr && mrrMultiple) {
    valuations.push({
      method: 'ARR Multiple',
      valuation: mrr * 12 * mrrMultiple,
    })
  }

  const avgValuation =
    valuations.length > 0
      ? valuations.reduce((sum, v) => sum + v.valuation, 0) / valuations.length
      : 0

  return {
    valuations,
    average: avgValuation,
    range: {
      low: Math.min(...valuations.map(v => v.valuation)),
      high: Math.max(...valuations.map(v => v.valuation)),
    },
  }
}

/**
 * Calculate ownership value at different valuations
 * @param {number} ownershipPercentage - Ownership percentage
 * @param {Array} valuations - Array of valuation scenarios
 * @returns {Array} - Ownership values at each valuation
 */
export function calculateOwnershipValue(ownershipPercentage, valuations) {
  return valuations.map(valuation => ({
    valuation,
    value: (ownershipPercentage / 100) * valuation,
    ownershipPercentage,
  }))
}

/**
 * Calculate dilution-adjusted ownership value
 * @param {number} initialOwnership - Initial ownership percentage
 * @param {Array} rounds - Future funding rounds
 * @param {number} exitValuation - Exit valuation
 * @returns {Object} - Diluted ownership and value
 */
export function calculateDilutedValue(initialOwnership, rounds, exitValuation) {
  let currentOwnership = initialOwnership

  // Apply dilution from each round
  rounds.forEach(round => {
    const dilution = (round.investment / round.postMoneyValuation) * 100
    currentOwnership = currentOwnership * (1 - dilution / 100)
  })

  return {
    initialOwnership,
    finalOwnership: currentOwnership,
    dilution: initialOwnership - currentOwnership,
    value: (currentOwnership / 100) * exitValuation,
  }
}

/**
 * Calculate cap table value at exit
 * @param {Array} stakeholders - All stakeholders
 * @param {number} exitValuation - Exit valuation
 * @returns {Array} - Stakeholders with exit values
 */
export function calculateExitValue(stakeholders, exitValuation) {
  return stakeholders.map(stakeholder => ({
    ...stakeholder,
    exitValue: (stakeholder.ownership / 100) * exitValuation,
    multiple: stakeholder.invested
      ? ((stakeholder.ownership / 100) * exitValuation) / stakeholder.invested
      : null,
  }))
}

/**
 * Calculate 409A strike price (simplified)
 * @param {number} preferredPrice - Recent preferred share price
 * @param {number} discount - Discount percentage (typically 30-40%)
 * @returns {number} - Fair market value for options
 */
export function calculate409APrice(preferredPrice, discount = 40) {
  return preferredPrice * (1 - discount / 100)
}
