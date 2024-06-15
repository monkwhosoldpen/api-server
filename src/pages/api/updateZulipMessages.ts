import { NextApiRequest, NextApiResponse } from 'next';
import zulipInit from 'zulip-js';
import { allowedOrigins, supabase } from "@pages/api/api-utils";

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

    console.log(req.body)

    return res.status(200).json({
        "content": "Hey, we just received **something** from Zulip -- Supabase!"
    });

    // if (req.method === "POST") {
    //     // POST method logic
    //     // const premium_user_username1 = 'apjithender';
    //     const premium_user_username2 = 'narasaiah';
    //     // await updateZulipData(premium_user_username1);
    //     // await updateZulipData(premium_user_username2);
    //     console.log("Hey, we just received **something** from Zulip -- Supabase");
    //     return res.status(200).json({
    //         "content": "Hey, we just received **something** from Zulip -- Supabase!"
    //     });
    // }
    // else {
    //     return res.status(405).json({ error: 'Method not allowed' });
    // }
}

export async function updateZulipData(username) {
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
async function updateZulipMessagesToSupabase(messages) {
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
