import { allowedOrigins, supabase } from "@pages/api/api-utils";
import { translateUsingAI } from "@pages/api/hello";
import { fetchUserDetails } from "@pages/api/ScrapTwitterData";
import { DateTime } from 'luxon';

export default async function handler(req, res) {

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

    const { username, id } = req.query;

    if (req.method === 'POST') {

        const postData = req.body;

        const {
            fullText,
            createdAt
        } = postData;

        const isoTimestamp = DateTime.fromISO(createdAt).setZone('Asia/Kolkata').toISO();

        let translations = {
            default: fullText,
            english: fullText,
            hindi: fullText,
            telugu: fullText,
        };
        // const response = await translateUsingAI(fullText);
        // const translationsString = response.data.choices[0].message.content;
        // translations = translationsString? JSON.parse(translationsString): translations;
        // console.log(response);
        console.log(translations);

        await updateZulipMessageToSupabase(username, id, fullText, createdAt, translations);

        // Check if the username is one of the specific mock values
        res.status(200).json({ username: username });
    }
    else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
}

// Update data to Supabase
export async function updateZulipMessageToSupabase(username, id, text, timestamp, translations) {
    const message_id = id;
    let translated_content = {
        default: text,
        english: translations.english,
        telugu: translations.telugu,
        hindi: translations.hindi
    };
    // Convert current time to ISO 8601 format in Indian Standard Time (IST)
    let sampleMessage = {
        "message_id": message_id, // Assuming message_id is intended to be unique and based on the current timestamp
        "username": username, // Example username
        "source": "TWITTER", // Example source
        "content": translated_content, // Including the ISO 8601 timestamp in the message content for demonstration
        "translated_content": translated_content,
        "timestamp": timestamp, // Storing the timestamp in ISO 8601 format
        "reactions": [] // Example empty reactions array
    };
    try {
        const { data: updatedData, error } = await supabase
            .from('zulip_messages') // Replace 'your_table_name' with your Supabase table name
            .upsert([sampleMessage], { onConflict: ['message_id'] as any });
        if (error) {
            throw error;
        }
        return updatedData;
    } catch (error) {
        throw error;
    }
}
