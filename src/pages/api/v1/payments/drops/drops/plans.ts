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
        if (req.method === "GET") {
            // const userData = await GetUserInfo(req);
            // // If userData is null, it means the user is not found in Supabase
            // const user = userData || {};
            return res.status(200).json([
                {
                    "name": "small_50",
                    "edition_size": 50,
                    "pricing": 399
                },
                {
                    "name": "medium_100",
                    "edition_size": 100,
                    "pricing": 599
                },
                {
                    "name": "large_1000",
                    "edition_size": 1000,
                    "pricing": 999
                }
            ]);
        }
        else {
            return res.status(405).json({ error: "Method not allowed" });
        }
    } catch (error) {
        console.error("An unexpected error occurred:", error);
        return res.status(500).json({ error: "An unexpected error occurred" });
    }
}
