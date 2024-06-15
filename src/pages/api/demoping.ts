import { NextApiRequest, NextApiResponse } from 'next';
import zulipInit from 'zulip-js';
import { supabase } from './api-utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method === "POST") {
            // POST method logic
            // const premium_user_username1 = 'apjithender';
            const premium_user_username2 = 'apjithender';
            // await updateZulipData(premium_user_username1);
            await updateZulipData(premium_user_username2);
            console.log("Hey, we just received **something** from Zulip -- Supabase");
            return res.status(200).json({
                "content": "Hey, we just received **something** from Zulip -- Supabase!"
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

async function processTwitterMessages() {
    try {
        const chuckNorrisJoke = await fetchChuckNorrisJoke();
        const currentTimestamp = new Date().toISOString();
        const sample_message = {
            "id": generateTimestampBasedId(),
            "url": "https://twitter.com/apjithender/status/123",
            "verified": true,
            "username": "@apjithender",
            "fullname": "apjithender",
            "timestamp": currentTimestamp,
            "text": chuckNorrisJoke,
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

async function fetchChuckNorrisJoke() {
    try {
        const response = await fetch('https://api.chucknorris.io/jokes/random');
        const data = await response.json();
        return data.value;
    } catch (error) {
        console.error('Error fetching Chuck Norris joke:', error);
        return "Chuck Norris joke not available right now.";
    }
}

async function updateZulipData(username) {
    try {
        const config = {
            username: 'monkwhosoldpen@gmail.com',
            apiKey: 'tBfz8Wn3nzrSks6oocwaCq8AjdkXlJgY',
            realm: 'https://monkwhosoldpen.zulipchat.com/',
        };
        const client = await zulipInit(config);
        const readParams = {
            anchor: "newest",
            num_before: 100,
            num_after: 0,
            client_gravatar: true,
            narrow: [
                { operator: "stream", operand: username },
            ],
        };
        let messagesResponse = await client.messages.retrieve(readParams);
        let messages = messagesResponse.messages || [];
        messages = messages.map(ele => {
            const text = ele.content;
            let final = {
                // ...ele,
                username: username,
                message_id: ele.id,
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
                source: 'ZULIP',
                timestamp: new Date().toISOString()
            }
            return {
                ...final
                // ...ele,
                // username: stream.name,
                // message_id: ele.id
            }
        });
        await updateZulipMessagesToSupabase(messages);
    }
    catch (error) {
        console.error('Error initializing Zulip client:', error);
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
