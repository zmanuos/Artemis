import { getApiUrl } from "./Config.js";

const API_URL = getApiUrl("patrol_reports");

export const getPatrolReports = async () => {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Error obteniendo los reportes de patrullas:", error);
  }
};
