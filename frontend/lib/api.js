/**
 * lib/api.js
 * Servicio central de API con refresh automático de tokens.
 *
 * CÓMO FUNCIONA EL SISTEMA DE TOKENS:
 * ─────────────────────────────────────
 * 1. Al hacer login el backend devuelve dos tokens:
 *    - accessToken:  dura 15 min, se envía en cada petición como "Bearer ..."
 *    - refreshToken: dura 7 días, solo se usa para pedir un nuevo accessToken
 *
 * 2. Cuando el accessToken expira, el backend responde 401 "Sesión no válida".
 *
 * 3. El interceptor de esta función detecta ese 401, llama a /auth/refresh
 *    con el refreshToken, guarda el nuevo accessToken y reintenta la petición
 *    original automáticamente. El usuario nunca se da cuenta.
 *
 * 4. Si el refreshToken también expiró (después de 7 días sin usar la app),
 *    se limpia la sesión y se redirige al login.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const API_TIMEOUT = parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || "30000", 10);
const AUTH_BASE = `${API_URL}/auth`;

// Claves del localStorage — centralizadas para no escribirlas a mano en cada lugar
const KEYS = {
  ACCESS_TOKEN:  "accessToken",
  REFRESH_TOKEN: "refreshToken",
  USER:          "usuario",
};

// ─────────────────────────────────────────────
// ERRORES
// ─────────────────────────────────────────────

export class APIError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name   = "APIError";
    this.status = status;
    this.data   = data;
  }
}

// ─────────────────────────────────────────────
// SESIÓN — guardar / leer / limpiar
// ─────────────────────────────────────────────

export function saveSession({ accessToken, refreshToken, user }) {
  if (typeof window === "undefined") return;
  if (accessToken)  localStorage.setItem(KEYS.ACCESS_TOKEN,  accessToken);
  if (refreshToken) localStorage.setItem(KEYS.REFRESH_TOKEN, refreshToken);
  if (user)         localStorage.setItem(KEYS.USER, JSON.stringify(user));
}

export function getAccessToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(KEYS.ACCESS_TOKEN);
}

export function getRefreshToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(KEYS.REFRESH_TOKEN);
}

export function getSessionUser() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEYS.USER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearSession() {
  if (typeof window === "undefined") return;
  Object.values(KEYS).forEach((key) => localStorage.removeItem(key));
}

// ─────────────────────────────────────────────
// REFRESH — pedir nuevo accessToken
// ─────────────────────────────────────────────

let isRefreshing = false;          // Evita que múltiples peticiones simultáneas hagan refresh al mismo tiempo
let refreshQueue = [];             // Cola de peticiones que esperan el nuevo token

function processQueue(newToken, error) {
  refreshQueue.forEach((cb) => (error ? cb.reject(error) : cb.resolve(newToken)));
  refreshQueue = [];
}

async function doRefresh() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new APIError("Sin refresh token", 401, null);

  const response = await fetch(`${AUTH_BASE}/refresh`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ refreshToken }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new APIError(
      data?.error || "Sesión expirada",
      response.status,
      data
    );
  }

  // El backend devuelve { success, data: { accessToken, refreshToken } }
  const session = data?.data || {};
  if (session.accessToken)  localStorage.setItem(KEYS.ACCESS_TOKEN,  session.accessToken);
  if (session.refreshToken) localStorage.setItem(KEYS.REFRESH_TOKEN, session.refreshToken);

  return session.accessToken;
}

// ─────────────────────────────────────────────
// FETCH CON INTERCEPTOR DE TOKEN
// ─────────────────────────────────────────────
// Esta es la función central. Todas las peticiones pasan por aquí.
// Si recibe un 401, intenta hacer refresh y reintenta la petición.

async function request(url, options = {}, retry = true) {
  const controller = new AbortController();
  const timeoutId  = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      signal:  controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);
    const data = await response.json().catch(() => null);

    // ── Token expirado: intentar refresh ──────────────────────
    if (response.status === 401 && retry) {
      // Si ya hay un refresh en curso, encolar esta petición
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push({
            resolve: (newToken) => resolve(
              request(url, {
                ...options,
                headers: { ...options.headers, Authorization: `Bearer ${newToken}` },
              }, false)
            ),
            reject,
          });
        });
      }

      isRefreshing = true;

      try {
        const newToken = await doRefresh();
        processQueue(newToken, null);
        isRefreshing = false;

        // Reintentar la petición original con el nuevo token
        return request(url, {
          ...options,
          headers: { ...options.headers, Authorization: `Bearer ${newToken}` },
        }, false);

      } catch (refreshError) {
        processQueue(null, refreshError);
        isRefreshing = false;

        // El refresh falló → sesión completamente expirada → ir al login
        clearSession();
        if (typeof window !== "undefined") {
          window.location.href = "/";
        }
        throw new APIError("Sesión expirada. Inicia sesión de nuevo.", 401, null);
      }
    }
    if (!response.ok) {
      throw new APIError(
        data?.error || data?.message || `Error ${response.status}`,
        response.status,
        data
      );
    }

    return data;

  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === "AbortError") throw new APIError("Tiempo de espera agotado", 408, null);
    if (error instanceof APIError)   throw error;
    throw new APIError(error.message || "Error de red", 0, null);
  }
}

// Shorthand con token automático desde localStorage
function authRequest(url, options = {}) {
  const token = getAccessToken();
  return request(url, {
    ...options,
    headers: {
      ...options.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}

// ─────────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────────

export async function loginUsuario(email, password) {
  try {
    if (!email || !password) throw new APIError("Email y contraseña requeridos", 400);

    const data = await request(`${AUTH_BASE}/login`, {
      method: "POST",
      body:   JSON.stringify({ email, password }),
    });

    const session = data?.data || {};
    return {
      success:      true,
      data:         session.user         || null,
      accessToken:  session.accessToken  || null,
      refreshToken: session.refreshToken || null,
      error:        null,
    };
  } catch (error) {
    return { success: false, data: null, accessToken: null, refreshToken: null, error: error.message };
  }
}

export async function logoutUsuario() {
  try {
    // Avisar al backend para revocar el refresh token en la BD
    await authRequest(`${AUTH_BASE}/logout`, { method: "POST" });
  } catch {
    // Si falla la petición igual limpiamos localmente
  } finally {
    clearSession();
  }
}

export async function registrarUsuario(full_name, email, password) {
  try {
    if (!full_name || !email || !password) throw new APIError("Todos los campos son requeridos", 400);
    const data = await request(`${AUTH_BASE}/register`, {
      method: "POST",
      body:   JSON.stringify({ full_name, email, password }),
    });
    return { success: true, data: data?.data || null, error: null };
  } catch (error) {
    return { success: false, data: null, error: error.message };
  }
}

export async function getProfile() {
  try {
    const data = await authRequest(`${AUTH_BASE}/me`);
    return { success: true, data: data?.data || null, error: null };
  } catch (error) {
    return { success: false, data: null, error: error.message };
  }
}

// ─────────────────────────────────────────────
// USUARIOS
// ─────────────────────────────────────────────

export async function getUsuarios() {
  try {
    const data = await authRequest(`${API_URL}/usuarios`);
    return { success: true, data: data?.data || [], total: data?.total || 0, error: null };
  } catch (error) {
    return { success: false, data: [], total: 0, error: error.message };
  }
}

// NUEVO: Editar rol y/o área de un usuario
export async function actualizarUsuario(id, updates) {
  try {
    if (!id) throw new APIError("ID requerido", 400);
    const data = await authRequest(`${API_URL}/usuarios/${id}`, {
      method: "PATCH",
      body:   JSON.stringify(updates),
    });
    return { success: true, data: data?.data || null, error: null };
  } catch (error) {
    return { success: false, data: null, error: error.message };
  }
}

// NUEVO: Activar o desactivar un usuario
export async function toggleUsuario(id) {
  try {
    if (!id) throw new APIError("ID requerido", 400);
    const data = await authRequest(`${API_URL}/usuarios/${id}/toggle`, {
      method: "PATCH",
    });
    return { success: true, data: data?.data || null, message: data?.message, error: null };
  } catch (error) {
    return { success: false, data: null, error: error.message };
  }
}

export async function getUsuarioById(id) {
  try {
    if (!id) throw new APIError("ID requerido", 400);
    const data = await authRequest(`${API_URL}/usuarios/${id}`);
    return { success: true, data: data?.data || null, error: null };
  } catch (error) {
    return { success: false, data: null, error: error.message };
  }
}

// ─────────────────────────────────────────────
// INVENTARIO
// ─────────────────────────────────────────────

export async function getInventario() {
  try {
    const data = await authRequest(`${API_URL}/inventario`);
    return { success: true, data: data?.data || [], error: null };
  } catch (error) {
    return { success: false, data: [], error: error.message };
  }
}

export async function crearItemInventario(itemData) {
  try {
    if (!itemData) throw new APIError("Datos requeridos", 400);
    const data = await authRequest(`${API_URL}/inventario`, {
      method: "POST",
      body:   JSON.stringify(itemData),
    });
    return { success: true, data: data?.data || null, error: null };
  } catch (error) {
    return { success: false, data: null, error: error.message };
  }
}

export async function actualizarItemInventario(id, itemData) {
  try {
    if (!id) throw new APIError("ID requerido", 400);
    const data = await authRequest(`${API_URL}/inventario/${id}`, {
      method: "PATCH",
      body:   JSON.stringify(itemData),
    });
    return { success: true, data: data?.data || null, error: null };
  } catch (error) {
    return { success: false, data: null, error: error.message };
  }
}

export async function eliminarItemInventario(id) {
  try {
    if (!id) throw new APIError("ID requerido", 400);
    await authRequest(`${API_URL}/inventario/${id}`, { method: "DELETE" });
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// ─────────────────────────────────────────────
// ÁREAS
// ─────────────────────────────────────────────

export async function getAreas() {
  try {
    const data = await authRequest(`${API_URL}/areas`);
    return { success: true, data: data?.data || [], error: null };
  } catch (error) {
    return { success: false, data: [], error: error.message };
  }
}

export async function crearArea(areaData) {
  try {
    const data = await authRequest(`${API_URL}/areas`, {
      method: "POST",
      body:   JSON.stringify(areaData),
    });
    return { success: true, data: data?.data || null, error: null };
  } catch (error) {
    return { success: false, data: null, error: error.message };
  }
}

export async function getTodasLasAreas() {
  try {
    const data = await authRequest(`${API_URL}/areas?incluir_inactivas=true`);
    return { success: true, data: data?.data || [], error: null };
  } catch (error) {
    return { success: false, data: [], error: error.message };
  }
}
 
// Editar un área existente (nombre, descripción, is_active)
export async function editarArea(id, updates) {
  try {
    if (!id) throw new APIError("ID requerido", 400);
    const data = await authRequest(`${API_URL}/areas/${id}`, {
      method: "PATCH",
      body:   JSON.stringify(updates),
    });
    return { success: true, data: data?.data || null, error: null };
  } catch (error) {
    return { success: false, data: null, error: error.message };
  }
}

// ─────────────────────────────────────────────
// PRÉSTAMOS
// ─────────────────────────────────────────────

export async function getPrestamos() {
  try {
    const data = await authRequest(`${API_URL}/prestamos`);
    return { success: true, data: data?.data || [], total: data?.total || 0, error: null };
  } catch (error) {
    return { success: false, data: [], total: 0, error: error.message };
  }
}

export async function crearPrestamo(prestamoData) {
  try {
    const data = await authRequest(`${API_URL}/prestamos`, {
      method: "POST",
      body:   JSON.stringify(prestamoData),
    });
    return { success: true, data: data?.data || null, error: null };
  } catch (error) {
    return { success: false, data: null, error: error.message };
  }
}

export async function devolverPrestamo(id) {
  try {
    const data = await authRequest(`${API_URL}/prestamos/${id}/devolver`, {
      method: "PATCH",
    });
    return { success: true, data: data?.data || null, error: null };
  } catch (error) {
    return { success: false, data: null, error: error.message };
  }
}

// ─────────────────────────────────────────────
// HEALTH CHECK
// ─────────────────────────────────────────────

export async function healthCheck() {
  try {
    const data = await request(`${API_URL}/health`);
    return { success: true, status: data?.status || "OK", error: null };
  } catch (error) {
    return { success: false, status: "ERROR", error: error.message };
  }
}

// ─────────────────────────────────────────────
// PERFIL
// ─────────────────────────────────────────────

// Actualizar nombre del perfil
export async function actualizarPerfil(datos) {
  try {
    const data = await authRequest(`${AUTH_BASE}/me`, {
      method: "PATCH",
      body:   JSON.stringify(datos),
    });
    return { success: true, data: data?.data || null, error: null };
  } catch (error) {
    return { success: false, data: null, error: error.message };
  }
}

// Cambiar contraseña
export async function cambiarPassword({ currentPassword, newPassword }) {
  try {
    const data = await authRequest(`${AUTH_BASE}/password`, {
      method: "PATCH",
      body:   JSON.stringify({ currentPassword, newPassword }),
    });
    return { success: true, data: data?.data || null, error: null };
  } catch (error) {
    return { success: false, data: null, error: error.message };
  }
}

// ─────────────────────────────────────────────
// EXPORT DEFAULT — objeto consolidado
// ─────────────────────────────────────────────

const apiService = {
  // Auth
  loginUsuario,
  logoutUsuario,
  registrarUsuario,
  getProfile,
  saveSession,
  clearSession,
  getSessionUser,
  getAccessToken,
  // Usuarios
  getUsuarios,
  getUsuarioById,
  // Inventario
  getInventario,
  crearItemInventario,
  actualizarItemInventario,
  eliminarItemInventario,
  // Áreas
  getAreas,
  crearArea,
  getTodasLasAreas,
  editarArea,
  // Préstamos
  getPrestamos,
  crearPrestamo,
  devolverPrestamo,
  // Utilidades
  healthCheck,
  actualizarUsuario,
  toggleUsuario,
  //perfil
  actualizarPerfil,
  cambiarPassword,
};

export default apiService;