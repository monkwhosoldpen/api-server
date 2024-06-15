import { allowedOrigins, supabase } from "@pages/api/api-utils";
import axios from "axios";
import { DateTime } from 'luxon';
import OpenAI from 'openai';

export default async function handler1(req, res) {
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

    const sampleM = req.body || {};

    console.log(sampleM);

    const stream_id = '425985';

    await updateUserProfileToSupabase(stream_id);

    return res.status(200).json({
        "content": "Hey, we just received **something** from Zulip -- Supabase!"
    });
}
else {
    return res.status(405).json({ error: 'Method not allowed' });
}
}

// Update data to Supabase
async function updateUserProfileToSupabase(stream_id) {
  const message_id = Date.now();
  // Convert current time to ISO 8601 format in Indian Standard Time (IST)
  const isoTimestamp = DateTime.now().setZone('Asia/Kolkata').toISO();
  let text = `Date: ${isoTimestamp}`;
  let sampleMessage = {
    "message_id": message_id, // Assuming message_id is intended to be unique and based on the current timestamp
    "username": 'narsaiah', // Example username
    "source": "ZULIP", // Example source
    "content": text, // Including the ISO 8601 timestamp in the message content for demonstration
    translated_content: {
      default: text,
      english: text,
      telugu: 't' + text,
      kannada: 'k' + text,
      hindi: 'h' + text,
      tamil: 't' + text,
      sanskrit: 's' + text,
      malayalam: 'm' + text
    },
    "timestamp": isoTimestamp, // Storing the timestamp in ISO 8601 format
    "stream_id": stream_id, // Assuming stream_id is defined elsewhere in your code
    "reactions": [] // Example empty reactions array
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
