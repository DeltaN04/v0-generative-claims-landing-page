"use client"

import { motion } from "framer-motion"
import { StatCard } from "./stat-card"

const stats = [
  { value: "200K+", label: "Real records analyzed" },
  { value: "98.7%", label: "Benchmark accuracy" },
  { value: "6%", label: "Accurate claim rate" },
  { value: "0", label: "Constraint violations" },
]

export function StatsSection() {
  return (
    <section className="relative py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative rounded-3xl overflow-hidden"
        >
          {/* Background glow effects */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/30 rounded-full blur-3xl" />
          
          <div className="relative bg-card/40 backdrop-blur-xl border border-border rounded-3xl p-8 md:p-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Proven Results
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Trusted by insurance companies for generating high-quality synthetic data
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              {stats.map((stat, index) => (
                <StatCard
                  key={stat.label}
                  value={stat.value}
                  label={stat.label}
                  delay={index * 0.1}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
