import { allowedOrigins, getUser, supabase } from "../../../api-utils";
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
        try {
            const { hcaptcha_response_token } = req.body;

            const secret = 'ES_558da93ae313421d91365243b98f0690';
            const token = hcaptcha_response_token;

            // Verify captcha
            const captchaData = await verify(secret, token);
            if (!captchaData.success) {
                return res.status(400).json({ error: 'Captcha verification failed' });
            }

            const captcha_completed_at = new Date().toISOString();

            // Fetch user data
            const userDataRaw = await getUser(req);
            const id = userDataRaw.id;

            // Update user metadata
            const { data: user, error } = await supabase.auth.admin.updateUserById(
                id,
                {
                    user_metadata: {
                        captcha_completed_at: captcha_completed_at,
                    }
                }
            );

            if (error) {
                return res.status(500).json({ error: 'Failed to update user metadata' });
            }

            // Fetch latest user data
            const userDataRawLatest = await getUser(req);

            const userResponse = {
                data: {
                    profile: userDataRawLatest
                }
            };
            return res.status(200).json(userResponse);

        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
}
