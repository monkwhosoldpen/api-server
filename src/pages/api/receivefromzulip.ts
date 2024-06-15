import { allowedOrigins, supabase } from "@pages/api/api-utils";
import { updateZulipData } from "./loadData";

const sampleMessageFromZulip = {
  "bot_email": "outgoing-bot@localhost",
  "bot_full_name": "Outgoing webhook test",
  "data": "@**Outgoing webhook test** Zulip is the world\u2019s most productive group chat!",
  "message": {
    "avatar_url": "https://secure.gravatar.com/avatar/1f4f1575bf002ae562fea8fc4b861b09?d=identicon&version=1",
    "client": "website",
    "content": "@**Outgoing webhook test** Zulip is the world\u2019s most productive group chat!",
    "display_recipient": "Verona",
    "id": 112,
    "is_me_message": false,
    "reactions": [],
    "recipient_id": 20,
    "rendered_content": "<p><span class=\"user-mention\" data-user-id=\"25\">@Outgoing webhook test</span> Zulip is the world\u2019s most productive group chat!</p>",
    "sender_email": "iago@zulip.com",
    "sender_full_name": "Iago",
    "sender_id": 5,
    "sender_realm_str": "zulip",
    "stream_id": 419668,
    "subject": "Verona2",
    "submessages": [],
    "timestamp": 1527876931,
    "topic_links": [],
    "type": "stream"
  },
  "token": "xvOzfurIutdRRVLzpXrIIHXJvNfaJLJ0",
  "trigger": "mention"
};

export default async function handler(req, res) {
  // Set CORS headers
  const origin = req.headers.origin;
  const sampleM = req.body || {};

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

  const stream_id = sampleM?.message?.stream_id || '425985';
  const message_id = sampleM?.message?.id || 112;
  const timestamp = sampleM?.message?.timestamp || 1527876931;

  let username = '';

  try {
    username = await fetchStreamName(stream_id);
  } catch (error) {
    // Here you can customize the error response based on the error thrown
    username = '';
  }
  if (username) {
    await updateZulipData(false);
    sendNotificationAsync(sampleM)
      .then(response => console.log("Notification sent successfully:", response))
      .catch(error => console.error("Failed to send notification:", error));
  }
  return res.status(200).json({
    "content": "Hey, we just received **something** from Zulip -- Supabase!" + stream_id + JSON.stringify(sampleM)
  });
}

// Example async function to send a notification, replace with your actual notification API call
async function sendNotificationAsync(data) {
  // Placeholder for your notification API call logic
  // For example:
  await fetch('https://push.fixd.ai/api/push', { method: 'GET' });
  console.log("Sending notification with data:", data);
}

export async function fetchStreamName(stream_id) {
  try {
    const { data, error } = await supabase
      .from('zulip_streams')
      .select('name')
      .eq('stream_id', stream_id)
      .single();

    if (error) {
      console.error('Error fetching stream name:', error.message);
      return ""; // Return an empty string in case of error
    }

    return data?.name || ""; // Return the name or an empty string if name is not found
  } catch (error) {
    console.error('Unexpected error fetching stream name:', error.message);
    return ""; // Return an empty string in case of unexpected error
  }
}

// Update data to Supabase
async function updateZulipMessagesToSupabase(username, sampleMessage, stream_id, message_id, timestamp) {
  sampleMessage = {
    // ...sampleMessage,
    "message_id": message_id,
    "username": username || "NOT_FOUND",
    "source": "ZULIP",
    "content": sampleMessage?.message.content,
    "timestamp": "2018-06-01T15:42:11Z",
    "stream_id": stream_id,
    "reactions": []
  };
  try {
    const { data: updatedData, error } = await supabase
      .from('zulip_messages') // Replace 'your_table_name' with your Supabase table name
      .upsert([sampleMessage], { onConflict: ['message_id'] as any, ignoreDuplicates: true }); // Cast 'uid' as 'any'
    if (error) {
      throw error;
    }
    return updatedData;
  } catch (error) {
    throw error;
  }
}
