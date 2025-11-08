import { config as dotenvConfig } from 'dotenv';
import { z } from 'zod';

// Load environment variables
dotenvConfig();

// Environment schema validation
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3001'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  FRONTEND_URL: z
    .string()
    .default('http://localhost:3000')
    .refine((value) => {
      const origins = value.split(',').map((origin) => origin.trim()).filter(Boolean);
      if (!origins.length) {
        return false;
      }
      return origins.every((origin) => {
        try {
          new URL(origin);
          return true;
        } catch {
          return false;
        }
      });
    }, { message: 'FRONTEND_URL must be a comma-separated list of valid URLs' }),
});

// Parse and validate environment variables
const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ Invalid environment variables:');
  console.error(parsedEnv.error.format());
  process.exit(1);
}

export const env = parsedEnv.data;

const frontendOrigins = env.FRONTEND_URL
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

export const config = {
  env: env.NODE_ENV,
  port: parseInt(env.PORT, 10),
  database: {
    url: env.DATABASE_URL,
  },
  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: env.JWT_EXPIRES_IN,
  },
  cors: {
    origin: frontendOrigins.length === 1 ? frontendOrigins[0] : frontendOrigins,
  },
  isDevelopment: env.NODE_ENV === 'development',
  isProduction: env.NODE_ENV === 'production',
  isTest: env.NODE_ENV === 'test',
};
