import { supabase } from "../../api-utils";

// Handle the API route
export default async function handler(req, res) {
    try {
        if (req.method === 'GET') {
            const { data: userProfiles, } = await supabase
                .from('user_profiles')
                .select('*');
            res.status(200).json(userProfiles || []);
        } else {
            return res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('An unexpected error occurred:', error);
        return res.status(500).json({ error: 'An unexpected error occurred' });
    }
}
