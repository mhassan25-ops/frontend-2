import "./globals.css";
import { Toaster } from "react-hot-toast";
import ClientLayout from "./components/ClientLayout";

export const metadata = {
  title: "Textile Management System",
  description: "Modern textile management dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-sky-100 via-white to-indigo-100 font-sans">
        <Toaster position="top-center" reverseOrder={false} />
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
