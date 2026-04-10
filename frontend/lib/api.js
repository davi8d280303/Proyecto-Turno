/**
 * Servicio de API - Funciones para consumir la API del backend
 * Maneja: Request/Response, Errores, Timeouts, Reintentos y Gestión de Inventario
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const API_TIMEOUT = parseInt(
  process.env.NEXT_PUBLIC_API_TIMEOUT || "30000",
  10,
);
const AUTH_BASE = `${API_URL}/auth`;

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const USER_SESSION_KEY = "usuario";

/**
 * Clase personalizada para errores de API
 */
export class APIError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = "APIError";
    this.status = status;
    this.data = data;
  }
}

/**
 * Realizar solicitud HTTP con manejo de errores y timeout
 */
async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new APIError(
        data?.error || `Error ${response.status}`,
        response.status,
        data,
      );
    }

    return data;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === "AbortError") {
      throw new APIError("Tiempo de espera agotado", 408, null);
    }

    if (error instanceof APIError) {
      throw error;
    }

    throw new APIError(error.message || "Error de red", 0, null);
  }
}

/* ==========================================
   GESTIÓN DE SESIÓN
   ========================================== */

export function saveSession({ accessToken, refreshToken, user }) {
  if (typeof window === "undefined") return;

  if (accessToken) {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  }

  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }

  if (user) {
    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(user));
  }
}

export function clearSession() {
  if (typeof window === "undefined") return;

  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_SESSION_KEY);
}

/* ==========================================
   MÓDULO DE AUTENTICACIÓN Y USUARIOS
   ========================================== */

export async function loginUsuario(email, password) {
  try {
    if (!email || !password) {
      throw new APIError("Email y contraseña requeridos", 400);
    }

    const data = await fetchWithTimeout(`${AUTH_BASE}/login`, {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    const session = data?.data || {};

    return {
      success: true,
      data: session.user || null,
      accessToken: session.accessToken || null,
      refreshToken: session.refreshToken || null,
      error: null,
    };
  } catch (error) {
    console.error("Error en loginUsuario:", error);
    return {
      success: false,
      data: null,
      accessToken: null,
      refreshToken: null,
      error: error.message || "Error al iniciar sesión",
    };
  }
}

export async function getUsuarios(accessToken) {
  try {
    const data = await fetchWithTimeout(`${API_URL}/usuarios`, {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    });

    return {
      success: true,
      data: data?.data || [],
      total: data?.total || 0,
      error: null,
    };
  } catch (error) {
    console.error("Error en getUsuarios:", error);
    return {
      success: false,
      data: [],
      total: 0,
      error: error.message || "Error al obtener usuarios",
    };
  }
}

export async function getUsuarioById(id, accessToken) {
  try {
    if (!id) {
      throw new APIError("ID de usuario requerido", 400);
    }

    const data = await fetchWithTimeout(`${API_URL}/usuarios/${id}`, {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    });

    return {
      success: true,
      data: data?.data || null,
      error: null,
    };
  } catch (error) {
    console.error(`Error en getUsuarioById(${id}):`, error);
    return {
      success: false,
      data: null,
      error: error.message || "Error al obtener usuario",
    };
  }
}

export async function registrarUsuario(full_name, email, password) {
  try {
    if (!full_name || !email || !password) {
      throw new APIError("Todos los campos son requeridos", 400);
    }

    const data = await fetchWithTimeout(`${AUTH_BASE}/register`, {
      method: "POST",
      body: JSON.stringify({ full_name, email, password }),
    });

    return {
      success: true,
      data: data?.data || null,
      error: null,
    };
  } catch (error) {
    console.error("Error en registrarUsuario:", error);
    return {
      success: false,
      data: null,
      error: error.message || "Error al registrarse",
    };
  }
}

/* ==========================================
   MÓDULO DE INVENTARIO (OPTIMIZADO)
   ========================================== */

export async function getInventario(accessToken) {
  try {
    const data = await fetchWithTimeout(`${API_URL}/inventario`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return { success: true, data: data?.data || [] };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function crearItemInventario(itemData, accessToken) {
  try {
    // Verificación preventiva
    if (!accessToken)
      throw new Error("Sesión expirada. Inicie sesión nuevamente.");

    const data = await fetchWithTimeout(`${API_URL}/inventario`, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify(itemData),
    });

    return { success: true, data: data?.data || null };
  } catch (error) {
    console.error("Error en crearItemInventario:", error);
    return { success: false, error: error.message };
  }
}

/* ==========================================
   MÓDULO DE PRÉSTAMOS
   ========================================== */

export async function getPrestamos() {
  try {
    const data = await fetchWithTimeout(`${API_URL}/prestamos`);
    return {
      success: true,
      data: data?.data || [],
      total: data?.total || 0,
      error: null,
    };
  } catch (error) {
    console.error("Error en getPrestamos:", error);
    return {
      success: false,
      data: [],
      total: 0,
      error: error.message || "Error al obtener préstamos",
    };
  }
}

export async function getPrestamoById(id) {
  try {
    if (!id) {
      throw new APIError("ID de préstamo requerido", 400);
    }

    const data = await fetchWithTimeout(`${API_URL}/prestamos/${id}`);
    return {
      success: true,
      data: data?.data || null,
      error: null,
    };
  } catch (error) {
    console.error(`Error en getPrestamoById(${id}):`, error);
    return {
      success: false,
      data: null,
      error: error.message || "Error al obtener préstamo",
    };
  }
}

export async function crearPrestamo(prestamoData) {
  try {
    if (!prestamoData) {
      throw new APIError("Datos del préstamo requeridos", 400);
    }

    const data = await fetchWithTimeout(`${API_URL}/prestamos`, {
      method: "POST",
      body: JSON.stringify(prestamoData),
    });

    return {
      success: true,
      data: data?.data || null,
      error: null,
    };
  } catch (error) {
    console.error("Error en crearPrestamo:", error);
    return {
      success: false,
      data: null,
      error: error.message || "Error al crear préstamo",
    };
  }
}

export async function actualizarPrestamo(id, prestamoData) {
  try {
    if (!id || !prestamoData) {
      throw new APIError("ID y datos del préstamo requeridos", 400);
    }

    const data = await fetchWithTimeout(`${API_URL}/prestamos/${id}`, {
      method: "PUT",
      body: JSON.stringify(prestamoData),
    });

    return {
      success: true,
      data: data?.data || null,
      error: null,
    };
  } catch (error) {
    console.error(`Error en actualizarPrestamo(${id}):`, error);
    return {
      success: false,
      data: null,
      error: error.message || "Error al actualizar préstamo",
    };
  }
}

/* ==========================================
   OTROS
   ========================================== */

export async function healthCheck() {
  try {
    const data = await fetchWithTimeout(`${API_URL}/health`);
    return {
      success: true,
      status: data?.status || "OK",
      error: null,
    };
  } catch (error) {
    console.error("Error en healthCheck:", error);
    return {
      success: false,
      status: "ERROR",
      error: error.message || "API no disponible",
    };
  }
}

// OBJETO CONSOLIDADO PARA EXPORTACIÓN
const apiService = {
  getUsuarios,
  getUsuarioById,
  loginUsuario,
  getInventario, // Exportado
  crearItemInventario, // Exportado
  getPrestamos,
  getPrestamoById,
  crearPrestamo,
  actualizarPrestamo,
  healthCheck,
  saveSession,
  clearSession,
  registrarUsuario,
};

export default apiService;
