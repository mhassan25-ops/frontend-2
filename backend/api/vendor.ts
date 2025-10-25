import axios from "axios";

// --- Base API Setup ---
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API,
  headers: {
    "Content-Type": "application/json",
  },
});

// --- Vendor Data Type ---
export interface Vendor {
  company_name: string;
  broker_name: string;
  contract_type: string;
  contact: string;
  gst_number: string;
  prefix: string;
}

// --- API Functions --------------------------------------------------------

// Register a new vendor
export const registerVendor = async (vendor: Vendor) => {
  try {
    const response = await api.post("/register_vendor/", vendor);
    return response.data;
  } catch (error: any) {
    console.error("Error registering vendor:", error.message);
    throw error;
  }
};

// View a vendor by ID
export const viewVendor = async (vendorId: string) => {
  try {
    const response = await api.get(`/view_vendor/${vendorId}`);
    return response.data;
  } catch (error: any) {
    console.error("Error viewing vendor:", error.message);
    throw error;
  }
};

// Delete a vendor by ID
export const deleteVendor = async (vendorId: string) => {
  try {
    const response = await api.delete(`/delete_vendor/${vendorId}`);
    return response.data;
  } catch (error: any) {
    console.error("Error deleting vendor:", error.message);
    throw error;
  }
};

export const viewAllVendors = async () => {
  try {
    const response = await api.get("/view_all_vendors");
    console.log("✅ View All Vendors Response:", response.data);
    return response.data; // array of vendor objects
  } catch (error: any) {
    console.error("❌ Error viewing all vendors:", error.message);
    throw error;
  }
};