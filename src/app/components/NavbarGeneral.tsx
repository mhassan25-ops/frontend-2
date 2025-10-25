"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useEffect, useState } from "react";

export default function NavbarGeneral() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("role");
    router.push("/login");
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-md border-b border-blue-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between">
        {/* Title */}
        <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-indigo-600 font-extrabold text-2xl">
          Textile Management System
        </h1>

        {/* Right side */}
        <div className="flex items-center gap-4 mt-3 sm:mt-0">
          <p className="text-sm text-gray-500">
            Logged as:{" "}
            <span className="font-semibold text-indigo-600">{role || "Guest"}</span>
          </p>
          <button
            onClick={handleLogout}
            className="px-5 py-2.5 bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-semibold rounded-lg shadow-md 
              transition-all duration-300 transform hover:scale-[1.05] hover:bg-white border border-transparent 
              hover:border-[2px] hover:border-sky-500 hover:text-transparent hover:bg-clip-text 
              hover:bg-gradient-to-r hover:from-sky-600 hover:to-indigo-600"
          >
            <LogOut className="inline-block mr-2" size={16} />
            Logout
          </button>
        </div>
      </div>

      <div className="h-1 bg-gradient-to-r from-sky-500 to-indigo-500" />
    </nav>
  );
}
