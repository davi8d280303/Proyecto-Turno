import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    // Aseguramos que Turbopack use el directorio `frontend` como raíz absoluta
    root: path.join(__dirname),
  },
};

export default nextConfig;
