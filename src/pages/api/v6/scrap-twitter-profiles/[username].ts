import { allowedOrigins, supabase } from "@pages/api/api-utils";
import { fetchUserDetails } from "@pages/api/ScrapTwitterData";
import { updateSiteProfilePagesDataToSupabase } from "@pages/api/loadData";
import { createProfileObjectByUsername } from "@pages/api/hourlysync";
import axios from "axios";

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

    const { username } = req.query;

    if (req.method === 'GET') {

        const user_twitter_response = await fetchUserDetails(username);

        if (user_twitter_response) {
            console.log(user_twitter_response);

            const { fullName, description, profileImage, profileBanner } = (await fetchUserDetails(username));

            const state_code = 'TG';
            const code = 'TG';
            const supabaseURL = 'https://cydjretpcgmuezpkbkql.supabase.co';
            let image_url = '';
            let cover_url = '';
            try {
                const uploadedImageUrl = await downloadAndUploadImage(profileImage, 'profileImage', username, '');
                // const uploadedCoverUrl = await downloadAndUploadImage(profileBanner , 'profileBanner', username, '');
                // Return the uploaded image URL
                // console.log(uploadedImageUrl);
                image_url = `${supabaseURL}/storage/v1/object/public/${uploadedImageUrl}`;
                // cover_url = `${supabaseURL}/storage/v1/object/public/${uploadedCoverUrl}`;
            } catch (uploadError) {
                console.error(`Error uploading image at index:`, uploadError);
                // Handle upload error as needed
            }
            const sam = {
                name: fullName,
                bio: description,
                twitter_username: username,
                img_url: [image_url],
                cover_url: [cover_url]
            }
            let profileFinal = createProfileObjectByUsername(sam, state_code, code);
            const isPremiumUser = username === 'narsaiah' || username === 'elonmusk';
            profileFinal = {
                ...profileFinal,
                is_premium: isPremiumUser,
                verified: true
            };
            await updateSiteProfilePagesDataToSupabase(profileFinal);
        }
        else {
            console.log(`Not found for ${username}`);
        }
        // Check if the username is one of the specific mock values
        res.status(200).json({ username: username });
    }
    else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
}

async function downloadAndUploadImage(imageUrl: string, fileName: string, username: string, type: string): Promise<string> {
    try {
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });

        if (response.status !== 200) {
            console.error('Error downloading image:', response.statusText);
            throw new Error(`Failed to download image: ${response.statusText}`);
        }

        const buffer: Buffer = Buffer.from(response.data);

        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const day = String(now.getDate()).padStart(2, '0');
        const hour = String(now.getHours()).padStart(2, '0');
        const minute = String(now.getMinutes()).padStart(2, '0');
        const second = String(now.getSeconds()).padStart(2, '0');

        const timestamp = `${year}${month}${day}${hour}${minute}${second}`;

        const profileMediaPath: string = `/mediastore/media/${timestamp}/goats/${username}/${fileName}.jpg`; // Customize the path as needed

        const path: string = profileMediaPath;

        // Upload image to Supabase Storage
        const { data, error } = await supabase.storage
            .from('avatars')  // Replace 'your-storage-bucket-name' with your Supabase Storage bucket name
            .upload(path, buffer);

        if (error) {
            console.error('Error uploading image to Supabase Storage:', error);
            throw error;
        }
        // Return the URL of the uploaded image
        return data['fullPath'];  // 'Key' is the key of the uploaded file
    } catch (error) {
        console.error('An unexpected error occurred:', error);
        throw error;
    }
}
