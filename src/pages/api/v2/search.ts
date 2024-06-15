import { NextApiRequest, NextApiResponse } from "next";
import { allowedOrigins } from "../api-utils";
import { mockSearchData } from "../../../data/mockdata";

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
        return res.status(200).json(mockSearchData);
    }
    else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
}
