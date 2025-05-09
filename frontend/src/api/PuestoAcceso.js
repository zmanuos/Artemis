import { getApiUrl } from "./Config.js";

const API_URL = getApiUrl("puesto_acceso");



export const getPuestosAcceso = async () => {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Error obteniendo puestos de acceso:", error);
  }
};

export const createPuestoAcceso = async (puestoAcceso) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(puestoAcceso),
    });
    return await response.json();
  } catch (error) {
    console.error("Error creando puesto de acceso:", error);
  }
};

export const updatePuestoAcceso = async (codigo, puestoAcceso) => {
  try {
    const response = await fetch(API_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ codigo, ...puestoAcceso }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error actualizando puesto de acceso:", error);
  }
};

export const deletePuestoAcceso = async (codigo) => {
  try {
    const response = await fetch(API_URL, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ codigo }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error eliminando puesto de acceso:", error);
  }
};
