import cors from 'cors'
import dotenv from 'dotenv'
import express, { type Request, type Response } from 'express'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const PORT = process.env.PORT || 9000;
const SERVER_NAME = process.env.SERVER_NAME || '';

const ZISK_COUCHDB_ADMIN_USER = process.env.ZISK_COUCHDB_ADMIN_USER
const ZISK_COUCHDB_ADMIN_PASS = process.env.ZISK_COUCHDB_ADMIN_PASS
const AUTH_ACCESS_TOKEN_SECRET = process.env.AUTH_ACCESS_TOKEN_SECRET
const AUTH_REFRESH_TOKEN_SECRET = process.env.AUTH_REFRESH_TOKEN_SECRET
const AUTH_ACCESS_TOKEN_HMAC_KID = process.env.AUTH_ACCESS_TOKEN_HMAC_KID
const ZISK_COUCHDB_URL = process.env.ZISK_COUCHDB_URL

// CORS
const ALLOWED_ORIGINS = ['http://localhost:9475', 'https://app.tryzisk.com', 'http://192.168.68.68:9475'];
const ENABLE_CORS = false

// Token expiration times
const JWT_EXPIRATION = "1h";
const REFRESH_EXPIRATION = "7d";

const ADMIN_ROLE_NAME = "_admin"

const app = express();


if (ENABLE_CORS) {
  app.use(cors({
    origin: (origin, callback) => {
      callback(null, true); // For now, allow all origins.

      if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, // Allow cookies and other credentials
  }));
}

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    zisk: 'Welcome',
    version: '0.3.0',
    serverName: SERVER_NAME,
    status: 'ok',
    initialized: true,
  });
});

app.post("/login", async (req: Request, res: Response) => {

});

// Logout endpoint
app.post("/logout", (req, res) => {

});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
