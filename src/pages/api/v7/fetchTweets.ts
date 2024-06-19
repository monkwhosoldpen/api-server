import zulipInit from 'zulip-js';
import { Rettiwt } from 'rettiwt-api';
import { allowedOrigins, supabaseAnon } from '../api-utils';

const apiKey = 'a2R0PVV5dW1DeTZuU1dsQUNMVG9oNmdjSDBYQ3dETzFuWVJ6NHhzQ2ZjdGw7dHdpZD0idT0xNjU1MzEyMTA4NDc5NzU4MzM4IjtjdDA9YTZkYTllZDVkODRmMjFiMmVhMTIxZjE0YjMzYjZjMTI7YXV0aF90b2tlbj1hZDQ0YzY1ZmMyMjhlZjgyZWIxZTMyYmI1NDYyM2Q3Mjc4MTQ4MGU3Ow==';// await authenticate(email, username, password);
const rettiwt = new Rettiwt({ apiKey: apiKey });

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

  const usernames = ['elonmusk', 'nasa', 'BillGates'];
  const stream_id = '';
  const username = '';
  await main(username, stream_id);

  // await updateZulipData(premium_user_username2);
  return res.status(200).json({
    "content": "Hey, we just updated **something** from Twitter -- Supabase!" + stream_id + username
  });
}

// Example async function to send a notification, replace with your actual notification API call
async function sendNotificationAsync(data) {
  // Placeholder for your notification API call logic
  // For example:
  await fetch('https://push.netaconnect.com/api/push', { method: 'GET' });
  console.log("Sending notification with data:", data);
}

async function fetchTweets(usernames) {
  const rettiwt = new Rettiwt();

  try {
    // Log in and get the API key
    const apiKey = await rettiwt.auth.login('ashwathbharadwaj.se@gmail.com', 'moongodspeaks', 'Ashu@7569');
    console.log(apiKey); // Ideally, you wouldn't log the API key in production

    // Iterate over each username
    for (const username of usernames) {
      // Fetch user details to get the userId
      const userDetails = await rettiwt.user.details(username);
      console.log(userDetails); // Display user details

      // Assuming you get userId from userDetails, and Rettiwt's timeline method supports parameters for batching and date filtering
      const userId = userDetails.id; // This is an assumption; replace with actual way to get userId from userDetails

      // Fetch and log the timeline for the user
      // Note: Adjust parameters according to the actual API capabilities for batching and date filtering
      const timeline = await rettiwt.user.timeline(userId);
      console.log({ username, timeline });
    }
  } catch (error) {
    console.error(error);
  }
}

async function authenticate(email, username, password) {
  try {
    const apiKey = await rettiwt.auth.login(email, username, password);
    console.log('Authenticated successfully.');
    return apiKey;
  } catch (error) {
    console.error('Authentication failed:', error);
    return null;
  }
}

async function fetchUserDetails(username) {
  try {
    const userDetails = await rettiwt.user.details(username);
    console.log(`${username} details:`, userDetails);
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
async function handleUsername(targetUsername) {
  try {
    // Fetch user details
    const userDetails = await fetchUserDetails(targetUsername);
    if (userDetails && userDetails.id) {
      // Fetch user timeline if the ID exists
      await fetchUserTimeline(userDetails.id, userDetails.userName);
      console.log(`Fetched timeline for ${targetUsername}`);
    } else {
      console.log(`User details for ${targetUsername} did not include an ID.`);
    }
  } catch (error) {
    console.error(error.message);
  }
}

// Example usage with your array of targetUsernames
async function main(username, stream_id) {
  const targetUsernames = ['rahulgandhi'];
  for (const targetUsername of targetUsernames) {
    // Handle each username by calling the separate function
    await handleUsername(targetUsername);
  }
}

async function manipulateMessage(createdAt, fullText, id, username) {
  const sample = [{ source: "TWITTER", timestamp: createdAt, content: fullText, message_id: id, username: username }];
  try {
    const { data: updatedData, error } = await supabaseAnon
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
