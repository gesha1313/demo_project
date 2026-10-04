import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Нативные модули — не бандлить
  serverExternalPackages: ["@libsql/client", "better-sqlite3"],
};

export default nextConfig;
