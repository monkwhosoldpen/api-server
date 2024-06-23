import { Rettiwt } from 'rettiwt-api';
import { allowedOrigins, supabaseAnon } from '../api-utils';
import fetch from 'node-fetch'; // Ensure fetch is available in your environment
const rettiwt = new Rettiwt();

const mockUsernames = [
  'elonmusk',
  'BarackObama',
  'katyperry',
  'rihanna',
  'Cristiano',
  'taylorswift13',
  'ladygaga',
  'narendramodi',
  'TheEllenShow',
  'realdonaldtrump'
];

export default async function handler(req, res) {
  // Set CORS headers
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  // const url_ = 'https://pbs.twimg.com/media/Fh0bPd7VQAAU31D.jpg';
  // saveImageToSupabase(url_);
  // uploadImageToSupabase(url_);
  // Handle OPTIONS request for preflight check
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Use mock usernames for now
    const results = await main(mockUsernames);

    return res.status(200).json({
      content: "Hey, we just updated **something** from Twitter -- Supabase!",
      results,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

async function fetchUserDetails(username) {
  try {
    const userDetails = await rettiwt.user.details(username);
    console.log(`${username} details:`, userDetails);
    return userDetails;
  } catch (error) {
    console.error(`Failed to fetch details for ${username}:`, error);
    throw new Error(`Failed to fetch details for ${username}`);
  }
}

async function fetchUserTimeline(userId) {
  // try {
  //   const response = await rettiwt.user.timeline(userId);
  //   const tweets = response.list;

  //   console.log(`Timeline for User ID: ${userId}:`);
  //   tweets.forEach(tweet => {
  //     const { createdAt, fullText, id } = tweet;
  //     console.log(`Tweet ID: ${id}`);
  //     console.log(`Created At: ${createdAt}`);
  //     console.log(`Text: ${fullText}`);
  //     console.log('-----------------------------------');
  //   });
  //   return response;
  // } catch (error) {
  //   console.error(`Failed to fetch timeline for User ID: ${userId}:`, error);
  //   throw new Error(`Failed to fetch timeline for User ID: ${userId}`);
  // }
}

async function handleUsername(targetUsername) {
  try {
    const userDetails = await fetchUserDetails(targetUsername);
    const {
      profileBanner,
      profileImage,
      createdAt,
      userName,
      isVerified,
      fullName,
      followersCount,
      description,
      location,
      id
    } = userDetails;

    const profileImageUrl = await saveImageToSupabase(profileImage);
    const profileBannerUrl = await saveImageToSupabase(profileBanner);

    await saveGoatProfile(userName, { profileImageUrl, profileBannerUrl, description, fullName, location, isVerified });

    if (userDetails && userDetails.id) {
      const timeline = await fetchUserTimeline(userDetails.id);
      console.log(`Fetched timeline for ${userName}`);
      return { userDetails, timeline };
    } else {
      console.log(`User details for ${userName} did not include an ID.`);
      return null;
    }
  } catch (error) {
    console.error(error.message);
    return null;
  }
}

async function saveGoatProfile(username, {profileImageUrl, profileBannerUrl, description, fullName, location, isVerified}) {
  const { error } = await supabaseAnon
    .from('user_profiles')
    .upsert({
      'username': username,
      'img_url': { url: profileImageUrl },
      'cover_url': { url: profileBannerUrl },
      'description': description || "NA",
      'full_name': fullName || "NA",
      'location': location || "NA",
      'verified': isVerified || false,
    }, { onConflict: 'username' });

  if (error) {
    console.error('Error saving user profile:', error);
  } else {
    console.log('Profile saved successfully');
  }
}

async function main(targetUsernames) {
  const results = [];
  for (const targetUsername of targetUsernames) {
    const result = await handleUsername(targetUsername);
    // if (result) {
    //   // Process tweets and replace image URLs
    //   // for (const tweet of result.timeline.list) {
    //   //   if (tweet.entities && tweet.media && tweet.media.length > 0) {
    //   //     for (const media of tweet.media) {
    //   //       if (media.url) {
    //   //         const supabaseImageUrl = await saveImageToSupabase(media.url);
    //   //         media.url = supabaseImageUrl;
    //   //       }
    //   //     }
    //   //   }
    //   // }
    //   results.push(result);
    // }
  }
  return results;
}

async function saveImageToSupabase(imageUrl: string): Promise<string | null> {
  try {
    const response = await fetch(imageUrl);
    const buffer = await response.buffer();
    const fileName = `${Date.now()}-${imageUrl.split('/').pop()}`;
    const fileType = response.headers.get('content-type');

    // Upload the file to Supabase
    const { data, error } = await supabaseAnon.storage
      .from('twitter_images') // Ensure this bucket is created in Supabase
      .upload(fileName, buffer, {
        contentType: fileType,
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      throw new Error(`Failed to upload image to Supabase: ${error.message}`);
    }

    const publicUrlResponse: any = await supabaseAnon.storage
      .from('twitter_images')
      .getPublicUrl(fileName);

    const publicUrl = publicUrlResponse.data?.publicUrl || '';

    return publicUrl;
  } catch (error) {
    console.error(`Failed to save image from URL: ${imageUrl}`, error);
    return null;
  }
}
