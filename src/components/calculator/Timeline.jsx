import { useRef, useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { ZoomIn, ZoomOut, Maximize2, Plus, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import TimelineEvent from './TimelineEvent'
import useTimeline from '@/hooks/useTimeline'
import useCalculatorStore from '@/store/useCalculatorStore'
import { cn } from '@/lib/utils'

export default function Timeline({ onEventClick, onAddEvent }) {
  const { company, founders, rounds, employees, updateRound, updateFounder } = useCalculatorStore()
  const containerRef = useRef(null)
  const [draggingEvent, setDraggingEvent] = useState(null)

  // Calculate timeline date range
  const startDate = company.foundedDate || new Date()
  const endDate = useMemo(() => {
    // End date is 2 years after latest event or 2 years from founding
    const latestRound = rounds.length > 0
      ? rounds[rounds.length - 1].date
      : startDate

    const endFromRounds = new Date(latestRound)
    endFromRounds.setFullYear(endFromRounds.getFullYear() + 2)

    return endFromRounds
  }, [rounds, startDate])

  const {
    zoom,
    zoomIn,
    zoomOut,
    resetZoom,
    dateToX,
    xToDate,
    axisMarkers,
    dimensions
  } = useTimeline(startDate, endDate)

  // Convert data to timeline events with collision detection
  const events = useMemo(() => {
    const allEvents = []

    // Funding rounds
    rounds.forEach(round => {
      allEvents.push({
        id: round.id,
        type: 'funding-round',
        subtype: round.type,
        date: new Date(round.date),
        title: round.type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        data: round
      })
    })

    // Founder vesting milestones (cliff dates)
    founders.forEach(founder => {
      if (founder.vestingStart && founder.cliffMonths) {
        const cliffDate = new Date(founder.vestingStart)
        cliffDate.setMonth(cliffDate.getMonth() + founder.cliffMonths)

        allEvents.push({
          id: `${founder.id}-cliff`,
          type: 'vesting-milestone',
          date: cliffDate,
          title: `${founder.name} Cliff`,
          description: 'Vesting cliff reached',
          data: {
            stakeholder: founder.name,
            percentVested: (founder.cliffMonths / founder.vestingMonths) * 100
          }
        })

        // Vesting complete
        const vestingCompleteDate = new Date(founder.vestingStart)
        vestingCompleteDate.setMonth(vestingCompleteDate.getMonth() + founder.vestingMonths)

        allEvents.push({
          id: `${founder.id}-complete`,
          type: 'vesting-milestone',
          date: vestingCompleteDate,
          title: `${founder.name} Fully Vested`,
          description: 'Vesting schedule complete',
          data: {
            stakeholder: founder.name,
            percentVested: 100
          }
        })
      }
    })

    // Employee vesting milestones (major grants only to avoid clutter)
    employees.slice(0, 5).forEach(emp => {
      if (emp.grantDate) {
        const cliffDate = new Date(emp.grantDate)
        cliffDate.setMonth(cliffDate.getMonth() + (emp.cliffMonths || 12))

        allEvents.push({
          id: `${emp.id}-cliff`,
          type: 'vesting-milestone',
          date: cliffDate,
          title: `${emp.name} Options Cliff`,
          description: 'Employee vesting cliff',
          data: {
            stakeholder: emp.name,
            percentVested: ((emp.cliffMonths || 12) / (emp.vestingMonths || 48)) * 100
          }
        })
      }
    })

    // Sort by date
    allEvents.sort((a, b) => a.date - b.date)

    return allEvents
  }, [rounds, founders, employees])

  // Calculate y-offsets to prevent overlapping events using lane system
  const eventsWithPositions = useMemo(() => {
    const COLLISION_THRESHOLD = 100 // pixels - if events are closer than this, use different lanes
    const VERTICAL_SPACING = 70 // pixels between lanes

    // Track occupied lanes: { yOffset: lastXPosition }
    const lanes = []

    return events.map((event) => {
      const eventX = dateToX(event.date)

      // Find the first available lane (starting from y=0)
      let yOffset = 0
      let laneIndex = 0

      // Check each lane to see if it's available
      for (let i = 0; i < lanes.length; i++) {
        const laneLastX = lanes[i]
        const distance = eventX - laneLastX

        // If this lane is far enough from last event, use it
        if (distance >= COLLISION_THRESHOLD) {
          yOffset = i * VERTICAL_SPACING
          laneIndex = i
          break
        }
      }

      // If no existing lane works, create a new one
      if (laneIndex === 0 && lanes.length > 0 && eventX - lanes[0] < COLLISION_THRESHOLD) {
        laneIndex = lanes.length
        yOffset = laneIndex * VERTICAL_SPACING
      }

      // Update the lane's last X position
      lanes[laneIndex] = eventX

      return {
        ...event,
        x: eventX,
        yOffset
      }
    })
  }, [events, dateToX])

  const handleDragStart = (event) => {
    setDraggingEvent(event.id)
  }

  const handleDragEnd = (event, info) => {
    setDraggingEvent(null)

    // Calculate new date based on X position
    const newX = info.point.x
    const newDate = xToDate(newX)

    // Update the event date in store based on event type
    if (event.type === 'funding-round') {
      // Update funding round date
      updateRound(event.id, { date: newDate })
    } else if (event.type === 'vesting-milestone') {
      // For vesting milestones, we need to adjust the founder's vesting start date
      // Extract founder ID from event ID (format: "founderId-cliff" or "founderId-complete")
      const founderId = event.id.replace(/-cliff$|-complete$/, '')
      const founder = founders.find(f => f.id === founderId)

      if (founder) {
        // Calculate how many months to adjust based on whether it's cliff or complete
        const isCliff = event.id.endsWith('-cliff')
        const monthsFromStart = isCliff ? founder.cliffMonths : founder.vestingMonths

        // Calculate new vesting start date
        const newVestingStart = new Date(newDate)
        newVestingStart.setMonth(newVestingStart.getMonth() - monthsFromStart)

        updateFounder(founderId, { vestingStart: newVestingStart })
      }
    }
  }

  return (
    <Card className="border-2 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-950 dark:to-secondary-950 border-b">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
              <Calendar className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Company Timeline</h2>
              <p className="text-sm text-muted-foreground">
                {company.name || 'Your Company'}'s equity journey
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs px-3 py-1">
              {eventsWithPositions.length} {eventsWithPositions.length === 1 ? 'event' : 'events'}
            </Badge>

            <div className="flex items-center gap-1 ml-2">
              <Button variant="outline" size="sm" onClick={zoomOut} title="Zoom out" aria-label="Zoom out">
                <ZoomOut className="w-4 h-4" />
              </Button>

              <Button variant="outline" size="sm" onClick={resetZoom} title="Reset zoom" aria-label="Reset zoom">
                <Maximize2 className="w-4 h-4" />
              </Button>

              <Button variant="outline" size="sm" onClick={zoomIn} title="Zoom in" aria-label="Zoom in">
                <ZoomIn className="w-4 h-4" />
              </Button>
            </div>

            <Button size="sm" onClick={onAddEvent} className="ml-2">
              <Plus className="w-4 h-4 mr-2" />
              Add Event
            </Button>
          </div>
        </div>
      </div>

      {/* Timeline Container - improved scrolling */}
      <div className="p-6">
        <div
          ref={containerRef}
          className="relative overflow-x-auto overflow-y-visible bg-gradient-to-b from-muted/30 to-muted/10 rounded-xl px-6 py-10 cursor-grab active:cursor-grabbing touch-pan-x border-2 border-dashed border-border/50"
          style={{ minHeight: '400px' }}
        >
        {/* Timeline axis */}
        <div
          className="relative min-h-[300px] min-w-max"
          style={{ width: `${Math.max(dimensions.totalWidth, 1200)}px`, paddingLeft: '20px', paddingRight: '20px' }}
        >
          {/* Horizontal line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-primary-200 via-secondary-200 to-primary-200 rounded-full shadow-sm" />

          {/* Axis markers (months) */}
          {axisMarkers.map((marker, index) => (
            <div
              key={index}
              className="absolute top-1/2"
              style={{ left: `${marker.x}px` }}
            >
              {/* Tick mark */}
              <div className="absolute left-1/2 -translate-x-1/2 w-0.5 h-4 bg-border" />

              {/* Label */}
              <div className="absolute left-1/2 -translate-x-1/2 top-6 text-xs text-muted-foreground whitespace-nowrap">
                {marker.label}
              </div>
            </div>
          ))}

          {/* Events */}
          {eventsWithPositions.map(event => (
            <TimelineEvent
              key={event.id}
              event={event}
              x={event.x}
              yOffset={event.yOffset}
              isDragging={draggingEvent === event.id}
              onDragStart={() => handleDragStart(event)}
              onDragEnd={handleDragEnd}
              onClick={() => onEventClick?.(event)}
            />
          ))}

          {/* Empty state */}
          {eventsWithPositions.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No events yet</p>
                <p className="text-xs">Add founders or funding rounds to see them on the timeline</p>
              </div>
            </div>
          )}
        </div>
        </div>

        {/* Legend */}
        <div className="mt-8 pt-6 border-t border-border/50">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px w-8 bg-border" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Legend</span>
            <div className="h-px flex-1 bg-border" />
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-success-50 dark:bg-success-950 border border-success-200 dark:border-success-800 rounded-lg">
              <div className="w-3 h-3 rounded-full bg-success-500 shadow-sm" />
              <span className="text-xs font-medium text-success-700 dark:text-success-300">Pre-seed</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-primary-50 dark:bg-primary-950 border border-primary-200 dark:border-primary-800 rounded-lg">
              <div className="w-3 h-3 rounded-full bg-primary-500 shadow-sm" />
              <span className="text-xs font-medium text-primary-700 dark:text-primary-300">Seed</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary-50 dark:bg-secondary-950 border border-secondary-200 dark:border-secondary-800 rounded-lg">
              <div className="w-3 h-3 rounded-full bg-secondary-500 shadow-sm" />
              <span className="text-xs font-medium text-secondary-700 dark:text-secondary-300">Series A</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800 rounded-lg">
              <div className="w-3 h-3 rounded-full bg-purple-500 shadow-sm" />
              <span className="text-xs font-medium text-purple-700 dark:text-purple-300">Series B+</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="w-3 h-3 rounded-full bg-blue-400 shadow-sm" />
              <span className="text-xs font-medium text-blue-700 dark:text-blue-300">Vesting</span>
            </div>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="px-6 pb-6">
        <div className="p-3 bg-primary-50 dark:bg-primary-950 border border-primary-200 dark:border-primary-800 rounded-lg">
          <p className="text-xs text-primary-700 dark:text-primary-300">
            <span className="font-semibold">💡 Pro tip:</span> Drag events to adjust dates • Click for details • Use zoom controls for better view
          </p>
        </div>
      </div>
    </Card>
  )
}
