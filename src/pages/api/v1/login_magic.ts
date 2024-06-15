import { allowedOrigins, generateToken, generateUUID, saveUserToDB, supabase } from "../api-utils";


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
        console.log("POST Occurred");
        const did = generateUUID();
        const currentDate = new Date();
        const expirationDate = new Date(currentDate);
        expirationDate.setMonth(expirationDate.getMonth() + 1); // Set token expiration to 1 month

        const payload = {
            did,
            expiration: expirationDate.getTime(), // Expiration in milliseconds
        };

        const token = generateToken(payload);
        const responseToSend = {
            access: token,
            refresh: token,
            did: did,
            provider_access_token: token,
        };

        // Uncomment and implement your logic for saving user and handling errors
        await saveUserToDB(did);

        return res.status(200).json(responseToSend);
    } else {
        // Handle other HTTP methods or return a not allowed response
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
    // Your API logic here
  }
  