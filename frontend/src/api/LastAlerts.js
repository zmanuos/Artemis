import { getApiUrl } from "./Config.js";

const API_URL = getApiUrl("last_alerts");


export const getLastAlerts = async () => {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Error obteniendo logs:", error);
  }
};