import dotenv from "dotenv";

dotenv.config();

const requiredVars = ["DATABASE_URL", "JWT_SECRET"] as const;
const missing = requiredVars.filter((key) => !process.env[key]);

if (missing.length > 0) {
  throw new Error(`Missing environment variables: ${missing.join(", ")}`);
}

export const env = {
  port: Number(process.env.PORT || 4000),
  databaseUrl: process.env.DATABASE_URL as string,
  jwtSecret: process.env.JWT_SECRET as string,
  enableAnalyticsRoutes: process.env.ENABLE_ANALYTICS_ROUTES === "true",
  dailyApiKey: process.env.DAILY_API_KEY ?? "",
  pagarMeApiKey: process.env.PAGAR_ME_API_KEY ?? "",
};
