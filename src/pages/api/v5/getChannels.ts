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
            const followeeIds = follows.map((follow) => follow.followee_id);

            const { data: profiles, error: profilesError } = await supabaseAnon
                .from('user_profiles')  // Replace 'user_profiles' with your actual profiles table
                .select('*')
                .in('username', followeeIds);

            if (profilesError) {
                console.error('Supabase error:', profilesError);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            const topCreatorTokenResponse = {
                creator_tokens: profiles,
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
        const response = {
            data: {
                profile: {},
            },
        };
        return res.status(200).json(response);
    }
    else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
}
