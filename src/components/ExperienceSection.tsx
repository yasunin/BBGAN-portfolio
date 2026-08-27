"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Building, Calendar, MapPin, Briefcase, ChevronRight } from "lucide-react";

export function ExperienceSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const experiences = [
    {
      company: "MFEC.co.th",
      position: "System Administrator",
      period: "ปัจจุบัน",
      location: "กรุงเทพฯ, ประเทศไทย",
      type: "08:00-20:00",
      description: "ออกแบบและส่งมอบโซลูชัน เว็บ สำหรับลูกค้าในกลุ่ม Health-tech, การศึกษา",
      achievements: [
        "นำทีมส่งมอบโครงการสำเร็จหลายโครงการสำหรับลูกค้าที่หลากหลาย",
        "สร้างโซลูชันระดับ Production ที่ให้บริการผู้ใช้หลายพันคน"
      ],
      technologies: ["AI/ML", "React", "Next.js", "AWS"]
    },
    {
      company: "Muang Thai Life Assurance (MTL)",
      position: "Application Monitoring",
      period: "2023 - 2024",
      location: "กรุงเทพฯ, ประเทศไทย",
      type: "24x7",
      description: "รับผิดชอบในการตรวจสอบ (Monitor) แอปพลิเคชันหลัก 8 ตัวตลอด 24 ชั่วโมง เพื่อให้แน่ใจว่าระบบทำงานได้อย่างต่อเนื่องและมีประสิทธิภาพ",
      achievements: [
        "ดูแลและให้คำแนะนำการใช้งานเบื้องต้นสำหรับ Bizbox (ตรวจสอบเวอร์ชัน Browser/OS)",
        "ดูแลความเสถียรของแอปพลิเคชันสำคัญ ได้แก่ Smart web, MTL Connect, New Saletool, Smart Proposal, CTB, ATR, และ Online sale"
      ],
      technologies: ["Bizbox", "Smart web", "MTL Connect", "New Saletool", "Smart Proposal", "CTB", "ATR", "Online sale"]
    },
    {
      company: "PEA",
      position: "Security",
      period: "2022 - 2023",
      location: "Bangkok, Thailand",
      type: "08:00-20:00",
      description: "Reduced workflow behavior traffic and config policy",
      technologies: ["McAfee", "Rapid7"]
    }
  ];

  return (
    <section id="experience" className="py-24 relative overflow-hidden">
      <div className="absolute top-1/4 left-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl -translate-x-1/2" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl translate-x-1/2" />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4 thai-text">
            ประสบการณ์ทำงาน
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full mt-4"></div>
        </motion.div>

        {/* Timeline Experience */}
        <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-blue-500/30 before:to-transparent">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.company}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
            >
              {/* Icon */}
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <Briefcase className="w-4 h-4" />
              </div>
              
              {/* Card */}
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] glass-card p-6 sm:p-8 group-hover:-translate-y-1 transition-transform duration-300">
                <div className="flex flex-col gap-2 mb-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl sm:text-2xl font-bold text-foreground thai-text flex items-center gap-2">
                      <Building className="w-5 h-5 text-blue-500 hidden sm:block" />
                      {exp.company}
                    </h3>
                    <span className="text-sm font-bold text-blue-500 bg-blue-500/10 px-3 py-1 rounded-full shrink-0">
                      {exp.period}
                    </span>
                  </div>
                  <h4 className="text-lg font-semibold text-gradient">
                    {exp.position}
                  </h4>
                  
                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground mt-2">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      {exp.location}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      {exp.type}
                    </div>
                  </div>
                </div>

                <p className="text-muted-foreground thai-text leading-relaxed mb-6">
                  {exp.description}
                </p>

                {exp.achievements && exp.achievements.length > 0 && (
                  <div className="mb-6">
                    <h5 className="font-semibold text-foreground mb-3 text-sm tracking-wide uppercase">
                      Key Achievements
                    </h5>
                    <ul className="space-y-2 text-muted-foreground thai-text text-sm">
                      {exp.achievements.map((achievement, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <ChevronRight className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <div className="flex flex-wrap gap-2">
                    {exp.technologies.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs font-medium border border-border hover:bg-border transition-colors cursor-default"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
