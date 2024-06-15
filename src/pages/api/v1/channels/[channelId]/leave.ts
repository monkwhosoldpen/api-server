import { NextApiRequest, NextApiResponse } from "next";
import { decodeAndVerifyToken, decodeToken, generateDIDProfileId, getUserDataByUId, supabase } from "../../../api-utils";

const fetch = require('node-fetch'); // Import fetch for Node.js
// Define Airtable and Supabase configurations
const airtableApiKey = process.env.NEXT_PUBLIC_AIRTABLE_API_KEY;
const airtableBaseId = process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID;
// const airtableTableName = 'all_official_entities_content';

const Airtable = require('airtable');
const base = new Airtable({ apiKey: airtableApiKey }).base(airtableBaseId);

// Modify the fetchDataFromAirtable function to include downloading and attaching content
async function fetchDataFromAirtable(username, airtableTableName) {
  const records = await base(airtableTableName)
    .select({
      filterByFormula: `{username} = '${username}'`, // Replace 'username_field_name' with your Airtable field name for username
    })
    .all();
  return records || [];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      return res.status(200).json([]);
    }
    else if (req.method === "POST") {
      const { channelId } = req.query;
      // console.log(req.query);
      // const authHeader = req.headers.authorization;
      // const accessToken = authHeader.split(" ")[1];
      // const payload = decodeAndVerifyToken(accessToken);
      // const uid = generateDIDProfileId(payload);

      // let airtableData = await fetchDataFromAirtable(channelId, 'all_official_entities_metadata');
      // let profile_id = '';

      // if (airtableData.length > 0) {
      //   // Extract specific fields from the fetched data
      //   const extractedFields = airtableData.map(record => {
      //     return record.fields;
      //   });

      //   // console.log(extractedFields);
      //   // Return the extracted fields in the response
      //   profile_id = extractedFields[0].profile_id;
      // }
      // else {

      //   // return res.status(200).json(mockUser);
      // }

      const authHeader = req.headers.authorization;
      const accessToken = authHeader.split(" ")[1];

      const payload = decodeToken(accessToken);
      const uid = payload.did;

      const userData = await getUserDataByUId(uid);
      const follower_id = userData.profile_id;

      const { data, error } = await supabase
        .from("user_follows")
        .delete()
        .eq("follower_id", follower_id)
        .eq("followee_id", 'profile_id');

      if (error) {
        console.error("Error adding Join:", error);
        return res.status(500).json({ error: "Error adding Join" });
      }
      return res.status(200).json({});
    }
    else {
      return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    return res.status(500).json({ error: "An unexpected error occurred" });
  }
}
