import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from "@supabase/supabase-js";
import { allNFTSData1 } from '../../../../data/mockdata';

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
            // const { data, error } = await supabase.rpc("get_nfts_with_owners");
            // if (error) {
            //     return res.status(500).json({ error: "Error executing query" });
            // }
            // const response = data.map(ele => {
            //     return {
            //         ...ele,
            //         // ...allNFTSData1[0]
            //         chain_name: 'dontknow',
            //         contract_address: '0xbE853d21cEC138Ae8513291674d93659d742fc9e',
            //         token_id: ele.nft_id,
            //         creator_username: 'dontknow',
            //         creator_name: 'dontknow',
            //         slug: "throwback-to-my-first-ai-drop",
            //         username: 'creator_username'
            //     };
            // })
            return res.status(200).json(allNFTSData1);
        } else {
            return res.status(405).json({ error: "Method not allowed" });
        }
    } catch (error) {
        console.error("An unexpected error occurred:", error);
        return res.status(500).json({ error: "An unexpected error occurred" });
    }
}