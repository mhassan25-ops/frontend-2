import axios from "axios";

// --- Base API Setup ---
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API,
  headers: {
    "Content-Type": "application/json",
  },
});

// --- Yarn Request Schema ---
export interface YarnRequest {
  count: number;
  content: string;
  spun_type: string;
  bags: number;
  kgs: number;
  status?: string; // optional, default is "pending"
}

// --- Yarn Received Schema ---
export interface YarnReceived {
  spun_type: string;
  kgs_received: number;
  bags_recevied: number;
  received_date: string; // use ISO format: "2025-10-20T10:00:00Z"
  vendor_id: string;
  order_no: string
}

// --- API Functions -------------------------------------------------

// Create a new yarn request
export const requestYarn = async (data: YarnRequest) => {
  try {
    const response = await api.post("/request_yarn/", data);
    return response.data;
  } catch (error: any) {
    console.error("Error requesting yarn:", error.message);
    throw error;
  }
};

// View yarn requests (optionally filter by status)
export const viewYarn = async (status?: string) => {
  try {
    const url = status ? `/view_yarn/?status=${status}` : "/view_yarn/";
    const response = await api.get(url);
    return response.data;
  } catch (error: any) {
    console.error("Error viewing yarn:", error.message);
    throw error;
  }
};

// Record received yarn
export const receiveYarn = async (data: YarnReceived) => {
  try {
    const response = await api.put("/receive_yarn/", data);
    return response.data;
  } catch (error: any) {
    console.error("Error receiving yarn:", error.message);
    throw error;
  }
};

export const viewAllYarn = async () => {
  try {
    const response = await api.get("/view_all_yarn");
    console.log("View All Yarn Response:", response.data);
    return response.data; // array of yarn objects
  } catch (error: any) {
    console.error("❌ Error viewing all yarn:", error.message);
    throw error;
  }
};