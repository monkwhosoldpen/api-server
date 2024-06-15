import { allowedOrigins, decodeToken, getUserDataByUId, supabase } from "../api-utils";

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

        let my_channels = [];
        const authHeader = req.headers.authorization;

        if (authHeader) {

            const accessToken = authHeader.split(" ")[1];

            const payload = decodeToken(accessToken);
            const uid = payload.did;
            const userData = await getUserDataByUId(uid);
            // console.log(userData.notifications_last_opened);

            try {
                const { data, error } = await supabase.rpc('get_following_profiles_by_uid', {
                    uid_param: uid
                });
                if (error) {
                    console.error("Error fetching user data with follow counts:", error.message);
                }
                else if (!data) {
                    console.error("No data found for uid:", uid);
                }
                my_channels = (data || []).map(ele => {
                    return {
                        ...ele,
                        tags: [
                            'joined',
                        ]
                    }
                });
            }
            catch (error) {
                console.error("An error occurred while fetching user data with follow counts:", error.message);
            }

            my_channels = (my_channels || []).map(ele => ({
                ...ele,
                tags: ['joined'],
                read: ele.latest_message ? userData.notifications_last_opened >= ele.latest_message?.timestamp : true // Set read based on timestamp comparison
            }));

            // console.log(my_channels[0])

            const topCreatorTokenResponse = {
                creator_tokens: my_channels,
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
    else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
}
