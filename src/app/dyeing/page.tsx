"use client";
import { motion } from "framer-motion";
import useAuthCheck from "../../../lib/useAuthCheck";
import { useState } from "react";
import { processDyeingYarn } from "../../../backend/api/process-yarn";
import { downloadPurchaseOrder } from "../../../backend/api/purchase-orders";
import Papa from "papaparse";
import { jsPDF } from "jspdf";
import toast from "react-hot-toast";

export default function DyeingPage() {
  useAuthCheck(["dyeing"]);

  // Separate states
  const [processPoNumber, setProcessPoNumber] = useState("");
  const [downloadPoNumber, setDownloadPoNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [deliver, setDeliver] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [message2, setMessage2] = useState<string | null>(null);

  // --- Process Yarn Handler ---
  const handleProcessYarn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!processPoNumber || !amount || !deliver) {
      return toast.error("Please enter PO number, amount, and delivery.", {
        style: { background: "#EF4444", color: "#fff", borderRadius: "10px" },
      });
    }

    setLoading(true);

    try {
      const response = await processDyeingYarn({
        po_number: processPoNumber,
        amount: Number(amount),
        deliver: Number(deliver), 
      });

      toast.success(
        `${response.message}\nPO: ${response.po_number}\nAvailable Yarn: ${response.new_available_yarn}\nProcessed Yarn: ${response.new_processed_yarn}`,
        {
          duration: 4000,
          style: {
            background: "#10B981",
            color: "#fff",
            borderRadius: "10px",
            fontWeight: "500",
            whiteSpace: "pre-line",
          },
        }
      );

      console.log(response);
    } catch (err: any) {
      console.error(err);
      const errorMsg =
        err.response?.data?.detail ||
        "❌ Error processing yarn. Please try again.";
      toast.error(errorMsg, {
        style: { background: "#EF4444", color: "#fff", borderRadius: "10px" },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPO = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!downloadPoNumber)
      return setMessage2("Please enter PO number to download.");

    setDownloadLoading(true);
    setMessage2(null);

    try {
      // The API returns a PDF blob
      const response = await downloadPurchaseOrder(downloadPoNumber);

      // Ensure it’s a blob (PDF)
      if (!(response instanceof Blob)) {
        throw new Error("Invalid response: expected a PDF file.");
      }

      // Create a temporary download link
      const url = window.URL.createObjectURL(response);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${downloadPoNumber}_PurchaseOrder.pdf`;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      link.remove();
      window.URL.revokeObjectURL(url);

      setMessage2(`📄 Purchase Order #${downloadPoNumber} downloaded successfully!`);
    } catch (err) {
      console.error(err);
      setMessage2("❌ Error downloading Purchase Order PDF.");
    } finally {
      setDownloadLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="min-h-screen flex flex-col items-center bg-gradient-to-br from-white via-sky-50 to-indigo-100 py-16 px-6"
    >
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-indigo-700 mb-3">
          Dyeing Department
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Manage yarn dyeing operations, monitor color batches, and ensure
          quality.
        </p>
      </div>

      {/* Process Yarn Card */}
      <motion.div className="w-full max-w-6xl bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-10 mb-12 hover:shadow-indigo-200 transition-shadow duration-300">
        <h2 className="text-2xl font-bold text-indigo-700 mb-8 text-center">
          Process Dyeing Yarn
        </h2>
        <form
          onSubmit={handleProcessYarn}
          className="flex flex-col md:flex-row md:items-end md:space-x-6 space-y-4 md:space-y-0"
        >
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              PO Number
            </label>
            <input
              type="text"
              value={processPoNumber}
              onChange={(e) => setProcessPoNumber(e.target.value)}
              placeholder="Enter PO number"
              className="w-full rounded-xl border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            />
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Yarn Amount
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter yarn amount"
              className="w-full rounded-xl border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            />
          </div>

          {/* 🆕 Deliver Field */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Delivery Amount
            </label>
            <input
              type="number"
              value={deliver}
              onChange={(e) => setDeliver(e.target.value)}
              placeholder="Enter delivery amount"
              className="w-full rounded-xl border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            disabled={loading}
            type="submit"
            className="w-full md:w-auto px-8 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 shadow-md transition"
          >
            {loading ? "Processing..." : "Process Yarn"}
          </motion.button>
        </form>
      </motion.div>

      {/* Download PO Card */}
      <motion.div className="w-full max-w-6xl bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-10 hover:shadow-sky-200 transition-shadow duration-300">
        <h2 className="text-2xl font-bold text-sky-600 mb-8 text-center">
          Download Purchase Order
        </h2>
        <form
          onSubmit={handleDownloadPO}
          className="flex flex-col md:flex-row md:items-end md:space-x-6 space-y-4 md:space-y-0"
        >
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              PO Number
            </label>
            <input
              type="text"
              value={downloadPoNumber}
              onChange={(e) => setDownloadPoNumber(e.target.value)}
              placeholder="Enter PO number"
              className="w-full rounded-xl border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm"
            />
          </div>
          <motion.button
            whileTap={{ scale: 0.97 }}
            disabled={downloadLoading}
            type="submit"
            className="w-full md:w-auto px-8 py-3 bg-sky-500 text-white font-semibold rounded-xl hover:bg-sky-600 shadow-md transition"
          >
            {downloadLoading ? "Downloading..." : "Download PO"}
          </motion.button>
        </form>
        {message2 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`mt-6 text-center font-medium ${
              message2.includes("📄")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {message2}
          </motion.p>
        )}
      </motion.div>

      {/* Footer */}
      <p className="mt-14 text-gray-500 text-sm text-center">
        © {new Date().getFullYear()} Yarn Management System
      </p>
    </motion.div>
  );
}