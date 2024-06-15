import { NextApiRequest, NextApiResponse } from "next";
import { UpdateUserInfo } from "../api-utils";
import { mockUserMe } from "../../../data/mockdata";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        if (req.method === "POST") {
            const userData = await UpdateUserInfo(req);
            // If userData is null, it means the user is not found in Supabase
            const userResponse = {
                data: {
                    profile: { ...mockUserMe.data.profile, ...userData },
                }
            };
            return res.status(200).json(userResponse);
        }
        else {
            return res.status(405).json({ error: "Method not allowed" });
        }
    } catch (error) {
        return res.status(500).json({ error: "An unexpected error occurred" });
    }
}

