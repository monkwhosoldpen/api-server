import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const developerToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiIsImtpZCI6IjMzRFI3UzY1NEsifQ.eyJpc3MiOiI4OFRLSEIyNjhXIiwiZXhwIjoxNjkwOTk3NDk0LCJpYXQiOjE2OTA5OTAyOTR9.bmf5TYQ7RbwLiYJGMxc94uI4XoHCkMYYGCIQ3zhaH-Ig0C_4rg30UrtgCXmqss5qJeEEalSYuQH2-t81nEzmzg';
    res.json({ developer_token: developerToken });
}
