import { NextApiRequest, NextApiResponse } from "next";
import { notificationsData } from "../../../../data/mockdata";
import { allowedOrigins, decodeToken, getUserDataByUId, supabase } from "../../api-utils";


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
        // Handle GET request
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            res.status(200).json([]);
        }
        else {
            
            const sampleNotification = {
                "id": 9589277,
                "to_timestamp": "2022-08-02T23:01:51.477461+00:00",
                "img_url": "https://lh3.googleusercontent.com/dcEVjRY_mmES4YwzJVa_tpuPuIEyXFsq-woKBJQ58LcovxEEYcXtU2vsiLK9R09cjs03ywJNyZyCI7P45WRzEWELly4ZYV63hXQT5w",
                "description": "how every do this thrusday sorry for inactivity just making what I make ",
                "type_name": "CHANNEL_NEW_MESSAGE",
                "actors": [
                    {
                        "username": "vaunarts",
                        "verified": true,
                        "bio": "My passion for illustration and coffee is a great combination, and it's always good to have a unique style that sets you apart from others in your field. Don’t give me camera I will run off with it and take unique pictures.\n\nAlso I talk to myself.",
                        "profile_id": 766282,
                        "name": "Oneil Vaun Clarke",
                        "wallet_address": "0xf5e39e8a8fe9db8338759250b698c35595d4679a",
                        "wallet_address_nonens": "0xf5e39e8a8fe9db8338759250b698c35595d4679a",
                        "img_url": "https://lh3.googleusercontent.com/dcEVjRY_mmES4YwzJVa_tpuPuIEyXFsq-woKBJQ58LcovxEEYcXtU2vsiLK9R09cjs03ywJNyZyCI7P45WRzEWELly4ZYV63hXQT5w"
                    }
                ],
                "nfts": null,
                "channel": {
                    "id": 40,
                    "name": "vaunarts_channel"
                }
            };

            res.status(200).json([sampleNotification]);
        }
    }
    else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
}
