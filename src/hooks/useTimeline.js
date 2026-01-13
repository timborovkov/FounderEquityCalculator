import { useState, useCallback, useMemo } from 'react'
import { differenceInDays, addMonths, format } from 'date-fns'

export default function useTimeline(startDate, endDate) {
  const [zoom, setZoom] = useState(1) // 1 = default, 2 = zoomed in, 0.5 = zoomed out
  const [viewOffset, setViewOffset] = useState(0) // Horizontal scroll offset

  // Calculate timeline dimensions
  const timelineDimensions = useMemo(() => {
    const totalDays = differenceInDays(endDate, startDate)
    const pixelsPerDay = 2 * zoom // Base scale
    const totalWidth = totalDays * pixelsPerDay

    return {
      totalDays,
      pixelsPerDay,
      totalWidth,
      startDate,
      endDate,
    }
  }, [startDate, endDate, zoom])

  // Convert date to X position on timeline
  const dateToX = useCallback(
    date => {
      const days = differenceInDays(date, timelineDimensions.startDate)
      return days * timelineDimensions.pixelsPerDay
    },
    [timelineDimensions]
  )

  // Convert X position to date
  const xToDate = useCallback(
    x => {
      const days = Math.round(x / timelineDimensions.pixelsPerDay)
      return addMonths(timelineDimensions.startDate, Math.round(days / 30))
    },
    [timelineDimensions]
  )

  // Zoom in/out
  const zoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev * 1.5, 5))
  }, [])

  const zoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev / 1.5, 0.3))
  }, [])

  const resetZoom = useCallback(() => {
    setZoom(1)
    setViewOffset(0)
  }, [])

  // Generate axis markers (months/years)
  const axisMarkers = useMemo(() => {
    const markers = []
    let currentDate = new Date(timelineDimensions.startDate)
    const end = timelineDimensions.endDate

    while (currentDate <= end) {
      markers.push({
        date: new Date(currentDate),
        x: dateToX(currentDate),
        label: format(currentDate, 'MMM yyyy'),
      })
      currentDate = addMonths(currentDate, 1)
    }

    return markers
  }, [timelineDimensions, dateToX])

  return {
    zoom,
    viewOffset,
    setViewOffset,
    zoomIn,
    zoomOut,
    resetZoom,
    dateToX,
    xToDate,
    axisMarkers,
    dimensions: timelineDimensions,
  }
}
