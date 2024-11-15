import { allowedOrigins, supabase } from "@pages/api/api-utils";
import { allNFTSData1 } from "../../../../../data/mockdata";
// import PocketBase from 'pocketbase';
// const pb = new PocketBase('https://grew-faster.pockethost.io');

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

    // await pb.admins.authWithPassword('monkwhosoldpen@gmail.com', 'letmeenter@12345');

    if (req.method === 'GET') {
        // Extract category from query parameters
        const { category } = req.query;
        console.log('Category:', category);
        
        const { data: userProfiles, error } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('type', category);

        if (error) {
            console.error('Error fetching user profiles:', error);
            return res.status(500).json({ error: 'Failed to fetch user profiles' });
        }

        const topCreatorTokenResponse = {
            creator_tokens: [...userProfiles || [],]
        };
        res.status(200).json(topCreatorTokenResponse);
    }
    else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
}
