import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
// import { supabase } from "../../../api-utils";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { creator_token_id, tab_type } = req.query;
        if (req.method === "GET") {

            // const { data, error } = await supabase
            //     .rpc("get_default_channels_by_profile_id", { profile_id_param: creator_token_id })
            //     .select("*");

            // if (error) {
            //     console.error("Supabase error:", error);
            //     return res.status(500).json({ error: "An error occurred while fetching channels" });
            // }

            return res.status(200).json({ profiles: [] });

        } else {
            return res.status(405).json({ error: "Method not allowed" });
        }
    } catch (error) {
        console.error("An unexpected error occurred:", error);
        return res.status(500).json({ error: "An unexpected error occurred" });
    }
}
