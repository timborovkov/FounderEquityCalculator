import { motion } from 'framer-motion'
import { Quote, Star } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'CEO, TechFlow',
    company: 'Series A SaaS',
    avatar: 'SC',
    quote: 'This calculator helped us negotiate our Series A with confidence. We could model different scenarios and understand exactly how each term sheet would affect our ownership.',
    rating: 5
  },
  {
    name: 'Marcus Rodriguez',
    role: 'Co-founder, BuildRight',
    company: 'Seed Stage Hardware',
    avatar: 'MR',
    quote: 'As first-time founders, we had no idea how dilution would impact us long-term. The timeline visualization made it crystal clear. We ended up taking less money at a better valuation.',
    rating: 5
  },
  {
    name: 'Emily Nakamura',
    role: 'Founder, HealthSync',
    company: 'Pre-seed Biotech',
    avatar: 'EN',
    quote: 'The exit scenario modeling is incredible. We could show investors our path to 10x returns while maintaining meaningful founder ownership. It\'s become part of our fundraising deck.',
    rating: 5
  },
  {
    name: 'David Kim',
    role: 'CTO, DataCore',
    company: 'Series B AI',
    avatar: 'DK',
    quote: 'We use this for every funding conversation. The option pool calculator alone saved us from making expensive mistakes. Highly recommend for any founder raising capital.',
    rating: 5
  },
  {
    name: 'Priya Patel',
    role: 'Founder, MarketFlow',
    company: 'Bootstrapped to Profitable',
    avatar: 'PP',
    quote: 'Started bootstrapped and used this to plan when to raise. We modeled different scenarios and decided to wait until we hit $5M ARR. Best decision we ever made.',
    rating: 5
  },
  {
    name: 'James Wilson',
    role: 'Co-founder, Venture Labs',
    company: 'Angel Investor',
    avatar: 'JW',
    quote: 'I share this with every founder I advise. It teaches fundamental equity concepts while providing practical value. The waterfall analysis is particularly well done.',
    rating: 5
  }
]

export default function Testimonials() {
  return (
    <section className="py-24 bg-background">
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
            Trusted by
            <span className="text-transparent bg-clip-text bg-gradient-primary"> Thousands </span>
            of Founders
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From first-time founders to serial entrepreneurs, here's what they're saying
            about the Equity Calculator.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  {/* Quote Icon */}
                  <Quote className="w-10 h-10 text-primary-300 mb-4" />

                  {/* Rating */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-warning-500 text-warning-500" />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-muted-foreground mb-6 italic">
                    "{testimonial.quote}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <Avatar className="bg-gradient-primary">
                      <AvatarFallback className="text-white font-semibold">
                        {testimonial.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {testimonial.company}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-600 mb-2">4.9/5</div>
            <div className="text-muted-foreground">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-600 mb-2">10K+</div>
            <div className="text-muted-foreground">Active Users</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-600 mb-2">$5B+</div>
            <div className="text-muted-foreground">Modeled Valuations</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-600 mb-2">50K+</div>
            <div className="text-muted-foreground">Scenarios Created</div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
