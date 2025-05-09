import { getApiUrl } from "./Config.js";

const API_URL = getApiUrl("alertas");

export const getAlertas = async () => {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Error obteniendo alertas:", error);
  }
};

export const createAlerta = async (alerta) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(alerta),
    });
    return await response.json();
  } catch (error) {
    console.error("Error creando alerta:", error);
  }
};

export const updateAlerta = async (id, alerta) => {
  try {
    const response = await fetch(API_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, ...alerta }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error actualizando alerta:", error);
  }
};

export const deleteAlerta = async (id) => {
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
    console.error("Error eliminando alerta:", error);
  }
};
