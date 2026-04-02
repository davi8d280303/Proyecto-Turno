/**
 * Loaders - Funciones accesibles para cargar datos
 * Estas funciones pueden ser usadas desde cualquier parte del backend
 */

/**
 * Simula cargar datos de una API externa
 * @param {string} endpoint - URL del endpoint
 * @returns {Promise<Object>} Datos de la API
 */
const loadFromAPI = async (endpoint) => {
  try {
    console.log(`Cargando desde: ${endpoint}`);
    // Aquí irá la lógica de consumo de APIs
    // Por ahora retorna un placeholder
    return {
      success: true,
      data: [],
      message: `loader para ${endpoint}`
    };
  } catch (error) {
    console.error(`Error al cargar de ${endpoint}:`, error.message);
    throw new Error(`No se pudo cargar desde ${endpoint}`);
  }
};

/**
 * Carga datos de múltiples fuentes en paralelo
 * @param {Array<string>} endpoints - Array de endpoints
 * @returns {Promise<Array>} Resutados de todas las peticiones
 */
const loadMultiple = async (endpoints) => {
  try {
    console.log(`Cargando ${endpoints.length} fuentes en paralelo...`);
    const promises = endpoints.map(endpoint => loadFromAPI(endpoint));
    const results = await Promise.all(promises);
    return results;
  } catch (error) {
    console.error("Error cargando múltiples endpoints:", error.message);
    throw error;
  }
};

/**
 * Carga datos con reintentos en caso de fallo
 * @param {string} endpoint - URL del endpoint
 * @param {number} retries - Número de reintentos
 * @returns {Promise<Object>} Datos de la API
 */
const loadWithRetry = async (endpoint, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`Intento ${i + 1}/${retries} para: ${endpoint}`);
      return await loadFromAPI(endpoint);
    } catch (error) {
      if (i === retries - 1) {
        throw error;
      }
      // Esperar antes de reintentar (backoff exponencial)
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
    }
  }
};

module.exports = {
  loadFromAPI,
  loadMultiple,
  loadWithRetry
};
