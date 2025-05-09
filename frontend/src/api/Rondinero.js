import { getApiUrl } from "./Config.js";

const API_URL = getApiUrl("rondinero");

export const getRondineros = async () => {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Error obteniendo rondineros:", error);
  }
};

export const createRondinero = async (rondinero) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(rondinero),
    });
    return await response.json();
  } catch (error) {
    console.error("Error creando rondinero:", error);
  }
};

export const updateRondinero = async (ID, rondinero) => {
  try {
    const response = await fetch(API_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ID, ...rondinero }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error actualizando rondinero:", error);
  }
};

export const deleteRondinero = async (ID) => {
  try {
    const response = await fetch(API_URL, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ID }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error eliminando rondinero:", error);
  }
};
