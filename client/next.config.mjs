/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  images:{
    remotePatterns:[
      {
        hostname:"res.cloudinary.com",
      }
    ]
  },

  output: "standalone",
  
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.watchOptions = {
        poll: 1000, // Check for changes every second
        aggregateTimeout: 200, // Delay before rebuilding
      };
    }
    return config;
  },
};

export default nextConfig;
