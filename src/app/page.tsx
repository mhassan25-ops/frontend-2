"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Run immediately after hydration
    const role = localStorage.getItem("role");

    if (!role) {
      router.replace("/login");
      return;
    }

    const routes: Record<string, string> = {
      admin: "/admin",
      knitting: "/knitting",
      dyeing: "/dyeing",
      trimming: "/trimming",
      merchant: "/merchant",
    };

    router.replace(routes[role] || "/login");
  }, [router]);

  // Prevent rendering of "/" — keep it blank
  return null;
}
