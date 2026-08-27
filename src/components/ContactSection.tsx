"use client";

import { motion, useInView } from "framer-motion";
import { Mail, Phone, MapPin, Github, Linkedin, Send } from "lucide-react";
import { useRef } from "react";

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "Yasunin09@gmail.com",
    href: "mailto:Yasunin09@gmail.com",
    color: "from-blue-500 to-indigo-500",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "(+66) 09-3380-8010",
    href: "tel:+660933808010",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "BKK, Thailand",
    href: "https://www.google.com/maps?ll=13.809636,100.558311&z=16&t=m&hl=th-TH&gl=US&mapclient=embed&cid=8620206362451404498",
    color: "from-red-500 to-rose-500",
  },
];

const socialLinks = [
  {
    icon: Github,
    label: "GitHub",
    href: "https://github.com/BBGANT",
    hoverColor: "hover:bg-gray-800 hover:text-white",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/biwty-g-a724272a0?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    hoverColor: "hover:bg-blue-600 hover:text-white",
  },
];

export function ContactSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
   <section
      id="contact"
      className="py-24 relative overflow-hidden"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[600px] bg-gradient-to-tr from-blue-500/10 via-purple-500/10 to-transparent rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Contact
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Available for collaboration and new opportunities.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full mt-6"></div>
        </motion.div>


       <div className="grid lg:grid-cols-5 gap-10 max-w-6xl mx-auto">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
              Get in touch
            </h3>

            <div className="space-y-4">
              {contactInfo.map((info, index) => (
                <motion.a
                  key={info.label}
                  href={info.href}
                  target={info.href.startsWith("http") ? "_blank" : undefined}
                  rel={info.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-5 p-5 rounded-2xl glass hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className={`p-4 rounded-xl bg-gradient-to-br ${info.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <info.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-sm uppercase tracking-wider mb-1">
                      {info.label}
                    </h4>
                    <p className="text-muted-foreground group-hover:text-foreground transition-colors font-medium">
                      {info.value}
                    </p>
                  </div>
                </motion.a>
              ))}
            </div>

            <div className="pt-8">
              <h4 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">
                Connect with me
              </h4>
              <div className="flex gap-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                    className={`p-4 glass rounded-xl text-foreground transition-all duration-300 ${social.hoverColor}`}
                    aria-label={social.label}
                  >
                    <social.icon className="w-6 h-6" />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>   

  );
}
