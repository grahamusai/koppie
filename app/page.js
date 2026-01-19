"use client";

import { motion } from "framer-motion";
import { TypingAnimation } from "@/components/typing-animation";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation"; // <-- Change this import

const features = [
  "AI-Powered Invoicing",
  "Smart CRM Analytics",
  "Automated Workflows",
  "Cash Flow Predictions",
  "Client Insights",
  "Revenue Forecasting",
];

export default function LandingPage() {
  const router = useRouter(); // <-- Add parentheses here to actually call the hook

  const handleGetStarted = () => {
    router.push("/dashboard");
  };

  return (
    <main className="h-screen w-screen overflow-hidden bg-background flex items-center justify-center relative">
      {/* Subtle animated background elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.03 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 overflow-hidden pointer-events-none"
      >
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            x: [0, 20, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 rounded-full bg-foreground blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, -20, 0],
            y: [0, 20, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 rounded-full bg-foreground blur-3xl"
        />
      </motion.div>

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        {/* Logo/Brand */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          <span className="font-serif text-lg tracking-widest text-muted-foreground uppercase">
            Koppie AI Dashboard
          </span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="font-serif text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight text-foreground leading-tight"
        >
          <span className="block mb-2">The Future of</span>
          <span className="block h-[1.2em]">
            <TypingAnimation
              words={features}
              typingSpeed={80}
              deletingSpeed={40}
              pauseDuration={2500}
            />
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          className="mt-8 text-lg md:text-xl text-muted-foreground font-sans max-w-2xl mx-auto leading-relaxed"
        >
          Transform your business with intelligent automation. One platform for
          CRM, invoicing, and financial insights.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={handleGetStarted}
              size="lg"
              className="font-sans text-base px-8 py-6 rounded-full"
            >
              Get Started Free
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <ArrowRight className="ml-2 h-5 w-5" />
              </motion.span>
            </Button>
          </motion.div>

          {/* <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="outline"
              size="lg"
              className="font-sans text-base px-8 py-6 rounded-full border-foreground/20 hover:bg-foreground/5 bg-transparent"
            >
              Watch Demo
            </Button>
          </motion.div>*/}
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2, ease: "easeOut" }}
          className="mt-16 flex items-center justify-center gap-8 text-muted-foreground/60"
        >
          <span className="font-sans text-sm">AI Powered Dashboard</span>
          <span className="hidden sm:inline text-muted-foreground/30">|</span>
          <span className="hidden sm:inline font-sans text-sm">
            Super Reliable
          </span>
          <span className="hidden sm:inline text-muted-foreground/30">|</span>
          <span className="hidden sm:inline font-sans text-sm">
            99.9% Uptime
          </span>
        </motion.div>
      </div>
    </main>
  );
}
