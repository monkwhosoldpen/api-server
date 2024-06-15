import { allowedOrigins, supabase } from '../../../api-utils';
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

    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select('*')
      // Use ilike for case-insensitive comparison
      .ilike('username', `%${channelId as string}%`)
      .limit(1);

    const modifiedOwner = {
      profile: userProfile[0] || mockUserMe.data.profile,
    };

    const { data: activities, error } = await supabase
      .from('zulip_messages')
      .select('*')
      // Use ilike for case-insensitive comparison
      .ilike('username', `%${channelId as string}%`)

      // // .eq('source', 'ZULIP') // Filter activities by source
      .range((parsedPage - 1) * parsedLimit, parsedPage * parsedLimit - 1)
      .order('timestamp', { ascending: false }); // Change to ascending order

    if (error) {
      console.error("An error occurred during retrieval:", error);
      return res.status(500).json({ error: "Internal server error" });
    }

    const response_send = activities.map(ele => {
      let sampleMessage = {
        "channel_message": {
          "id": 490,
          "created_at": ele.timestamp,
          "updated_at": ele.timestamp,
          "is_payment_gated": false,
          "body": ele.content,
          source: ele.source,
          mime_type: ele.mime_type,
          "body_text_length": 243,
          "sent_by": { profile: modifiedOwner.profile },
          "media": ele.media || [
            {
              "type": "photo",
              "media_url": "https://pbs.twimg.com/media/FRNsuSFWUAUW6aP.jpg"
            }
          ],
        },
        "reaction_group": [
          {
            "reaction_id": 5,
            "count": 2,
            "self_reacted": false
          },
          {
            "reaction_id": 2,
            "count": 9,
            "self_reacted": false
          },
          {
            "reaction_id": 4,
            "count": 2,
            "self_reacted": false
          }
        ],
        "read": true
      };
      return { ...ele, ...sampleMessage }
    });

    return res.status(200).json(response_send);

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
