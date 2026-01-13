/**
 * Calculate liquidation waterfall with preferences
 * @param {number} exitValuation - Total exit valuation
 * @param {Array} stakeholders - All stakeholders with ownership
 * @param {Array} rounds - Funding rounds with liquidation preferences
 * @returns {Object} - Waterfall distribution
 */
export function calculateLiquidationWaterfall(exitValuation, stakeholders, rounds) {
  let remainingProceeds = exitValuation
  const distribution = []

  // Sort rounds by seniority (later rounds typically have priority)
  const sortedRounds = [...rounds].sort((a, b) =>
    new Date(b.date) - new Date(a.date)
  )

  // Step 1: Pay liquidation preferences
  sortedRounds.forEach(round => {
    if (remainingProceeds <= 0) {
      distribution.push({
        stakeholder: round.leadInvestors?.join(', ') || 'Investor',
        round: round.type,
        stage: 'liquidation-preference',
        amount: 0,
        source: 'preference'
      })
      return
    }

    const preference = round.investment * (round.liquidationPreference || 1)
    const payout = Math.min(preference, remainingProceeds)

    distribution.push({
      stakeholder: round.leadInvestors?.join(', ') || 'Investor',
      round: round.type,
      stage: 'liquidation-preference',
      amount: payout,
      source: 'preference',
      ownership: 0 // Will be updated if participating
    })

    remainingProceeds -= payout
  })

  // Step 2: Handle participating vs non-participating preferred
  if (remainingProceeds > 0) {
    // For participating preferred, distribute remaining proceeds pro-rata
    const participatingRounds = sortedRounds.filter(r => r.participating)
    const nonParticipatingRounds = sortedRounds.filter(r => !r.participating)

    // Calculate if non-participating should convert to common
    nonParticipatingRounds.forEach(round => {
      // Find investor ownership percentage
      const investorStakeholder = stakeholders.find(
        s => s.type === 'investor' && s.round === round.type
      )

      if (investorStakeholder) {
        const proRataShare = (investorStakeholder.ownership / 100) * exitValuation
        const preferenceAmount = distribution.find(
          d => d.round === round.type && d.stage === 'liquidation-preference'
        )?.amount || 0

        // Convert if pro-rata share is better
        if (proRataShare > preferenceAmount) {
          // Remove preference payout and add back to remaining
          const index = distribution.findIndex(
            d => d.round === round.type && d.stage === 'liquidation-preference'
          )
          if (index !== -1) {
            remainingProceeds += distribution[index].amount
            distribution[index].amount = 0
            distribution[index].converted = true
          }

          // Will receive pro-rata share instead
          participatingRounds.push({ ...round, converted: true })
        }
      }
    })

    // Distribute remaining proceeds to common and participating preferred
    const commonStakeholders = stakeholders.filter(
      s => s.type === 'founder' || s.type === 'employee'
    )

    const participatingInvestors = stakeholders.filter(
      s => s.type === 'investor' &&
      participatingRounds.some(r => r.type === s.round)
    )

    const allParticipating = [...commonStakeholders, ...participatingInvestors]
    const totalParticipatingOwnership = allParticipating.reduce(
      (sum, s) => sum + s.ownership,
      0
    )

    allParticipating.forEach(stakeholder => {
      const proRataShare = (stakeholder.ownership / totalParticipatingOwnership) * remainingProceeds

      distribution.push({
        stakeholder: stakeholder.name,
        type: stakeholder.type,
        stage: 'pro-rata',
        amount: proRataShare,
        source: 'common',
        ownership: stakeholder.ownership
      })
    })
  }

  // Step 3: Calculate totals per stakeholder
  const stakeholderTotals = {}

  distribution.forEach(d => {
    const key = d.stakeholder
    if (!stakeholderTotals[key]) {
      stakeholderTotals[key] = {
        stakeholder: d.stakeholder,
        type: d.type || 'investor',
        total: 0,
        breakdown: []
      }
    }

    stakeholderTotals[key].total += d.amount
    stakeholderTotals[key].breakdown.push(d)
  })

  return {
    distribution,
    stakeholderTotals: Object.values(stakeholderTotals),
    totalDistributed: Object.values(stakeholderTotals).reduce((sum, s) => sum + s.total, 0),
    exitValuation
  }
}

/**
 * Simplified waterfall calculation for quick scenarios
 * @param {number} exitValuation - Exit valuation
 * @param {Array} stakeholders - Stakeholders with ownership and invested amounts
 * @returns {Array} - Payout per stakeholder
 */
export function calculateSimpleWaterfall(exitValuation, stakeholders) {
  return stakeholders.map(stakeholder => {
    const payout = (stakeholder.ownership / 100) * exitValuation
    const invested = stakeholder.invested || 0
    const multiple = invested > 0 ? payout / invested : null
    const profit = payout - invested

    return {
      ...stakeholder,
      payout,
      invested,
      profit,
      multiple
    }
  })
}

/**
 * Calculate IRR (Internal Rate of Return) for investors
 * @param {number} invested - Amount invested
 * @param {number} proceeds - Proceeds at exit
 * @param {Date} investmentDate - Date of investment
 * @param {Date} exitDate - Date of exit
 * @returns {number} - IRR as percentage
 */
export function calculateIRR(invested, proceeds, investmentDate, exitDate) {
  const years = (exitDate - investmentDate) / (1000 * 60 * 60 * 24 * 365.25)

  if (years <= 0) return 0

  // IRR = (FV / PV) ^ (1/n) - 1
  const irr = Math.pow(proceeds / invested, 1 / years) - 1
  return irr * 100
}

/**
 * Calculate MOIC (Multiple on Invested Capital)
 * @param {number} proceeds - Proceeds at exit
 * @param {number} invested - Amount invested
 * @returns {number} - MOIC
 */
export function calculateMOIC(proceeds, invested) {
  if (invested === 0) return 0
  return proceeds / invested
}

/**
 * Calculate breakeven valuation (where investors get their money back)
 * @param {Array} rounds - Funding rounds
 * @returns {number} - Breakeven valuation
 */
export function calculateBreakevenValuation(rounds) {
  return rounds.reduce((sum, round) => {
    return sum + (round.investment * (round.liquidationPreference || 1))
  }, 0)
}

/**
 * Calculate payout at different exit valuations
 * @param {Object} stakeholder - Stakeholder with ownership
 * @param {Array} exitValuations - Array of exit valuations to model
 * @param {Array} rounds - Funding rounds
 * @param {Array} allStakeholders - All stakeholders
 * @returns {Array} - Payouts at each valuation
 */
export function calculatePayoutScenarios(stakeholder, exitValuations, rounds, allStakeholders) {
  return exitValuations.map(exitVal => {
    const waterfall = calculateLiquidationWaterfall(exitVal, allStakeholders, rounds)
    const stakeholderPayout = waterfall.stakeholderTotals.find(
      s => s.stakeholder === stakeholder.name
    )

    return {
      exitValuation: exitVal,
      payout: stakeholderPayout?.total || 0,
      percentage: ((stakeholderPayout?.total || 0) / exitVal) * 100
    }
  })
}

/**
 * Compare waterfall outcomes with/without preferences
 * @param {number} exitValuation - Exit valuation
 * @param {Array} stakeholders - All stakeholders
 * @param {Array} rounds - Funding rounds
 * @returns {Object} - Comparison of scenarios
 */
export function compareWaterfallScenarios(exitValuation, stakeholders, rounds) {
  // Scenario 1: With liquidation preferences
  const withPreferences = calculateLiquidationWaterfall(exitValuation, stakeholders, rounds)

  // Scenario 2: Pro-rata (no preferences)
  const proRata = stakeholders.map(s => ({
    stakeholder: s.name,
    type: s.type,
    payout: (s.ownership / 100) * exitValuation,
    ownership: s.ownership
  }))

  // Calculate difference
  const comparison = stakeholders.map(s => {
    const withPref = withPreferences.stakeholderTotals.find(st => st.stakeholder === s.name)
    const withoutPref = proRata.find(pr => pr.stakeholder === s.name)

    return {
      stakeholder: s.name,
      type: s.type,
      withPreferences: withPref?.total || 0,
      proRata: withoutPref?.payout || 0,
      difference: (withPref?.total || 0) - (withoutPref?.payout || 0)
    }
  })

  return {
    withPreferences: withPreferences.stakeholderTotals,
    proRata,
    comparison,
    exitValuation
  }
}
