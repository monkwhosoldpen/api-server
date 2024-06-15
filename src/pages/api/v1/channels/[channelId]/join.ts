import { allowedOrigins, decodeToken, getUserDataByUId, supabase } from "@pages/api/api-utils";

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

  if (req.method === "POST") {

    const { channelId } = req.query;
    const id = channelId;
    const authHeader = req.headers.authorization;
    const accessToken = authHeader.split(" ")[1];

    const payload = decodeToken(accessToken);
    const uid = payload.did;
    const userData = await getUserDataByUId(uid);
    const follower_id = userData.profile_id;

    // Insert a new follow into the follows table
    const { data, error } = await supabase
      .from("user_follows")
      .insert([
        {
          follower_id,
          followee_id: id
        }
      ]);

    if (error) {
      console.error("Error adding follow:", error);
      return res.status(500).json({ error: "Error adding follow" });
    }
    return res.status(200).json({});
  }
  else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
