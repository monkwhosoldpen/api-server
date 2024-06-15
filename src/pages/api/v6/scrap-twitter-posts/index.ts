import { NextApiRequest, NextApiResponse } from 'next';
import { TamilNaduDataMPs, TelanganaDataMPs } from '../../../../data/netas-data/TG/Bhongir/mps';
import { createProfileObjectByUsername } from '../../hourlysync';

import { fetchByUsername } from '../../ScrapTwitterData';

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

            [...cleanerUserProfiles].forEach(profile => {
                if (profile.twitter_username) {
                    fetch(`${baseUrl}/api/v6/scrap-twitter-posts/${profile.twitter_username}`, {
                        method: 'GET',
                    }).then(response => console.log(`Request sent for ${profile.twitter_username}`))
                        .catch(error => console.error(`Request failed for ${profile.twitter_username}`, error));
                    // No await used here, the request is sent, and we don't wait for it to complete
                }
            });
            return res.status(200).json({ message: "Initiated" });
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
