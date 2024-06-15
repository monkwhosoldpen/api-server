import { NextApiRequest, NextApiResponse } from 'next';
import { allowedOrigins, decodeAndVerifyToken, decodeToken, generateDIDProfileId, supabase } from '../../../api-utils';
import { pushMockData } from '../../../../../data/mockdata';

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

    if (req.method === "PATCH") {
        const authHeader = req.headers.authorization;
        const accessToken = authHeader.split(" ")[1];

        // console.log(accessToken);
        // const decodedPayload = decodeToken(accessToken);
        // console.log(decodedPayload);

        const payload = decodeToken(accessToken);
        const uid = payload.did;
        console.log(uid);

        // const settingsToUpdate = req.body; // Contains the dynamic settings

        // const savedSettings = await updateNotificationSettings(uid, settingsToUpdate);

        // if (!savedSettings) {
        //     return res.status(500).json({ error: "Failed to update notification settings" });
        // }

        return res.status(200).json(pushMockData);
    } else if (req.method === "GET") {
        const authHeader = req.headers.authorization;
        const accessToken = authHeader.split(" ")[1];

        // console.log(accessToken);
        // const decodedPayload = decodeToken(accessToken);
        // console.log(decodedPayload);

        const payload = decodeToken(accessToken);
        const uid = payload.did;
        console.log(uid);

        // // Fetch user settings based on the UID from the user_settings table
        // const { data: userSettings, error } = await supabase
        //     .from("user_settings")
        //     .select()
        //     .eq('uid', uid)
        //     .single();

        // if (error) {
        //     console.error("An error occurred while fetching user settings:", error);
        //     return res.status(500).json({ error: "Failed to fetch user settings" });
        // }

        // Return the fetched user settings or mock data if user settings are not found
        return res.status(200).json(pushMockData);
    }
    else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
}
