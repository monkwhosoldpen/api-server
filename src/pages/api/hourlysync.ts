import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { netasdata } from '../../data/netas';
import { TelanganaDataMPs } from '../../data/netas-data/TG/Bhongir/mps';
import { updateSiteProfilePagesDataToSupabase } from './loadData';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method === "GET") {
            return res.status(200).json({ content: "Success" });
        } else {
            return res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('An unexpected error occurred:', error);
        // Respond with the error from the first failed request
        return res.status(500).json({ error: 'An unexpected error occurred' });
    }
}

function extractUsername(usernameWithAt) {
    // Check if the input starts with '@'
    if (usernameWithAt.startsWith('@')) {
        // Remove the '@' symbol and return the remaining string
        return usernameWithAt.slice(1);
    } else {
        // If the input doesn't start with '@', return the input as it is
        return usernameWithAt;
    }
}

export function createProfileObjectByUsername(profile, state_code, code) {
    // console.log(profile)
    let username = profile?.twitter_username || '';
    const profile_id = username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const name = extractName(profile?.name || profile?.twitter_username);
    const bio = extractBio(profile?.bio || profile?.twitter_username);

    // const MPS_DATA = TelanganaDataMPs;

    // const profileObjects = MPS_DATA.constituencies.flatMap(constituency => {
    //     let netas = [];
    //     constituency.netas.forEach(ele => {
    //         netas.push(ele);
    //     });
    //     return [...netas];
    // });

    // console.log(profileObjects);

    // const filteredProfileObjects = profileObjects.filter(profile => profile.twitter_username !== 'elon_musk');

    // console.log(filteredProfileObjects);

    const profileObject = {
        "profile_id": profile_id,
        "stream_id": null,
        "uid": username,
        "username": username,
        "verified": profile?.verified || false,
        "is_demo": profile?.is_demo || false,
        "metadata_with_translations": {
            "bio": bio,
            "name": name
        },
        "is_secondary_stream": profile?.is_secondary_stream || false,
        "is_premium": profile?.is_premium || false,
        "img_url": profile?.img_url || [`https://via.placeholder.com/150?text=${username}+DP`],
        "cover_url": profile?.cover_url || [`https://via.placeholder.com/1200x300?text=${username}+cover`],
        "location_code": code || null,
        "state_code": state_code || null,
        "district_code": null,
        "website_url": null,
        "wikipedia_url": null,
        "instagram_username": null,
        "twitter_username": profile?.twitter_username || null,
        "facebook_username": null,
        "spotify_artist_id": null,
        "apple_music_artist_id": null,
        "tags": null,
        "entity_type": ['NETA'],
        "type": ["neta"],
        "blocked_profile_ids": null,
        "latest_message": null
    };

    // console.log(profileObject);

    return profileObject;
}



export function extractTwitterUsernames(data) {
    let usernames = [];

    // Extract usernames from constituencies
    data.constituencies.forEach(constituency => {
        // Extract winner's username
        if (constituency.winner && constituency.winner.twitter_username) {
            usernames.push(constituency.winner.twitter_username);
        }

        // Extract runner-up's username
        if (constituency.runner_up && constituency.runner_up.twitter_username) {
            usernames.push(constituency.runner_up.twitter_username);
        }

        // Extract usernames from sub-constituencies if present
        if (constituency.constituencies) {
            constituency.constituencies.forEach(subConstituency => {
                // Extract winner's username
                if (subConstituency.winner && subConstituency.winner.twitter_username) {
                    usernames.push(subConstituency.winner.twitter_username);
                }

                // Extract runner-up's username
                if (subConstituency.runner_up && subConstituency.runner_up.twitter_username) {
                    usernames.push(subConstituency.runner_up.twitter_username);
                }
            });
        }
    });

    return usernames;
}

export function extractName(name) {
    let usernames = [];
    // Extract usernames from constituencies
    return {
        "default": name?.default || `${name}`,
        "hindi": name?.hindi || `${name}`,
        "telugu": name?.telugu || `${name}`,
        "english": name?.english || `${name}`
    };
}

export function extractBio(bio) {
    let usernames = [];
    // Extract usernames from constituencies
    return {
        "default": bio?.default || `${bio}`,
        "hindi": bio?.hindi || `${bio}`,
        "telugu": bio?.telugu || `${bio}`,
        "english": bio?.english || `${bio}`
    };
}

