import { allowedOrigins } from "../api-utils";

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
        const did  = req.body.data.user.id; // Extracting did from the payload or setting it to 'NA' if not provided
        const { provider_access_token = 'NA' } = req.body; // Extracting did from the payload or setting it to 'NA' if not provided
        const responseToSend = {
            access: provider_access_token,
            refresh: provider_access_token,
            did,
            provider_access_token: provider_access_token,
        };
        return res.status(200).json(responseToSend);
    } else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
  