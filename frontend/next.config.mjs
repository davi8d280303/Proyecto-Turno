import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  
  // 🚀 ESTO ES LO QUE FALTA PARA EL DEPLOY
  async rewrites() {
    return [
      {
        // Cuando el front pida algo a /api/..., lo enviará al backend
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/:path*`,
      },
    ]
  },
};

export default nextConfig;