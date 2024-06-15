import { allowedOrigins, decodeToken, getUserDataByUId } from '../api-utils';

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
        const authHeader = req.headers.authorization;
        const accessToken = authHeader.split(" ")[1];

        const payload = decodeToken(accessToken);
        const uid = payload.did;
        const userData = await getUserDataByUId(uid);

        // If userData is null, it means the user is not found
        const user = userData || {};

        if (!user) {
            return res.status(500).json({ error: 'No object found' });
        }

        let follows = [];
        let joined_channels = [];

        if (user.follows && user.follows.length > 0) {
            follows = user.follows.map((profileId) => ({ profile_id: profileId }));
            joined_channels = user.follows.map((channel_id) => ({ channel_id: channel_id }));
        }

        delete user['following_count'];
        delete user['followers_count'];

        // Constructing the response structure with the modified follows array
        const response = {
            data: {
                profile: { ...user },
                followers_count: 5000,
                following_count: 500,
                joined_channels: joined_channels,
                follows: follows, // Use the modified array of objects
            },
        };
        return res.status(200).json(response);
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
  