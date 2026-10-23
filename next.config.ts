import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Нативные модули — не бандлить
  serverExternalPackages: ["@libsql/client", "better-sqlite3"],
  // Старая дублирующая страница услуг ведёт на новые тарифы сиделок
  async redirects() {
    return [{ source: "/services", destination: "/sidelki", permanent: false }];
  },
};

export default nextConfig;
