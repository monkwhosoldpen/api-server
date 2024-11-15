import { allowedOrigins, supabaseAnon } from '../../../api-utils';
import { createClient } from '@supabase/supabase-js';
import { mockChannelMessageData } from '../../../../../data/mockdata';

export default async function handler(req, res) {
  // Set CORS headers
  const origin = req.headers.origin;

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

    const parsedPage = parseInt(Array.isArray(page) ? page[0] : page) || 1;
    const parsedLimit = parseInt(Array.isArray(limit) ? limit[0] : limit) || 20;

    // console.log(channelId);

    // Fetch messages from Supabase
    let { data: messages, error } = await supabaseAnon
      .from('messages')
      .select('*')
      .range((parsedPage - 1) * parsedLimit, parsedPage * parsedLimit - 1);

    if (error) {
      return res.status(500).json({ error: 'Error fetching messages' });
    }

    const sampleMessage = {
      "channel_message": {
        "id": 1,
        "created_at": new Date().toISOString(),
        "updated_at": new Date().toISOString(),
        "is_payment_gated": true,
        "body": "Hey everyone! We have a new feature out soon and if you're a fixd creator, we'd love you to pilot it with us.\n\nIf you're seeing this, you can DM me on Twitter (twitter.com/fixd) or Telegram (t.me/fixd) to learn more. Thank you!",
        "body_text_length": 243,
        "sent_by": {
          "id": 1,
          "admin": false,
          "created_at": new Date().toISOString(),
          "updated_at": new Date().toISOString(),
          "profile": {
            "verified": false,
            "bio": "Sample bio",
            "profile_id": 1,
            "name": "Sample User",
            "username": channelId,
            "wallet_address": "sample.eth",
            "wallet_address_nonens": "0x0000000000000000000000000000000000000000",
            "img_url": "https://lh3.googleusercontent.com/m4ybeZLNk3gORAtt35Far8MuVx-1s4EWXiY_W9XXZ-E0cmDupCUEpbX3lLt3RfGAtNWHePDUAPKvijLmbmpeCIxe4RXpZotrz-KX"
          }
        }
      },
      "reaction_group": [
        {
          "reaction_id": 1,
          "count": 0,
          "self_reacted": false
        }
      ],
      "read": false
    };

    // Format messages like the sample message at index 0
    const formattedMessages = messages.map(message => {
      return sampleMessage;
    });

    return res.status(200).json(formattedMessages);
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

