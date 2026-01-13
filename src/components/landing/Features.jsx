import { motion } from 'framer-motion'
import {
  Clock,
  Users,
  TrendingUp,
  PieChart,
  FileText,
  Shield,
  Zap,
  BarChart3,
  GitBranch,
  Calculator,
  DollarSign,
  Award
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

const features = [
  {
    icon: Clock,
    title: 'Interactive Timeline',
    description: 'Visualize your startup journey with a beautiful, drag-and-drop timeline showing funding rounds, vesting milestones, and key events.'
  },
  {
    icon: Users,
    title: 'Founder Equity Calculator',
    description: 'Fair equity splits based on contribution weighting, time invested, and capital. Handle co-founder departures with reverse vesting.'
  },
  {
    icon: TrendingUp,
    title: 'Funding Rounds Manager',
    description: 'Model multiple funding rounds from pre-seed to Series D+. Automatic dilution calculations and liquidation preference tracking.'
  },
  {
    icon: PieChart,
    title: 'Real-Time Cap Table',
    description: 'See ownership breakdown at any point in time. Track fully diluted vs current ownership for all stakeholders.'
  },
  {
    icon: BarChart3,
    title: 'Stock Option Pool',
    description: 'Manage employee equity grants with vesting schedules. Track pool utilization and plan for refreshes between rounds.'
  },
  {
    icon: DollarSign,
    title: 'Exit Scenario Modeling',
    description: 'Waterfall analysis at different exit valuations. See exactly who gets paid what, accounting for liquidation preferences.'
  },
  {
    icon: Calculator,
    title: 'Valuation Tools',
    description: 'Pre/post-money calculators, price per share, and valuation evolution charts. Understand your company\'s worth.'
  },
  {
    icon: GitBranch,
    title: 'Scenario Comparison',
    description: 'Compare side-by-side timelines and outcomes. Model different fundraising strategies and their impact on dilution.'
  },
  {
    icon: FileText,
    title: 'Export & Share',
    description: 'Export beautiful PDF reports with cap tables, charts, and timelines. Share scenarios via link with co-founders and advisors.'
  },
  {
    icon: Shield,
    title: 'Smart Warnings',
    description: 'Get alerted about excessive dilution, small option pools, and other common equity mistakes before they happen.'
  },
  {
    icon: Zap,
    title: 'Auto-Save',
    description: 'Never lose your work. Automatic saving to local storage with manual save points and full undo/redo support.'
  },
  {
    icon: Award,
    title: 'Template Scenarios',
    description: 'Start quickly with pre-loaded templates: YC standard deal, typical Series A, bootstrap to profitability, and more.'
  }
]

export default function Features() {
  return (
    <section id="features" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Everything You Need to
            <span className="text-transparent bg-clip-text bg-gradient-primary"> Plan Your Equity</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive tools for founders to make informed decisions about equity,
            funding, and exits. No finance degree required.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow border-2 hover:border-primary-200">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-lg text-muted-foreground mb-4">
            Ready to take control of your equity?
          </p>
          <a
            href="/calculator"
            className="inline-block bg-gradient-primary text-white font-semibold px-8 py-4 rounded-lg hover:opacity-90 transition-opacity"
          >
            Start Calculating Now
          </a>
        </motion.div>
      </div>
    </section>
  )
}
