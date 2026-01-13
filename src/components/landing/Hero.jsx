import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, TrendingUp, FileText } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import TemplateSelector from '@/components/shared/TemplateSelector'

export default function Hero() {
  const navigate = useNavigate()

  const handleTemplateLoaded = () => {
    // Navigate to calculator after template is loaded
    navigate('/calculator')
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-primary py-20">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10 max-w-7xl">
        <motion.div
          className="text-center text-white max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">Built for founders, by founders</span>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-4 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            See Your Startup&apos;s
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-purple-200">
              Equity Story Unfold
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-lg md:text-xl mb-8 text-blue-100 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Plan funding rounds with confidence. Understand dilution before it happens. Model exit
            scenarios and make data-driven decisions about your equity.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Link to="/calculator">
              <Button
                size="lg"
                className="bg-white text-primary-600 hover:bg-gray-100 font-semibold px-6 py-5 text-base group"
              >
                Start Free
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <TemplateSelector
              trigger={
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold px-6 py-5 text-base"
                >
                  <FileText className="mr-2 w-5 h-5" />
                  Start from Template
                </Button>
              }
              onTemplateLoaded={handleTemplateLoaded}
            />
          </motion.div>

          {/* Video Preview Slot */}
          <motion.div
            className="max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="relative rounded-xl overflow-hidden border-2 border-white/20 shadow-2xl backdrop-blur-sm bg-white/10">
              {/* Video Placeholder */}
              <div className="aspect-video bg-gradient-to-br from-primary-900/50 to-secondary-900/50 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-white/20 flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <p className="text-white text-base font-medium">Watch Demo Video</p>
                  <p className="text-blue-200 text-sm mt-1">See how it works in 2 minutes</p>
                </div>
              </div>
              {/* When you have a video, replace the above div with:
              <video controls className="w-full h-full">
                <source src="/path-to-video.mp4" type="video/mp4" />
              </video>
              */}
            </div>
          </motion.div>

          {/* Simplified Social Proof */}
          <motion.div
            className="mt-8 text-center text-blue-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <p className="text-base font-medium">
              100% Free • No Credit Card • No Sign Up Required
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <motion.div
          className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-1 h-2 bg-white/50 rounded-full mt-2" />
        </motion.div>
      </motion.div>
    </section>
  )
}
