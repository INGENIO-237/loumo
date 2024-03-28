import { config } from "dotenv";

config();

export default {
  PORT: process.env.PORT ? process.env.PORT : 8000,
  DB_CONNECTION_STRING: process.env.DB_CONNECTION_STRING as string,
  SALT_FACTOR: parseInt(process.env.SALT_FACTOR as string),
};
