"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { viewAllPO } from "../../../backend/api/purchase-orders"; 

interface Label {
  vendor_id: string;
  quality: string;
  printed_woven: string;
  elastic_type: string;
  elastic_vendor_id: string;
  trims: string[];
}

interface PO {
  _id: string;
  customer_name: string;
  order_number: string;
  bags: number;
  company_order_number: string;
  yarn_count: number;
  content: string;
  spun: string;
  sizes: string[];
  knitting_type: string;
  dyeing_type: string;
  finishing_type: string;
  po_number: string;
  labels: Label[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<PO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await viewAllPO();
      setOrders(data);
    } catch (err: any) {
      setError("Failed to fetch Purchase Orders. Please try again.");
      console.error("❌ Fetch Orders Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="min-h-screen flex flex-col items-center bg-gradient-to-br from-white via-sky-50 to-indigo-100 py-10 px-4"
    >
      <h1 className="text-4xl font-bold text-indigo-700 mb-2 text-center">
        Textile Purchase Orders
      </h1>
      <p className="text-gray-600 text-lg mb-8 text-center max-w-2xl">
        Click below to view all recorded Purchase Orders with their details.
      </p>

      {/* Button */}
      <button
        onClick={fetchOrders}
        disabled={loading}
        className="w-full max-w-2xl py-4 mb-8 text-lg font-semibold text-white rounded-xl shadow-md 
        transition-all duration-300 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60"
      >
        {loading ? "Loading..." : "View All Purchase Orders"}
      </button>

      {/* Error Message */}
      {error && (
        <div className="text-red-600 font-medium bg-red-50 border border-red-200 rounded-md p-3 w-full max-w-2xl text-center mb-4">
          {error}
        </div>
      )}

      {/* Orders List */}
      <div className="w-full max-w-4xl space-y-6">
        {orders.map((po, index) => (
          <motion.div
            key={po._id || index}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
            className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100 hover:shadow-xl"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
              <h2 className="text-2xl font-semibold text-indigo-700">
                Purchase Order #{po.po_number}
              </h2>
              <p className="text-sm text-gray-500 mt-1 sm:mt-0">
                Company Order: <span className="font-medium">{po.company_order_number}</span>
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-3 text-gray-700 text-sm">
              <p><span className="font-semibold">Customer:</span> {po.customer_name}</p>
              <p><span className="font-semibold">Order No:</span> {po.order_number}</p>
              <p><span className="font-semibold">Bags:</span> {po.bags}</p>
              <p><span className="font-semibold">Yarn Count:</span> {po.yarn_count}</p>
              <p><span className="font-semibold">Content:</span> {po.content}</p>
              <p><span className="font-semibold">Spun:</span> {po.spun}</p>
              <p><span className="font-semibold">Knitting Type:</span> {po.knitting_type}</p>
              <p><span className="font-semibold">Dyeing Type:</span> {po.dyeing_type}</p>
              <p><span className="font-semibold">Finishing Type:</span> {po.finishing_type}</p>
              <p><span className="font-semibold">Sizes:</span> {po.sizes.join(", ")}</p>
            </div>

            {/* Labels Section */}
            {po.labels && po.labels.length > 0 && (
              <div className="mt-4 border-t border-gray-200 pt-3">
                <h3 className="font-semibold text-indigo-600 mb-2">Label Details:</h3>
                {po.labels.map((label, idx) => (
                  <div
                    key={idx}
                    className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 text-sm text-gray-700 mb-2"
                  >
                    <p><span className="font-semibold">Vendor ID:</span> {label.vendor_id}</p>
                    <p><span className="font-semibold">Quality:</span> {label.quality}</p>
                    <p><span className="font-semibold">Printed/Woven:</span> {label.printed_woven}</p>
                    <p><span className="font-semibold">Elastic Type:</span> {label.elastic_type}</p>
                    <p><span className="font-semibold">Elastic Vendor ID:</span> {label.elastic_vendor_id}</p>
                    <p><span className="font-semibold">Trims:</span> {label.trims.join(", ")}</p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {!loading && orders.length === 0 && !error && (
        <p className="text-gray-500 italic mt-8 text-center">
          No Purchase Orders available yet.
        </p>
      )}
    </motion.div>
  );
}
