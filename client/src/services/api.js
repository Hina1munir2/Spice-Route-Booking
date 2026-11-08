
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically attach JWT token to API requests.
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Get all restaurant services.
export const getServices = async () => {
  const response = await api.get("/services");
  return response.data.services;
};

// Get available booking slots.
export const getAvailableSlots = async (serviceId, date) => {
  const response = await api.get(
    `/services/${serviceId}/availability`,
    {
      params: { date },
    }
  );

  return response.data.availableSlots;
};

// Create a restaurant booking.
export const createBooking = async (bookingData) => {
  const response = await api.post("/bookings", bookingData);
  return response.data;
};

export default api;
