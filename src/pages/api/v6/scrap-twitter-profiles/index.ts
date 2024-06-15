import { NextApiRequest, NextApiResponse } from 'next';
import { TamilNaduDataMPs, TelanganaDataMPs } from '../../../../data/netas-data/TG/Bhongir/mps';
import { createProfileObjectByUsername } from '../../hourlysync';

import { fetchByUsername } from '../../ScrapTwitterData';

// Function to delay execution for a specified time
const delay = ms => new Promise(res => setTimeout(res, ms));

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method === "GET") {

            const MPS_DATA = TelanganaDataMPs;

            const profileObjects = MPS_DATA.constituencies.flatMap(constituency => {

                let netas = [];
                constituency.netas.forEach(ele => {
                    let obj = createProfileObjectByUsername(ele, MPS_DATA.state_code, constituency.name);
                    obj = {
                        ...obj,
                        "type": ["neta"]
                    };
                    netas.push(obj);
                });
                return [...netas];
            });

            const cleanerUserProfiles = profileObjects.filter(prof => Boolean(prof?.twitter_username));
            const baseUrl = 'https://api.netaconnect.com';

            // Use for...of loop to iterate and await for each profile
            for (const profile of cleanerUserProfiles) {
                if (profile.twitter_username) {
                    try {
                        await fetch(`${baseUrl}/api/v6/scrap-twitter-profiles/${profile.twitter_username}`, {
                            method: 'GET',
                        });
                        console.log(`Request sent for ${profile.twitter_username}`);
                        await delay(2000); // Wait for 2 seconds before continuing to the next iteration
                    } catch (error) {
                        console.error(`Request failed for ${profile.twitter_username}`, error);
                    }
                }
            }

            return res.status(200).json({ message: "Initiated Profiles" });
        }
        else {
            return res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('An unexpected error occurred:', error);
        return res.status(500).json({ error: 'An unexpected error occurred' });
    }
}
