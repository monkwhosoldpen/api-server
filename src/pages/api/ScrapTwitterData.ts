import { mockUserMe } from "../../data/mockdata";
import { allowedOrigins, supabase } from "./api-utils";
import { Rettiwt } from 'rettiwt-api';

const apiKey = 'a2R0PVV5dW1DeTZuU1dsQUNMVG9oNmdjSDBYQ3dETzFuWVJ6NHhzQ2ZjdGw7dHdpZD0idT0xNjU1MzEyMTA4NDc5NzU4MzM4IjtjdDA9YTZkYTllZDVkODRmMjFiMmVhMTIxZjE0YjMzYjZjMTI7YXV0aF90b2tlbj1hZDQ0YzY1ZmMyMjhlZjgyZWIxZTMyYmI1NDYyM2Q3Mjc4MTQ4MGU3Ow==';// await authenticate(email, username, password);

const urlString = 'http://180.183.157.159:8080'; // This is your proxy URL string
const urlObject = new URL(urlString); // Convert the string to a URL object

// Now you can use urlObject where a URL type is expected

const rettiwt = new Rettiwt({
    // apiKey: API_KEY, // Comment this line if you're using 'guest' authentication
    proxyUrl: urlObject
});

export default async function handler(req, res) {
  // Set CORS headers
  const origin = req.headers.origin;

  // Set CORS headers for preflight and actual requests
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

  const { username } = req.body;

  // Ensure username and stream_id are provided
  if (!username) {
    return res.status(400).json({ error: 'Missing username in request body.' });
  }

  // Adding a waiting time of 5 seconds
  await new Promise(resolve => setTimeout(resolve, 5000));

  // Call MainFn function after waiting
  await fetchByUsername(username);

  return res.status(200).json({
    content: `Hey, we just updated **something** from Twitter -- Supabase! Username: ${username}`
  });
}

export async function fetchUserDetails(username) {
  try {
    const userDetails = await rettiwt.user.details(username);
    // console.log(`${username} details:`, userDetails);
    return userDetails; // Return the user details for further use
  } catch (error) {
    console.error(`Failed to fetch details for ${username}:`, error);
    throw new Error(`Failed to fetch details for ${username}`);
  }
}

async function fetchUserTimeline(userId, userName) {
  try {
    const response = await rettiwt.user.timeline(userId); // Fetch the timeline
    const tweets = response.list; // Access the tweets directly from the 'list' property

    console.log(`Timeline for User ID: ${userId}:`);

    // Iterate over each tweet in the list
    tweets.forEach(tweet => {
      // Extract the required information
      const { createdAt, fullText, id } = tweet;
      // Print in a structured format
      console.log(`Tweet ID: ${id}`);
      console.log(`Created At: ${createdAt}`);
      console.log(`Text: ${fullText}`);
      console.log('-----------------------------------');

      manipulateMessage(createdAt, fullText, id, userName);
    });

    return response; // Return the response for further processing if necessary
  } catch (error) {
    console.error(`Failed to fetch timeline for User ID: ${userId}:`, error);
    throw new Error(`Failed to fetch timeline for User ID: ${userId}`);
  }
}

// Define a function to handle the fetching of user details and timeline for a single username
export async function fetchByUsername(targetUsername) {
  try {
    // Fetch user details
    const userDetails = await fetchUserDetails(targetUsername);

     fetch('http://localhost:3001/api/saveUserProfile',
        {
            method: 'POST',
            body: JSON.stringify({ 
                'twitter_username': targetUsername 
            })
        }
    );
    console.log(userDetails);

    // if (userDetails && userDetails.id) {
    //   // Fetch user timeline if the ID exists
    //   await fetchUserTimeline(userDetails.id, userDetails.userName);
    //   console.log(`Fetched timeline for ${targetUsername}`);
    // } else {
    //   console.log(`User details for ${targetUsername} did not include an ID.`);
    // }

    //     return fetch('http://localhost:3001/api/saveUserProfile',
    //     {
    //         method: 'POST',
    //         body: JSON.stringify({ 
    //             'twitter_username': profile.twitter_username, 
    //             'metadata_with_translations': profile.metadata_with_translations 
    //         })
    //     }
    // );
  } catch (error) {
    console.error(error.message);
  }
}


async function manipulateMessage(createdAt, fullText, id, username) {
  const sample = [{ source: "TWITTER", timestamp: createdAt, content: fullText, message_id: id, username: username }];
  try {
    const { data: updatedData, error } = await supabase
      .from('zulip_messages') // Replace 'your_table_name' with your Supabase table name
      .upsert(sample, { onConflict: ['message_id'] as any, ignoreDuplicates: true }); // Cast 'uid' as 'any'
    if (error) {
      throw error;
    }
    return updatedData;
  } catch (error) {
    throw error;
  }
}
