/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL: "http://localhost:5001/api",
  },
  images: {
    remotePatterns: [
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
        protocol : "https",
        hostname : "assets-webp.khelnow.com"
      },
      {
        protocol:"https",
        hostname :"encrypted-tbn0.gstatic.com"
      },{
        protocol: "https",
        hostname: "assets-webp.khelnow.com",
      },{
        protocol:"https",
        hostname : "iplcricbet.com"
      }
    ],
  },
};

module.exports = nextConfig;
