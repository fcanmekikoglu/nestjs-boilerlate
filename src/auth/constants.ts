import * as dotenv from "dotenv";
dotenv.config();

export const JWT_CONSTANTS = {
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRES_IN: 60 * 15, // 15 minutes
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRES_IN: 60 * 60 * 24, // 1 day
};
