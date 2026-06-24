/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['uploads.tickettailor.com', 'cdn.discordapp.com', 'media.discordapp.net', 'cdn.sanity.io'],
    },
  }

  module.exports = nextConfig
