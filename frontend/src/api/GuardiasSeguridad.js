import { getApiUrl } from "./Config.js";

const API_URL = getApiUrl("guardias_seguridad");

export const getGuardias = async () => {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Error obteniendo guardias:", error);
  }
};

export const createGuardia = async (guardia) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(guardia),
    });
    return await response.json();
  } catch (error) {
    console.error("Error creando guardia:", error);
  }
};

export const updateGuardia = async (id, guardia) => {
  try {
    const response = await fetch(API_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, ...guardia }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error actualizando guardia:", error);
  }
};

export const deleteGuardia = async (id) => {
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
    console.error("Error eliminando guardia:", error);
  }
};
