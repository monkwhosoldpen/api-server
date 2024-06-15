import { NextApiRequest, NextApiResponse } from 'next';

import { Rettiwt } from 'rettiwt-api';

const apiKey = 'a2R0PVV5dW1DeTZuU1dsQUNMVG9oNmdjSDBYQ3dETzFuWVJ6NHhzQ2ZjdGw7dHdpZD0idT0xNjU1MzEyMTA4NDc5NzU4MzM4IjtjdDA9YTZkYTllZDVkODRmMjFiMmVhMTIxZjE0YjMzYjZjMTI7YXV0aF90b2tlbj1hZDQ0YzY1ZmMyMjhlZjgyZWIxZTMyYmI1NDYyM2Q3Mjc4MTQ4MGU3Ow==';// await authenticate(email, username, password);
// const rettiwt = new Rettiwt({});

const urlString = 'http://180.183.157.159:8080'; // This is your proxy URL string
const urlObject = new URL(urlString); // Convert the string to a URL object

// Now you can use urlObject where a URL type is expected

const rettiwt = new Rettiwt({
    // apiKey: API_KEY, // Comment this line if you're using 'guest' authentication
    proxyUrl: urlObject
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method === "GET") {

            let { username } = req.query;

            const currentUsername: any = username;
            const userDetails = await rettiwt.user.details(currentUsername);

            // Assuming you get userId from userDetails, and Rettiwt's timeline method supports parameters for batching and date filtering
            const userId = userDetails?.id || ''; // This is an assumption; replace with actual way to get userId from userDetails

            // Fetch and log the timeline for the user
            // Note: Adjust parameters according to the actual API capabilities for batching and date filtering
            const timeline = await rettiwt.user.timeline(userId, 1);

            const baseUrl = 'https://api.netaconnect.com';

            [...timeline.list].forEach(tweet => {
                const { id, fullText, createdAt } = tweet;
                if (id) {
                    fetch(`${baseUrl}/api/v6/scrap-twitter-post/${username}/${id}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            id,
                            fullText,
                            createdAt
                        })
                    }).then(response => console.log(`scrap-twitter-post Request sent for ${username} ${id}`))
                        .catch(error => console.error(`scrap-twitter-post Request failed for ${username} ${id}`, error));
                    // No await used here, the request is sent, and we don't wait for it to complete
                }
            });

            return res.status(200).json({ message: "Initiated Posts" });
        }
        else {
            return res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('An unexpected error occurred:', error);
        // Respond with the error from the first failed request
        return res.status(500).json({ error: 'An unexpected error occurred' });
    }
}
