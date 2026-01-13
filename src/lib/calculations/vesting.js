import { differenceInMonths, differenceInDays } from 'date-fns'

/**
 * Calculate vested shares based on vesting schedule
 * @param {Date} grantDate - Date shares were granted
 * @param {Date} currentDate - Current date
 * @param {number} totalShares - Total shares granted
 * @param {number} cliffMonths - Cliff period in months
 * @param {number} vestingMonths - Total vesting period in months
 * @returns {Object} - Vesting calculations
 */
export function calculateVestedShares(
  grantDate,
  currentDate,
  totalShares,
  cliffMonths = 12,
  vestingMonths = 48
) {
  const monthsSinceGrant = differenceInMonths(currentDate, grantDate)
  const daysSinceGrant = differenceInDays(currentDate, grantDate)

  // Before cliff, nothing is vested
  if (monthsSinceGrant < cliffMonths) {
    return {
      vestedShares: 0,
      unvestedShares: totalShares,
      percentVested: 0,
      monthsRemaining: vestingMonths - monthsSinceGrant,
      cliffRemaining: cliffMonths - monthsSinceGrant,
    }
  }

  // After vesting period completes, everything is vested
  if (monthsSinceGrant >= vestingMonths) {
    return {
      vestedShares: totalShares,
      unvestedShares: 0,
      percentVested: 100,
      monthsRemaining: 0,
      cliffRemaining: 0,
    }
  }

  // During vesting period, calculate proportionally
  // Use days for more accurate calculation
  const totalDays = vestingMonths * 30.44 // Average days per month
  const vestedPercentage = (daysSinceGrant / totalDays) * 100
  const vestedShares = Math.floor((vestedPercentage / 100) * totalShares)
  const unvestedShares = totalShares - vestedShares

  return {
    vestedShares,
    unvestedShares,
    percentVested: vestedPercentage,
    monthsRemaining: vestingMonths - monthsSinceGrant,
    cliffRemaining: 0,
  }
}

/**
 * Calculate vesting schedule milestones
 * @param {Date} grantDate - Date shares were granted
 * @param {number} totalShares - Total shares granted
 * @param {number} cliffMonths - Cliff period in months
 * @param {number} vestingMonths - Total vesting period in months
 * @returns {Array} - Array of vesting milestones
 */
export function calculateVestingSchedule(
  grantDate,
  totalShares,
  cliffMonths = 12,
  vestingMonths = 48
) {
  const milestones = []

  // Add cliff milestone
  const cliffDate = new Date(grantDate)
  cliffDate.setMonth(cliffDate.getMonth() + cliffMonths)
  const cliffShares = Math.floor((cliffMonths / vestingMonths) * totalShares)

  milestones.push({
    date: cliffDate,
    month: cliffMonths,
    shares: cliffShares,
    cumulativeShares: cliffShares,
    type: 'cliff',
    percentVested: (cliffMonths / vestingMonths) * 100,
  })

  // Add quarterly milestones (every 3 months)
  for (let month = cliffMonths + 3; month <= vestingMonths; month += 3) {
    const milestoneDate = new Date(grantDate)
    milestoneDate.setMonth(milestoneDate.getMonth() + month)

    const cumulativeShares = Math.floor((month / vestingMonths) * totalShares)
    const previousMilestone = milestones[milestones.length - 1]
    const shares = cumulativeShares - previousMilestone.cumulativeShares

    milestones.push({
      date: milestoneDate,
      month,
      shares,
      cumulativeShares,
      type: 'quarterly',
      percentVested: (month / vestingMonths) * 100,
    })
  }

  // Add final milestone if not already included
  if (vestingMonths % 3 !== 0) {
    const finalDate = new Date(grantDate)
    finalDate.setMonth(finalDate.getMonth() + vestingMonths)
    const previousMilestone = milestones[milestones.length - 1]
    const shares = totalShares - previousMilestone.cumulativeShares

    milestones.push({
      date: finalDate,
      month: vestingMonths,
      shares,
      cumulativeShares: totalShares,
      type: 'final',
      percentVested: 100,
    })
  }

  return milestones
}

/**
 * Handle co-founder departure with reverse vesting
 * @param {Object} founder - Founder object
 * @param {Date} departureDate - Date of departure
 * @param {Date} currentDate - Current date
 * @returns {Object} - Updated founder with vested/unvested breakdown
 */
export function handleFounderDeparture(founder, departureDate, _currentDate) {
  const vesting = calculateVestedShares(
    founder.vestingStart,
    departureDate,
    founder.totalShares,
    founder.cliffMonths,
    founder.vestingMonths
  )

  return {
    ...founder,
    departed: true,
    departureDate,
    vestedShares: vesting.vestedShares,
    unvestedShares: vesting.unvestedShares,
    // Unvested shares return to company
    forfeited: vesting.unvestedShares,
  }
}

/**
 * Calculate total vested options across all employees
 * @param {Array} employees - Array of employee grants
 * @param {Date} currentDate - Current date
 * @returns {Object} - Total vested/unvested options
 */
export function calculateTotalVestedOptions(employees, currentDate) {
  let totalGranted = 0
  let totalVested = 0
  let totalUnvested = 0

  employees.forEach(emp => {
    const vesting = calculateVestedShares(
      emp.grantDate,
      currentDate,
      emp.optionsGranted,
      emp.cliffMonths || 12,
      emp.vestingMonths || 48
    )

    totalGranted += emp.optionsGranted
    totalVested += vesting.vestedShares
    totalUnvested += vesting.unvestedShares
  })

  return {
    totalGranted,
    totalVested,
    totalUnvested,
    percentVested: totalGranted > 0 ? (totalVested / totalGranted) * 100 : 0,
  }
}

/**
 * Calculate monthly vesting rate
 * @param {number} totalShares - Total shares to vest
 * @param {number} vestingMonths - Total vesting period
 * @returns {number} - Shares vesting per month
 */
export function calculateMonthlyVestingRate(totalShares, vestingMonths) {
  return totalShares / vestingMonths
}

/**
 * Calculate acceleration on exit
 * @param {Object} stakeholder - Founder or employee
 * @param {Date} exitDate - Date of exit event
 * @param {number} accelerationPercentage - Percentage of unvested to accelerate (0-100)
 * @returns {Object} - Accelerated vesting calculation
 */
export function calculateAcceleration(stakeholder, exitDate, accelerationPercentage = 100) {
  const currentVesting = calculateVestedShares(
    stakeholder.grantDate || stakeholder.vestingStart,
    exitDate,
    stakeholder.totalShares || stakeholder.optionsGranted,
    stakeholder.cliffMonths || 12,
    stakeholder.vestingMonths || 48
  )

  const acceleratedShares = Math.floor(
    currentVesting.unvestedShares * (accelerationPercentage / 100)
  )

  return {
    ...currentVesting,
    acceleratedShares,
    totalVestedWithAcceleration: currentVesting.vestedShares + acceleratedShares,
    remainingUnvested: currentVesting.unvestedShares - acceleratedShares,
  }
}
