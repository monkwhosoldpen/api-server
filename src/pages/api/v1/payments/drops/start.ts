import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

// Initialize the Supabase client with your Supabase URL and API Key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        if (req.method === "POST") {
            return res.status(200).json({
                "payment_intent_id": "pi_3NalqQAgQah8GEw21agboINg",
                "client_secret": "pi_3NalqQAgQah8GEw21agboINg_secret_M8h2XJCo7gnuRD3htjI6MIA2T"
            });
        }
        else {
            return res.status(405).json({ error: "Method not allowed" });
        }
    } catch (error) {
        console.error("An unexpected error occurred:", error);
        return res.status(500).json({ error: "An unexpected error occurred" });
    }
}
