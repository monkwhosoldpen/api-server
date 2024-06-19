import { JWT_SECRET, allowedOrigins, getUser, supabase } from "../../api-utils"; // Ensure you import supabase from api-utils
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
    try {
        // Set CORS headers
        const origin = req.headers.origin;
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

        // Handle POST request
        if (req.method === "POST") {
            const { id } = req.query;

            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const token = authHeader.split(' ')[1]; // Extract token from "Bearer <token>"

            const decodedToken = jwt.verify(token, JWT_SECRET);
            const uid = decodedToken.sub;

            const follower_id = uid;
            const followee_id = id;

            const { data, error } = await supabase
                .from("user_follows")
                .delete()
                .eq("follower_id", follower_id)
                .eq("followee_id", followee_id);

            // Handle insertion error
            if (error) {
                console.error("Error adding follow:", error);
                return res.status(500).json({ error: "Error adding follow" });
            }

            return res.status(200).json({});
        } else {
            return res.status(405).json({ error: "Method not allowed" });
        }
    } catch (error) {
        console.error("Unexpected error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
