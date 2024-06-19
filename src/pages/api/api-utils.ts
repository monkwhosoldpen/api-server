import { createClient } from "@supabase/supabase-js";
import jwt from "jsonwebtoken";
import { mockUser, mockUserMe } from "../../data/mockdata";

const supabase_url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pylhvrqhogloubzygehi.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5bGh2cnFob2dsb3VienlnZWhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTg0ODU5NTEsImV4cCI6MjAzNDA2MTk1MX0.BVqMLmZf_6_aPWGt59EpC9oLvkVmAFQ_6jmgVSjdlWo';
const service_role_key = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5bGh2cnFob2dsb3VienlnZWhpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxODQ4NTk1MSwiZXhwIjoyMDM0MDYxOTUxfQ.cqA7R4vXx13pHCwK1Duy9MNvm53BaVuVQGYJn64Rbek';
export const JWT_SECRET = process.env.NEXT_PUBLIC_SUPABASE_JWT_SECRET || 'oGxKu10cXVoxAnz/tDPiAC30fi58nNtMb2Dn5AiqyYwWwdvbi8MqWhct5KubflaBTvsU77az1+mgoAwN6cxPxg==';

export const supabase = createClient(supabase_url, service_role_key);
export const supabaseAnon = createClient(supabase_url, supabaseKey);

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

export function generateAndVerifyToken(payload: any): string {
    try {
        const token = jwt.sign(payload, JWT_SECRET);
        return token;
    } catch (error) {
        throw error;
    }
}

export async function getUserProfileDataByUsername(username) {
    const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('username', username)
        .single();

    if (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }

    return data;
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

export async function getUser(req) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        console.error("Invalid request: token is missing.");
        return null;
    }
    const { data, error } = await supabase.auth.getUser(token);
    return data?.user;
}

export async function UpdateUserInfo(req) {
}

export async function saveUserToDB(didProfileId) {
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
