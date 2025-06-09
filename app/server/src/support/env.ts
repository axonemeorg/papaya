import dotenv from 'dotenv';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file
dotenv.config({
  path: path.resolve(__dirname, '../../../.env')
});

// Export environment variables
export const PAPAYA_COUCHDB_URL = process.env.PAPAYA_COUCHDB_URL ?? 'http://localhost:5984';
export const PAPAYA_COUCHDB_ADMIN_USER = process.env.PAPAYA_COUCHDB_ADMIN_USER;
export const PAPAYA_COUCHDB_ADMIN_PASS = process.env.PAPAYA_COUCHDB_ADMIN_PASS;
export const AUTH_REFRESH_TOKEN_SECRET = process.env.AUTH_REFRESH_TOKEN_SECRET;
export const AUTH_ACCESS_TOKEN_SECRET = process.env.AUTH_ACCESS_TOKEN_SECRET;
export const AUTH_ACCESS_TOKEN_HMAC_KID = process.env.AUTH_ACCESS_TOKEN_HMAC_KID;
export const PAPAYA_SERVER_PORT = process.env.PAPAYA_SERVER_PORT || 9000;
export const SERVER_NAME = process.env.SERVER_NAME || '';
export const NODE_ENV = process.env.NODE_ENV;
