import { motion } from 'framer-motion'
import { Laptop, Wrench, ShoppingCart, Pill, Lightbulb, Building2 } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

const useCases = [
  {
    icon: Laptop,
    title: 'SaaS Startups',
    description: 'Model recurring revenue growth and plan funding rounds based on ARR milestones.',
    example: 'Seed round at $10M post-money, Series A at $50M with 20% dilution'
  },
  {
    icon: Wrench,
    title: 'Hardware Companies',
    description: 'Navigate capital-intensive fundraising with higher dilution. Plan for manufacturing scale-up.',
    example: 'Larger rounds with 30-40% dilution, inventory financing considerations'
  },
  {
    icon: ShoppingCart,
    title: 'Marketplace Platforms',
    description: 'Balance growth capital needs with founder ownership. Model two-sided marketplace dynamics.',
    example: 'Aggressive early dilution for market capture, followed by profitable growth'
  },
  {
    icon: Pill,
    title: 'Biotech & HealthTech',
    description: 'Long development cycles require careful runway planning. Model multiple funding rounds before revenue.',
    example: 'Series A-C before product launch, managing 60%+ total dilution'
  },
  {
    icon: Lightbulb,
    title: 'Deep Tech',
    description: 'R&D-heavy companies need patient capital. Plan dilution while reaching technical milestones.',
    example: 'Grant funding + equity rounds, SAFE notes for bridge financing'
  },
  {
    icon: Building2,
    title: 'Bootstrap to Scale',
    description: 'Start bootstrapped, take smart capital later. Maintain founder control while accelerating growth.',
    example: 'Launch without funding, raise growth round at strong valuation'
  }
]

export default function UseCases() {
  return (
    <section className="py-24 bg-muted/30">
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
            Built for
            <span className="text-transparent bg-clip-text bg-gradient-primary"> Every Type </span>
            of Startup
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Whether you're building software, hardware, or biotech, our calculator
            adapts to your unique fundraising journey.
          </p>
        </motion.div>

        {/* Use Cases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {useCases.map((useCase, index) => (
            <motion.div
              key={useCase.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-xl transition-all hover:-translate-y-1">
                <CardHeader>
                  <div className="w-16 h-16 rounded-xl bg-gradient-secondary flex items-center justify-center mb-4">
                    <useCase.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl mb-2">{useCase.title}</CardTitle>
                  <CardDescription className="text-base">
                    {useCase.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/50 rounded-lg p-4 border-l-4 border-primary-500">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-semibold text-foreground">Example: </span>
                      {useCase.example}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <Card className="max-w-3xl mx-auto bg-gradient-primary text-white border-0">
            <CardHeader>
              <CardTitle className="text-2xl mb-2">
                Not Sure Where to Start?
              </CardTitle>
              <CardDescription className="text-blue-100 text-base">
                Use our template scenarios to see how companies similar to yours
                typically structure their equity and fundraising. Templates include
                YC standard terms, typical Series A structures, and more.
              </CardDescription>
            </CardHeader>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
