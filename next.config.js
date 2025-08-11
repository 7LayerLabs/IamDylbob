/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/rooted',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'perenual.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.perenual.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig