import { getApiUrl } from "./Config.js";

const API_URL = getApiUrl("reportes");

export const getReportes = async () => {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Error obteniendo reportes:", error);
  }
};

export const createReporte = async (reporte) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reporte),
    });
    return await response.json();
  } catch (error) {
    console.error("Error creando reporte:", error);
  }
};

export const updateReporte = async (id, reporte) => {
  try {
    const response = await fetch(API_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, ...reporte }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error actualizando reporte:", error);
  }
};

export const deleteReporte = async (id) => {
  try {
    const response = await fetch(API_URL, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error eliminando reporte:", error);
  }
};
