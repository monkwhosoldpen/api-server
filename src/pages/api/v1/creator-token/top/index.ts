import { allowedOrigins, supabase } from "@pages/api/api-utils";
import PocketBase from 'pocketbase';
const pb = new PocketBase('https://grew-faster.pockethost.io');

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

    await pb.admins.authWithPassword('monkwhosoldpen@gmail.com', 'letmeenter@12345');

    if (req.method === 'GET') {
        const userProfiles = [];
        const resultList = await pb.collection('goats').getList(1, 50, {
            filter: 'created >= "2022-01-01 00:00:00" && someField1 != someField2',
        });
        
        // you can also fetch all records at once via getFullList
        const records = await pb.collection('goats').getFullList({
            sort: '-created',
        });
        
        // or fetch only the first record that matches the specified filter
        const record = await pb.collection('goats').getFirstListItem('someField="test"', {
            expand: 'relField1,relField2.subRelField',
        });
        // const { data: userProfiles, error } = await supabase
        // .from('user_profiles') // Replace 'user_profiles' with your actual table name
        // .select('*')
        // // .eq('verified', true)
        // // .eq('is_party', false)
        // // // .eq('is_demo', false)
        // .eq('is_secondary_stream', false);  

        // if (error) {
        //     // Handle the error
        //     return res.status(500).json({ error: 'An unexpected error occurred' });
        // }
        const topCreatorTokenResponse = {
            creator_tokens: [...records || [],]
        };
        res.status(200).json(topCreatorTokenResponse);
    }
    else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
}
