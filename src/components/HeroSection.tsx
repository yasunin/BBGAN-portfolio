"use client";

import { motion } from "framer-motion";
import { ChevronDown, Mail, Phone, MapPin, Download } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function HeroSection() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Profile Image with Glow Effect */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, type: "spring", bounce: 0.5 }}
            className="mb-8 relative inline-block"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-lg opacity-60 animate-pulse" />
            <div className="relative w-36 h-36 sm:w-44 sm:h-44 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-1 shadow-2xl">
              <div className="w-full h-full rounded-full overflow-hidden bg-background">
                <Image
                  src="https://images.unsplash.com/photo-1742626157052-f5a373a727ef?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzOHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Yasunin Suriya (Biw)"
                  width={176}
                  height={176}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
            </div>
          </motion.div>

          {/* Name and Title */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4 thai-text text-foreground">
              Yasunin Suriya
              <span className="block text-2xl sm:text-3xl md:text-4xl text-gradient font-semibold mt-3">
                (Biw)
              </span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <p className="text-xl sm:text-2xl md:text-3xl text-muted-foreground mb-8 font-medium tracking-wide">
            
            </p>
          </motion.div>

          {/* Contact Info Chips */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-10"
          >
            {[
              { icon: Phone, text: "(+66) 09-338080-10" },
              { icon: Mail, text: "Yasunin09@gmail.com" },
              { icon: MapPin, text: "BKK, Thailand" },
            ].map((item, index) => (
              <div key={index} className="glass px-4 py-2 rounded-full flex items-center gap-2 text-sm sm:text-base text-foreground font-medium hover:bg-white/80 dark:hover:bg-gray-900/80 transition-all cursor-default">
                <item.icon size={16} className="text-blue-500" />
                <span>{item.text}</span>
              </div>
            ))}
          </motion.div>

          {/* Brief Summary */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="max-w-3xl mx-auto mb-12 glass-card p-6 sm:p-8"
          >
            <p className="text-xl sm:text-2xl font-bold text-foreground mb-2 thai-text">
              ประสบการณ์กว่า 6 ปี
            </p>
            <p className="text-base sm:text-lg text-muted-foreground thai-text">
              มุ่งมั่นในการพัฒนาระบบให้มีประสิทธิภาพและเสถียรภาพสูงสุด
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
