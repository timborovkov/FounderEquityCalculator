import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'

const faqs = [
  {
    question: 'What is equity dilution?',
    answer: 'Equity dilution occurs when new shares are issued during a funding round, reducing the ownership percentage of existing shareholders. For example, if investors buy 20% of your company, all existing shareholders get diluted by 20%.'
  },
  {
    question: 'How do liquidation preferences work?',
    answer: 'Liquidation preferences determine who gets paid first (and how much) in an exit. A 1x preference means investors get their money back before others. A 2x preference means they get 2x their investment back first. "Participating" means they also get their pro-rata share of remaining proceeds.'
  },
  {
    question: 'What is a typical option pool size?',
    answer: 'Most startups allocate 10-20% of fully diluted equity to an option pool for employees. This is usually created before a funding round so the dilution is borne by existing shareholders, not the new investors.'
  },
  {
    question: 'What does fully diluted mean?',
    answer: 'Fully diluted means all potential shares are counted - common stock, preferred stock, all options (granted and ungranted in the pool), warrants, and convertible notes. This gives the most accurate ownership picture.'
  },
  {
    question: 'Should I use pre-money or post-money valuation?',
    answer: 'Pre-money is the company valuation before investment. Post-money is after. Post-money = Pre-money + Investment. Investor ownership % = Investment / Post-money. Most modern term sheets quote post-money to make ownership math clearer.'
  },
  {
    question: 'How much dilution is too much?',
    answer: 'Taking more than 40% dilution in a single round is concerning. Founders should aim to retain at least 15-20% ownership through exit to stay motivated. Total dilution from seed to Series C typically ranges from 50-70%.'
  },
  {
    question: 'What is vesting and why does it matter?',
    answer: 'Vesting means equity is earned over time (typically 4 years with a 1-year cliff). This protects against early departures. If a co-founder leaves after 6 months without vesting, they keep 0%. After 2 years, they keep 50%.'
  },
  {
    question: 'Is this calculator legally binding?',
    answer: 'No, this is an educational planning tool only. Always consult a lawyer before signing term sheets or equity agreements. The calculator helps you understand concepts and model scenarios, but doesn\'t constitute legal or financial advice.'
  }
]

const glossaryTerms = [
  { term: 'Pre-money valuation', definition: 'Company value before new investment' },
  { term: 'Post-money valuation', definition: 'Company value after new investment' },
  { term: 'Dilution', definition: 'Reduction in ownership % from new shares issued' },
  { term: 'Fully diluted', definition: 'All shares including options and convertibles' },
  { term: 'Liquidation preference', definition: 'Priority payout order in exit or liquidation' },
  { term: 'Participating preferred', definition: 'Gets preference + pro-rata share' },
  { term: 'Pro-rata rights', definition: 'Right to maintain ownership % in future rounds' },
  { term: 'Vesting', definition: 'Earning equity over time (typically 4 years)' },
  { term: 'Cliff', definition: 'Period before vesting starts (typically 1 year)' },
  { term: 'Strike price', definition: 'Price to exercise stock options' },
  { term: '409A valuation', definition: 'IRS-compliant fair market value for options' },
  { term: 'Waterfall analysis', definition: 'Distribution of exit proceeds to stakeholders' }
]

export default function Footer() {
  return (
    <footer className="bg-muted/30 pt-24 pb-8">
      <div className="container mx-auto px-4">
        {/* FAQ Section */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-2 text-center">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-center mb-8">
            Common questions about equity, dilution, and startup fundraising
          </p>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </motion.div>

        <Separator className="my-12" />

        {/* Glossary Section */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-2 text-center">
            Equity Glossary
          </h2>
          <p className="text-muted-foreground text-center mb-8">
            Key terms every founder should understand
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {glossaryTerms.map((item, index) => (
              <motion.div
                key={index}
                className="bg-background rounded-lg p-4 border"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <div className="font-semibold text-primary-600 mb-1">
                  {item.term}
                </div>
                <div className="text-sm text-muted-foreground">
                  {item.definition}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <Separator className="my-12" />

        {/* Disclaimer */}
        <motion.div
          className="mb-12 max-w-4xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Alert>
            <AlertDescription className="text-sm">
              <strong>Disclaimer:</strong> This calculator is an educational tool for planning and
              modeling purposes only. It does not constitute legal, financial, or tax advice.
              Always consult with qualified professionals before making equity decisions or
              signing agreements. Calculations are estimates and may not reflect all complexities
              of your specific situation.
            </AlertDescription>
          </Alert>
        </motion.div>

        {/* Bottom Bar */}
        <div className="text-center">
          <div className="text-sm text-muted-foreground">
            © 2024 Equity Calculator. Made with <Heart className="w-4 h-4 inline text-danger-500 fill-danger-500" /> for founders.
          </div>
        </div>
      </div>
    </footer>
  )
}
