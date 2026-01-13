import { motion } from 'framer-motion'
import { TrendingUp, Users, Calendar, DollarSign } from 'lucide-react'
import { format } from 'date-fns'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const EVENT_TYPES = {
  'funding-round': {
    icon: TrendingUp,
    colors: {
      'pre-seed': 'bg-success-500',
      'seed': 'bg-primary-500',
      'series-a': 'bg-secondary-500',
      'series-b': 'bg-purple-500',
      'series-c': 'bg-warning-500',
      'series-d': 'bg-danger-500',
    }
  },
  'vesting-milestone': {
    icon: Users,
    color: 'bg-blue-400'
  },
  'custom': {
    icon: Calendar,
    color: 'bg-gray-400'
  }
}

export default function TimelineEvent({
  event,
  x,
  yOffset = 0,
  isDragging,
  onDragStart,
  onDragEnd,
  onClick
}) {
  const { type, subtype, date, title, description, data } = event

  const EventIcon = EVENT_TYPES[type]?.icon || Calendar
  const eventColor = type === 'funding-round'
    ? EVENT_TYPES[type].colors[subtype] || 'bg-primary-500'
    : EVENT_TYPES[type]?.color || 'bg-gray-400'

  // Funding rounds are larger and more prominent
  const eventSize = type === 'funding-round' ? 'w-12 h-12' : 'w-9 h-9'
  const iconSize = type === 'funding-round' ? 'w-6 h-6' : 'w-4 h-4'

  const formatCurrency = (amount) => {
    if (amount >= 1e9) return `$${(amount / 1e9).toFixed(1)}B`
    if (amount >= 1e6) return `$${(amount / 1e6).toFixed(1)}M`
    if (amount >= 1e3) return `$${(amount / 1e3).toFixed(1)}K`
    return `$${amount.toFixed(0)}`
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            drag="x"
            dragMomentum={false}
            dragElastic={0}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            style={{ x, top: `${yOffset}px` }}
            className={cn(
              'absolute cursor-grab active:cursor-grabbing',
              isDragging && 'z-50'
            )}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
          >
            {/* Vertical line */}
            <div className="absolute left-1/2 top-0 w-0.5 h-full bg-border -translate-x-1/2" />

            {/* Event marker */}
            <div
              className={cn(
                'relative rounded-full border-4 border-background shadow-lg flex items-center justify-center',
                eventSize,
                eventColor,
                isDragging && 'ring-4 ring-primary-200'
              )}
            >
              <EventIcon className={cn(iconSize, 'text-white')} />
            </div>

            {/* Event label */}
            <div className={cn(
              'absolute left-1/2 -translate-x-1/2 whitespace-nowrap',
              type === 'funding-round' ? 'top-14' : 'top-11'
            )}>
              <div className={cn(
                'font-medium text-center mb-1',
                type === 'funding-round' ? 'text-sm' : 'text-xs'
              )}>
                {title || format(date, 'MMM d, yyyy')}
              </div>
              {type === 'funding-round' && data?.investment && (
                <Badge variant="secondary" className="text-xs font-semibold">
                  {formatCurrency(data.investment)}
                </Badge>
              )}
            </div>
          </motion.div>
        </TooltipTrigger>

        <TooltipContent side="top" className="max-w-xs">
          <div className="space-y-2">
            <div className="font-semibold">{title}</div>
            <div className="text-xs text-muted-foreground">
              {format(date, 'MMMM d, yyyy')}
            </div>

            {description && (
              <div className="text-sm">{description}</div>
            )}

            {type === 'funding-round' && data && (
              <div className="space-y-1 text-sm pt-2 border-t">
                {data.investment && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Investment:</span>
                    <span className="font-medium">{formatCurrency(data.investment)}</span>
                  </div>
                )}
                {data.preMoneyValuation && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pre-money:</span>
                    <span className="font-medium">{formatCurrency(data.preMoneyValuation)}</span>
                  </div>
                )}
                {data.postMoneyValuation && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Post-money:</span>
                    <span className="font-medium">{formatCurrency(data.postMoneyValuation)}</span>
                  </div>
                )}
                {data.leadInvestors && data.leadInvestors.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Lead:</span>
                    <span className="font-medium">{data.leadInvestors.join(', ')}</span>
                  </div>
                )}
              </div>
            )}

            {type === 'vesting-milestone' && data && (
              <div className="space-y-1 text-sm pt-2 border-t">
                {data.stakeholder && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Who:</span>
                    <span className="font-medium">{data.stakeholder}</span>
                  </div>
                )}
                {data.percentVested && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Vested:</span>
                    <span className="font-medium">{data.percentVested.toFixed(1)}%</span>
                  </div>
                )}
              </div>
            )}

            <div className="text-xs text-muted-foreground pt-2 border-t">
              Drag to adjust date
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
