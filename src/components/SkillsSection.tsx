"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Code, Brain, Cloud } from "lucide-react";

const getCategoryGradient = (colorClass: string) => {
  const gradients = {
    'bg-blue-500': '#3b82f6, #1d4ed8',
    'bg-purple-500': '#a855f7, #7c3aed',
    'bg-green-500': '#10b981, #059669',
  };
  return gradients[colorClass as keyof typeof gradients] || '#3b82f6, #1d4ed8';
};

export function SkillsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const skillCategories = [
    {
      icon: Code,
      title: "Frontend & Backend",
      color: "bg-blue-500",
      skills: [
        { name: "TypeScript/JavaScript", level: 30},
        { name: "Next.js", level: 10 },
        { name: "Python", level: 40 }
      ]
    },
    {
      icon: Brain,
      title: "AI & Machine Learning",
      color: "bg-purple-500",
      skills: [
        { name: "Prompt Engineering", level: 50 }
      ]
    },
    {
      icon: Cloud,
      title: "Cloud & DevOps",
      color: "bg-green-500",
      skills: [
        { name: "Docker", level: 55 },
        { name: "AWS Cloud Services", level: 20 },
        { name: "API Integration", level: 10 }
      ]
    }
  ];

  return (
    <section id="skills" className="py-24 relative overflow-hidden bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4 thai-text">
            ทักษะทางเทคนิค
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full mt-4"></div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
              className="glass p-8 rounded-2xl group hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="flex items-center mb-8">
                <div className={`p-4 rounded-xl shadow-lg mr-4 bg-gradient-to-br from-white/20 to-transparent ${category.color}`}>
                  <category.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-foreground thai-text">
                  {category.title}
                </h3>
              </div>

              <div className="space-y-6">
                {category.skills.map((skill, skillIndex) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{
                      duration: 0.6,
                      delay: categoryIndex * 0.1 + skillIndex * 0.05
                    }}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm sm:text-base font-semibold text-foreground">
                        {skill.name}
                      </span>
                      <span className="text-sm font-bold text-muted-foreground bg-secondary px-2 py-1 rounded-md">
                        {skill.level}%
                      </span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-3 overflow-hidden shadow-inner">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={isInView ? { width: `${skill.level}%` } : { width: 0 }}
                        transition={{
                          duration: 1.2,
                          delay: categoryIndex * 0.1 + skillIndex * 0.05 + 0.3,
                          ease: "easeOut"
                        }}
                        className="h-3 rounded-full relative"
                        style={{
                          background: `linear-gradient(90deg, ${getCategoryGradient(category.color)})`
                        }}
                      >
                        <div className="absolute inset-0 bg-white/20"></div>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Key Achievements */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={isInView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.95, y: 30 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-20 glass-card p-10 max-w-3xl mx-auto relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500"></div>
          
          <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-8 text-center thai-text">
            ผลงานทางเทคนิคที่สำคัญ
          </h3>

          <div className="text-center">
            <div className="text-5xl font-extrabold text-gradient mb-3">95+</div>
            <div className="text-xl text-foreground font-semibold thai-text mb-2">เป้าหมายการรับงานส่งมอบงาน</div>
            <div className="text-muted-foreground thai-text">การปรับปรุงประสิทธิภาพ</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
