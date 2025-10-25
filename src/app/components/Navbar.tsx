"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("role");
    router.push("/login");
  };

  // Hide navbar completely until logged in
  if (!role) return null;

  return (
    <nav className="bg-white shadow-md border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-indigo-600 font-extrabold text-2xl">
          Textile Management System
        </h1>

        <div className="flex items-center space-x-6">
          {role === "admin" && (
            <>
              <Link href="/admin" className="text-gray-700 font-medium hover:text-indigo-600 transition">Admin</Link>
              <Link href="/vendor" className="text-gray-700 font-medium hover:text-indigo-600 transition">Vendor</Link>
              <Link href="/yarn" className="text-gray-700 font-medium hover:text-indigo-600 transition">Yarn</Link>
              <Link href="/yarn-processing" className="text-gray-700 font-medium hover:text-indigo-600 transition">Yarn Processing</Link>
              <Link href="/purchase-orders" className="text-gray-700 font-medium hover:text-indigo-600 transition">Purchase Orders</Link>
              <Link href="/orders" className="text-gray-700 font-medium hover:text-indigo-600 transition">Orders</Link>
            </>
          )}

          {role === "knitting" && (
            <Link href="/knitting" className="text-gray-700 font-medium hover:text-indigo-600 transition">Knitting</Link>
          )}

          {role === "dyeing" && (
            <Link href="/dyeing" className="text-gray-700 font-medium hover:text-indigo-600 transition">Dyeing</Link>
          )}

          {role === "trims" && (
            <Link href="/trimming" className="text-gray-700 font-medium hover:text-indigo-600 transition">Trimming</Link>
          )}

          {role === "merchant" && (
            <Link href="/merchant" className="text-gray-700 font-medium hover:text-indigo-600 transition">Merchant</Link>
          )}

          <button
            onClick={handleLogout}
            className="ml-4 px-5 py-2.5 bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-semibold rounded-lg shadow-md transition-all duration-300 transform hover:scale-[1.05]"
          >
            Logout
          </button>
        </div>
      </div>
      <div className="h-1 bg-gradient-to-r from-sky-500 to-indigo-500" />
    </nav>
  );
}
