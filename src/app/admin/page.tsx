"use client";

import { motion } from "framer-motion";
import useAuthCheck from "../../../lib/useAuthCheck";
import PageCard from "../components/PageCard";

export default function AdminPage() {
  // Only admin is allowed here
  useAuthCheck(["admin"]);

  const pages = [
    { title: "Vendor", description: "Manage vendor details and contacts.", href: "/vendor" },
    { title: "Yarn", description: "Track yarn inventory and details.", href: "/yarn" },
    { title: "Yarn Processing", description: "Monitor yarn dyeing and trimming stages.", href: "/yarn-processing" },
    { title: "Purchase Orders", description: "Create and manage purchase orders.", href: "/purchase-orders" },
    { title: "Orders", description: "View and manage textile orders.", href: "/orders" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white via-sky-50 to-indigo-100"
    >
      <h1 className="text-4xl font-bold text-indigo-700 mb-4">Admin Dashboard</h1>
      <p className="text-gray-600 text-lg max-w-2xl text-center">
        Manage all departments, oversee vendor operations, and monitor workflow across the entire production system with ease.
      </p>

      <section className="max-w-6xl mx-auto mt-16 px-6 flex flex-wrap gap-10 justify-center">
        {pages.map((p) => (
          <PageCard key={p.href} {...p} />
        ))}
      </section>
    </motion.div>
  );
}
