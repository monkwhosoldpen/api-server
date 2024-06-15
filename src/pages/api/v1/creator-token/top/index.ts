import { allowedOrigins, supabase } from "@pages/api/api-utils";

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

    if (req.method === 'GET') {
        const { data: userProfiles, error } = await supabase
        .from('user_profiles') // Replace 'user_profiles' with your actual table name
        .select('*')
        // .eq('verified', true)
        // .eq('is_party', false)
        // // .eq('is_demo', false)
        .eq('is_secondary_stream', false);  

        if (error) {
            // Handle the error
            return res.status(500).json({ error: 'An unexpected error occurred' });
        }
        const topCreatorTokenResponse = {
            creator_tokens: [...userProfiles,]
        };
        res.status(200).json(topCreatorTokenResponse);
    }
    else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
}
