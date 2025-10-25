import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API,
  headers: {
    "Content-Type": "application/json",
  },
});


// Purchase Orders (PO) API

// Type for Purchase Order details \ example schema
export interface PurchaseOrder {
  po_number: string;
  vendor_name: string;
  date: string;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  total_amount: number;
  status: string;
}

// View PO Details
export const viewPurchaseOrder = async (poNumber: string): Promise<PurchaseOrder> => {
  try {
    const response = await api.get(`/view_po/${poNumber}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching PO details:", error);
    throw error;
  }
};

// Download PO
export const downloadPurchaseOrder = async (poNumber: string): Promise<Blob> => {
  try {
    const response = await api.get(`/download/${poNumber}`, {
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    console.error("Error downloading PO:", error);
    throw error;
  }
};

// Duplicate Download PO Endpoint
export const duplicateDownloadPO = async (poNumber: string): Promise<Blob> => {
  try {
    const response = await api.get(`/download_po/${poNumber}`, {
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    console.error("Error downloading duplicate PO:", error);
    throw error;
  }
};

export const viewAllPO = async () => {
  try {
    const response = await api.get("/view_all_po");
    console.log("✅ View All PO Response:", response.data);
    return response.data; // array of PO objects
  } catch (error: any) {
    console.error("❌ Error viewing all POs:", error.message);
    throw error;
  }
};

export default {
  viewPurchaseOrder,
  downloadPurchaseOrder,
  duplicateDownloadPO,
  viewAllPO
};