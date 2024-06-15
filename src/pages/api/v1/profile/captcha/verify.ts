import { UpdateUserInfo, allowedOrigins } from "../../../api-utils";
const { verify } = require('hcaptcha');

export default async function handler(req, res) {
    
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

        const captcha_completed_at = new Date().toISOString();

        const { hcaptcha_response_token } = req.body;

        const secret = 'ES_558da93ae313421d91365243b98f0690';
        console.log("TODO: Secret here.");
        const token = hcaptcha_response_token;

        verify(secret, token)
            .then((data) => {
                if (data.success === true) {
                    console.log('success!', data);
                } else {
                    console.log('verification failed');
                }
            })
            .catch(console.error);

        req.body = { ...req.body, captcha_completed_at };
        const userData = await UpdateUserInfo(req);
        // If userData is null, it means the user is not found in Supabase
        const userResponse = {
            data: {
                profile: userData
            }
        };
        return res.status(200).json(userResponse);
    }
    else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
  }
  