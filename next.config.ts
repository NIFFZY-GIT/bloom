import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. Configure and ENABLE the image optimizer
  images: {
    // This allows images from your own domain. It's secure.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'chemquest.lk',
      },
      {
        protocol: 'https',
        hostname: 'www.chemquest.lk',
      },
    ],
    // The sizes can be tuned for your specific design if needed
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Allow local images from /uploads directory
    unoptimized: false, // Keep optimization enabled
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // 2. Experimental features for body size limit
  experimental: {
    serverActions: {
      bodySizeLimit: '15mb',
    },
  },
};

export default nextConfig;