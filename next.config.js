/** @type {import('next').NextConfig} */
require("next-ws/server").verifyPatch();
const nextConfig = {
  images: {
    domains: ["res.cloudinary.com"],
  },
};

module.exports = nextConfig;
