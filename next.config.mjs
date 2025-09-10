/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // output: 'export',       // ✅ enables static export
  trailingSlash: true,    // ✅ optional, helps Netlify routing
};

export default nextConfig;
