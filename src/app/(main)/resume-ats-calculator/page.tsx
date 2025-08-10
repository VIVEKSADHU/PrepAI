"use client"

import { motion } from "framer-motion"
import { ATSIcon, ResumeAnalyticsIcon } from "@/components/icons/ats-icons"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Scan, BarChart3, CheckCircle, Clock, Bell, ArrowRight, Zap, Target, Award } from "lucide-react"

export default function ResumeATSCalculatorPage() {
  const features = [
    {
      icon: Scan,
      title: "ATS Scanning",
      description: "Advanced AI-powered scanning to check resume compatibility with Applicant Tracking Systems"
    },
    {
      icon: BarChart3,
      title: "Score Analytics",
      description: "Get detailed analytics and scoring for your resume's ATS performance"
    },
    {
      icon: Target,
      title: "Keyword Optimization",
      description: "Identify missing keywords and optimize your resume for specific job descriptions"
    },
    {
      icon: Award,
      title: "Industry Benchmarking",
      description: "Compare your resume against industry standards and top-performing resumes"
    }
  ]

  const benefits = [
    "Increase interview callbacks by 40%",
    "Pass ATS filters with 95% accuracy",
    "Optimize for specific job roles",
    "Real-time improvement suggestions"
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-950 dark:to-indigo-950">
      <div className="container mx-auto px-4 py-16">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex justify-center mb-6"
          >
            <div className="relative">
              <ATSIcon size={96} className="drop-shadow-xl" />
              <motion.div
                className="absolute -top-2 -right-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8, type: "spring" }}
              >
                <Badge variant="destructive" className="text-xs animate-pulse">
                  Coming Soon
                </Badge>
              </motion.div>
            </div>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4"
          >
            Resume ATS Calculator
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8"
          >
            Maximize your job application success with AI-powered ATS optimization. 
            Get your resume scored, analyzed, and optimized for Applicant Tracking Systems.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button size="lg" className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Bell className="mr-2 h-4 w-4" />
              Get Early Access
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button variant="outline" size="lg" className="border-blue-200 hover:bg-blue-50">
              <FileText className="mr-2 h-4 w-4" />
              Learn More
            </Button>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + index * 0.1, duration: 0.6 }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm hover:bg-white/90 dark:hover:bg-slate-800/90">
                <CardContent className="p-6 text-center">
                  <motion.div
                    className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 mb-4"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <feature.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </motion.div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.6 }}
          className="mb-16"
        >
          <Card className="border-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-indigo-500/10 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Why Choose Our ATS Calculator?
                  </h3>
                  <div className="space-y-3">
                    {benefits.map((benefit, index) => (
                      <motion.div
                        key={benefit}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.8 + index * 0.1 }}
                        className="flex items-center gap-3"
                      >
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <span className="text-muted-foreground">{benefit}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-center">
                  <motion.div
                    animate={{ 
                      y: [0, -10, 0],
                      rotate: [0, 2, -2, 0]
                    }}
                    transition={{ 
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <ResumeAnalyticsIcon size={120} />
                  </motion.div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Coming Soon Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.6 }}
          className="text-center"
        >
          <Card className="max-w-lg mx-auto border-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-indigo-500/5 backdrop-blur-sm">
            <CardContent className="p-8">
              <motion.div
                animate={{ 
                  scale: [1, 1.05, 1],
                  rotate: [0, 1, -1, 0]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-500 flex items-center justify-center shadow-lg"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  <Zap className="h-10 w-10 text-white" />
                </motion.div>
              </motion.div>
              
              <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Launching Soon
              </h3>
              <p className="text-muted-foreground mb-4">
                We're fine-tuning our AI algorithms to give you the most accurate ATS analysis. 
                Join the waitlist to be the first to access this powerful tool!
              </p>
              
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Expected launch: Q1 2025</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
