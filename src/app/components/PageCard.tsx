"use client";
import Link from "next/link";
import { motion } from "framer-motion";

interface PageCardProps {
  title: string;
  description: string;
  href: string;
}

export default function PageCard({ title, description, href }: PageCardProps) {
  return (
    <Link href={href}>
      <motion.div
        whileHover={{ scale: 1.08, y: -5 }}
        transition={{ type: "spring", stiffness: 250, damping: 15 }}
        className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl border border-gray-100 hover:border-indigo-400 w-full sm:w-80 text-center cursor-pointer"
      >
        <h2 className="text-2xl font-bold text-indigo-700">{title}</h2>
        <p className="text-gray-500 mt-3 text-sm">{description}</p>
      </motion.div>
    </Link>
  );
}
