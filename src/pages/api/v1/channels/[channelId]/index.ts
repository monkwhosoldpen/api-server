// import { allowedOrigins, supabase } from "../../../api-utils";
import { allowedOrigins, supabaseAnon } from "@pages/api/api-utils";
import { mockUserMe } from "../../../../../data/mockdata";

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

        let { channelId } = req.query;

        let mockChannelInfo: any = {
            "created_at": "2023-06-05T20:15:49.378Z",
            "updated_at": "2023-06-05T20:15:49.378Z",
            "owner": {
            },
            "channel_reactions": [
                {
                    "id": 2,
                    "reaction": "\ud83d\udd25"
                },
                {
                    "id": 4,
                    "reaction": "\ud83d\ude0d"
                },
                {
                    "id": 5,
                    "reaction": "\ud83e\udd2f"
                },
                {
                    "id": 6,
                    "reaction": "\ud83e\udd23"
                },
                {
                    "id": 7,
                    "reaction": "\ud83d\ude4f"
                }
            ],
            "member_count": 2555,
            "latest_message_updated_at": "2023-11-16T20:41:03.968Z",
            "latest_message_created_at": "2023-11-16T20:41:03.968Z",
            "permissions": {
                "can_upload_media": false,
                "can_send_messages": false,
                "can_view_creator_messages": true,
                "can_view_public_messages": true
            }
        };

        const { data: userProfile, } = await supabaseAnon
            .from('user_profiles')
            .select('*')
            .eq('username', channelId || 'elonmusk')
            .limit(1);

        const modifiedOwner = userProfile && userProfile[0]
            ? { ...userProfile[0] }
            : { ...mockUserMe.data.profile };

        let res1 = mockChannelInfo;
        
        res1 = {
            ...modifiedOwner,
            spotify_artist_id: "1L0eYtrSxuk6bhdupdVFpH",
            apple_music_artist_id: "1489534572",
            social_login_handles: {
                "instagram": 'userProfile.instagram',
                "twitter": 'userProfile.twitter'
            },
        };
        res.status(200).json({ ...mockChannelInfo, owner: { ...res1 } });

    }
    else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
}
