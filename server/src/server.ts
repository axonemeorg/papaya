import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express, { type Request, type Response } from 'express'
import { createProxyMiddleware } from 'http-proxy-middleware'
import nano from 'nano'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'

// Load environment variables from .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, '../../.env')
});

const PORT = process.env.PORT || 9000;
const SERVER_NAME = process.env.SERVER_NAME || '';

const ZISK_COUCHDB_ADMIN_USER = process.env.ZISK_COUCHDB_ADMIN_USER
const ZISK_COUCHDB_ADMIN_PASS = process.env.ZISK_COUCHDB_ADMIN_PASS
const AUTH_ACCESS_TOKEN_SECRET = process.env.AUTH_ACCESS_TOKEN_SECRET
const AUTH_REFRESH_TOKEN_SECRET = process.env.AUTH_REFRESH_TOKEN_SECRET
const AUTH_ACCESS_TOKEN_HMAC_KID = process.env.AUTH_ACCESS_TOKEN_HMAC_KID
const ZISK_COUCHDB_URL = process.env.ZISK_COUCHDB_URL ?? 'http://localhost:5984'

// CORS
const ALLOWED_ORIGINS = ['http://localhost:9475', 'https://app.tryzisk.com', 'http://192.168.68.68:9475'];
const ENABLE_CORS = false

// Token expiration times
const JWT_EXPIRATION = "1h";
const REFRESH_EXPIRATION = "7d";

// Cookies
const AUTH_TOKEN_COOKIE = 'AuthToken'
const REFRESH_TOKEN_COOKIE = 'RefreshToken'

// Roles
const ADMIN_ROLE_NAME = "_admin"

const app = express();

const couch = nano(`http://${ZISK_COUCHDB_ADMIN_USER}:${ZISK_COUCHDB_ADMIN_PASS}@${ZISK_COUCHDB_URL.split('//')[1]}`);

if (ENABLE_CORS) {
  app.use(cors({
    origin: (origin, callback) => {
      if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, // Allow cookies and other credentials
  }));
}

// Use cookie-parser middleware to parse cookies
app.use(cookieParser());

// Use body-parser for JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const proxyMiddleware = createProxyMiddleware({
  target: ZISK_COUCHDB_URL, // e.g. 'http://localhost:5984'
  changeOrigin: true,
  pathRewrite: {
    '^/proxy': '', // Remove the 'proxy' prefix when forwarding
  },
  on: {
    proxyReq: (proxyReq, req: Request, res: Response) => {
      // Get the AuthToken from cookies
      const authToken = req.cookies.AuthToken;

      if (authToken) {
        // Remove existing authorization header if present
        proxyReq.removeHeader('Authorization');

        // Add Bearer token
        proxyReq.setHeader('Authorization', `Bearer ${authToken}`);
      }

      // If it's a POST/PUT/PATCH request with a body, we need to restream the body
      if (req.body && ['POST', 'PUT', 'PATCH'].includes(req.method)) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
    },
    error: (err, req: Request, res: Response) => {
      res.status(500).send('Proxy Error');
    }
  }
});

// Apply the proxy middleware to all routes under /couchdb
app.use('/proxy', proxyMiddleware);

// Health check endpoint
app.get('/', (req: Request, res: Response) => {
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

app.post("/logout", (req: Request, res: Response) => {

});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
