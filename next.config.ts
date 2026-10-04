import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // better-sqlite3 — нативный модуль, его нельзя бандлить
  serverExternalPackages: ["better-sqlite3"],
};

export default nextConfig;
