import { getApiUrl } from "./Config.js";

const API_URL = getApiUrl("reporte_accesos");

export const getReportesAcceso = async () => {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Error obteniendo reportes de acceso:", error);
  }
};

export const createReporteAcceso = async (reporteAcceso) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reporteAcceso),
    });
    return await response.json();
  } catch (error) {
    console.error("Error creando reporte de acceso:", error);
  }
};

export const updateReporteAcceso = async (numero, reporteAcceso) => {
  try {
    const response = await fetch(API_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ numero, ...reporteAcceso }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error actualizando reporte de acceso:", error);
  }
};

export const deleteReporteAcceso = async (numero) => {
  try {
    const response = await fetch(API_URL, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ numero }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error eliminando reporte de acceso:", error);
  }
};
