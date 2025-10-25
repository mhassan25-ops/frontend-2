import axios from "axios";

// --- Base API Setup ---
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API,
  headers: {
    "Content-Type": "application/json",
  },
});

// --- Process Yarn Function Types ---
export interface YarnProcessInput {
  po_number: string;
  amount: number;
  deliver: number;
}

// --- Yarn Tracking Response Type ---
export interface YarnTracking {
  [key: string]: any; // flexible type for now
}

// --- API FUNCTIONS -----------------------------------------------

// Process yarn in Knitting stage
export const processKnittingYarn = async (data: YarnProcessInput) => {
  try {
    const response = await api.put(
      `/knitting/process_yarn/?po_number=${data.po_number}&amount=${data.amount}&deliver=${data.deliver}`
    );
    return response.data;
  } catch (error: any) {
    console.error("Error processing knitting yarn:", error.message);
    throw error;
  }
};

// Process yarn in DYEING stage
export const processDyeingYarn = async (data: YarnProcessInput) => {
  try {
    const response = await api.put(
      `/dying/process_yarn/?po_number=${data.po_number}&amount=${data.amount}&deliver=${data.deliver}`
    );
    return response.data;
  } catch (error: any) {
    console.error("Error processing dyeing yarn:", error.message);
    throw error;
  }
};

// Process yarn in TRIMMING stage
export const processTrimmingYarn = async (data: YarnProcessInput) => {
  try {
    const response = await api.put(
      `/trim/process_yarn/?po_number=${data.po_number}&amount=${data.amount}&deliver=${data.deliver}`
    );
    return response.data;
  } catch (error: any) {
    console.error("Error processing trimming yarn:", error.message);
    throw error;
  }
};

// --- Yarn Tracking APIs -----------------------------------------

// View all yarn in KNITTING stage
export const viewKnittingYarn = async () => {
  try {
    const response = await api.get("/knitting/yarn/");
    return response.data;
  } catch (error: any) {
    console.error("Error viewing knitting yarn:", error.message);
    throw error;
  }
};

// View all yarn in DYEING stage
export const viewDyeingYarn = async () => {
  try {
    const response = await api.get("/dying/yarn/");
    return response.data;
  } catch (error: any) {
    console.error("Error viewing dyeing yarn:", error.message);
    throw error;
  }
};

// View all yarn in TRIMMING stage
export const viewTrimmingYarn = async () => {
  try {
    const response = await api.get("/trim/yarn/");
    return response.data;
  } catch (error: any) {
    console.error("Error viewing trimming yarn:", error.message);
    throw error;
  }
};

// Admin view of all yarn tracking
export const viewAdminYarn = async () => {
  try {
    const response = await api.get("/admin/yarn/");
    return response.data;
  } catch (error: any) {
    console.error("Error viewing admin yarn tracking:", error.message);
    throw error;
  }
};