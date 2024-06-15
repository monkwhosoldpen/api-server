import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        if (req.method === "GET" || req.method === "POST") {
            return res.status(200).json({
                "mint": {
                    "edition_contract_address": "0x29836C323553F57A0b9d4D42F6c2a0072858fde6",
                    "token_id": "111"
                },
                "remaining_mints_today": 0
            });
        }
        else {
            return res.status(405).json({ error: "Method not allowed" });
        }
    } catch (error) {
        return res.status(500).json({ error: "An unexpected error occurred" });
    }
}
