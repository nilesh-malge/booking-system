import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: "postgresql://booking_user:booking_password@127.0.0.1:5432/booking_db?schema=public",
  },
});
