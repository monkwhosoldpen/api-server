import { NextApiRequest, NextApiResponse } from "next";
import multiparty from "multiparty";
import { createClient } from "@supabase/supabase-js";
import { decode } from "base64-arraybuffer";
import fs from "fs";
import { UpdateUserInfo } from "../../../api-utils";

// Initialize the Supabase client with your Supabase URL and API Key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
const storage = supabase.storage;
const storageUrl = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL


export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const form = new multiparty.Form();

        try {
            const data: any = await new Promise((resolve, reject) => {
                form.parse(req, function (err, fields, files) {
                    if (err) reject({ err });
                    resolve({ fields, files });
                });
            });

            // Check if there is an image in the files
            const imageFile = data?.files.image && data?.files.image[0];

            if (!imageFile) {
                return res.status(400).json({ error: "No image file found" });
            }

            // Read the image file using fs
            const imageBuffer = fs.readFileSync(imageFile.path);

            // Convert the image buffer to base64
            const base64 = imageBuffer.toString("base64");

            // Generate a unique filename for the image (you can use your own logic here)
            const fileName = `${Date.now()}_${imageFile.originalFilename}`;

            const { data: storageResponse, error: storageError } = await supabase.storage
                .from("avatars")
                .upload(fileName, decode(base64), {
                    cacheControl: "3600",
                    upsert: false,
                    contentType: imageFile.headers["content-type"],
                });
            if (storageError) {
                console.error("Storage Error:", storageError);
                return res.status(500).json({ error: "Error uploading image" });
            }
            
            interface StorageResponse {
                path: string;
                Key?: string; // Assuming 'Key' might not always be present
              }
              
              // Then, when you get the storageResponse, ensure it's treated as this type
              const { Key } = storageResponse as StorageResponse;
              
            const cover_url = storageUrl + Key;

            req.body = { ...req.body, cover_url };

            const result = await UpdateUserInfo(req);

            res.status(200).json({ success: true, storageResponse, result });
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}
