import { createClient } from "@supabase/supabase-js";
// import { createHash } from "crypto";
// import { magic } from "./v1/magic";
import jwt from "jsonwebtoken";

const supabaseUrl: any = "https://cydjretpcgmuezpkbkql.supabase.co";
const supabaseKey: any = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5ZGpyZXRwY2dtdWV6cGtia3FsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDYxMTkxOTEsImV4cCI6MjAyMTY5NTE5MX0.oXmm_fYwbkvK1ezeh8Ns6MlDPNYP1h7w6wr9hQ3aXdA";

export const supabase = createClient(supabaseUrl, supabaseKey);

export const SESSION_LENGTH_IN_DAYS = 7;

export const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://www.fixd.ai',
];

export function decodeToken(token) {
    const decodedPayload = Buffer.from(token, 'base64').toString('utf-8');
    return JSON.parse(decodedPayload);
}

export function generateDIDProfileId(user: any): string | any {
    if (user.email) {
        // Use email to generate profile_id
        return user.email;
    } else if (user.phone_number) {
        // Use phone number to generate profile_id
        return user.phone_number;
    } else {
        // Neither email nor phone is available
        return '';
    }
}

export const JWT_SECRET = "your_default_jwt_secret_here";

export function generateAndVerifyToken(payload: any): string {
    try {
        const token = jwt.sign(payload, JWT_SECRET);
        return token;
    } catch (error) {
        throw error;
    }
}

export function decodeAndVerifyToken(token: string): any {
    try {
        const decodedToken = jwt.verify(token, JWT_SECRET);
        return decodedToken;
    } catch (error) {
        throw error;
    }
}

export async function getUserDataByUId(uid) {
    let userData = null;
    if (!uid || uid.trim() === '') {
        console.error("Invalid uid: uid cannot be empty or null.");
    }
    else {
        try {
            // console.log(uid);
            const { data, error } = await supabase.rpc('get_user_profile_with_follow_counts_by_uid', {
                uid_param: uid
            });

            if (error) {
                console.error("Error fetching user data with follow counts by UID:", error.message);
            }
            else if (!data) {
                console.error("No data found for uid:", uid);
            }
            else {
                userData = {
                    ...data[0],
                };
            }
        }
        catch (error) {
            console.error("An error occurred while fetching user data with follow counts by UID:", error.message);
        }
    }
    return userData;
}

export async function UpdateUserInfo(req) {
    try {
        const authHeader = req.headers.authorization;
        const accessToken = authHeader.split(" ")[1];

        // console.log(accessToken);
        // const decodedPayload = decodeToken(accessToken);
        // console.log(decodedPayload);

        const payload = decodeToken(accessToken);
        const uid = payload.did;
        console.log(uid);

        // const authHeader = req.headers.authorization;
        // const accessToken = authHeader.split(" ")[1];
        // const payload = decodeAndVerifyToken(accessToken);
        // const uid = generateDIDProfileId(payload);
        const existingData = await getUserDataByUId(uid);

        // const authHeader = req.headers.authorization;

        // const accessToken = authHeader.split(" ")[1];
        // const payload = decodeAndVerifyToken(accessToken);
        // const uid = generateDIDProfileId(payload);
        // const existingData = await getUserDataByUId(uid);

        const requestBody = req.body;

        // Step 2: Merge the new data with existing user data
        const updatedUserData = {
            ...existingData,
            ...requestBody,
            uid
        };

        delete updatedUserData['followers_count'];
        delete updatedUserData['following_count'];
        delete updatedUserData['follows'];

        const { data, error } = await supabase
            .from("user_profiles")
            .upsert([updatedUserData], { onConflict: ['uid'] } as any);

        if (error) {
            console.error("Error upserting user data:", error);
            return null;
        }

        console.log("User data upserted successfully:");
        return data ? data[0] : null;

    } catch (error) {
        console.error("An unexpected error occurred:", error);
        return null;
    }
}




export async function saveUserToDB(didProfileId) {
    // const currentDate = new Date().toISOString();
    const userProfile = {
        uid: didProfileId
    };
    try {
        // Attempt to insert the user data with a loop to handle conflicts
        let inserted = false;
        let insertAttempts = 0;

        while (!inserted && insertAttempts <= 2) {
            try {
                const { data, error } = await supabase
                    .from('user_profiles')
                    .upsert([userProfile], { onConflict: ['uid'] } as any);

                if (error) {
                    console.log("Error upserting user:", error);
                } else {
                    console.log("User inserted:", data);
                    inserted = true;
                }
            } catch (error) {
                console.log("Conflict detected. Generating a new profile ID.");
                // Generate a new profile ID here and update userProfile.uid
                insertAttempts++;
            }
        }
    } catch (error) {
        console.log("An unexpected error occurred:", error);
    }
}


export function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export function generateToken(payload) {
    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64');
    return encodedPayload; // This is a simple representation; in practice, you'd need to add more security measures
}
