"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { GraduationCap, Calendar, MapPin, Award } from "lucide-react";

export function EducationSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="education" className="py-24 relative overflow-hidden bg-secondary/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Education
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full mt-4"></div>
        </motion.div>

        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass p-8 sm:p-10 rounded-3xl relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-bl-full transition-transform duration-500 group-hover:scale-110"></div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-6">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg shrink-0">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-1">
                  Bachelor of Business Computer
                </h3>
                <p className="text-xl text-gradient font-semibold">
                  KRIRK University
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-sm sm:text-base text-muted-foreground mb-6 bg-secondary/50 p-4 rounded-xl">
              <div className="flex items-center font-medium">
                <Calendar className="w-5 h-5 mr-2 text-blue-500" />
                2014 – 2018
              </div>
              <div className="flex items-center font-medium">
                <MapPin className="w-5 h-5 mr-2 text-blue-500" />
                Bangkok, Thailand
              </div>
              <div className="flex items-center font-medium">
                <Award className="w-5 h-5 mr-2 text-blue-500" />
                GPA: 2.99
              </div>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-foreground font-medium text-lg thai-text">
                ภูมิปัญญาเพื่อสังคม (Wisdom for Society)
              </p>
              <span className="px-4 py-1.5 rounded-full text-sm font-bold bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20">
                Completed
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
