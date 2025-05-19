import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  async redirects() {
    return [
      {
        source: '/',
        destination: '/Home',
        permanent: true, // Use `false` for temporary redirect
      }
      
    ];
  },


};

module.exports = {
  middleware:true,
};

export default nextConfig;
