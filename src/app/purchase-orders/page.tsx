"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { downloadPurchaseOrder } from "../../../backend/api/purchase-orders";
import { receiveOrder } from "../../../backend/api/order";
import { jsPDF } from "jspdf";
import Papa from "papaparse";


interface Label {
  vendor_id: string;
  quality: string;
  printed_woven: string;
  elastic_type: string;
  elastic_vendor_id?: string | null;
  // FRONTEND: trims and sizes are simple strings so user can type commas freely.
  trims?: string;
  sizes?: string;
  // if you want extra free text field:
  additional_info?: string;
}

interface Order {
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
  dyeing_color: string; // ✅ add this
  finishing_type: string;
  po_number: string;
  labels?: Label[] | null;
  additional_info?: string;
}


export default function PurchaseOrdersPage() {
  const [poNumber, setPoNumber] = useState("");
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [message2, setMessage2] = useState<string | null>(null);

  const [orderData, setOrderData] = useState<Order>({
    customer_name: "",
    order_number: "",
    bags: 0,
    company_order_number: "",
    yarn_count: 0,
    content: "",
    spun: "",
    sizes: [],
    knitting_type: "",
    dyeing_type: "",
    dyeing_color: "",
    finishing_type: "",
    po_number: "",
    labels: [],
    additional_info: "",
  });

  const [receiveLoading, setReceiveLoading] = useState(false);
  const [message1, setMessage1] = useState<string | null>(null);

  // Labels stored as objects where trims and sizes are strings (commas allowed)
  const [labels, setLabels] = useState<Label[]>([
    { vendor_id: "", quality: "", printed_woven: "", elastic_type: "", elastic_vendor_id: "", trims: "", sizes: "", additional_info: "" },
  ]);

  const addLabel = () => {
    setLabels((prev) => [
      ...prev,
      { vendor_id: "", quality: "", printed_woven: "", elastic_type: "", elastic_vendor_id: "", trims: "", sizes: "", additional_info: "" },
    ]);
  };

  const removeLabel = (index: number) => {
    setLabels((prev) => prev.filter((_, i) => i !== index));
  };

  // Update label fields; trims/sizes are just strings here
  const updateLabel = (index: number, field: keyof Label, value: string) => {
    setLabels((prev) => {
      const newLabels = [...prev];
      newLabels[index] = {
        ...newLabels[index],
        [field]: value,
      } as Label;
      return newLabels;
    });
  };

  // --- Validation ---
  const validateOrder = (): string | null => {
    const mandatoryFields: (keyof Order)[] = [
      "customer_name",
      "order_number",
      "bags",
      "company_order_number",
      "yarn_count",
      "content",
      "spun",
      "sizes",
      "knitting_type",
      "dyeing_type",
      "finishing_type",
      "po_number",
    ];

    for (const field of mandatoryFields) {
      const value = orderData[field];
      if (value === "" || value === 0 || (Array.isArray(value) && value.length === 0)) {
        return `Please fill the mandatory order field: ${field.replaceAll("_", " ")}`;
      }
    }

    for (let i = 0; i < labels.length; i++) {
      const label = labels[i];
      const mandatoryLabelFields: (keyof Label)[] = ["vendor_id", "quality", "printed_woven", "elastic_type"];
      for (const field of mandatoryLabelFields) {
        const value = label[field];
        if (!value || value.toString().trim() === "") {
          return `Please fill mandatory label field "${field}" for label #${i + 1}`;
        }
      }
    }

    return null;
  };

  // Build payload: convert label.trims and label.sizes strings into arrays for backend
  const handleReceiveOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage1(null);

    const error = validateOrder();
    if (error) {
      setMessage1(`❌ ${error}`);
      return;
    }

    setReceiveLoading(true);
    try {
      const payload: Order = {
      ...orderData,
      dyeing_color: orderData.dyeing_color,
      bags: Number(orderData.bags),
      yarn_count: Number(orderData.yarn_count),
      sizes: orderData.sizes.map((s) => s.trim()).filter((s) => s !== ""),
      labels: labels.map((label) => ({
        ...label,
        trims: typeof label.trims === "string"
          ? label.trims.split(",").map((s) => s.trim()).filter((s) => s !== "")
          : (label.trims as any),
        sizes: typeof label.sizes === "string"
          ? label.sizes.split(",").map((s) => s.trim()).filter((s) => s !== "")
          : (label.sizes as any),
  })),
};


      await receiveOrder(payload);
      setMessage1("✅ Order received successfully!");
      // reset
      setOrderData({
      customer_name: "",
      order_number: "",
      bags: 0,
      company_order_number: "",
      yarn_count: 0,
      content: "",
      spun: "",
      sizes: [],
      knitting_type: "",
      dyeing_type: "",
      dyeing_color: "", // ✅ ADDED
      finishing_type: "",
      po_number: "",
      labels: [],
      additional_info: "", // optional if not used in backend
});
      setLabels([{ vendor_id: "", quality: "", printed_woven: "", elastic_type: "", elastic_vendor_id: "", trims: "", sizes: "", additional_info: "" }]);
    } catch (err) {
      console.error(err);
      setMessage1("❌ Failed to receive order. Check console for details.");
    } finally {
      setReceiveLoading(false);
    }
  };

  // --- Download PO handler (unchanged logic, kept for completeness) ---

const handleDownloadPO = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!poNumber) return setMessage2("Please enter PO number to download.");

  setDownloadLoading(true);
  setMessage2(null);

  try {
    const response = await downloadPurchaseOrder(poNumber);

    // --- Get JSON or CSV ---
    let data: any;
    if (response && typeof response === "object" && "json" in response && typeof response.json === "function") {
      data = await response.json();
    } else if (typeof response === "string") {
      // parse CSV into JSON if backend returns CSV
      const parsed = Papa.parse(response, { header: true, skipEmptyLines: true });
      data = parsed.data[0]; // assume first row is the order
    } else {
      throw new Error("Invalid response from API");
    }

    if (!data) {
      setMessage2("❌ No data found for this PO.");
      return;
    }

    // --- Setup PDF ---
    const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
    const margin = 40;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let y = margin;
    const lineHeight = 18;

    // --- Helper for page break ---
    const checkPageBreak = (height: number) => {
      if (y + height > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
    };

    // --- Order Header ---
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(`Purchase Order #${poNumber}`, margin, y);
    y += 25;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, margin, y);
    y += 25;

    // --- Order Details ---
    const orderFields: [string, any][] = [
      ["Customer Name", data.customer_name],
      ["Order Number", data.order_number],
      ["Company Order No", data.company_order_number],
      ["PO Number", data.po_number],
      ["Bags", data.bags],
      ["Yarn Count", data.yarn_count],
      ["Content", data.content],
      ["Spun", data.spun],
      ["Knitting Type", data.knitting_type],
      ["Dyeing Type", data.dyeing_type],
      ["Dyeing Color", data.dyeing_color],
      ["Finishing Type", data.finishing_type],
      ["Sizes", Array.isArray(data.sizes) ? data.sizes.join(", ") : data.sizes],
      ["Additional Info", data.additional_info || "-"],
    ];

    orderFields.forEach(([label, value]) => {
      checkPageBreak(lineHeight);
      doc.setFont("helvetica", "bold");
      doc.text(`${label}:`, margin, y);
      doc.setFont("helvetica", "normal");
      doc.text(String(value ?? "-"), margin + 150, y);
      y += lineHeight;
    });

    y += 15;

    // --- Labels Section ---
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Labels", margin, y);
    y += 20;

    const labels = Array.isArray(data.labels) ? data.labels : [];

    labels.forEach((label: any, idx: number) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      checkPageBreak(lineHeight * 8);
      doc.text(`Label #${idx + 1}`, margin, y);
      y += lineHeight;

      const labelFields: [string, any][] = [
        ["Vendor ID", label.vendor_id],
        ["Quality", label.quality],
        ["Printed/Woven", label.printed_woven],
        ["Elastic Type", label.elastic_type],
        ["Elastic Vendor ID", label.elastic_vendor_id || "-"],
        ["Sizes", Array.isArray(label.sizes) ? label.sizes.join(", ") : label.sizes || "-"],
        ["Trims", Array.isArray(label.trims) ? label.trims.join(", ") : label.trims || "-"],
        ["Additional Info", label.additional_info || "-"],
      ];

      labelFields.forEach(([key, value]) => {
        doc.setFont("helvetica", "bold");
        doc.text(`${key}:`, margin, y);
        doc.setFont("helvetica", "normal");
        doc.text(String(value), margin + 150, y);
        y += lineHeight;
      });

      y += 10; // space between labels
    });

    // --- Save PDF ---
    doc.save(`${poNumber}_PurchaseOrder.pdf`);
    setMessage2(`📄 Purchase Order #${poNumber} downloaded successfully!`);
  } catch (err) {
    console.error(err);
    setMessage2("❌ Error generating PDF from PO data.");
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
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-indigo-700 mb-3">Purchase Orders</h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Manage and receive new orders with multiple labels or download existing purchase orders.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-10 mb-12 hover:shadow-indigo-200 transition-shadow duration-300"
      >
        <h2 className="text-2xl font-bold text-indigo-700 mb-8 text-center">Receive New Order</h2>

        <form onSubmit={handleReceiveOrder} className="space-y-4">
          {/* Order fields (excluding sizes and labels) */}
          {Object.entries(orderData)
            .filter(([key]) => key !== "labels" && key !== "sizes")
            .map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                  {key.replaceAll("_", " ")}
                </label>
                <input
                  type={key === "bags" || key === "yarn_count" ? "number" : "text"}
                  value={value as string | number}
                  onChange={(e) =>
                    setOrderData((prev) => ({
                      ...prev,
                      [key]:
                        key === "bags" || key === "yarn_count"
                          ? Number(e.target.value)
                          : e.target.value,
                    }))
                  }
                  placeholder={`Enter ${key.replaceAll("_", " ")}`}
                  className="w-full rounded-xl border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                />
              </div>
            ))}

          {/* Sizes section (dynamic inputs) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sizes</label>
            {orderData.sizes.map((size, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  value={size}
                  onChange={(e) => {
                    const newSizes = [...orderData.sizes];
                    newSizes[index] = e.target.value;
                    setOrderData((prev) => ({ ...prev, sizes: newSizes }));
                  }}
                  placeholder="Enter size (e.g. S, M, L or 32x34)"
                  className="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                {orderData.sizes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      const newSizes = [...orderData.sizes];
                      newSizes.splice(index, 1);
                      setOrderData((prev) => ({ ...prev, sizes: newSizes }));
                    }}
                    className="ml-2 text-red-500 hover:text-red-700 font-bold"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={() => setOrderData((prev) => ({ ...prev, sizes: [...prev.sizes, ""] }))}
              className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
            >
              + Add Size
            </button>
          </div>

          {/* Dyeing Color field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dyeing Color</label>
            <input
              type="text"
              value={orderData.dyeing_color}
              onChange={(e) => setOrderData((prev) => ({ ...prev, dyeing_color: e.target.value }))}
              placeholder="Enter dyeing color (e.g. Red, Navy)"
              className="w-full rounded-xl border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            />
          </div>


          {/* Additional order-level info */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Additional Info</label>
            <textarea
              value={orderData.additional_info ?? ""}
              onChange={(e) => setOrderData((prev) => ({ ...prev, additional_info: e.target.value }))}
              placeholder="Enter any extra details or notes..."
              rows={3}
              className="w-full rounded-xl border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            />
          </div>

          {/* Labels */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3 text-indigo-600">Labels</h3>
            {labels.map((label, idx) => (
              <div key={idx} className="border p-4 rounded-xl mb-4 bg-white/70 shadow-inner">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(
                    ["vendor_id", "quality", "printed_woven", "elastic_type", "elastic_vendor_id", "trims", "sizes", "additional_info"] as (keyof Label)[]
                  ).map((field) => (
                    <div key={field}>
                      <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                        {field.replaceAll("_", " ")}
                      </label>
                      <input
                        type="text"
                        value={(label[field] ?? "") as string}
                        onChange={(e) => updateLabel(idx, field, e.target.value)}
                        placeholder={`Enter ${field.replaceAll("_", " ")}${field === "trims" || field === "sizes" ? " (comma-separated allowed)" : ""}`}
                        className="w-full rounded-xl border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
                      />
                    </div>
                  ))}
                </div>
                <button type="button" onClick={() => removeLabel(idx)} className="mt-2 text-sm text-red-500 hover:underline">
                  Remove Label
                </button>
              </div>
            ))}
            <button type="button" onClick={addLabel} className="px-4 py-2 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 shadow-md transition">
              + Add Label
            </button>
          </div>

          <motion.button whileTap={{ scale: 0.97 }} disabled={receiveLoading} type="submit" className="w-full mt-6 px-8 py-3 bg-indigo-500 text-white font-semibold rounded-xl hover:bg-indigo-600 shadow-md transition">
            {receiveLoading ? "Receiving..." : "Receive Order"}
          </motion.button>
        </form>

        {message1 && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`mt-6 text-center font-medium ${message1.includes("✅") ? "text-green-600" : "text-red-600"}`}>
            {message1}
          </motion.p>
        )}
      </motion.div>

      {/* Download PO Card */}
      <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-6xl bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-10 hover:shadow-sky-200 transition-shadow duration-300">
        <h2 className="text-2xl font-bold text-sky-600 mb-8 text-center">Download Purchase Order</h2>

        <form onSubmit={handleDownloadPO} className="flex flex-col md:flex-row md:items-end md:space-x-6 space-y-4 md:space-y-0">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">PO Number</label>
            <input type="text" value={poNumber} onChange={(e) => setPoNumber(e.target.value)} placeholder="Enter PO number" className="w-full rounded-xl border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm" />
          </div>

          <motion.button whileTap={{ scale: 0.97 }} disabled={downloadLoading} type="submit" className="w-full md:w-auto px-8 py-3 bg-sky-500 text-white font-semibold rounded-xl hover:bg-sky-600 shadow-md transition">
            {downloadLoading ? "Downloading..." : "Download PO"}
          </motion.button>
        </form>

        {message2 && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`mt-6 text-center font-medium ${message2.includes("📄") ? "text-green-600" : "text-red-600"}`}>{message2}</motion.p>}
      </motion.div>

      {/* Footer */}
      <p className="mt-14 text-gray-500 text-sm text-center">© {new Date().getFullYear()} Yarn Management System</p>
    </motion.div>
  );
}
