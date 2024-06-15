import { allowedOrigins, supabase } from "@pages/api/api-utils";
import axios from "axios";
import { DateTime } from 'luxon';

const sdk = require('api')('@pplx/v0#29jnn2rlt35the2');



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

  const sample = {
    "metadata_with_translations": {
      "bio": {
        "hindi": "",
        "default": "",
        "telugu": "",
        "english": ""
      },
      "name": {
        "hindi": "",
        "default": "",
        "telugu": "",
        "english": ""
      }
    },
  };

  // const fullName = 'Elon Musk'
  const bio = 'Entrepreneur and business magnate. Founder of SpaceX, Tesla, SolarCity, Neuralink, and The Boring Company.'
  const resp = {};//await translateUsingAI(bio);
  res.status(200).json({ data: resp });


  // sdk.auth('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');
  // sdk.post_chat_completions({
  //   model: 'mistral-7b-instruct',
  //   messages: [
  //     { role: 'system', content: 'Be precise and concise.' },
  //     { role: 'system', content: `This is my bio ${bio}?, for ${fullName}` },
  //     { role: 'user', content: 'give me back a json having tranlsations for bio and fullName, the languages are english, hindi and telugu?' }
  //   ]
  // })
  //   .then(({ data }) => {
  //     res.status(200).json({ data: data });
  //     console.log(data);
  //   })
  //   .catch(err => console.error(err));

  // const stream_id = '425985';

  // await updateZulipMessageToSupabase(stream_id);
  // // Example usage:
  // sendNotificationToUsers('You have a new Alert!').then((result) => {
  //   console.log(result);
  // });

  // res.status(200).json({ name: "Test Message Inserted!" });
}


export function translateUsingAI(text: any) {
  sdk.auth('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');
  return sdk.post_chat_completions({
    model: 'mistral-7b-instruct',
    messages: [
      { role: 'system', content: 'Be precise and concise.' },
      { role: 'system', content: `This is my text: ${text}?` },
      {
        role: 'user',
        content: `Translate the following text into multiple languages: ${text}. Please provide translations in English, Hindi, and Telugu. Format the response as JSON with keys for each language: {english: '', hindi: '', telugu: ''} A key called urls that is array of any urls in the text. Do not miss urls or anything untranslatable`
      }
    ]
  })
    .then(({ data }) => {
      // Assuming data is in the format you expect
      return { data: data };
    })
    .catch(err => {
      console.error(err);
      // Return a default or error-specific response structure
      return {
        data: {
          error: "An error occurred during translation.",
          details: err.message || "Unknown error", // Customize based on actual error object structure
          english: text, // Optionally return the original text for reference
          hindi: "",
          telugu: "",
        }
      };
    });
}

async function sendNotificationToUsers(message) {
  // Mock OneSignal app ID and REST API key (replace with your actual credentials)
  const appId = '078fd443-0e11-48b1-9d3e-3b35a15a6658';
  const restApiKey = 'MjRiZTQ3NzQtOGRmYi00Mjc0LTlkN2MtMzI4MzBmOWJlM2Ix';

  const notification = {
    app_id: appId,
    contents: { en: message }, // Message content
    included_segments: ['All'], // Send to all subscribed users
    url: 'http://localhost:3000/groups/narsaiah', // URL to navigate to on click
    big_picture: 'https://placehold.co/600x400', // Mock huge image using placehold.co
    buttons: [
      { id: "id1", text: "Button 1", icon: "https://placehold.co/128x128" },
      { id: "id2", text: "Button 2", icon: "https://placehold.co/128x128" }
    ],
    data: { key1: "value1", key2: "value2" },
    // Add more detailed fields as needed
  };

  // Set OneSignal API endpoint
  const apiUrl = 'https://onesignal.com/api/v1/notifications';

  try {
    // Send POST request to OneSignal API
    const response = await axios.post(apiUrl, notification, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${restApiKey}`,
      },
    });


    // Check if the notification was sent successfully
    if (response.data.success) {
      console.log('Notification sent successfully:', response.data);
      return { success: true, message: 'Notification sent successfully' };
    } else {
      console.error('Failed to send notification:', response.data.errors);
      return { success: false, message: 'Failed to send notification' };
    }
  } catch (error) {
    console.error('Error sending notification:', error);
    return { success: false, message: 'Error sending notification' };
  }
}

// Update data to Supabase
async function updateZulipMessageToSupabase(stream_id) {
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
