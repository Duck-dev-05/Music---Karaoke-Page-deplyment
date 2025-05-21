/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['0.0.0.0', 'i.scdn.co', 'example.com', 'i.ytimg.com'],
  },
}

module.exports = nextConfig
