/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  async rewrites() {
    return [
      {
        source: '/previews/:path*',
        destination: '/previews/:path*',
      },
    ]
  },
}

module.exports = nextConfig