import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from './api-utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method === "POST") {
            const stringifiedData = req.body || { status: 'NA' };
            // const relevantActivitiesTwitter = await processFromIFFFT(stringifiedData);
            // const premium_user_username = 'narsaiah';
            // await updateZulipData(premium_user_username);
            const relevantActivitiesTwitter = await processFromIFFFT(stringifiedData);
            await updateZulipMessagesToSupabase(relevantActivitiesTwitter);
            return res.status(200).json({
                "content": "Hey, we just received **something** from IFFFT!"
            });
        }
        else {
            return res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('An unexpected error occurred:', error);
        return res.status(500).json({ error: 'An unexpected error occurred' });
    }
}

function generateTimestampBasedId() {
    const now = Date.now();
    const randomSuffix = Math.floor(Math.random() * 10000);
    return Number(String(now) + String(randomSuffix));
}

async function processFromIFFFT(sample) {

    const { TweetEmbedCode, CreatedAt, LinkToTweet, content } = sample;

    const username = 'narsaiah'

    const _test = CreatedAt || "January 26, 2024 at 08:23PM";
    // Convert the string to a date format JavaScript understands
    // Adjusting for AM/PM
    const _testDate = new Date(_test.replace(' at ', ' ').replace('PM', ' PM').replace('AM', ' AM'));
    // Convert to ISO string
    const isoTimestamp = _testDate.toISOString();

    console.log(isoTimestamp);


    try {
        // const currentTimestamp = new Date().toISOString();
        const sample_message = {
            "id": generateTimestampBasedId(),
            "url": LinkToTweet,
            "verified": true,
            "username": username,
            "fullname": username,
            "timestamp": isoTimestamp,
            "text": content,
            "links": [],
            "isPinned": false,
            "isQuote": false,
            "isRetweet": false,
            "isReply": false,
            "likes": 30,
            "replies": 2,
            "retweets": 1,
            "quotes": 0
        };
        return [sample_message].map(activityData => {
            const { username, text, id, timestamp, url } = activityData;
            const usernameWithoutAt = username.replace('@', '');
            return {
                username: usernameWithoutAt,
                source: "TWITTER",
                content: text,
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
                timestamp: timestamp,
                message_url: url,
                message_id: id,
                // Other fields as needed
            };
        });
    } catch (error) {
        console.error('Error in processTwitterMessages:', error);
        // Depending on your application, you might want to handle this error differently.
        // For example, you might return a default message, an empty array, or rethrow the error.
        return [];
    }
}

// Update data to Supabase
export async function updateZulipMessagesToSupabase(messages) {
    // const toPush = {
    //     username,
    //     messages: messages
    // };
    try {
        const { data: updatedData, error } = await supabase
            .from('zulip_messages') // Replace 'your_table_name' with your Supabase table name
            .upsert(messages, { onConflict: ['message_id'] as any, ignoreDuplicates: true }); // Cast 'uid' as 'any'
        if (error) {
            throw error;
        }
        return updatedData;
    } catch (error) {
        throw error;
    }
}
