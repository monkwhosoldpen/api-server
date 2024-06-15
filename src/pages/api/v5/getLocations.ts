import { allowedOrigins, supabase } from "../api-utils";

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
    // Handle OPTIONS request for preflight check
    if (req.method === "GET") {
        // Assuming 'supabase' is configured properly and can access the 'locations' table
        const { data: locations, error } = await supabase
            .from('locations')
            .select('*'); // Replace 'username' with actual column names you need

        if (error) {
            console.error("Error fetching locations:", error.message);
            return res.status(500).json({ error: "An unexpected error occurred" });
        }

        return res.status(200).json({
            locations: locations || [],
        });
    }
    else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
  }
  