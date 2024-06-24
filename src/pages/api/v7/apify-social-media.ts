import { allowedOrigins, supabaseAnon } from '../api-utils';
import fetch from 'node-fetch'; // Ensure fetch is available in your environment
import axios from 'axios'; // Use axios for HTTP requests

import { ApifyClient } from 'apify-client';

const client = new ApifyClient({ token: 'apify_api_Odu7adhdBqnYLd0o4G2kwSnaF0UoDP13yh2F' });

const mockRealUsernames = [
  {
    mySiteUsername: 'user1',
    instagram: 'katyperry',
    twitter: 'katyperry',
    facebook: 'katyperry'
  },
  {
    mySiteUsername: 'user2',
    instagram: 'justinbieber',
    twitter: 'justinbieber',
    facebook: 'justinbieber'
  },
  {
    mySiteUsername: 'user3',
    instagram: 'selenagomez',
    twitter: 'selenagomez',
    facebook: 'selenagomez'
  },
];

async function runActor(platform, usernames) {
  let input;

  switch (platform) {
    case 'instagram':
      input = {
        "addParentData": false,
        "directUrls": usernames.map(username => `https://www.instagram.com/${username}/`),
        "enhanceUserSearchWithFacebookPage": false,
        "isUserTaggedFeedURL": false,
        "resultsLimit": 2,
        "resultsType": "posts",
        "searchLimit": 1,
        "searchType": "hashtag"
      };
      break;
    case 'twitter':
      input = {
        "addUserInfo": true,
        "maxRequestRetries": 6,
        "maxTweets": 1000,
        "scrapeTweetReplies": false,
        "searchMode": "live",
        "searchTerms": usernames,
      };
      break;
    case 'facebook':
      input = {
        "usernames": usernames.map(username => `https://www.facebook.com/${username}`)
      };
      break;
    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }

  const actorId = {
    instagram: 'apify/instagram-scraper',
    twitter: 'microworlds/twitter-scraper',
    facebook: 'apify/facebook-scraper'
  }[platform];

  const run = await client.actor(actorId).call(input);
  const { items } = await client.dataset(run.defaultDatasetId).listItems();
  return items;
}

export default async function handler(req, res) {
  // Set CORS headers
  const origin = req.headers.origin;

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

  try {
    const instagramUsernames = mockRealUsernames.map(user => user.instagram);
    const twitterUsernames = mockRealUsernames.map(user => user.twitter);
    const facebookUsernames = mockRealUsernames.map(user => user.facebook);

    // Run Instagram actor first
    const instagramResults = await runActor('instagram', instagramUsernames);

    // Then run Twitter actor
    const twitterResults = await runActor('twitter', twitterUsernames);

    // Finally, run Facebook actor
    // const facebookResults = await runActor('facebook', facebookUsernames);

    return res.status(200).json({
      input: mockRealUsernames,
      instagram: instagramResults,
      twitter: twitterResults,
      // facebook: facebookResults,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
