import axios from 'axios';
import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from "next"
import { getToken } from "next-auth/jwt";

const COUCHDB_URL = process.env.COUCHDB_URL;
const AUTH_SECRET = process.env.AUTH_SECRET ?? '';


function dbNameToUsername(prefixedHexName: string) {
    return Buffer.from(prefixedHexName.replace('ziskuserdb-', ''), 'hex').toString('utf8');
}

function usernameToDbName(name: string) {
    return 'ziskuserdb-' + Buffer.from(name).toString('hex');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log('[API] Create remote database');
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

    const userName = sessionUserClaims.sub ?? '';

    if (!userName) {
        res.status(500).json({ error: 'Token subscriber is not available' });
        return;
    }

    let bearerToken = null;
    try {
        bearerToken = jwt.sign(sessionUserClaims, AUTH_SECRET, { algorithm: 'HS256', header: { alg: 'HS256', typ: 'JWT', kid: 'helloworld' } });
        console.log('Using bearer token:', bearerToken);
    } catch (error) {
        console.error('Failed to generate bearer token:', error);
    }

    // Build the target CouchDB URL
    const databaseName = usernameToDbName(userName);
    const targetUrl = `${COUCHDB_URL}/${databaseName}`;

    // Create the database
    console.log('Create database target URL:', targetUrl);

    let createResponse;
    try {
        createResponse = await axios.put(targetUrl, {
            headers: {
                authorization: `Bearer ${bearerToken}`,
            },
        });
    } catch (error) {
        res.status(error.status).json(error.response.data);
        return;
    }



    // Add the user as a member of the database
    const securityUrl = `${targetUrl}/_security`;
    let securityResponse;
    // try {
    //     securityResponse = await fetch(securityUrl, {
    //         method: 'PUT',
    //         headers: {
    //             authorization: `Bearer ${bearerToken}`,
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({
    //             members: {
    //                 names: [userName],
    //                 roles: ['_admin']
    //             }
    //         })
    //     });
    // } catch (error) {
    //     res.status(error.status).json(error);
    //     return;
    // }

    res.status(200).json({ createResponse, securityResponse });
    return;
}
