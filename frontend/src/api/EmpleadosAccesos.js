import { getApiUrl } from "./Config.js";

const API_URL = getApiUrl("empleados_accesos");


export const getEmpleadoAccesos = async () => {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Error obteniendo empleado accesos:", error);
  }
};

export const createEmpleadoAcceso = async (empleadoAcceso) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(empleadoAcceso),
    });
    return await response.json();
  } catch (error) {
    console.error("Error creando empleado acceso:", error);
  }
};

export const updateEmpleadoAcceso = async (numero, empleadoAcceso) => {
  try {
    const response = await fetch(API_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ numero, ...empleadoAcceso }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error actualizando empleado acceso:", error);
  }
};

export const deleteEmpleadoAcceso = async (numero) => {
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
    console.error("Error eliminando empleado acceso:", error);
  }
};
