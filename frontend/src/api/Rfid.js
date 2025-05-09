import { getApiUrl } from "./Config.js";

const API_URL = getApiUrl("rfid");


export const getRFID = async () => {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Error obteniendo RFID:", error);
  }
};

export const createRFID = async (rfid) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(rfid),
    });
    return await response.json();
  } catch (error) {
    console.error("Error creando RFID:", error);
  }
};

export const updateRFID = async (id_RFID, rfid) => {
  try {
    const response = await fetch(API_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id_RFID, ...rfid }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error actualizando RFID:", error);
  }
};

export const deleteRFID = async (id_RFID) => {
  try {
    const response = await fetch(API_URL, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id_RFID }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error eliminando RFID:", error);
  }
};
