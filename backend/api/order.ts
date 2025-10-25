import axios from "axios";

// ---  API Setup ---
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API,
  headers: {
    "Content-Type": "application/json",
  },
});

// --- Label Schema ---
export interface Label {
  vendor_id: string;
  quality: string;
  printed_woven: string;
  elastic_type: string;
  elastic_vendor_id?: string | null;
  trims?: string[];
}

// --- Order Schema ---
export interface Order {
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
  dyeing_color: string; 
  finishing_type: string;
  po_number: string;
  labels?: Label[] | null;
}


// --- API Function -------------------------------------

// 1️⃣ Create (Receive) a new order
export const receiveOrder = async (data: Order) => {
  try {
    const response = await api.post("/receive_order/", data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Error receiving order:", error.response?.data || error.message);
    throw error;
  }
};
