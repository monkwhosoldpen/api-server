import { UpdateUserInfo, allowedOrigins, decodeToken, getUserDataByUId } from '../api-utils';

export default async function handler(req, res) {
    // Set CORS headers
    const origin = req.headers.origin;

    // Set CORS headers
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle OPTIONS request for preflight check
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === "POST") {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            res.status(200).json([]);
        }
        else {
            // Set the current date and time in ISO 8601 format
            req.body.notifications_last_opened = new Date().toISOString();
            // req.body.notifications_last_opened = '2020-08-02T23:01:51.477461+00:00';
            await UpdateUserInfo(req);
            return res.status(200).json([]);
        }
    }
    else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
  }
  