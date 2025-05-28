import axios from 'axios'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express, { type Request, type RequestHandler, type Response } from 'express'
import { createProxyMiddleware, type Options } from 'http-proxy-middleware'
import jwt from 'jsonwebtoken'
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
const JWT_EXPIRATION_SECONDS = 5; // 5 seconds
const REFRESH_EXPIRATION_SECONDS = 7 * 24 * 60 * 60; // 7 days
const ENABLE_ISSUE_AUTH_TOKEN_VIA_REFRESH_TOKEN = true

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

const isTokenExpired = (token: string, secret: string): boolean => {
  try {
    jwt.verify(token, secret);
    return false;
  } catch (error) {
    return error instanceof jwt.TokenExpiredError;
  }
};

const tokenMiddlewareHandler: RequestHandler = (req, res, next) => {
  const accessToken = req.cookies[AUTH_TOKEN_COOKIE];
  const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE];

  if (!refreshToken) {
    return next();
  }

  try {
    // Check if refresh token is valid (not expired)
    const decoded = jwt.verify(refreshToken, AUTH_REFRESH_TOKEN_SECRET as jwt.Secret) as jwt.JwtPayload;

    // Always create a new refresh token (sliding window)
    const newRefreshToken = jwt.sign(
      { name: decoded.name },
      AUTH_REFRESH_TOKEN_SECRET as jwt.Secret,
      { expiresIn: REFRESH_EXPIRATION_SECONDS }
    );

    // Set the new refresh token cookie
    res.cookie(REFRESH_TOKEN_COOKIE, newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: REFRESH_EXPIRATION_SECONDS * 1000,
    });

    if (!ENABLE_ISSUE_AUTH_TOKEN_VIA_REFRESH_TOKEN) {
      throw new Error('Issuing auth tokens via refresh token is disabled.')
    }
    // Check if access token is expired or absent
    if (!accessToken || isTokenExpired(accessToken, AUTH_ACCESS_TOKEN_SECRET as string)) {
      console.log("Minting new auth token")
      // Create new access token
      const userClaims = {
        name: decoded.name,
        roles: decoded.roles || [],
      };

      const newAccessToken = jwt.sign(
        userClaims,
        AUTH_ACCESS_TOKEN_SECRET as jwt.Secret,
        {
          expiresIn: JWT_EXPIRATION_SECONDS,
          subject: decoded.name,
          algorithm: 'HS256',
          keyid: AUTH_ACCESS_TOKEN_HMAC_KID
        }
      );

      // Store the new token in res.locals for immediate use
      res.locals.authToken = newAccessToken;

      res.cookie(AUTH_TOKEN_COOKIE, newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: JWT_EXPIRATION_SECONDS * 1000,
      });
    }
  } catch (error) {
    console.error(error)
  }

  next();
};

// Create the proxy middleware with proper typing
const proxyMiddlewareOptions: Options = {
  target: ZISK_COUCHDB_URL, // e.g. 'http://localhost:5984'
  changeOrigin: true,
  pathRewrite: {
    '^/proxy': '', // Remove the 'proxy' prefix when forwarding
  },
  on: {
    proxyReq: (proxyReq, req: Request, res: Response) => {
      // Use the newly generated token if available, otherwise use the cookie
      const authToken = res.locals.authToken ?? req.cookies[AUTH_TOKEN_COOKIE];

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
};

app.use('/proxy', tokenMiddlewareHandler, createProxyMiddleware(proxyMiddlewareOptions));

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

app.post("/login", async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ error: 'Username and password are required' });
      return
    }

    // Create Basic Authentication credentials
    const credentials = Buffer.from(`${username}:${password}`).toString('base64');

    try {
      // Make request to CouchDB _session endpoint
      const response = await axios.post(`${ZISK_COUCHDB_URL}/_session`, {
        name: username,
        password: password
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${credentials}`
        }
      });

      // If successful, extract user claims from CouchDB response
      if (response.data && response.data.ok) {
        const userClaims = {
          name: response.data.name,
          roles: response.data.roles,
        };

        // Create JWT token
        const accessToken = jwt.sign(
          userClaims,
          AUTH_ACCESS_TOKEN_SECRET as jwt.Secret,
          {
            expiresIn: JWT_EXPIRATION_SECONDS,
            subject: username,
            algorithm: 'HS256',
            keyid: AUTH_ACCESS_TOKEN_HMAC_KID
          }
        );

        // Create refresh token
        const refreshToken = jwt.sign(
          { name: userClaims.name },
          AUTH_REFRESH_TOKEN_SECRET as jwt.Secret,
          {
            expiresIn: REFRESH_EXPIRATION_SECONDS
          }
        );

        // Set cookies
        res.cookie(AUTH_TOKEN_COOKIE, accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: JWT_EXPIRATION_SECONDS * 1000,
        });

        res.cookie(REFRESH_TOKEN_COOKIE, refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: REFRESH_EXPIRATION_SECONDS * 1000,
        });

        // Return success response
        res.status(200).json({
          ok: true,
          name: userClaims.name,
          roles: userClaims.roles,
          isAdmin: userClaims.roles.includes(ADMIN_ROLE_NAME)
        });
      } else {
        res.status(401).json({ error: 'Authentication failed' });
      }
    } catch (error) {
      console.error('CouchDB authentication error:', error);
      res.status(401).json({ error: 'Authentication failed' });
    } finally {
      return
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post("/logout", async (req: Request, res: Response, next): Promise<void> => {
  // Clear auth token cookie
  res.cookie(AUTH_TOKEN_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0,
  });

  // Clear refresh token cookie
  res.cookie(REFRESH_TOKEN_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0,
  });

  res.status(200).json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
