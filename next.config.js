/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['cdn.discordapp.com', 'media.discordapp.net', 'cdn.sanity.io'],
    },
  }

  module.exports = nextConfig
