import { allowedOrigins, supabase } from "@pages/api/api-utils";
import { mockUserMe } from "../../../../data/mockdata";
import { subchannelsdata } from "../../../../data/subchannels";

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

    if (req.method === 'GET') {
        const groupsList = subchannelsdata;
        const { username } = req.query;

        const { data: userProfile, } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('username', username)
            .limit(1);

        let profile = userProfile && userProfile[0] ? userProfile[0] : mockUserMe.data.profile;

        // Check if the username is one of the specific mock values
        const isPremiumGoat = profile.is_premium;

        const modifiedOwner = {
            data: {
                profile: profile,
                // If the username matches one of the mock values, set services to an empty array
                // Otherwise, set services to the original array
                services: !isPremiumGoat ? [] : groupsList,
                readMarkdown: !isPremiumGoat ? {
                    en: '',
                    telugu: '',
                    default: '',
                    hindi: ''
                } : {
                    en: sampleMarkdown,
                    telugu: teluguMarkdown,
                    default: sampleMarkdown,
                    hindi: hindiMarkdown
                },
            }
        };
        res.status(200).json(modifiedOwner);
    }
    else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
}


const sampleMarkdown = `
<div class="post-article">
  <h1>Lorem Ipsum Biography</h1>
  
  <div class="section">
    <h2>Professional Experience</h2>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
    
    <h3>Key Achievements</h3>
    <ul>
      <li>Duis aute irure dolor in reprehenderit</li>
      <li>Excepteur sint occaecat cupidatat non proident</li>
      <li>Sunt in culpa qui officia deserunt mollit</li>
    </ul>
  </div>

  <div class="section">
    <h2>Education & Training</h2>
    <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis.</p>
  </div>

  <div class="section">
    <h2>Publications & Research</h2>
    <p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</p>
  </div>
</div>
`;

const hindiMarkdown = `
<div class="post-article">
  <h1>लोरेम इप्सम जीवनी</h1>
  
  <div class="section">
    <h2>व्यावसायिक अनुभव</h2>
    <p>लोरेम इप्सम डोलर सिट अमेट, कंसेक्टेटुर अडिपिसिंग एलिट। सेड डू ईउस्मोड टेम्पोर इंसिडिडंट उट लबोरे एट डोलोरे मैग्ना अलिका। उट एनिम अड मिनिम वेनियम, क्विस नोस्ट्रुड एक्सरसिटेशन उल्लामको लबोरिस।</p>
    
    <h3>प्रमुख उपलब्धियां</h3>
    <ul>
      <li>डुइस ऑट इरुरे डोलर इन रेप्रेहेंडेरिट</li>
      <li>एक्सेप्टर सिंट ओकेकैट कपिडाटाट नॉन प्रोइडेंट</li>
      <li>संट इन कल्पा क्वी ऑफिसिया डेसेरंट मॉलिट</li>
    </ul>
  </div>

  <div class="section">
    <h2>शिक्षा और प्रशिक्षण</h2>
    <p>सेड उट पर्स्पिसिएटिस उंडे ओम्निस इस्ते नैटस एरर सिट वोलुप्टाटेम अकुसांटियम डोलोरेम्क्यू लॉडेंटियम।</p>
  </div>
</div>
`;

const teluguMarkdown = `
<div class="post-article">
  <h1>లోరెం ఇప్సం జీవిత చరిత్ర</h1>
  
  <div class="section">
    <h2>వృత్తిపరమైన అనుభవం</h2>
    <p>లోరెం ఇప్సం డాలర్ సిట్ అమేట్, కన్సెక్టెటుర్ అడిపిసిసింగ్ ఎలిట్. సెడ్ డు ఎయుస్మోడ్ టెంపోర్ ఇన్సిడిడంట్ ఉట్ లబోరే ఎట్ డాలోరే మాగ్నా అలిఖా. ఉట్ ఎనిమ్ అడ్ మినిమ్ వెనియామ్.</p>
    
    <h3>ముఖ్య విజయాలు</h3>
    <ul>
      <li>డుయిస్ ఆటే ఇరురే డాలర్ ఇన్ రెప్రెహెండెరిట్</li>
      <li>ఎక్సెప్టర్ సింట్ ఓకెకాట్ కపిడాటాట్ నాన్ ప్రోయిడెంట్</li>
      <li>సంట్ ఇన్ కల్పా క్వి ఆఫీసియా డెసెరంట్ మాలిట్</li>
    </ul>
  </div>

  <div class="section">
    <h2>విద్య మరియు శిక్షణ</h2>
    <p>సెడ్ ఉట్ పెర్స్పిసియాటిస్ ఉండే ఓమ్నిస్ ఇస్తే నాటస్ ఎర్రర్ సిట్ వొలుప్టాటెమ్ అకుసాంటియమ్ డొలోరెమ్క్యు లాడెంటియమ్.</p>
  </div>
</div>
`;
