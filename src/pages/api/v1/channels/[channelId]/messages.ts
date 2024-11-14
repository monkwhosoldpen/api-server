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

    // // Fetch messages from Supabase
    // let { data: messages, error } = await supabaseAnon
    //   .from('messages')
    //   .select('*')
    //   .eq('username', 'elonmusk')
    //   .range((parsedPage - 1) * parsedLimit, parsedPage * parsedLimit - 1);

    // if (error) {
    //   return res.status(500).json({ error: 'Error fetching messages' });
    // }
    
    // // Format messages like the sample message at index 0
    // const formattedMessages = messages.map(message => {
    //   return {
    //     channel_message: {
    //       id: message.message_id,
    //       created_at: message.timestamp,
    //       updated_at: message.timestamp,
    //       is_payment_gated: false,
    //       body: message.content.text,
    //       body_text_length: 243,
    //       sent_by: {
    //         admin: true,
    //         profile: [Object]
    //       }
    //     },
    //     read: true
    //   }
    // });

    return res.status(200).json(mockChannelMessageData);
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
