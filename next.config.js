/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
};
// next.config.js
module.exports = {
  target: "serverless", // Ensure you are using the serverless target
};

// next.config.js
module.exports = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Exclude fs import in client-side code
      config.resolve.fallback = {
        fs: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
