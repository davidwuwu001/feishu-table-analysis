/** @type {import('next').NextConfig} */
const nextConfig = {
  // Server Actions are enabled by default in Next.js 14
  env: {
    CUSTOM_KEY: 'my-value',
  },
  images: {
    domains: ['p1-arco.byteimg.com', 'lf1-xgcdn-tos.pstatp.com', 'open.feishu.cn'],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
}

module.exports = nextConfig 