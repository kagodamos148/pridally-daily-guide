/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React Strict Mode
  reactStrictMode: true,
  // Enable static export for GitHub Pages
  output: 'export',
  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },
  // Configure base path for GitHub Pages (will be set by environment variable)
  basePath: process.env.NODE_ENV === 'production' ? '/pridally-daily-guide' : '',
  // Trailing slash for GitHub Pages compatibility
  trailingSlash: true,
  // Transpile packages if needed
  transpilePackages: [],
}

module.exports = nextConfig
