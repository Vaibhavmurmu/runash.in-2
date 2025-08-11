"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export default function ResearchTimeline() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const milestones = [
    {
      year: 2021,
      title: "AI Research Founded",
      description: "Established dedicated AI research team focused on streaming technology.",
    },
    {
      year: 2022,
      title: "Building Foundation AI",
      description: "Building a foundational RunAsh AI Model.",
    },
    {
      year: 2023,
      title: "Edge AI Breakthrough",
      description: "Developed lightweight models for edge devices with 80% less compute.",
    },
    {
      year: 2024,
      title: "Multi-modal",
      description: "Advanced research in combining video, visual, and text data for holistic content understanding.",
    },
    {
      year: 2025,
      title: "Open Source Initiative",
      description: "Released key components of our AI stack as open source projects.",
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  }

  return (
    <motion.div
      className="relative mt-16"
      variants={containerVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
    >
      {/* Timeline line */}
      <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-orange-500 to-yellow-500 dark:from-orange-600 dark:to-yellow-600 rounded-full"></div>

      <div className="relative">
        {milestones.map((milestone, index) => (
          <motion.div
            key={index}
            className={`flex items-center mb-12 ${index % 2 === 0 ? "justify-start md:justify-end" : "justify-start"} relative`}
            variants={itemVariants}
          >
            <div className={`w-full md:w-5/12 ${index % 2 === 0 ? "md:pr-8 text-right" : "md:ml-auto md:pl-8"}`}>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-orange-100 dark:border-orange-900/20">
                <div className="text-orange-600 dark:text-orange-400 font-bold text-xl mb-2">{milestone.year}</div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{milestone.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{milestone.description}</p>
              </div>
            </div>

            {/* Timeline dot */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 to-yellow-500 dark:from-orange-600 dark:to-yellow-600 border-4 border-white dark:border-gray-900"></div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
