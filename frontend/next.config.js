/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: true,
  env: {
    // NEXT_PUBLIC_API_URL: "https://aution2-0.onrender.com/api",
    NEXT_PUBLIC_API_URL: "http://localhost:5001/api",
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "s.yimg.com" },
      { protocol: "https", hostname: "e0.pxfuel.com" },
      { protocol: "https", hostname: "static.indiatv.in" },
      { protocol: "https", hostname: "www.vhv.rs" },
      {
        protocol: "https",
        hostname: "iplcricbet.com",
      },
      {
        protocol: "https",
        hostname: "static.indiatv.in",
      },
      {
        protocol: "https",
        hostname: "www.vhv.rs",
      },
      {
        protocol: "https",
        hostname: "documents.iplt20.com",
      },
      {
        protocol: "https",
        hostname: "femalecricket.com",
      },
      {
        protocol: "https",
        hostname: "i.cdn.newsbytesapp.com",
      },
      {
        protocol: "https",
        hostname: "www.gujarattitansipl.com",
      },
      {
        protocol: "https",
        hostname: "www.rajasthanroyals.com",
      },
      {
        protocol: "https",
        hostname: "www.mumbaiindians.com",
      },
      {
        protocol: "https",
        hostname: "www.lucknowsupergiants.in",
      },
      {
        protocol: "https",
        hostname: "www.kkr.in",
      },
      {
        protocol: "https",
        hostname: "www.delhicapitals.in",
      },
      {
        protocol: "https",
        hostname: "static.cricketaddictor.com",
      },
      {
        protocol: "https",
        hostname: "assets.iplt20.com",
      },
      {
        protocol: "https",
        hostname: "preview.redd.it",
      },
      {
        protocol: "https",
        hostname: "www.royalchallengers.com",
      },
      {
        protocol: "https",
        hostname: "www.wplt20.com",
      },
      {
        protocol: "https",
        hostname: "www.punjabkingsipl.in",
      },
      {
        protocol: "https",
        hostname: "cricclubs.com",
      },
      {
        protocol: "https",
        hostname: "www.bdcrictime.com",
      },
      {
        protocol: "https",
        hostname: "assets-webp.khelnow.com",
      },
      {
        protocol: "https",
        hostname: "encrypted-tbn0.gstatic.com",
      },
      {
        protocol: "https",
        hostname: "assets-webp.khelnow.com",
      },
      {
        protocol: "https",
        hostname: "iplcricbet.com",
      },
      {
        protocol: "https",
        hostname: "tse2.mm.bing.net",
      },
    ],
  },
};

module.exports = nextConfig;
