import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Get all restaurant services.
export const getServices = async () => {
  const response = await api.get("/services");
  return response.data.services;
};

// Get available slots for a selected service and date.
export const getAvailableSlots = async (serviceId, date) => {
  const response = await api.get(
    `/services/${serviceId}/availability`,
    {
      params: { date },
    }
  );

  return response.data.availableSlots;
};

// Submit a restaurant booking.
export const createBooking = async (bookingData) => {
  const response = await api.post("/bookings", bookingData);
  return response.data;
};

export default api;