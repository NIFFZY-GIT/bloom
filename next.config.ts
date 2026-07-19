import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The upload/serve routes build paths from process.cwd() at runtime, which the
  // file tracer can't analyze statically — so it over-traces the whole project
  // (pulling in next.config.ts). These routes need no bundled project files, so
  // exclude them from tracing to silence the "unexpected file in NFT list" warning.
  outputFileTracingExcludes: {
    '/api/uploads': ['**/*'],
    '/api/serve-uploads/[...path]': ['**/*'],
    '/api/serve-images/[...path]': ['**/*'],
    '/api/custom-packages/upload-quotation': ['**/*'],
  },

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

  // 3. Serve runtime-uploaded files.
  //
  // Next.js only serves files that were in public/ when the server booted, but
  // /api/uploads writes into public/uploads while it is running — so every uploaded
  // image 404s at /uploads/... until the next restart, even though the file is on
  // disk. `afterFiles` runs only when the static handler found nothing, so genuinely
  // static assets keep their fast path and runtime uploads fall through to the route
  // that reads them from disk. This repairs existing /uploads/... rows too.
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [
        {
          source: '/uploads/:path*',
          destination: '/api/serve-uploads/:path*',
        },
      ],
      fallback: [],
    };
  },
};

export default nextConfig;