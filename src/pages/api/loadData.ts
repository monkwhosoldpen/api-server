import { supabase } from "./api-utils";

// Import necessary packages
require('dotenv').config();
const axios = require('axios');

import { subchannelsdata } from "../../data/subchannels";
import zulipInit from 'zulip-js';
import { netasdata } from "../../data/netas";
import { partiesdata } from "../../data/parties";

// Handle the API route
export default async function handler(req, res) {
    try {
        if (req.method === 'GET') {
            await updateGoatsMetaDataToSupabase();

            res.status(200).json({ message: 'All Data updated in Supabase' });
        } else {
            return res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('An unexpected error occurred:', error);
        return res.status(500).json({ error: 'An unexpected error occurred' });
    }
}

// Update data to Supabase
async function updateGoatsMetaDataToSupabase() {
    try {
        let subchannelsdata_ = subchannelsdata.map(ele => {
            return {
                ...ele,
                is_party: false
            }
        });
        let netasdata_ = netasdata.map((ele: any) => {
            return {
                ...ele,
                is_party: false,
                is_secondary_stream: false,
                is_demo: ele?.is_demo || false,
            }
        });
        let partiesdata_ = partiesdata.map(ele => {
            return {
                ...ele,
                is_party: true,
                is_secondary_stream: false,
                is_demo: false,
            }
        });
        // await updateSiteProfilePagesDataToSupabase(netasdata_);
        await updateSiteProfilePagesDataToSupabase(subchannelsdata_);
        await updateSiteProfilePagesDataToSupabase(partiesdata_);
        await updateZulipData(true);
        return;
    } catch (error) {
        throw error;
    }
}

// Update data to Supabase
export async function updateSiteProfilePagesDataToSupabase(fieldsToUpdate) {
    try {
        const { data: updatedData, error } = await supabase
            .from('user_profiles') // Replace 'your_table_name' with your Supabase table name
            .upsert(fieldsToUpdate, { onConflict: ['profile_id'] as any, ignoreDuplicates: true }); // Cast 'uid' as 'any'
        if (error) {
            throw error;
        }
        return updatedData;
    } catch (error) {
        throw error;
    }
}

export async function updateZulipData(flag: boolean) {
    try {
        const config = {
            username: 'monkwhosoldpen@gmail.com',
            apiKey: 'tBfz8Wn3nzrSks6oocwaCq8AjdkXlJgY',
            realm: 'https://monkwhosoldpen.zulipchat.com/',
        };
        const client = await zulipInit(config);

        // Retrieve all streams (channels)
        const streams = await client.streams.retrieve();

        if (flag) {
            await updateZulipChannelsToSupabase(streams.streams);
        }

        streams.streams.forEach(async (stream) => {
            const readParams = {
                anchor: "newest",
                num_before: 100,
                num_after: 0,
                client_gravatar: true,
                narrow: [
                    { operator: "stream", operand: stream.name },
                ],
            };

            let messagesResponse = await client.messages.retrieve(readParams);
            let messages = messagesResponse.messages;

            messages = messages
                .filter(ele => ele.client !== 'Internal' && ele.client !== 'OutgoingWebhookResponse' && !ele.content.includes("supabase_bot")) // Filter out undesired elements
                .map(ele => {
                    console.log(ele);
                    const text = ele.content;

                    // Transforming the object
                    let final = {
                        // ...ele,
                        username: stream.name,
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
                        timestamp: '2022-08-02T23:01:51.477461+00:00'
                    };

                    return final;
                });

            await updateZulipMessagesToSupabase(messages);
        });

    } catch (error) {
        console.error('Error initializing Zulip client:', error);
    }
}

// Update data to Supabase
async function updateZulipChannelsToSupabase(streams) {
    // console.log(streams);
    try {
        const { data: updatedData, error } = await supabase
            .from('zulip_streams') // Replace 'your_table_name' with your Supabase table name
            .upsert(streams, { onConflict: ['stream_id'] as any, ignoreDuplicates: true }); // Cast 'uid' as 'any'
        if (error) {
            throw error;
        }
        return updatedData;
    } catch (error) {
        throw error;
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
