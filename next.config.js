/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['uploads.tickettailorassets.com', 'cdn.discordapp.com', 'media.discordapp.net', 'cdn.sanity.io'],
    },
  }

  module.exports = nextConfig
