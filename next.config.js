const withMDX = require('@next/mdx')()

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    DATA_URL: 'https://api.mccreations.net',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'static.wixstatic.com',
        port: '',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: "mccreations.s3.us-west-1.amazonaws.com"
      },
      {
        protocol: 'https',
        hostname: "lh3.googleusercontent.com"
      },
      {
        protocol: 'https',
        hostname: "avatars.githubusercontent.com"
      }
    ],
  }
}

module.exports = withMDX(nextConfig)