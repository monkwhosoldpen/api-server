import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import { chainIdentifierMockData } from "../../../../../data/mockdata";


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        if (req.method === "GET") {
            // const userData = await GetUserInfo(req);
            // // If userData is null, it means the user is not found in Supabase
            // const user = userData || {};
            return res.status(200).json(chainIdentifierMockData);
        }
        else if (req.method === "DELETE") {
            // const userData = await GetUserInfo(req);
            // // If userData is null, it means the user is not found in Supabase
            // const user = userData || {};
            return res.status(200).json(chainIdentifierMockData);
        }
        else {
            return res.status(405).json({ error: "Method not allowed" });
        }
    } catch (error) {
        console.error("An unexpected error occurred:", error);
        return res.status(500).json({ error: "An unexpected error occurred" });
    }
}
