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
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'trefle.io',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 's3.amazonaws.com',
        port: '',
        pathname: '/openfarm-production/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.openfarm.cc',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig