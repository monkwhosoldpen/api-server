import { PushSubscription } from 'web-push'
import { decodeToken, getUser, supabaseAnon } from '../api-utils'
import { CONFIG } from '../config'

// Handle the API route
export default async function handler(req, res) {
  try {
    if (req.method === 'POST') {

      const subscription = (await req.json()) as PushSubscription | null

      if (!subscription) {
        console.error('No subscription was provided!')
        return
      }

      const userDataRaw = await getUser(req);
      const uuid = userDataRaw.id;

      const registeredWithOneSignal = await registerSubscriptionWithOneSignal(subscription, uuid);
      const { player_id } = registeredWithOneSignal;
      const savedSubscription = await saveSubscriptionToDb1(subscription, uuid);

      const { error } = await supabaseAnon
        .from('user_profiles') // Assuming 'user_profile' is your table name
        .update({ player_id }) // Assuming 'player_id' is the column name in your table
        .eq('uid', uuid); // 'uuid' is the column used to identify the user

      if (error) {
        console.error('Error updating user profile with player ID:', error.message);
        throw error;
      }

      console.log('Subscription saved and registered successfully');

      return new Response(JSON.stringify({ message: 'Subscription saved and registered successfully', savedSubscription, registeredWithOneSignal }), { status: 200 });
    }
    else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('An unexpected error occurred:', error);
    return res.status(500).json({ error: 'An unexpected error occurred' });
  }
}


async function saveSubscriptionToDb1(subscription1: any, uuid: string) {
  console.log(subscription1);
  delete subscription1['expirationTime'];
  try {
    const { data, error } = await supabaseAnon.from('subscriptions').insert([
      {
        uuid, // Assuming 'uuid' is the column name for user UUIDs in your table
        ...subscription1,
      },
    ]);
    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Error saving subscription to Supabase:', error.message);
    throw error;
  }
}

async function registerSubscriptionWithOneSignal(subscription: PushSubscription, uuid: string) {
  const oneSignalUrl = `https://onesignal.com/api/v1/players`;
  const body = {
    app_id: CONFIG.ONESIGNAL_APP_ID,
    device_type: 5, // Assuming web browser. Adjust accordingly.
    identifier: subscription.endpoint, // Subscription endpoint
    external_user_id: uuid, // Associate the OneSignal player with your external user ID
  };

  try {
    const response = await fetch(oneSignalUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${CONFIG.ONESIGNAL_REST_API_KEY}`
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`OneSignal API Error: ${response.statusText}`);
    }

    const responseData: any = await response.json();
    // Return both the OneSignal player ID and your external user ID (uuid)
    return { player_id: responseData.id, uuid };
  } catch (error: any) {
    console.error('Error registering subscription with OneSignal:', error.message);
    throw error;  // Ensure error handling in calling context
  }
}
