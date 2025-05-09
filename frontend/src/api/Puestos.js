import { getApiUrl } from "./Config.js";

const API_URL = getApiUrl("puestos");

export const getPuestos = async () => {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data; 
  } catch (error) {
    console.error("Error obteniendo puestos:", error);
  }
};

export const createPuesto = async (descripcion, nombre_puesto) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        descripcion,
        nombre_puesto,
      }),
    });
    const data = await response.json();
    return data; 
  } catch (error) {
    console.error("Error creando puesto:", error);
  }
};

export const updatePuesto = async (codigo, descripcion, nombre_puesto) => {
  try {
    const response = await fetch(API_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        codigo,
        descripcion,
        nombre_puesto,
      }),
    });
    const data = await response.json();
    return data; 
  } catch (error) {
    console.error("Error actualizando puesto:", error);
  }
};

export const deletePuesto = async (codigo) => {
  try {
    const response = await fetch(API_URL, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        codigo,
      }),
    });
    const data = await response.json();
    return data; 
  } catch (error) {
    console.error("Error eliminando puesto:", error);
  }
};
