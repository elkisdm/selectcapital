/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
  },
  // Optimizaciones para producción
  swcMinify: true,
  compress: true,
  // Configuración para react-pdf en servidor
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Asegurar que react-pdf funcione correctamente en el servidor
      config.externals = [...(config.externals || []), 'canvas', 'utf-8-validate', 'bufferutil']
    }
    return config
  },
}

module.exports = nextConfig

