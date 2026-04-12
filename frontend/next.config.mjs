import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ── output standalone ────────────────────────────────────────────
  // Genera .next/standalone — una carpeta autocontenida con solo
  // lo necesario para producción. Reduce la imagen Docker de ~500MB
  // a ~80MB porque no copia node_modules completos al contenedor.
  output: 'standalone',

  // ── Turbopack (solo dev) ──────────────────────────────────────────
  turbopack: {
    root: path.join(__dirname),
  },

  // ── Proxy al backend ──────────────────────────────────────────────
  // En desarrollo y producción, /api/* se reenvía al backend.
  // En Docker, el backend corre en su propio contenedor.
  async rewrites() {
    return [
      {
        source:      '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/:path*`,
      },
    ];
  },
};

export default nextConfig;
