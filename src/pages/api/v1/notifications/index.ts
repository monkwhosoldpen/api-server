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

            // const accessToken = authHeader.split(" ")[1];
            // const payload = decodeToken(accessToken);

            // const uid = payload.did;
            // const userData = await getUserDataByUId(uid);

            // const user = userData || {};

            // let follows = [];
            // let joined_channels = [];

            // if (user.follows && user.follows.length > 0) {
            //     follows = user.follows.map((profileId) => ({ profile_id: profileId }));
            //     joined_channels = user.follows.map((channel_id) => ({ channel_id: channel_id }));
            // }

            // const notifications_last_opened = userData?.notifications_last_opened || new Date().toISOString();

            // const { data: unreadMessages, error: unreadMessagesError } = await supabase
            //     .from('zulip_messages')
            //     .select('*')
            //     .gt('timestamp', notifications_last_opened)
            //     .order('timestamp', { ascending: false })
            // // .limit(10);

            // if (unreadMessagesError) {
            //     console.error("Error fetching unread messages:", unreadMessagesError.message);
            //     return res.status(500).json({ error: "Error fetching unread messages" });
            // }

            // const sampleNotification = {
            //     "id": 9589277,
            //     "to_timestamp": "2022-08-02T23:01:51.477461+00:00",
            //     "img_url": "https://lh3.googleusercontent.com/dcEVjRY_mmES4YwzJVa_tpuPuIEyXFsq-woKBJQ58LcovxEEYcXtU2vsiLK9R09cjs03ywJNyZyCI7P45WRzEWELly4ZYV63hXQT5w",
            //     "description": "how every do this thrusday sorry for inactivity just making what I make ",
            //     "type_name": "CHANNEL_NEW_MESSAGE",
            //     "actors": [
            //         {
            //             "username": "vaunarts",
            //             "verified": true,
            //             "bio": "My passion for illustration and coffee is a great combination, and it's always good to have a unique style that sets you apart from others in your field. Don’t give me camera I will run off with it and take unique pictures.\n\nAlso I talk to myself.",
            //             "profile_id": 766282,
            //             "name": "Oneil Vaun Clarke",
            //             "wallet_address": "0xf5e39e8a8fe9db8338759250b698c35595d4679a",
            //             "wallet_address_nonens": "0xf5e39e8a8fe9db8338759250b698c35595d4679a",
            //             "img_url": "https://lh3.googleusercontent.com/dcEVjRY_mmES4YwzJVa_tpuPuIEyXFsq-woKBJQ58LcovxEEYcXtU2vsiLK9R09cjs03ywJNyZyCI7P45WRzEWELly4ZYV63hXQT5w"
            //         }
            //     ],
            //     "nfts": null,
            //     "channel": {
            //         "id": 40,
            //         "name": "vaunarts_channel"
            //     }
            // };

            // const myNotification = {
            //     message_id: 17056947661061756,
            //     username: 'narsaiah',
            //     sender_id: null,
            //     source: 'TWITTER',
            //     content: 'Hello World!',
            //     translated_content: {
            //         hindi: 'hHello World!',
            //         tamil: 'tHello World!',
            //         telugu: 'tHello World!',
            //         default: 'Hello World!',
            //         english: 'Hello World!',
            //         kannada: 'kHello World!',
            //         sanskrit: 'sHello World!',
            //         malayalam: 'mHello World!'
            //     },
            //     message_url: 'https://twitter.com/narsaiah/status/123',
            //     recipient_id: null,
            //     timestamp: '2024-01-19T20:06:06.106',
            //     edit_history: null,
            //     client: null,
            //     subject: null,
            //     is_me_message: null,
            //     sender_full_name: null,
            //     sender_email: null,
            //     sender_realm_str: null,
            //     display_recipient: null,
            //     type: null,
            //     stream_id: null,
            //     avatar_url: null,
            //     flags: null,
            //     content_type: null,
            //     submessages: null,
            //     reactions: null,
            //     topic_links: null,
            //     last_edit_timestamp: null
            // };

            // const combinedNotification = {
            //     "id": 17056947661061756,
            //     "to_timestamp": "2024-01-19T20:06:06.106",
            //     "img_url": null, // or a placeholder image URL
            //     "description": "Hello World!",
            //     "type_name": "TWITTER_MESSAGE",
            //     "actors": [
            //         {
            //             "username": "narsaiah",
            //             "verified": false, // Default value, as it's not provided in myNotification
            //             "bio": null, // Default value
            //             "profile_id": null, // Default value
            //             "name": null, // Default value
            //             "wallet_address": null, // Default value
            //             "wallet_address_nonens": null, // Default value
            //             "img_url": null // Default value or placeholder
            //         }
            //     ],
            //     "nfts": null,
            //     "channel": {
            //         "id": null, // Default value as there's no direct equivalent
            //         "name": "narsaiah_twitter" // Constructed from username and source
            //     }
            // };

            // console.log(unreadMessages?.length);

            // let sample = (unreadMessages || []).map(ele => {
            //     return {
            //         // ...ele,
            //         ...sampleNotification
            //     }
            // });

            res.status(200).json([]);
        }
    }
    else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
}
