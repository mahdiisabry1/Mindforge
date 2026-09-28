"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Check } from "lucide-react";

interface CourseCardProps {
  title: string;
  iconSrc: string;
  isActive: boolean;
  index: number;
}

export default function CourseCard({ title, iconSrc, isActive, index }: CourseCardProps) {
  return (
    <motion.button
      type="submit"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileTap={{ scale: 0.96 }}
      className={`relative flex flex-col items-center gap-3 rounded-2xl border p-5 bg-card transition-colors w-full
        ${isActive ? "border-primary ring-2 ring-primary/30" : "border-border hover:border-primary/40"}`}
    >
      {isActive && (
        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
          <Check className="w-3 h-3 text-primary-foreground" />
        </div>
      )}
      <div className="w-14 h-14 flex items-center justify-center text-4xl relative">
        {iconSrc.startsWith("/") ? (
          <Image src={iconSrc} alt={title} fill className="object-contain" />
        ) : (
          <span>{iconSrc}</span>
        )}
      </div>
      <p className="font-heading font-800 text-sm">{title}</p>
    </motion.button>
  );
}