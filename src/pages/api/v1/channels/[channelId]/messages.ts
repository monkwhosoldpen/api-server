import { allowedOrigins } from '../../../api-utils';
import { mockChannelMessageData, mockUserMe } from '../../../../../data/mockdata';

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

    let { page, limit, channelId } = req.query;
    // Ensure `page` and `limit` are treated as single string values.
    // If they are arrays, take the first element; otherwise, take them as they are.
    const parsedPage = parseInt(Array.isArray(page) ? page[0] : page) || 1;
    const parsedLimit = parseInt(Array.isArray(limit) ? limit[0] : limit) || 20;

    // const { data: userProfile } = await supabase
    //   .from('user_profiles')
    //   .select('*')
    //   // Use ilike for case-insensitive comparison
    //   .ilike('username', `%${channelId as string}%`)
    //   .limit(1);

    return res.status(200).json(mockChannelMessageData);

    // if (channelId == 'johndoe') {
    //   return res.status(200).json(mockChannelMessageData);
    // }
    // else {
    //   return res.status(200).json(response_send);
    // }

  }
  else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
