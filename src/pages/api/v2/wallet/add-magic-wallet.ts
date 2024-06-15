import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        if (req.method === "POST") {
            return res.status(200).json({
                "address": "0xa75AeE96Cc23DCe3ffadF2f24B7d7A87631CAE07",
                "nickname": null,
                "email": null,
                "phone_number": null,
                "last_authenticated": "2023-08-02T19:44:04.098Z",
                "is_email_user": true,
                "ens_domain": null,
                "minting_enabled": false
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
