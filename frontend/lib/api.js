/**
 * Servicio de API - Funciones para consumir la API del backend
 * Maneja: Request/Response, Errores, Timeouts, Reintentos
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const API_TIMEOUT = parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000');

/**
 * Clase personalizada para errores de API
 */
export class APIError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'APIError';
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
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);

    // Parsear respuesta
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new APIError(
        data?.error || `Error ${response.status}`,
        response.status,
        data
      );
    }

    return data;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      throw new APIError('Tiempo de espera agotado', 408, null);
    }

    if (error instanceof APIError) {
      throw error;
    }

    throw new APIError(error.message || 'Error de red', 0, null);
  }
}

/**
 * GET - Obtener todos los usuarios
 */
export async function getUsuarios() {
  try {
    const data = await fetchWithTimeout(`${API_URL}/usuarios`);
    return {
      success: true,
      data: data?.data || [],
      total: data?.total || 0,
      error: null,
    };
  } catch (error) {
    console.error('Error en getUsuarios:', error);
    return {
      success: false,
      data: [],
      total: 0,
      error: error.message || 'Error al obtener usuarios',
    };
  }
}

/**
 * GET - Obtener usuario por ID
 */
export async function getUsuarioById(id) {
  try {
    if (!id) {
      throw new APIError('ID de usuario requerido', 400);
    }

    const data = await fetchWithTimeout(`${API_URL}/usuarios/${id}`);
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
      error: error.message || 'Error al obtener usuario',
    };
  }
}

/**
 * POST - Crear un nuevo usuario (login/registro)
 */
export async function loginUsuario(email, password) {
  try {
    if (!email || !password) {
      throw new APIError('Email y contraseña requeridos', 400);
    }

    const data = await fetchWithTimeout(`${API_URL}/usuarios/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    return {
      success: true,
      data: data?.data || null,
      token: data?.token || null,
      error: null,
    };
  } catch (error) {
    console.error('Error en loginUsuario:', error);
    return {
      success: false,
      data: null,
      token: null,
      error: error.message || 'Error al iniciar sesión',
    };
  }
}

/**
 * GET - Obtener todos los préstamos
 */
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
    console.error('Error en getPrestamos:', error);
    return {
      success: false,
      data: [],
      total: 0,
      error: error.message || 'Error al obtener préstamos',
    };
  }
}

/**
 * GET - Obtener préstamo por ID
 */
export async function getPrestamoById(id) {
  try {
    if (!id) {
      throw new APIError('ID de préstamo requerido', 400);
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
      error: error.message || 'Error al obtener préstamo',
    };
  }
}

/**
 * POST - Crear un nuevo préstamo
 */
export async function crearPrestamo(prestamoData) {
  try {
    if (!prestamoData) {
      throw new APIError('Datos del préstamo requeridos', 400);
    }

    const data = await fetchWithTimeout(`${API_URL}/prestamos`, {
      method: 'POST',
      body: JSON.stringify(prestamoData),
    });

    return {
      success: true,
      data: data?.data || null,
      error: null,
    };
  } catch (error) {
    console.error('Error en crearPrestamo:', error);
    return {
      success: false,
      data: null,
      error: error.message || 'Error al crear préstamo',
    };
  }
}

/**
 * PUT - Actualizar préstamo
 */
export async function actualizarPrestamo(id, prestamoData) {
  try {
    if (!id || !prestamoData) {
      throw new APIError('ID y datos del préstamo requeridos', 400);
    }

    const data = await fetchWithTimeout(`${API_URL}/prestamos/${id}`, {
      method: 'PUT',
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
      error: error.message || 'Error al actualizar préstamo',
    };
  }
}

/**
 * GET - Health check de la API
 */
export async function healthCheck() {
  try {
    const data = await fetchWithTimeout(`${API_URL}/health`);
    return {
      success: true,
      status: data?.status || 'OK',
      error: null,
    };
  } catch (error) {
    console.error('Error en healthCheck:', error);
    return {
      success: false,
      status: 'ERROR',
      error: error.message || 'API no disponible',
    };
  }
}

export default {
  getUsuarios,
  getUsuarioById,
  loginUsuario,
  getPrestamos,
  getPrestamoById,
  crearPrestamo,
  actualizarPrestamo,
  healthCheck,
};
