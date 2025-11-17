import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cloudflare Pages 部署設定
  // 階段一：使用 static export（最簡單）
  // 階段二：可改用 @opennextjs/cloudflare（支援 SSR）

  // output: 'export', // 靜態匯出（uncomment for static deployment）

  // API 路由設定（連接到 Cloudflare Workers）
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NEXT_PUBLIC_API_URL
          ? `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`
          : 'http://localhost:8787/api/:path*', // 本地開發用
      },
    ];
  },

  // CORS 設定（開發時需要）
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
        ],
      },
    ];
  },
};

export default nextConfig;
