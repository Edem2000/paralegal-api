import dotenv from 'dotenv';
import * as process from 'node:process';

dotenv.config();
const envVars = process.env;

type GeneralConfig = {
  port: number,
  mongo: {
    connectionString: string,
  },
  jwt: JwtConfig,
};

export type JwtConfig = {
  secret: string,
  accessTtl: string,
  refreshTtl: string,
  userCacheTtl: number,
};

export const config: GeneralConfig = {
  port: parseInt(envVars.PORT || '3000'),
  mongo: {
    connectionString: envVars.MONGODB_URI || ""
  },
  jwt: {
    secret: envVars.JWT_SECRET || 'qwertyuiopasdfghjklzxcvbnm123456789hgfds',
    accessTtl: envVars.JWT_ACCESS_TTL || '1h',
    refreshTtl: envVars.JWT_REFRESH_TTL || '7d',
    userCacheTtl: +(envVars.USER_CACHE_TTL || 120) // 2 mins in seconds
  },
};