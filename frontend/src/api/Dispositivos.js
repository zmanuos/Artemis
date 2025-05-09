import { getApiUrl } from "./Config.js";

const API_URL = getApiUrl("dispositivos");

export const getDispositivos = async () => {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Error obteniendo dispositivos:", error);
  }
};

export const createDispositivo = async (dispositivo) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dispositivo),
    });
    return await response.json();
  } catch (error) {
    console.error("Error creando dispositivo:", error);
  }
};

export const updateDispositivo = async (codigo, dispositivo) => {
  try {
    const response = await fetch(API_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ codigo, ...dispositivo }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error actualizando dispositivo:", error);
  }
};

export const updateEstadoDispositivo = async (codigo, estado) => {
  try {
    const response = await fetch(API_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ codigo, estado }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error actualizando estado del dispositivo:", error);
  }
};

export const deleteDispositivo = async (codigo) => {
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
    console.error("Error eliminando dispositivo:", error);
  }
};
