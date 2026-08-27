"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Brain, Code, Users, CheckCircle2 } from "lucide-react";

export function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const highlights = [
    {
      icon: Brain,
      title: "AI & Machine Learning",
      description: "LLM fine-tuning"
    },
    {
      icon: Code,
      title: "Development",
      description: "Java, Next.js, Docker"
    },
    {
      icon: Users,
      title: "Leadership",
      description: "MFEC | The Leading Tech Company in Thailand"
    }
  ];

  return (
    <section id="about" className="py-24 relative overflow-hidden">
      <div className="absolute top-10 right-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4 thai-text">
            เกี่ยวกับฉัน
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto thai-text">
            มีความมุ่งมั่นในการแปลงงานและพัฒนาคุณภาพชีวิต
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left Column - Story */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card p-8 sm:p-10"
          >
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-6 thai-text flex items-center gap-3">
              <span className="w-8 h-1 bg-blue-500 rounded-full"></span>
              เส้นทางการทำงาน
            </h3>
            <div className="space-y-6 text-muted-foreground thai-text text-lg">
              <p className="font-medium text-foreground">
                ด้วยประสบการณ์กว่า 6 ปีในอุตสาหกรรมเทคโนโลยี
              </p>
              <ul className="space-y-4">
                {[
                  "Developing web-application 'Human Resource Information System Integration' by using asp.net with c# and MsSql server database.",
                  "Developing web-application 'Human Resource Information System Integration' by using Mcafee and hp fortify Rapid7.",
                  "All processes followed team schedule and software development life cycle."
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-blue-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Right Column - Highlights Grid */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid sm:grid-cols-2 lg:grid-cols-1 gap-6"
          >
            {highlights.map((highlight, index) => (
              <motion.div
                key={highlight.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                className="glass p-6 rounded-2xl hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="p-3 bg-blue-500/10 dark:bg-blue-500/20 rounded-xl group-hover:bg-blue-500/20 transition-colors">
                    <highlight.icon className="w-6 h-6 text-blue-500" />
                  </div>
                  <h4 className="text-xl font-bold text-foreground">
                    {highlight.title}
                  </h4>
                </div>
                <p className="text-muted-foreground thai-text pl-16">
                  {highlight.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-20 grid grid-cols-2 gap-8 text-center max-w-3xl mx-auto"
        >
          <div className="glass-card p-6 py-8">
            <div className="text-4xl md:text-5xl font-extrabold text-gradient mb-3">6+</div>
            <div className="text-foreground font-semibold tracking-wide">Years Experience</div>
          </div>
          <div className="glass-card p-6 py-8">
            <div className="text-4xl md:text-5xl font-extrabold text-gradient mb-3">5.0★</div>
            <div className="text-foreground font-semibold tracking-wide">Projects Completed</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
