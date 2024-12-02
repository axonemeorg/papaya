import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import fetch from 'node-fetch';
import { usernameToDbName } from '../init';

const COUCHDB_URL = process.env.COUCHDB_URL;
// The AUTH_SECRET used by CouchDB gets base64-decoded, so we need to sign these JWTs accordingly
const AUTH_SECRET = atob(process.env.AUTH_SECRET ?? '');
const AUTH_HMAC_KID = process.env.AUTH_HMAC_KID ?? '';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const sessionUserClaims = await getToken({ req });
    if (sessionUserClaims) {
        sessionUserClaims['_couchdb.roles'] = ['_admin'];
    }

    if (!sessionUserClaims) {
        res.status(401).json({ error: 'Unauthorized. Sign in to sync with remote.' });
        return;
    } else if (!COUCHDB_URL) {
        res.status(500).json({ error: 'CouchDB URL is not configured' });
        return;
    }

    let bearerToken = null;
    try {
        bearerToken = jwt.sign(sessionUserClaims, AUTH_SECRET, { algorithm: 'HS256', header: { alg: 'HS256', typ: 'JWT', kid: AUTH_HMAC_KID } });
        console.log('Using bearer token:', bearerToken);
    } catch (error) {
        console.error('Failed to generate bearer token:', error);
    }

    // Build the target CouchDB URL
    // console.log('original request url:', req.url);
    const targetPath = req?.url?.replace('/api/remote-db/proxy', ''); // Remove /api/remote-db/proxy prefix
    const userName = sessionUserClaims.sub ?? '';
    // TODO need a helper fn to get the username from the req object
    const databaseName = usernameToDbName(userName);
    const targetUrl = `${COUCHDB_URL}/${databaseName}${targetPath}`;
    // console.log('Proxy target URL:', targetUrl);


    try {
        const headers = {
            ...req.headers,
            authorization: `Bearer ${bearerToken}`,
        }

        // Handle body serialization
        let body = undefined;
        if (req.method !== 'GET' && req.method !== 'HEAD') {
            if (req.body) {
                // Ensure the body is properly encoded as JSON if necessary
                body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
            }
        }

        const couchResponse = await fetch(targetUrl, {
            method: req.method,
            headers,
            body,
        });

        res.status(couchResponse.status);
        couchResponse.body?.pipe(res);
    } catch (error) {
        res.status(500).json({ error });
    }
}
