import { getApiUrl } from "./Config.js";

const API_URL = getApiUrl("accesos");

export const getAccesos = async () => {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Error obteniendo accesos:", error);
  }
};

export const createAcceso = async (acceso) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(acceso),
    });
    return await response.json();
  } catch (error) {
    console.error("Error creando acceso:", error);
  }
};

export const updateAcceso = async (id, acceso) => {
  try {
    const response = await fetch(API_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, ...acceso }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error actualizando acceso:", error);
  }
};

export const deleteAcceso = async (id) => {
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
    console.error("Error eliminando acceso:", error);
  }
};
