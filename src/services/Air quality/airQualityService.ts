import axios from "axios";

const API_BASE = "http://192.168.43.173:5000/api"; // change to your backend URL

export const getAirQuality = async (city: string) => {
  const response = await axios.get(`${API_BASE}/air-quality?city=${city}`);
  return response.data;
};

export const getAirQualityHistory = async (city: string, days: number = 5) => {
  const response = await axios.get(
    `${API_BASE}/air-quality/history?city=${city}&days=${days}`
  );
  return response.data;
};
