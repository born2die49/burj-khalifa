/** @type {import('next').NextConfig} */
const nextConfig = {
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
