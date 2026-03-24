"use client"

import { motion } from "framer-motion"
import { Rocket, Bot, CheckCircle2 } from "lucide-react"
import { FeatureCard } from "./feature-card"

const features = [
  {
    icon: Rocket,
    title: "Vectorless RAG",
    description: "No vector DB needed. Pure reasoning-based retrieval that understands context without embeddings.",
  },
  {
    icon: Bot,
    title: "Reflexion Agent",
    description: "Self-improving AI that learns from mistakes and continuously optimizes data generation.",
  },
  {
    icon: CheckCircle2,
    title: "100% Compliance",
    description: "All functional dependencies respected. Every constraint validated, every rule followed.",
  },
]

export function FeaturesSection() {
  return (
    <section className="relative py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Powered by Advanced AI
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Our cutting-edge technology ensures accurate, compliant synthetic data generation
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
