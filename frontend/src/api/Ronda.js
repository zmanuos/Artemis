import { getApiUrl } from "./Config.js";

const API_URL = getApiUrl("rondas");

// Obtener rondas (o una ronda específica si se proporciona un código)
export const getRondas = async (codigo = null) => {
  try {
    let url = API_URL;
    
    // Si se proporciona un código, se agrega como parámetro a la URL
    if (codigo) {
      url += `?codigo=${codigo}`;
    }
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    return await response.json();
  } catch (error) {
    console.error("Error obteniendo rondas:", error);
  }
};

export const createRonda = async (ronda) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ronda),
    });
    return await response.json();
  } catch (error) {
    console.error("Error creando ronda:", error);
  }
};

export const updateRonda = async (codigo, ronda) => {
  try {
    const response = await fetch(API_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ codigo, ...ronda }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error actualizando ronda:", error);
  }
};

export const deleteRonda = async (codigo) => {
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
    console.error("Error eliminando ronda:", error);
  }
};
