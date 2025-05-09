import { getApiUrl } from "./Config.js";

const API_URL = getApiUrl("areas");

export const getAreas = async () => {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Error obteniendo áreas:", error);
  }
};

export const createArea = async (area) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(area),
    });
    return await response.json();
  } catch (error) {
    console.error("Error creando área:", error);
  }
};

export const updateArea = async (codigo_area, area) => {
  try {
    const response = await fetch(API_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ codigo_area, ...area }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error actualizando área:", error);
  }
};

export const deleteArea = async (codigo_area) => {
  try {
    const response = await fetch(API_URL, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ codigo_area }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error eliminando área:", error);
  }
};
