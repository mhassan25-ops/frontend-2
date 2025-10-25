"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  viewKnittingYarn,
  viewDyeingYarn,
  viewTrimmingYarn,
  viewAdminYarn,
} from "../../../backend/api/process-yarn"

export default function YarnProcessingPage() {
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState<any[]>([]);
  const [activeView, setActiveView] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFetch = async (viewType: string) => {
    setLoading(true);
    setError(null);
    setRecords([]);
    setActiveView(viewType);

    try {
      let response;

      if (viewType === "knitting") response = await viewKnittingYarn();
      else if (viewType === "dyeing") response = await viewDyeingYarn();
      else if (viewType === "trimming") response = await viewTrimmingYarn();
      else if (viewType === "admin") response = await viewAdminYarn();

      // Each API returns { knitting_records: [...] }
      setRecords(response?.knitting_records || []);
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Failed to fetch records.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="min-h-screen flex flex-col items-center py-10 px-6 bg-gradient-to-br from-white via-sky-50 to-indigo-100"
    >
      <h1 className="text-4xl font-bold text-indigo-700 mb-6">Yarn Processing Dashboard</h1>
      <p className="text-gray-600 text-center mb-10 max-w-2xl">
        Choose a stage below to view its yarn processing records. Each view will display only its respective data.
      </p>

      {/* Buttons */}
      <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { id: "knitting", label: "Knitting" },
          { id: "dyeing", label: "Dyeing" },
          { id: "trimming", label: "Trimms" },
          { id: "admin", label: "Admin Overview" },
        ].map((btn) => (
          <motion.button
            key={btn.id}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={loading}
            onClick={() => handleFetch(btn.id)}
            className={`w-full py-4 font-semibold rounded-xl shadow-md transition-all text-white ${
              activeView === btn.id
                ? "bg-gradient-to-r from-indigo-600 to-sky-500 shadow-lg"
                : "bg-gradient-to-r from-sky-400 to-indigo-400 hover:opacity-90"
            }`}
          >
            {loading && activeView === btn.id
              ? "Loading..."
              : btn.label}
          </motion.button>
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-red-100 border border-red-300 text-red-700 px-6 py-3 rounded-lg mb-8"
        >
          ⚠️ {error}
        </motion.div>
      )}

      {/* Yarn Records */}
      {records.length > 0 && (
        <div className="w-full max-w-5xl space-y-6">
          {records.map((rec, index) => (
            <motion.div
              key={rec._id || index}
              whileHover={{ y: -3 }}
              className="w-full bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-indigo-100 to-sky-100 px-6 py-3 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-indigo-700">
                  📦 Record #{index + 1}
                </h3>
                {activeView && (
                  <span className="text-sm font-medium text-gray-600 bg-indigo-50 px-3 py-1 rounded-full capitalize">
                    {activeView} stage
                  </span>
                )}
              </div>

              {/* Details */}
              <div className="p-6 text-gray-700 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-y-3">
                <p><strong>PO Number:</strong> {rec.po_number || "—"}</p>
                <p><strong>Available :</strong> {rec.available_yarn ?? "—"}</p>
                <p><strong>Processed Fabric:</strong> {rec.processed_yarn ?? "—"}</p>
                <p><strong>Vendor ID:</strong> {rec.vendor_id || "—"}</p>
                <p><strong>Record ID:</strong> {rec._id}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* No Records Found */}
      {!loading && activeView && records.length === 0 && !error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-600 mt-6 text-lg"
        >
          No records found for this stage.
        </motion.p>
      )}
    </motion.div>
  );
}
