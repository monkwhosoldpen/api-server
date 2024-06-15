import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import { allNFTSData1 } from "../../../../data/mockdata";

// Initialize the Supabase client with your Supabase URL and API Key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const { profile_id, tab_type } = req.query;
        if (req.method === "GET") {
            console.log(profile_id);
            const responseTabs = {
                has_more: false,
                items: allNFTSData1
            }
            return res.status(200).json(responseTabs);
            // Get the tab_type from the request query
            // const items = await getNftItems(profile_id, tab_type);
            // const nftTabsData = {
            //     items,
            //     has_more: false
            // };
            // return res.status(200).json(nftTabsData);
        } else {
            return res.status(405).json({ error: "Method not allowed" });
        }
    } catch (error) {
        return res.status(500).json({ error: "An unexpected error occurred" });
    }
}

const getNftItems = async (profile_id, tab_type) => {

    const { data: nftItems, error: nftError } = await supabase
        .from("nfts")
        .select()
        .eq("profile_id", profile_id);

    if (nftError) {
        throw new Error("Error fetching NFT items");
    }
    return nftItems || [];
};