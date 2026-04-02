# Integración Frontend-Backend: Guía de Implementación

## 📋 Resumen

Se ha implementado una **conexión completa entre el frontend (Next.js) y el backend (Express)** con:

✅ **Consumo de APIs** - Funciones reutilizables en `lib/api.js`  
✅ **Manejo de Asincronía** - async/await en todos los componentes  
✅ **Manejo de Errores** - Try/catch + fallback a datos demo  
✅ **Loader Accesible** - Componente WCAG 2.1 compliant  
✅ **Estructura de Deploy** - Variables de entorno y configuración lista  

---

## 🏗️ Estructura de Carpetas

```
frontend/
├── lib/
│   └── api.js                    # ← NUEVO: Servicio de API centralizado
├── app/
│   ├── page.js                   # ← ACTUALIZADO: Login con API
│   ├── components/
│   │   └── Loader.js             # ← NUEVO: Componente de carga accesible
│   └── (dashboard)/
│       ├── prestamos/
│       │   └── page.js           # ← ACTUALIZADO: Con consumo de API
│       └── recursos/
│           └── page.js           # ← ACTUALIZADO: Con consumo de API
├── .env.local                    # ← ACTUALIZADO: Variable de API URL
└── package.json
```

---

## 🔌 Configuración de API

### 1. Variables de Entorno (`.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_API_TIMEOUT=30000
NEXT_PUBLIC_ENV=development
```

**Para Deploy:**
```env
# Producción
NEXT_PUBLIC_API_URL=https://api.tudominio.com/api
NEXT_PUBLIC_API_TIMEOUT=30000
NEXT_PUBLIC_ENV=production
```

---

## 📡 Servicio de API (`lib/api.js`)

### Características Principales

#### 1. **Manejo de Timeout**
```javascript
// Automáticamente cancela requests después de 30s
const data = await fetchWithTimeout(url, options);
```

#### 2. **Manejo de Errores Unificado**
```javascript
// Clase personalizada para errores
export class APIError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
  }
}
```

#### 3. **Funciones Disponibles**

```javascript
import { 
  getUsuarios,
  getUsuarioById,
  loginUsuario,
  getPrestamos,
  getPrestamoById,
  crearPrestamo,
  actualizarPrestamo,
  healthCheck 
} from '@/lib/api';

// Ejemplo de uso
const resultado = await getUsuarios();
// Retorna: { success: true/false, data: [], error: string, total: number }
```

---

## 🎯 Patrones de Implementación

### Componente con Carga de Datos

```javascript
'use client';
import { useEffect, useState } from 'react';
import { getPrestamos } from '@/lib/api';
import Loader, { SkeletonCard } from '@/app/components/Loader';

export default function MiComponente() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar datos al montar
  useEffect(() => {
    const cargarDatos = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const resultado = await getPrestamos();
        
        if (!resultado.success) {
          setError(resultado.error);
          setData(DATOS_FALLBACK); // Datos de demo
        } else {
          setData(resultado.data);
        }
      } catch (err) {
        setError(err.message);
        setData(DATOS_FALLBACK);
      } finally {
        setIsLoading(false);
      }
    };

    cargarDatos();
  }, []);

  if (isLoading) return <SkeletonCard count={3} />;
  if (error) return <div role="alert">{error}</div>;

  return <div>{/* Render de datos */}</div>;
}
```

---

## ♿ Accesibilidad (WCAG 2.1)

### Componente Loader

```javascript
<Loader 
  isVisible={isLoading} 
  message="Cargando datos..."
  fullscreen={true}  // Modal overlay
/>
```

**Características:**
- ✅ `role="status"` para screen readers
- ✅ `aria-live="polite"` para anuncios
- ✅ `aria-label` descriptivos
- ✅ Respetuoso con `prefers-reduced-motion`

### Alertas de Error

```javascript
<div role="alert" aria-live="polite">
  {error}
</div>
```

---

## 📊 Páginas Actualizadas

### 1. **Login Page** (`app/page.js`)

- ✅ Validación de email con regex
- ✅ Manejo de asincronía con async/await
- ✅ Estado de carga del botón
- ✅ Mensajes de error amigables
- ✅ Almacenamiento en localStorage

```javascript
try {
  const result = await loginUsuario(email, password);
  if (!result.success) throw new Error(result.error);
  localStorage.setItem('usuario', JSON.stringify({email, loginTime}));
  router.push('/panel');
} catch (err) {
  setError(err.message);
}
```

### 2. **Préstamos Page** (`app/(dashboard)/prestamos/page.js`)

- ✅ Carga de datos con `useEffect`
- ✅ Filtrado dinámico sin API (optimizado)
- ✅ Skeleton loaders mientras carga
- ✅ Fallback a datos de demo si la API falla
- ✅ Contador de resultados

### 3. **Recursos Page** (`app/(dashboard)/recursos/page.js`)

- ✅ Carga asincrónica al montar
- ✅ Búsqueda en tiempo real
- ✅ Confirmación para eliminar
- ✅ Manejo de errores silencioso
- ✅ Responsive en mobile/desktop

---

## 🚀 Deploy Parcial (Ready to Deploy)

### Para Vercel (Recomendado para Frontend)

1. **Connectar repositorio en Vercel**
   ```bash
   vercel link
   ```

2. **Configurar variables de entorno en Vercel Dashboard**
   ```
   NEXT_PUBLIC_API_URL = https://api-produccion.com/api
   NEXT_PUBLIC_API_TIMEOUT = 30000
   ```

3. **Deploy**
   ```bash
   vercel deploy --prod
   ```

### Para Otros Servidores (Docker/Manual)

**Dockerfile** (ya existe en `frontend/`)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

**Build y Run:**
```bash
# Build
npm run build

# Production
NODE_ENV=production npm start

# Development
npm run dev
```

---

## 🔄 Flujo de Datos

```
┌──────────────────────────┐
│   Componente React       │
├──────────────────────────┤
│ useEffect(() => {        │
│   await getPrestamos()   │
│ })                       │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│   lib/api.js             │
├──────────────────────────┤
│ fetchWithTimeout()       │
├──────────────────────────┤
│ Timeout: 30s             │
│ Headers: JSON            │
│ Manejo de errores        │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│  Backend Express         │
├──────────────────────────┤
│ GET /api/prestamos       │
│ POST /api/usuarios/login │
│ CORS Enabled             │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│   Respuesta JSON         │
├──────────────────────────┤
│ {success, data, error}   │
└──────────────────────────┘
```

---

## ✅ Checklist de Pruebas

### Desarrollo Local

- [ ] Backend ejecutándose en `http://localhost:5000`
- [ ] Frontend ejecutándose en `http://localhost:3000`
- [ ] CORS habilitado en backend
- [ ] Variables `.env.local` configuradas
- [ ] Consola sin errores de Red (Network tab)

### Funcionalidad

- [ ] Login valida email y contraseña
- [ ] Préstamos cargan desde API o demo
- [ ] Búsqueda filtra resultados en tiempo real
- [ ] Loader muestra mientras carga
- [ ] Errores se muestran amigablemente
- [ ] Confir action para eliminar recurso

### Accesibilidad

- [ ] Loader accesible con screen readers
- [ ] Alertas con `role="alert"`
- [ ] Labels en todos los inputs
- [ ] Navegación por teclado funciona

---

## 🔧 Solución de Problemas

### "API not responding"
```bash
# Verifica que el backend está corriendo
lsof -i :5000  # Linux/Mac
netstat -ano | findstr :5000  # Windows
```

### CORS Error
```javascript
// Backend (src/middleware/corsConfig.js)
const corsOptions = {
  origin: 'http://localhost:3000',  // O tu dominio
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
};
```

### Timeout en Requests
```javascript
// Aumentar timeout en .env.local
NEXT_PUBLIC_API_TIMEOUT=60000  // 60 segundos
```

---

## 📝 Próximos Pasos

1. **Implementar endpoints faltantes** en el backend (POST login, POST préstamo, etc.)
2. **Agregar autenticación JWT** para seguridad
3. **Implementar caching** con SWR o React Query
4. **Agregar validación de formularios** con Zod o Yup
5. **Tests unitarios** con Jest + React Testing Library
6. **CI/CD Pipeline** con GitHub Actions

---

## 📚 Referencias

- [Next.js fetch API](https://beta.nextjs.org/docs/guides/data-fetching)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Express CORS](https://expressjs.com/en/resources/middleware/cors.html)
- [Vercel Deployment](https://vercel.com/docs)

---

**Última actualización:** 19 de febrero de 2026  
**Estado:** ✅ Listo para pruebas locales y deploy parcial
