import axios from "axios";

const API_BASE = "http://192.168.43.173:5000/api"; // change to your backend URL

export const getAirQuality = async (city: string) => {
  const response = await axios.get(`${API_BASE}/air-quality/get?city=${city}`);
  return response.data;
};

export const getAirQualityHistory = async (city: string, days: number = 5) => {
  const response = await axios.get(`${API_BASE}/air-quality/history?city=${city}&days=${days}`);
  return response.data;
};


export const getAQIPredictions = async (city: string, days: number = 5) => {
  try {
    const response = await axios.get(`${API_BASE}/air-quality/predict?city=${city}&days=${days}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching predictions:", error);
    throw error;
  }
};
