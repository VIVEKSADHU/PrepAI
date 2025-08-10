"use client"

import { motion } from "framer-motion"
import { N8nLogo } from "@/components/icons/n8n-logo"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Workflow, Zap, Bot, ArrowRight, Bell } from "lucide-react"

export default function SaasAiAgentsPage() {
  const features = [
    {
      icon: Workflow,
      title: "Automated Workflows",
      description: "Create complex automation workflows with drag-and-drop simplicity"
    },
    {
      icon: Zap,
      title: "AI-Powered Actions",
      description: "Leverage AI to make your workflows smarter and more efficient"
    },
    {
      icon: Bot,
      title: "Intelligent Agents",
      description: "Deploy AI agents that can handle complex multi-step processes"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
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
              <N8nLogo size={80} className="drop-shadow-lg" />
              <motion.div
                className="absolute -top-2 -right-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8, type: "spring" }}
              >
                <Badge variant="destructive" className="text-xs">
                  Soon
                </Badge>
              </motion.div>
            </div>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-4"
          >
            SaaS AI Agents
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
          >
            Powerful automation workflows powered by AI. Create, deploy, and manage intelligent agents that streamline your business processes.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button size="lg" className="group">
              <Bell className="mr-2 h-4 w-4" />
              Notify Me When Ready
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="grid md:grid-cols-3 gap-8 mb-16"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + index * 0.2, duration: 0.6 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-0 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <motion.div
                    className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <feature.icon className="h-6 w-6 text-primary" />
                  </motion.div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Coming Soon Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.6 }}
          className="text-center"
        >
          <Card className="max-w-md mx-auto border-0 bg-gradient-to-r from-primary/5 to-purple-500/5 backdrop-blur-sm">
            <CardContent className="p-8">
              <motion.div
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  rotate: { duration: 10, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
                className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center"
              >
                <Workflow className="h-8 w-8 text-white" />
              </motion.div>
              <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
              <p className="text-muted-foreground text-sm">
                We're working hard to bring you the most powerful AI automation platform. Stay tuned!
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}