import { NextApiRequest, NextApiResponse } from "next";

import { allNFTSData1 } from "../../../../../../data/mockdata";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        if (req.method === "GET") {
            // Create a map to look up user info by username
            const userMap = new Map();
            // Manipulate allNFTSData1 based on user info for owner details
            const manipulatedNFTSData = allNFTSData1.map((nft) => {
                const ownerInfo = userMap.get(nft.creator_name);



                // Check if user info exists
                if (ownerInfo) {
                    return {
                        ...nft,
                        "owner_name": ownerInfo.name,
                        "owner_address": ownerInfo.location,
                        "creator_img_url": ownerInfo.img_url,
                        "creator_followers_count": ownerInfo.followers_count,
                    };
                } else {
                    return nft; // If user info doesn't exist, keep the original NFT data
                }
            });

            return res.status(200).json([]);
        } else {
            return res.status(405).json({ error: "Method not allowed" });
        }
    } catch (error) {
        console.error("An unexpected error occurred:", error);
        return res.status(500).json({ error: "An unexpected error occurred" });
    }
}
