import { joinedChannelsData } from '../../../data/mockdata';
import { allowedOrigins, getUser, supabaseAnon } from '../api-utils';

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

    if (req.method === "GET") {

        const user: any = await getUser(req);

        if (user?.id) {
            const { data: follows, error: supabaseError } = await supabaseAnon
                .from('user_follows')
                .select('followee_id')
                .eq('follower_id', user.id);

            if (supabaseError) {
                console.error('Supabase error:', supabaseError);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            if (!follows) {
                console.error('No data found in follows');
                return res.status(404).json({ error: 'No data found' });
            }
            const follows_ = follows.map((usernameObj) => ({
                ...joinedChannelsData[0],
                username: usernameObj.followee_id,
            }));
            const topCreatorTokenResponse = {
                creator_tokens: follows_,
                follows: follows_
            };
            res.status(200).json(topCreatorTokenResponse);
        }
        else {
            const topCreatorTokenResponse = {
                creator_tokens: [],
            };
            res.status(200).json(topCreatorTokenResponse);
        }
    }
    else if (req.method === "POST") {
        // Constructing the response structure
        const response = {
            data: {
                profile: { ...({} || {}) },
                // Add more properties here if needed
            },
        };
        return res.status(200).json(response);
    }
    else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
}
