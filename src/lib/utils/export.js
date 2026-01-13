import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { calculateCurrentOwnership } from '@/lib/calculations/dilution'
import { format } from 'date-fns'

/**
 * Export cap table to CSV
 */
export async function exportCapTableToCSV(founders, rounds, employees, optionPool, _currentDate) {
  try {
    const { stakeholders } = calculateCurrentOwnership(founders, rounds, employees, optionPool)

    // CSV headers
    let csv = 'Name,Type,Shares,Ownership %,Fully Diluted %\n'

    // Add each stakeholder
    stakeholders.forEach(stakeholder => {
      const row = [
        stakeholder.name,
        stakeholder.type,
        stakeholder.shares.toFixed(0),
        (stakeholder.ownership || 0).toFixed(2),
        (stakeholder.ownership || 0).toFixed(2),
      ]
      csv += row.join(',') + '\n'
    })

    // Create and download file
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)

    link.setAttribute('href', url)
    link.setAttribute('download', `cap-table-${format(new Date(), 'yyyy-MM-dd')}.csv`)
    link.style.visibility = 'hidden'

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    URL.revokeObjectURL(url)
    return true
  } catch (error) {
    console.error('Error exporting CSV:', error)
    throw error
  }
}

/**
 * Capture element as image with html2canvas
 */
async function captureElement(selector) {
  try {
    const element = document.querySelector(selector)
    if (!element) return null

    const canvas = await html2canvas(element, {
      backgroundColor: '#ffffff',
      scale: 2,
      logging: false,
      useCORS: true,
    })

    return canvas.toDataURL('image/png')
  } catch (error) {
    console.error('Error capturing element:', error)
    return null
  }
}

/**
 * Export full report to PDF with chart captures
 */
export async function exportToPDF(company, founders, rounds, employees) {
  try {
    const pdf = new jsPDF('p', 'mm', 'a4')
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const margin = 20
    let yPosition = margin

    // Helper to add new page if needed
    const checkPageBreak = neededSpace => {
      if (yPosition + neededSpace > pageHeight - margin) {
        pdf.addPage()
        yPosition = margin
        return true
      }
      return false
    }

    // Title page
    pdf.setFontSize(28)
    pdf.setTextColor(14, 165, 233) // primary color
    pdf.text(company.name || 'Equity Calculator Report', pageWidth / 2, yPosition, {
      align: 'center',
    })

    yPosition += 15
    pdf.setFontSize(12)
    pdf.setTextColor(100, 100, 100)
    pdf.text(`Generated: ${format(new Date(), 'MMMM dd, yyyy')}`, pageWidth / 2, yPosition, {
      align: 'center',
    })

    yPosition += 20

    // Company summary
    pdf.setFontSize(14)
    pdf.setTextColor(0, 0, 0)
    pdf.text('Company Overview', margin, yPosition)
    yPosition += 8

    pdf.setFontSize(10)
    pdf.setTextColor(60, 60, 60)
    pdf.text(
      `Founded: ${format(new Date(company.foundedDate), 'MMMM dd, yyyy')}`,
      margin,
      yPosition
    )
    yPosition += 6
    pdf.text(`Founders: ${founders.length}`, margin, yPosition)
    yPosition += 6
    pdf.text(`Funding Rounds: ${rounds.length}`, margin, yPosition)
    yPosition += 6
    const totalRaised = rounds.reduce((sum, r) => sum + r.investment, 0)
    pdf.text(`Total Raised: ${formatCurrency(totalRaised)}`, margin, yPosition)
    yPosition += 6
    pdf.text(`Employees with Grants: ${employees.length}`, margin, yPosition)

    yPosition += 15

    // Disclaimer
    pdf.setFontSize(9)
    pdf.setTextColor(150, 150, 150)
    const disclaimerText =
      'This is a financial model and should not be considered legal or financial advice. ' +
      'Consult with qualified professionals before making any equity decisions.'
    const disclaimerLines = pdf.splitTextToSize(disclaimerText, pageWidth - 2 * margin)
    pdf.text(disclaimerLines, margin, yPosition)
    yPosition += disclaimerLines.length * 5 + 10

    // Try to capture cap table
    checkPageBreak(60)
    pdf.setFontSize(14)
    pdf.setTextColor(0, 0, 0)
    pdf.text('Cap Table', margin, yPosition)
    yPosition += 10

    const capTableImg = await captureElement('[data-export-section="cap-table"]')
    if (capTableImg) {
      const imgWidth = pageWidth - 2 * margin
      const imgHeight = 80
      checkPageBreak(imgHeight + 10)
      pdf.addImage(capTableImg, 'PNG', margin, yPosition, imgWidth, imgHeight)
      yPosition += imgHeight + 10
    } else {
      pdf.setFontSize(10)
      pdf.setTextColor(100, 100, 100)
      pdf.text('Cap table visualization not available', margin, yPosition)
      yPosition += 10
    }

    // Try to capture ownership chart
    checkPageBreak(60)
    pdf.setFontSize(14)
    pdf.setTextColor(0, 0, 0)
    pdf.text('Ownership Breakdown', margin, yPosition)
    yPosition += 10

    const ownershipChartImg = await captureElement('[data-export-section="ownership-chart"]')
    if (ownershipChartImg) {
      const imgWidth = 100
      const imgHeight = 80
      checkPageBreak(imgHeight + 10)
      pdf.addImage(
        ownershipChartImg,
        'PNG',
        (pageWidth - imgWidth) / 2,
        yPosition,
        imgWidth,
        imgHeight
      )
      yPosition += imgHeight + 10
    }

    // Funding rounds table
    if (rounds.length > 0) {
      checkPageBreak(40)
      pdf.setFontSize(14)
      pdf.setTextColor(0, 0, 0)
      pdf.text('Funding History', margin, yPosition)
      yPosition += 10

      pdf.setFontSize(9)
      rounds.forEach(round => {
        checkPageBreak(15)
        pdf.setTextColor(0, 0, 0)
        pdf.text(
          `${round.type.toUpperCase()}: ${formatCurrency(round.investment)} at ${formatCurrency(round.postMoneyValuation)} valuation`,
          margin,
          yPosition
        )
        yPosition += 5
        pdf.setTextColor(100, 100, 100)
        pdf.text(
          `Date: ${format(new Date(round.date), 'MMM yyyy')} • Investors: ${round.leadInvestors?.join(', ') || 'N/A'}`,
          margin + 5,
          yPosition
        )
        yPosition += 8
      })
    }

    // Footer on last page
    pdf.setFontSize(8)
    pdf.setTextColor(150, 150, 150)
    pdf.text('Generated by Founder Equity Calculator', pageWidth / 2, pageHeight - 10, {
      align: 'center',
    })

    // Save PDF
    const filename = `${(company.name || 'equity-calculator').toLowerCase().replace(/\s+/g, '-')}-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`
    pdf.save(filename)

    return true
  } catch (error) {
    console.error('Error exporting PDF:', error)
    throw error
  }
}

/**
 * Export specific chart to image
 */
export async function exportChartToImage(elementId, filename) {
  try {
    const element = document.getElementById(elementId)
    if (!element) {
      throw new Error('Element not found')
    }

    const canvas = await html2canvas(element, {
      backgroundColor: '#ffffff',
      scale: 2,
      logging: false,
    })

    // Convert to blob and download
    canvas.toBlob(blob => {
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename || `${elementId}-${Date.now()}.png`
      link.click()
      URL.revokeObjectURL(url)
    })

    return true
  } catch (error) {
    console.error('Error exporting chart:', error)
    throw error
  }
}

/**
 * Format currency for exports
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Format percentage for exports
 */
export function formatPercentage(value) {
  return `${value.toFixed(2)}%`
}
