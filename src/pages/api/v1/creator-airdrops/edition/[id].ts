import { allowedOrigins } from "@pages/api/api-utils";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req, res) {
    // Set CORS headers
    const origin = req.headers.origin;

    // Set CORS headers
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle OPTIONS request for preflight check
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === "GET") {
        return res.status(200).json({
            "mint": {
                "edition_contract_address": "0x29836C323553F57A0b9d4D42F6c2a0072858fde6",
                "token_id": "111"
            },
            "remaining_mints_today": 100
        });
    }
    else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
}
