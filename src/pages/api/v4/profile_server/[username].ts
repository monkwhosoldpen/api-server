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
        const isMockUser = profile.username === 'narsaiah' || profile.username === 'elonmusk';

        const modifiedOwner = {
            data: {
                profile: profile,
                // If the username matches one of the mock values, set services to an empty array
                // Otherwise, set services to the original array
                services: !isMockUser ? [] : groupsList,
                readMarkdown: !isMockUser ? {
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
<div class="container dt-container"><div class="vc_row wpb_row vc_row-fluid vc_custom_detheme1">
  <div class="vc_col-sm-12 wpb_column column_container">
      <div class="wpb_wrapper">
          <div id="section-1-1707656795" class=" dt-section-head center size-custom hide-overflow">
          <div class="dt-section-container"><h2 class="section-main-title section-heading-polkadot-left-right " style="color:#f97d09;font-size:22px">
              BIOGRAPHY
          </h2>
          </div></div>
      </div> 
  </div> 
</div></div><div class="container dt-container"><div class="vc_row wpb_row vc_row-fluid vc_custom_detheme2">
  <div class="vc_col-sm-8 wpb_column column_container">
      <div class="wpb_wrapper">
          
  <div class="wpb_text_column wpb_content_element ">
      <div class="wpb_wrapper">
          <p>Dr. B. Narsaiah born on 2nd March 1959 at Suryapet, Nalgonda district, studied till Intermediate at Suryapet and later graduated from Osmania Medical College,Hyderabad in 1983 with First division and Distinction in 4 subjects. He did his M.S in General Surgery from Osmania Medical College followed by specialization in Laparoscopic surgery. He is pioneer of of laparoscopic surgery in India and did more than 32,000 procedures for his credit. He is a Teacher, Academician, Trainer in laparoscopy, writer and social worker.</p>

      </div> 
  </div> 
  <div class="wpb_text_column wpb_content_element ">
      <div class="wpb_wrapper">
          <div>
<div class="col-xs-12 col-sm-3"><strong>Education</strong></div>

<div class="col-xs-12 col-sm-8">MS Gen Surgery, 1984 – 1987 Osmania Medical College<br>
MBBS Passed in First Division With distinctions in 4 Subjects 1976 – 83 at Osmania Medical College</div>
</div>
<div>
<div class="col-xs-12 col-sm-3"><strong>Experience</strong></div>

<div class="col-xs-12 col-sm-8">1996 onwards – Hyderabad Institute of Laparoendoscopic Surgery (HILS)<br>
at Aditya Hospital, HOD Star surgical services, Bariatric &amp; Metabolic<br>
Institute (BMI)</div>
<div>
<div class="col-xs-12 col-sm-3"><strong>Govt. postings</strong></div>

<div class="col-xs-12 col-sm-8">1991 to 1995 Assistant Professor of Surgery, Osmania General Hospital and Osmania Medical College<br>
1987 to 1990 Asst. Civil Surgeon, Medical Officer and District in charge – Laparoscopic Surgery at Mahaboobnagar.</div>
</div>
</div>

      </div> 
  </div> 
      </div> 
  </div> 

  <div class="vc_col-sm-4 wpb_column column_container">
      <div class="wpb_wrapper">
          
  <div class="wpb_single_image wpb_content_element vc_align_center">
      <div class="wpb_wrapper">
          
          <div class="vc_single_image-wrapper   vc_box_border_grey"><img width="555" height="536" src="https://cydjretpcgmuezpkbkql.supabase.co/storage/v1/object/public/media/netas/narsaiah/dp.jpg" class="vc_single_image-img attachment-full" alt="" srcset="https://cydjretpcgmuezpkbkql.supabase.co/storage/v1/object/public/media/netas/narsaiah/dp.jpg 555w, http://booranarsaiahgoud.com/wp-content/uploads/2018/04/narsaiah-img-300x290.jpg 300w" sizes="(max-width: 555px) 100vw, 555px"></div>
      </div>
  </div>

      </div> 
  </div> 
</div></div><div class="container dt-container"><div class="vc_row wpb_row vc_row-fluid vc_custom_detheme3">
  <div class="vc_col-sm-12 wpb_column column_container">
      <div class="wpb_wrapper">
          
      </div> 
  </div> 
</div></div><div class="container dt-container"><div class="vc_row wpb_row vc_row-fluid vc_custom_detheme4">
  <div class="vc_col-sm-12 wpb_column column_container">
      <div class="wpb_wrapper">
          <div class="vc_empty_space" style="height: 32px"><span class="vc_empty_space_inner"></span></div>

      </div> 
  </div> 
</div></div><div class="container dt-container"><div class="vc_row wpb_row vc_row-fluid vc_custom_detheme5">
  <div class="vc_col-sm-12 wpb_column column_container">
      <div class="wpb_wrapper">
          
  <div class="wpb_text_column wpb_content_element ">
      <div class="wpb_wrapper">
          <h3 style="color: #f97d09;">Experience &amp; Academics In Profession</h3>
<h4>Laparoscopic surgery</h4>
<p>One of pioneer surgeon of laparoscopy in India with more than 32,000 laparoscopic surgeries to his credit, from basic to advanced procedures. Most versatile surgeon in India with experience and expertise in general surgery, GI surgery, gynaec laparoscopy, thoracoscopy, cancer surgery, pediatric surgery, endocrine surgery and obesity surgery</p>
<h4>Bariatric Metabolic surgery</h4>
<p>Vast experience in obesity surgery with one of highest numbers in AP and india</p>
<h4>Open &amp; Critical surgeries</h4>
<p>Equally well experienced in open &amp; major procedures like PC shunts, liver resections, esophagastrectomies, thyroid, parathyroid surgeries.</p>
<h4>Rural surgeries</h4>
<p>As civil assistant surgeon of PHC Amangal contributed to maximum number of family welfare procedures, major procedures like appendicectomy, hysterectomies, LSCS. Pediatric surgery, re canalizations and other procedures with meager facilities and under spinal anesthesia only being surgeon , Anesthetists, Gynecologist all in one even with meagre facilities at hospital</p>

      </div> 
  </div> 
      </div> 
  </div> 
</div></div><div class="container dt-container"><div class="vc_row wpb_row vc_row-fluid vc_custom_detheme6">
  <div class="vc_col-sm-12 wpb_column column_container">
      <div class="wpb_wrapper">
          
  <div class="wpb_text_column wpb_content_element ">
      <div class="wpb_wrapper">
          <h5 style="color: #278d27;">The following points highlights his carrier</h5>
<ul>
<li>He is self taught Laparoscopic Surgeon</li>
<li>One of highest series in laparoscopic surgery (more than 32,000 cases)</li>
<li>First surgeon to spread awareness of laparoscopic surgery in districts and rural areas</li>
<li>First surgeon to start advanced laparoscopic surgeries like incisional hernia, hiatus hernia, carcinoma colon, cancer cervix etc in Hyderabad</li>
<li>First person to do thoracosopic decompression for B spine in Hyderabad</li>
<li>Received best surgeon award from district collector in 1989 at mahaboobnagar</li>
<li>Special appreciation from ministry of health for doing excellent surgical work in PHC</li>
</ul>

      </div> 
  </div> 
      </div> 
  </div> 
</div></div><div class="container dt-container"><div class="vc_row wpb_row vc_row-fluid vc_custom_detheme7">
  <div class="vc_col-sm-12 wpb_column column_container">
      <div class="wpb_wrapper">
          <div class="vc_empty_space" style="height: 32px"><span class="vc_empty_space_inner"></span></div>

      </div> 
  </div> 
</div></div><div class="container dt-container"><div class="vc_row wpb_row vc_row-fluid vc_custom_detheme8">
  <div class="vc_col-sm-12 wpb_column column_container">
      <div class="wpb_wrapper">
          
  <div class="wpb_text_column wpb_content_element ">
      <div class="wpb_wrapper">
          <h3 style="color: #f97d09;">Academic activities</h3>
<ul>
<li>Conducted more than 40 workshops on laparoscopic surgery</li>
<li>Conducted more than 75 CME</li>
<li>Presented papers at world congress of laparoscopic surgery at Singapore, Japan</li>
<li>Presented number of papers at state and national surgical forums</li>
</ul>

      </div> 
  </div> 
      </div> 
  </div> 
</div></div><div class="container dt-container"><div class="vc_row wpb_row vc_row-fluid vc_custom_detheme9">
  <div class="vc_col-sm-12 wpb_column column_container">
      <div class="wpb_wrapper">
          
  <div class="wpb_text_column wpb_content_element ">
      <div class="wpb_wrapper">
          <h5 style="color: #278d27;">Organization (Academic)</h5>
<ul>
<li>Secretary ASI AP chapter for 2 times from 2005 – 2009</li>
<li>GC member ASI</li>
<li>Vice president – AMASI</li>
<li>Honorary secretary – AMASI elected unanimously</li>
<li>Governing council member – ASI</li>
<li>EC member HSI ( Hernia Society of India)</li>
</ul>
<h5 style="color: #278d27;">Current status</h5>
<ul>
<li>Ex Member of parliament, Bhongir</li>
</ul>
<h5 style="color: #278d27;">Hobbies</h5>
<ul>
<li>Painting : Conducted solo exhibition of painting in 2007 at State Art Gallery and funds raised were used for social work</li>
<li>Writing : Published book titled “ Living by Quotes”</li>
</ul>
<p><!--




<h5 style="color: #0000ff;">Social work</h5>








<ul>
   



<li>BLR foundation : Established trust in the name of his late parents Burra Laxmaiah and Rajamma and serving by conducting various medical camps, spreading value of education</li>




   



<li>ROY &amp; ROYS: Social service organization working for better &amp; less bitter society.</li>




</ul>




--></p>

      </div> 
  </div> 
      </div> 
  </div> 
</div></div><div class="container dt-container"><div class="vc_row wpb_row vc_row-fluid vc_custom_detheme10">
  <div class="vc_col-sm-12 wpb_column column_container">
      <div class="wpb_wrapper">
          <div class="vc_empty_space" style="height: 32px"><span class="vc_empty_space_inner"></span></div>

      </div> 
  </div> 
</div></div><div class="container dt-container"><div class="vc_row wpb_row vc_row-fluid vc_custom_detheme11">
  <div class="vc_col-sm-12 wpb_column column_container">
      <div class="wpb_wrapper">
          
  <div class="wpb_text_column wpb_content_element ">
      <div class="wpb_wrapper">
          <h3 style="color: #f97d09;">Telangana movement (2009 – 2014)</h3>
<ul>
<li>Participated actively in Telangana movement and established DOTS ( Doctors of telangana state ). Actively participated in movement like rasta roko , million march , sagara haram , rail roko , assembly muttadi. Arrested twice as part of movement</li>
<li>Extended professional help to many people injured or needed treatment in telangana movement</li>
<li>Made a telangana Health blue print</li>
</ul>
<h5 style="color: #278d27;">Political life (2014 onwards)</h5>
<ul>
<li>Contested as an MP from bhongir constituency on TRS party ticket and won against a powerful opponent</li>
<li>2014 till 2018 he has achieved many mega projects in bhongir parliament constituency like</li>
<li>AIIMS ( All India institute of medical sciences )</li>
<li>Kendriya vidyalaya</li>
<li>Pass port Kendra</li>
<li>MMTS</li>
<li>Yadadari Temple</li>
<li>TIF GRIP industrial cluster</li>
<li>Mother and child hospital</li>
<li>Apache – Boeing Tata company</li>
<li>Dry port</li>
<li>Many more</li>
</ul>
<h3 style="color: #f97d09;">Future goals</h3>
<p>To balance between professional work and social contribution</p>

      </div> 
  </div> 
      </div> 
  </div> 
</div></div>
                      </div>
`;

const hindiMarkdown = `
<div class="post-article">
<div class="container dt-container"><div class="vc_row wpb_row vc_row-fluid vc_custom_detheme1">
  <div class="vc_col-sm-12 wpb_column column_container">
      <div class="wpb_wrapper">
          <div id="section-1-1707656795" class=" dt-section-head center size-custom hide-overflow">
          <div class="dt-section-container"><h2 class="section-main-title section-heading-polkadot-left-right " style="color:#f97d09;font-size:22px">
              जीवनी
          </h2>
          </div></div>
      </div> 
  </div> 
</div></div><div class="container dt-container"><div class="vc_row wpb_row vc_row-fluid vc_custom_detheme2">
  <div class="vc_col-sm-8 wpb_column column_container">
      <div class="wpb_wrapper">
          
  <div class="wpb_text_column wpb_content_element ">
      <div class="wpb_wrapper">
          <p>डॉ. बी. नरसैया का जन्म 2 मार्च 1959 को सूर्यापेट, नलगोंडा जिले में हुआ था, उन्होंने सूर्यापेट में इंटरमीडिएट तक पढ़ाई की और बाद में 1983 में ओस्मानिया मेडिकल कॉलेज,हैदराबाद से प्रथम श्रेणी और 4 विषयों में विशिष्टता के साथ स्नातक की उपाधि प्राप्त की। उन्होंने ओस्मानिया मेडिकल कॉलेज से सामान्य सर्जरी में एम.एस किया उसके बाद लैप्रोस्कोपिक सर्जरी में विशेषज्ञता हासिल की। वह भारत में लैप्रोस्कोपिक सर्जरी के अग्रदूत हैं और उन्होंने अपने नाम से 32,000 से अधिक प्रक्रियाएं की हैं। वह एक शिक्षक, अकादमिक, लैप्रोस्कोपी में प्रशिक्षक, लेखक और सामाजिक कार्यकर्ता हैं।</p>

      </div> 
  </div> 
  <div class="wpb_text_column wpb_content_element ">
      <div class="wpb_wrapper">
          <div>
<div class="col-xs-12 col-sm-3"><strong>शिक्षा</strong></div>

<div class="col-xs-12 col-sm-8">एमएस जेन सर्जरी, 1984 – 1987 ओस्मानिया मेडिकल कॉलेज<br>
एमबीबीएस 4 विषयों में विशिष्टताओं के साथ प्रथम श्रेणी में पास 1976 – 83 ओस्मानिया मेडिकल कॉलेज में</div>
</div>
<div>
<div class="col-xs-12 col-sm-3"><strong>अनुभव</strong></div>

<div class="col-xs-12 col-sm-8">1996 से आगे – हैदराबाद इंस्टिट्यूट ऑफ लेप्रोएंडोस्कोपिक सर्जरी (HILS)<br>
आदित्य हॉस्पिटल में, HOD स्टार सर्जिकल सेवाएँ, बेरिएट्रिक &amp; मेटाबॉलिक<br>
इंस्टीट्यूट (BMI)</div>
<div>
<div class="col-xs-12 col-sm-3"><strong>सरकारी पद</strong></div>

<div class="col-xs-12 col-sm-8">1991 से 1995 तक सर्जरी के सहायक प्रोफेसर, ओस्मानिया जनरल हॉस्पिटल और ओस्मानिया मेडिकल कॉलेज<br>
1987 से 1990 तक सहायक सिविल सर्जन, मेडिकल ऑफिसर और जिला प्रभारी – लैप्रोस्कोपिक सर्जरी महबूबनगर में।</div>
</div>
</div>

      </div> 
  </div> 
      </div> 
  </div> 

  <div class="vc_col-sm-4 wpb_column column_container">
      <div class="wpb_wrapper">
          
  <div class="wpb_single_image wpb_content_element vc_align_center">
      <div class="wpb_wrapper">
          
          <div class="vc_single_image-wrapper   vc_box_border_grey"><img width="555" height="536" src="https://cydjretpcgmuezpkbkql.supabase.co/storage/v1/object/public/media/netas/narsaiah/dp.jpg" class="vc_single_image-img attachment-full" alt="" srcset="https://cydjretpcgmuezpkbkql.supabase.co/storage/v1/object/public/media/netas/narsaiah/dp.jpg 555w, http://booranarsaiahgoud.com/wp-content/uploads/2018/04/narsaiah-img-300x290.jpg 300w" sizes="(max-width: 555px) 100vw, 555px"></div>
      </div>
  </div>

      </div> 
  </div> 
</div></div><div class="container dt-container"><div class="vc_row wpb_row vc_row-fluid vc_custom_detheme3">
  <div class="vc_col-sm-12 wpb_column column_container">
      <div class="wpb_wrapper">
          
      </div> 
  </div> 
</div></div><div class="container dt-container"><div class="vc_row wpb_row vc_row-fluid vc_custom_detheme4">
  <div class="vc_col-sm-12 wpb_column column_container">
      <div class="wpb_wrapper">
          <div class="vc_empty_space" style="height: 32px"><span class="vc_empty_space_inner"></span></div>

      </div> 
  </div> 
</div></div><div class="container dt-container"><div class="vc_row wpb_row vc_row-fluid vc_custom_detheme5">
  <div class="vc_col-sm-12 wpb_column column_container">
      <div class="wpb_wrapper">
          
  <div class="wpb_text_column wpb_content_element ">
      <div class="wpb_wrapper">
          <h3 style="color: #f97d09;">अनुभव और व्यावसायिकता में अकादमिक्स</h3>
<h4>लैप्रोस्कोपिक सर्जरी</h4>
<p>भारत में लैप्रोस्कोपिक सर्जरी के अग्रदूत सर्जन में से एक, जिन्होंने 32,000 से अधिक लैप्रोस्कोपिक सर्जरी की है, बुनियादी से लेकर उन्नत प्रक्रियाओं तक। भारत में सबसे बहुमुखी सर्जन जिनके पास सामान्य सर्जरी, जीआई सर्जरी, गाइनेक लैप्रोस्कोपी, थोराकोस्कोपी, कैंसर सर्जरी, बाल चिकित्सा सर्जरी, एंडोक्राइन सर्जरी और मोटापा सर्जरी में अनुभव और विशेषज्ञता है</p>
<h4>बेरिएट्रिक मेटाबॉलिक सर्जरी</h4>
<p>एपी और भारत में सबसे अधिक संख्या में मोटापा सर्जरी में विशाल अनुभव</p>
<h4>ओपन और क्रिटिकल सर्जरी</h4>
<p>ओपन और प्रमुख प्रक्रियाओं जैसे कि पीसी शंट, लिवर रिसेक्शन, एसोफेजेस्ट्रेक्टोमी, थायरॉइड, पैराथायरॉइड सर्जरी में समान रूप से अच्छी तरह से अनुभवी।</p>
<h4>ग्रामीण सर्जरी</h4>
<p>पीएचसी अमंगल के सिविल सहायक सर्जन के रूप में परिवार कल्याण प्रक्रियाओं, प्रमुख प्रक्रियाओं जैसे एपेंडिसेक्टॉमी, हिस्टेरेक्टॉमी, एलएससीएस की अधिकतम संख्या में योगदान दिया। बाल चिकित्सा सर्जरी, री कैनालाइजेशन और अन्य प्रक्रियाएं मामूली सुविधाओं के साथ और केवल स्पाइनल एनेस्थीसिया के तहत की गईं, जबकि सर्जन, एनेस्थेटिस्ट, गाइनेकोलॉजिस्ट सभी एक ही में थे यहां तक कि अस्पताल में मामूली सुविधाओं के साथ भी</p>

      </div> 
  </div> 
      </div> 
  </div> 
</div></div><div class="container dt-container"><div class="vc_row wpb_row vc_row-fluid vc_custom_detheme6">
  <div class="vc_col-sm-12 wpb_column column_container">
      <div class="wpb_wrapper">
          
  <div class="wpb_text_column wpb_content_element ">
      <div class="wpb_wrapper">
          <h5 style="color: #278d27;">निम्नलिखित बिंदु उनके करियर को हाइलाइट करते हैं</h5>
<ul>
<li>वह स्वयं सिखाए गए लैप्रोस्कोपिक सर्जन हैं</li>
<li>लैप्रोस्कोपिक सर्जरी में सबसे उच्च श्रृंखला (32,000 से अधिक मामले)</li>
<li>जिलों और ग्रामीण क्षेत्रों में लैप्रोस्कोपिक सर्जरी की जागरूकता फैलाने वाले पहले सर्जन</li>
<li>हैदराबाद में इंसिजनल हर्निया, हायटस हर्निया, कार्सिनोमा कॉलोन, कैंसर सर्विक्स आदि जैसी उन्नत लैप्रोस्कोपिक सर्जरी शुरू करने वाले पहले सर्जन</li>
<li>हैदराबाद में B स्पाइन के लिए थोरैकोस्कोपिक डीकम्प्रेशन करने वाले पहले व्यक्ति</li>
<li>1989 में महबूबनगर में जिला कलेक्टर से सर्वश्रेष्ठ सर्जन पुरस्कार प्राप्त किया</li>
<li>पीएचसी में उत्कृष्ट सर्जिकल कार्य करने के लिए स्वास्थ्य मंत्रालय से विशेष प्रशंसा</li>
</ul>

      </div> 
  </div> 
      </div> 
  </div> 
</div></div><div class="container dt-container"><div class="vc_row wpb_row vc_row-fluid vc_custom_detheme7">
  <div class="vc_col-sm-12 wpb_column column_container">
      <div class="wpb_wrapper">
          <div class="vc_empty_space" style="height: 32px"><span class="vc_empty_space_inner"></span></div>

      </div> 
  </div> 
</div></div><div class="container dt-container"><div class="vc_row wpb_row vc_row-fluid vc_custom_detheme8">
  <div class="vc_col-sm-12 wpb_column column_container">
      <div class="wpb_wrapper">
          
  <div class="wpb_text_column wpb_content_element ">
      <div class="wpb_wrapper">
          <h3 style="color: #f97d09;">अकादमिक गतिविधियाँ</h3>
<ul>
<li>लैप्रोस्कोपिक सर्जरी पर 40 से अधिक कार्यशालाएँ आयोजित की</li>
<li>75 से अधिक CME आयोजित की</li>
<li>सिंगापुर, जापान में लैप्रोस्कोपिक सर्जरी की विश्व कांग्रेस में पत्र प्रस्तुत किया</li>
<li>राज्य और राष्ट्रीय सर्जिकल मंचों पर कई पत्र प्रस्तुत किए</li>
</ul>

      </div> 
  </div> 
      </div> 
  </div> 
</div></div><div class="container dt-container"><div class="vc_row wpb_row vc_row-fluid vc_custom_detheme9">
  <div class="vc_col-sm-12 wpb_column column_container">
      <div class="wpb_wrapper">
          
  <div class="wpb_text_column wpb_content_element ">
      <div class="wpb_wrapper">
          <h5 style="color: #278d27;">संगठन (अकादमिक)</h5>
<ul>
<li>ASI AP चैप्टर के सचिव 2 बार 2005 – 2009 से</li>
<li>ASI के GC सदस्य</li>
<li>AMASI के उपाध्यक्ष</li>
<li>AMASI के मानद सचिव – सर्वसम्मति से चुने गए</li>
<li>ASI के गवर्निंग काउंसिल सदस्य</li>
<li>HSI (हर्निया सोसाइटी ऑफ इंडिया) के EC सदस्य</li>
</ul>
<h5 style="color: #278d27;">वर्तमान स्थिति</h5>
<ul>
<li>भोंगिर के पूर्व संसद सदस्य</li>
</ul>
<h5 style="color: #278d27;">शौक</h5>
<ul>
<li>पेंटिंग : 2007 में राज्य आर्ट गैलरी में पेंटिंग की एकल प्रदर्शनी आयोजित की और जुटाए गए धन का उपयोग सामाजिक कार्य के लिए किया</li>
<li>लेखन : “लिविंग बाय कोट्स” नामक पुस्तक प्रकाशित की</li>
</ul>
<p><!--




<h5 style="color: #0000ff;">सामाजिक कार्य</h5>








<ul>
   



<li>BLR फाउंडेशन : अपने दिवंगत माता-पिता बुर्रा लक्ष्मैया और रजम्मा के नाम पर ट्रस्ट स्थापित किया और विभिन्न मेडिकल शिविरों का आयोजन करके, शिक्षा के मूल्य को फैलाकर सेवा कर रहे हैं</li>




   



<li>ROY &amp; ROYS: बेहतर और कम कड़वे समाज के लिए काम कर रहे सामाजिक सेवा संगठन।</li>




</ul>




--></p>

      </div> 
  </div> 
      </div> 
  </div> 
</div></div><div class="container dt-container"><div class="vc_row wpb_row vc_row-fluid vc_custom_detheme10">
  <div class="vc_col-sm-12 wpb_column column_container">
      <div class="wpb_wrapper">
          <div class="vc_empty_space" style="height: 32px"><span class="vc_empty_space_inner"></span></div>

      </div> 
  </div> 
</div></div><div class="container dt-container"><div class="vc_row wpb_row vc_row-fluid vc_custom_detheme11">
  <div class="vc_col-sm-12 wpb_column column_container">
      <div class="wpb_wrapper">
          
  <div class="wpb_text_column wpb_content_element ">
      <div class="wpb_wrapper">
          <h3 style="color: #f97d09;">तेलंगाना आंदोलन (2009 – 2014)</h3>
<ul>
<li>तेलंगाना आंदोलन में सक्रिय रूप से भाग लिया और DOTS (तेलंगाना राज्य के डॉक्टर्स) की स्थापना की। रास्ता रोको, मिलियन मार्च, सागरा हारम, रेल रोको, विधानसभा मुत्तदी जैसे आंदोलन में सक्रिय रूप से भाग लिया। आंदोलन के भाग के रूप में दो बार गिरफ्तार हुए</li>
<li>तेलंगाना आंदोलन में चोटिल हुए या उपचार की आवश्यकता वाले कई लोगों को पेशेवर मदद प्रदान की</li>
<li>तेलंगाना हेल्थ ब्लू प्रिंट बनाया</li>
</ul>
<h5 style="color: #278d27;">राजनीतिक जीवन (2014 से आगे)</h5>
<ul>
<li>भोंगिर निर्वाचन क्षेत्र से TRS पार्टी के टिकट पर सांसद के रूप में चुनाव लड़ा और एक शक्तिशाली प्रतिद्वंद्वी के खिलाफ जीत हासिल की</li>
<li>2014 से 2018 तक उन्होंने भोंगिर संसदीय निर्वाचन क्षेत्र में कई मेगा प्रोजेक्ट्स हासिल किए जैसे</li>
<li>एम्स (ऑल इंडिया इंस्टिट्यूट ऑफ मेडिकल साइंसेज)</li>
<li>केंद्रीय विद्यालय</li>
<li>पासपोर्ट केंद्र</li>
<li>एमएमटीएस</li>
<li>यादादरी मंदिर</li>
<li>टीआईएफ ग्रिप इंडस्ट्रियल क्लस्टर</li>
<li>माता और शिशु अस्पताल</li>
<li>अपाचे – बोइंग टाटा कंपनी</li>
<li>ड्राई पोर्ट</li>
<li>और भी बहुत कुछ</li>
</ul>
<h3 style="color: #f97d09;">भविष्य के लक्ष्य</h3>
<p>पेशेवर काम और सामाजिक योगदान के बीच संतुलन बनाना</p>

      </div> 
  </div> 
      </div> 
  </div> 
</div></div>
                      </div>
`;


const teluguMarkdown = `
<div class="post-article">
<div class="container dt-container"><div class="vc_row wpb_row vc_row-fluid vc_custom_detheme1">
  <div class="vc_col-sm-12 wpb_column column_container">
      <div class="wpb_wrapper">
          <div id="section-1-1707656795" class=" dt-section-head center size-custom hide-overflow">
          <div class="dt-section-container"><h2 class="section-main-title section-heading-polkadot-left-right " style="color:#f97d09;font-size:22px">
              జీవితచరిత్ర
          </h2>
          </div></div>
      </div> 
  </div> 
</div></div><div class="container dt-container"><div class="vc_row wpb_row vc_row-fluid vc_custom_detheme2">
  <div class="vc_col-sm-8 wpb_column column_container">
      <div class="wpb_wrapper">
          
  <div class="wpb_text_column wpb_content_element ">
      <div class="wpb_wrapper">
          <p>డా. బి. నర్సయ్య 2 మార్చి 1959న సూర్యాపేట, నల్గొండ జిల్లాలో జన్మించారు, సూర్యాపేటలో ఇంటర్మీడియట్ వరకు చదివి, తరువాత ఒస్మానియా మెడికల్ కాలేజ్, హైదరాబాద్ నుండి 1983లో ఫస్ట్ డివిజన్ మరియు 4 సబ్జెక్ట్లలో డిస్టింక్షన్తో గ్రాడ్యుయేట్ అయ్యారు. ఆయన ఒస్మానియా మెడికల్ కాలేజ్ నుండి జనరల్ సర్జరీలో ఎం.ఎస్ చేసి, అనంతరం లాపరోస్కోపిక్ సర్జరీలో స్పెషలైజేషన్ చేశారు. భారతదేశంలో లాపరోస్కోపిక్ సర్జరీలో అగ్రగామిగా ఉన్నారు మరియు 32,000 కంటే ఎక్కువ ప్రక్రియలు చేసిన ఘనత ఆయనది. ఆయన ఒక టీచర్, అకాడెమిషియన్, లాపరోస్కోపీలో ట్రైనర్, రచయిత మరియు సామాజిక కార్యకర్త.</p>

      </div> 
  </div> 
  <div class="wpb_text_column wpb_content_element ">
      <div class="wpb_wrapper">
          <div>
<div class="col-xs-12 col-sm-3"><strong>విద్య</strong></div>

<div class="col-xs-12 col-sm-8">ఎంఎస్ జనరల్ సర్జరీ, 1984 – 1987 ఒస్మానియా మెడికల్ కాలేజ్<br>
ఎంబీబీఎస్ 4 సబ్జెక్ట్లలో డిస్టింక్షన్లతో ఫస్ట్ డివిజన్ పాస్ అయ్యారు 1976 – 83 ఒస్మానియా మెడికల్ కాలేజ్ వద్ద</div>
</div>
<div>
<div class="col-xs-12 col-sm-3"><strong>అనుభవం</strong></div>

<div class="col-xs-12 col-sm-8">1996 నుంచి – హైదరాబాద్ ఇన్స్టిట్యూట్ ఆఫ్ లాపరోఎండోస్కోపిక్ సర్జరీ (HILS)<br>
ఆదిత్య హాస్పిటల్ వద్ద, HOD స్టార్ సర్జికల్ సర్వీసెస్, బేరియాట్రిక్ &amp; మెటబోలిక్<br>
ఇన్స్టిట్యూట్ (BMI)</div>
<div>
<div class="col-xs-12 col-sm-3"><strong>ప్రభుత్వ పోస్టింగ్లు</strong></div>

<div class="col-xs-12 col-sm-8">1991 నుంచి 1995 వరకు సర్జరీ యొక్క అసిస్టెంట్ ప్రొఫెసర్, ఒస్మానియా జనరల్ హాస్పిటల్ మరియు ఒస్మానియా మెడికల్ కాలేజ్<br>
1987 నుంచి 1990 వరకు అసిస్టెంట్ సివిల్ సర్జన్, మెడికల్ ఆఫీసర్ మరియు జిల్లా ఇన్‌చార్జ్ – లాపరోస్కోపిక్ సర్జరీ మహబూబ్‌నగర్ వద్ద.</div>
</div>
</div>

      </div> 
  </div> 
      </div> 
  </div> 

  <div class="vc_col-sm-4 wpb_column column_container">
      <div class="wpb_wrapper">
          
  <div class="wpb_single_image wpb_content_element vc_align_center">
      <div class="wpb_wrapper">
          
          <div class="vc_single_image-wrapper   vc_box_border_grey"><img width="555" height="536" src="https://cydjretpcgmuezpkbkql.supabase.co/storage/v1/object/public/media/netas/narsaiah/dp.jpg" class="vc_single_image-img attachment-full" alt="" srcset="https://cydjretpcgmuezpkbkql.supabase.co/storage/v1/object/public/media/netas/narsaiah/dp.jpg 555w, http://booranarsaiahgoud.com/wp-content/uploads/2018/04/narsaiah-img-300x290.jpg 300w" sizes="(max-width: 555px) 100vw, 555px"></div>
      </div>
  </div>

      </div> 
  </div> 
</div></div><div class="container dt-container"><div class="vc_row wpb_row vc_row-fluid vc_custom_detheme3">
  <div class="vc_col-sm-12 wpb_column column_container">
      <div class="wpb_wrapper">
          
      </div> 
  </div> 
</div></div><div class="container dt-container"><div class="vc_row wpb_row vc_row-fluid vc_custom_detheme4">
  <div class="vc_col-sm-12 wpb_column column_container">
      <div class="wpb_wrapper">
          <div class="vc_empty_space" style="height: 32px"><span class="vc_empty_space_inner"></span></div>

      </div> 
  </div> 
</div></div><div class="container dt-container"><div class="vc_row wpb_row vc_row-fluid vc_custom_detheme5">
  <div class="vc_col-sm-12 wpb_column column_container">
      <div class="wpb_wrapper">
          
  <div class="wpb_text_column wpb_content_element ">
      <div class="wpb_wrapper">
          <h3 style="color: #f97d09;">వృత్తిలో అనుభవం &amp; అకాడెమిక్స్</h3>
<h4>లాపరోస్కోపిక్ సర్జరీ</h4>
<p>భారతదేశంలో లాపరోస్కోపీలో అగ్రగామి సర్జన్, బేసిక్ నుండి అడ్వాన్స్డ్ ప్రక్రియల వరకు 32,000కు పైగా లాపరోస్కోపిక్ సర్జరీలు చేసిన ఘనత ఆయనది. జనరల్ సర్జరీ, జీఐ సర్జరీ, గైనిక్ లాపరోస్కోపీ, థొరాకోస్కోపీ, క్యాన్సర్ సర్జరీ, పెడియాట్రిక్ సర్జరీ, ఎండోక్రైన్ సర్జరీ మరియు ఒబెసిటీ సర్జరీలో అనుభవం మరియు నిపుణతలు కలిగిన భారతదేశంలో అత్యంత బహుముఖ సర్జన్.</p>
<h4>బేరియాట్రిక్ మెటాబోలిక్ సర్జరీ</h4>
<p>ఒబెసిటీ సర్జరీలో విస్తృత అనుభవం, AP మరియు భారతదేశంలో అత్యధిక సంఖ్యలో ఉన్నారు</p>
<h4>ఓపెన్ &amp; క్రిటికల్ సర్జరీలు</h4>
<p>ఓపెన్ మరియు ప్రధాన ప్రక్రియలు వంటి పీసీ షంట్లు, లివర్ రీసెక్షన్లు, ఎసోఫాగస్ట్రెక్టమీలు, థైరాయిడ్, పారాథైరాయిడ్ సర్జరీలు వంటివిలో సమానంగా అనుభవం ఉన్నారు.</p>
<h4>గ్రామీణ సర్జరీలు</h4>
<p>PHC అమంగల్ యొక్క సివిల్ అసిస్టెంట్ సర్జన్గా కుటుంబ సంక్షేమ ప్రక్రియలు, అపెండిసెక్టమీ, హిస్టెరెక్టమీలు, LSCS వంటి ప్రధాన ప్రక్రియలను గరిష్ట సంఖ్యలో చేశారు. పెడియాట్రిక్ సర్జరీ, రీ కెనాలిజేషన్లు మరియు ఇతర ప్రక్రియలను స్పైనల్ అనస్థీషియా మాత్రమే ఉండగా సర్జన్, అనస్థెటిస్ట్, గైనకాలజిస్ట్ అన్నీ ఒక్కరే అయినప్పటికీ ఆసుపత్రిలో తక్కువ సౌకర్యాలతో చేశారు</p>

      </div> 
  </div> 
      </div> 
  </div> 
</div></div><div class="container dt-container"><div class="vc_row wpb_row vc_row-fluid vc_custom_detheme6">
  <div class="vc_col-sm-12 wpb_column column_container">
      <div class="wpb_wrapper">
          
  <div class="wpb_text_column wpb_content_element ">
      <div class="wpb_wrapper">
          <h5 style="color: #278d27;">ఆయన కెరీర్ యొక్క కీలక అంశాలు క్రిందివి</h5>
<ul>
<li>ఆయన స్వీయ శిక్షణలో లాపరోస్కోపిక్ సర్జన్</li>
<li>లాపరోస్కోపిక్ సర్జరీలో అత్యధిక సిరీస్ (32,000 కేసుల కంటే ఎక్కువ)</li>
<li>జిల్లాలు మరియు గ్రామీణ ప్రాంతాలలో లాపరోస్కోపిక్ సర్జరీ యొక్క అవగాహనను ప్రచారం చేసిన మొదటి సర్జన్</li>
<li>హైదరాబాద్‌లో ఇన్సిషనల్ హెర్నియా, హైయటస్ హెర్నియా, కార్సినోమా కొలన్, కాన్సర్ సర్విక్స్ వంటి అడ్వాన్స్డ్ లాపరోస్కోపిక్ సర్జరీలను ప్రారంభించిన మొదటి సర్జన్</li>
<li>హైదరాబాద్‌లో B స్పైన్ కోసం థొరాకోస్కోపిక్ డీకంప్రెషన్ చేసిన మొదటి వ్యక్తి</li>
<li>1989లో మహబూబ్‌నగర్‌లో జిల్లా కలెక్టర్ నుండి ఉత్తమ సర్జన్ అవార్డు పొందారు</li>
<li>PHCలో అద్భుతమైన శస్త్రచికిత్స పని చేయడం కొరకు ఆరోగ్య మంత్రిత్వ శాఖ నుండి ప్రత్యేక ప్రశంసలు పొందారు</li>
</ul>

      </div> 
  </div> 
      </div> 
  </div> 
</div></div><div class="container dt-container"><div class="vc_row wpb_row vc_row-fluid vc_custom_detheme7">
  <div class="vc_col-sm-12 wpb_column column_container">
      <div class="wpb_wrapper">
          <div class="vc_empty_space" style="height: 32px"><span class="vc_empty_space_inner"></span></div>

      </div> 
  </div> 
</div></div><div class="container dt-container"><div class="vc_row wpb_row vc_row-fluid vc_custom_detheme8">
  <div class="vc_col-sm-12 wpb_column column_container">
      <div class="wpb_wrapper">
          
  <div class="wpb_text_column wpb_content_element ">
      <div class="wpb_wrapper">
          <h3 style="color: #f97d09;">అకాడెమిక్ చర్యలు</h3>
<ul>
<li>లాపరోస్కోపిక్ సర్జరీపై 40కి పైగా వర్క్‌షాప్‌లను నిర్వహించారు</li>
<li>75కి పైగా CMEలను నిర్వహించారు</li>
<li>సింగపూర్, జపాన్‌లో జరిగిన లాపరోస్కోపిక్ సర్జరీ వరల్డ్ కాంగ్రెస్‌లో పేపర్లను ప్రజెంట్ చేశారు</li>
<li>రాష్ట్ర మరియు జాతీయ సర్జికల్ ఫోరమ్‌లలో అనేక పేపర్లను ప్రజెంట్ చేశారు</li>
</ul>

      </div> 
  </div> 
      </div> 
  </div> 
</div></div><div class="container dt-container"><div class="vc_row wpb_row vc_row-fluid vc_custom_detheme9">
  <div class="vc_col-sm-12 wpb_column column_container">
      <div class="wpb_wrapper">
          
  <div class="wpb_text_column wpb_content_element ">
      <div class="wpb_wrapper">
          <h5 style="color: #278d27;">సంస్థ (అకాడెమిక్)</h5>
<ul>
<li>2005 – 2009 నుండి 2 సార్లు ASI AP అధ్యాయం యొక్క సెక్రటరీ</li>
<li>GC సభ్యుడు ASI</li>
<li>వైస్ ప్రెసిడెంట్ – AMASI</li>
<li>గౌరవ సెక్రటరీ – AMASI ఎన్నికైనారు</li>
<li>గవర్నింగ్ కౌన్సిల్ సభ్యుడు – ASI</li>
<li>EC సభ్యుడు HSI (హెర్నియా సొసైటీ ఆఫ్ ఇండియా)</li>
</ul>
<h5 style="color: #278d27;">ప్రస్తుత స్థితి</h5>
<ul>
<li>భూంగిర్ నుండి మాజీ సభ్యుడు ఆఫ్ పార్లమెంట్</li>
</ul>
<h5 style="color: #278d27;">అభిరుచులు</h5>
<ul>
<li>చిత్రలేఖనం : 2007లో స్టేట్ ఆర్ట్ గ్యాలరీలో ఏకైక ప్రదర్శన నిర్వహించారు మరియు సేకరించిన నిధులను సామాజిక పనులకు ఉపయోగించారు</li>
<li>రచన : “Living by Quotes” అనే పుస్తకాన్ని ప్రచురించారు</li>
</ul>
<p><!--




<h5 style="color: #0000ff;">సామాజిక పని</h5>








<ul>
   



<li>BLR ఫౌండేషన్ : తన దివంగత మాతృమూర్తులు బుర్రా లక్ష్మయ్య మరియు రజమ్మ పేరుతో ట్రస్ట్ స్థాపించి వివిధ వైద్య శిబిరాలు నిర్వహించడం, విద్యా విలువలను ప్రచారం చేయడం ద్వారా సేవ చేస్తున్నారు</li>




   



<li>ROY &amp; ROYS: ఉత్తమ &amp; తక్కువ చేదు సమాజం కోసం పనిచేసే సామాజిక సేవా సంస్థ.</li>




</ul>




--></p>

      </div> 
  </div> 
      </div> 
  </div> 
</div></div><div class="container dt-container"><div class="vc_row wpb_row vc_row-fluid vc_custom_detheme10">
  <div class="vc_col-sm-12 wpb_column column_container">
      <div class="wpb_wrapper">
          <div class="vc_empty_space" style="height: 32px"><span class="vc_empty_space_inner"></span></div>

      </div> 
  </div> 
</div></div><div class="container dt-container"><div class="vc_row wpb_row vc_row-fluid vc_custom_detheme11">
  <div class="vc_col-sm-12 wpb_column column_container">
      <div class="wpb_wrapper">
          
  <div class="wpb_text_column wpb_content_element ">
      <div class="wpb_wrapper">
          <h3 style="color: #f97d09;">తెలంగాణ ఉద్యమం (2009 – 2014)</h3>
<ul>
<li>తెలంగాణ ఉద్యమంలో క్రియాశీలంగా పాల్గొన్నారు మరియు DOTS (డాక్టర్లు ఆఫ్ తెలంగాణ స్టేట్) స్థాపించారు. రాస్తా రోకో, మిలియన్ మార్చ్, సాగర హరం, రైల్ రోకో, అసెంబ్లీ ముట్టడి వంటి ఉద్యమాల్లో క్రియాశీలంగా పాల్గొన్నారు. ఉద్యమం భాగంగా రెండు సార్లు అరెస్టు చేయబడ్డారు</li>
<li>తెలంగాణ ఉద్యమంలో గాయపడిన లేదా చికిత్స అవసరమైన అనేక మందికి వృత్తిపరమైన సహాయం అందించారు</li>
<li>తెలంగాణ ఆరోగ్య బ్లూ ప్రింట్ తయారు చేశారు</li>
</ul>
<h5 style="color: #278d27;">రాజకీయ జీవితం (2014 నుండి)</h5>
<ul>
<li>TRS పార్టీ టికెట్‌పై భూంగిర్ నియోజకవర్గం నుండి ఎంపీగా పోటీ చేసి బలమైన ప్రత్యర్థిపై గెలుపొందారు</li>
<li>2014 నుండి 2018 వరకు భూంగిర్ పార్లమెంట్ నియోజకవర్గంలో అనేక మెగా ప్రాజెక్టులను సాధించారు వంటివి</li>
<li>AIIMS (ఆల్ ఇండియా ఇన్స్టిట్యూట్ ఆఫ్ మెడికల్ సైన్సెస్)</li>
<li>కేంద్రీయ విద్యాలయ</li>
<li>పాస్ పోర్ట్ కేంద్రం</li>
<li>MMTS</li>
<li>యాదాద్రి టెంపుల్</li>
<li>TIF GRIP ఇండస్ట్రియల్ క్లస్టర్</li>
<li>మదర్ అండ్ చైల్డ్ హాస్పిటల్</li>
<li>అపాచే – బోయింగ్ టాటా కంపెనీ</li>
<li>డ్రై పోర్ట్</li>
<li>మరిన్ని</li>
</ul>
<h3 style="color: #f97d09;">భవిష్యత్ లక్ష్యాలు</h3>
<p>వృత్తిపర పని మరియు సామాజిక రంగ సహకారం మధ్య సమతుల్యత సాధించడం</p>

      </div> 
  </div> 
      </div> 
  </div> 
</div></div>
</div>
`;

const markdownData = {

    'jhussainnayak':{
        english: `
        <div class="elementor-column-wrap elementor-element-populated">
							<div class="elementor-widget-wrap">
						<div class="elementor-element elementor-element-ecd473b elementor-widget elementor-widget-heading" data-id="ecd473b" data-element_type="widget" data-widget_type="heading.default">
				<div class="elementor-widget-container">
			<h2 class="elementor-heading-title elementor-size-default">About Jatothu Hussain Nayak</h2>		</div>
				</div>
				<div class="elementor-element elementor-element-33bfa39 elementor-widget elementor-widget-heading" data-id="33bfa39" data-element_type="widget" data-settings="{&quot;_animation&quot;:&quot;none&quot;}" data-widget_type="heading.default">
				<div class="elementor-widget-container">
			<p class="elementor-heading-title elementor-size-default">Jatothu Hussain Nayak was born on 6th March 1982 to a farmer’s Hindu family In Macharla Village, Gudur Mandal, Mahabubabad District. He was the fifth of five children born to Jatothu Lachya Nayak and Jatothu Gumsi Nayak. Hussain's family belonged to the Banjara's.<br><br>

He completed his education in Warangal. He is a young entrepreneur.<br><br>

Since 2015 he was enthusiastic to serve the people were below poverty. By measuring his Social Responsible and Leadership activities Bharatiya Janata Party (BJP) has given an opportunity to contest as Member of the Legislative Assembly (MLA) from Mahabubabad Parliamentary constituency.</p>		</div>
				</div>
				<div class="elementor-element elementor-element-394befc elementor-widget elementor-widget-heading" data-id="394befc" data-element_type="widget" data-widget_type="heading.default">
				<div class="elementor-widget-container">
			<h2 class="elementor-heading-title elementor-size-default">Aspiration:</h2>		</div>
				</div>
				<div class="elementor-element elementor-element-96a4f73 elementor-widget elementor-widget-heading" data-id="96a4f73" data-element_type="widget" data-widget_type="heading.default">
				<div class="elementor-widget-container">
			<p class="elementor-heading-title elementor-size-default">To represent Bharatiya Janata Party (BJP) from Mahabubabad Parliamentary Constituency (ST Reserved), Telangana State.</p>		</div>
				</div>
				<div class="elementor-element elementor-element-ac8e4fd elementor-widget elementor-widget-heading" data-id="ac8e4fd" data-element_type="widget" data-widget_type="heading.default">
				<div class="elementor-widget-container">
			<h2 class="elementor-heading-title elementor-size-default">Political Initiatives:</h2>		</div>
				</div>
				<div class="elementor-element elementor-element-112c616 elementor-widget elementor-widget-heading" data-id="112c616" data-element_type="widget" data-widget_type="heading.default">
				<div class="elementor-widget-container">
			<span class="elementor-heading-title elementor-size-default">Contested as Member of Parliament from <span style="color:#EB8500">16-Mahabubabad Parliamentary Constituency</span> held in 2019 Lok Sabha Elections. Joining in BJP on November 2018, He got the privileged to contest as Member of Legislative Assembly (MLA) from <span style="color:#EB8500">102-Mahabubabad Assembly constituency</span> during 2018 Elections in Telangana State.<br><br>

He extensively campaigned in all four mandals of Mahabubabad Assembly Districts covering 80 plus Gram Panchayats and ensured active participation of local cadre and karyakarthas in creating awareness among local people about BJP central schemes especially for the poor and downtrodden. <br><br>

Worked for <span style="color:#EB8500">BJP online Membership programme,</span> through his reference around 4000 people got joined in BJP party from Mahabubabad constituency.<br><br>

He established <span style="color:#EB8500">BJP party offices</span> and build cadre at all Mandals in Mahabubabad Constituency to strengthen BJP party.<br><br>

Engaged in <span style="color:#EB8500">Swachh Bharat Abhiyan</span> from time to time to create awareness about Cleanliness in Mahabubabad Constituency.<br><br>

Concurred in <span style="color:#EB8500">Mera Booth Sabse Mazboot</span> to strengthen party at grass root level and booth level.<br><br>

Performed in <span style="color:#EB8500">Mera Parivar BJP Parivar </span>and ensured maximum flag hoisting activities at households of BJP cadre and karyakarthas.<br><br>

Compete in promoting <span style="color:#EB8500">Vijay Sankalp Bike Rally</span> in all mandals of Mahabubabad Constituency.<br><br>

Took more strive to mend in <span style="color:#EB8500">Pradhan Mantri Ujjwala scheme </span>and ensured delivering GAS Cylinders and Gas Stoves in the Constituency.<br><br>

Actively participated in promoting <span style="color:#EB8500">Mann ki Baat</span> program across BJP Cadre in Constituency.<br><br>

Actively engaged in promoting <span style="color:#EB8500">Namo App </span>across BJP Cadre in Constituency.<br><br>

Campaigned extensively about various welfare schemes launched by BJP Party like </span>		</div>
				</div>
				<section class="elementor-section elementor-inner-section elementor-element elementor-element-16db8c9 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="16db8c9" data-element_type="section">
						<div class="elementor-container elementor-column-gap-default">
							<div class="elementor-row">
					<div class="elementor-column elementor-col-100 elementor-inner-column elementor-element elementor-element-558f99e" data-id="558f99e" data-element_type="column">
			<div class="elementor-column-wrap elementor-element-populated">
							<div class="elementor-widget-wrap">
						<div class="elementor-element elementor-element-6db3a3c elementor-icon-list--layout-traditional elementor-list-item-link-full_width elementor-widget elementor-widget-icon-list" data-id="6db3a3c" data-element_type="widget" data-widget_type="icon-list.default">
				<div class="elementor-widget-container">
					<ul class="elementor-icon-list-items">
							<li class="elementor-icon-list-item">
											<span class="elementor-icon-list-icon">
							<svg aria-hidden="true" class="svg-inline--fa fa-angle-right fa-w-8" focusable="false" data-prefix="fas" data-icon="angle-right" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512" data-fa-i2svg=""><path fill="currentColor" d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z"></path></svg><!-- <i aria-hidden="true" class="fas fa-angle-right"></i> -->						</span>
										<span class="elementor-icon-list-text">Pradhan Mantri Jan Dhan Yojana</span>
									</li>
								<li class="elementor-icon-list-item">
											<span class="elementor-icon-list-icon">
							<svg aria-hidden="true" class="svg-inline--fa fa-angle-right fa-w-8" focusable="false" data-prefix="fas" data-icon="angle-right" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512" data-fa-i2svg=""><path fill="currentColor" d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z"></path></svg><!-- <i aria-hidden="true" class="fas fa-angle-right"></i> -->						</span>
										<span class="elementor-icon-list-text">PM Kisan Yojana</span>
									</li>
								<li class="elementor-icon-list-item">
											<span class="elementor-icon-list-icon">
							<svg aria-hidden="true" class="svg-inline--fa fa-angle-right fa-w-8" focusable="false" data-prefix="fas" data-icon="angle-right" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512" data-fa-i2svg=""><path fill="currentColor" d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z"></path></svg><!-- <i aria-hidden="true" class="fas fa-angle-right"></i> -->						</span>
										<span class="elementor-icon-list-text">Swatchh Bharat Mission</span>
									</li>
								<li class="elementor-icon-list-item">
											<span class="elementor-icon-list-icon">
							<svg aria-hidden="true" class="svg-inline--fa fa-angle-right fa-w-8" focusable="false" data-prefix="fas" data-icon="angle-right" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512" data-fa-i2svg=""><path fill="currentColor" d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z"></path></svg><!-- <i aria-hidden="true" class="fas fa-angle-right"></i> -->						</span>
										<span class="elementor-icon-list-text">Pradhan Mantri Awas Yojana</span>
									</li>
								<li class="elementor-icon-list-item">
											<span class="elementor-icon-list-icon">
							<svg aria-hidden="true" class="svg-inline--fa fa-angle-right fa-w-8" focusable="false" data-prefix="fas" data-icon="angle-right" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512" data-fa-i2svg=""><path fill="currentColor" d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z"></path></svg><!-- <i aria-hidden="true" class="fas fa-angle-right"></i> -->						</span>
										<span class="elementor-icon-list-text">Pradhan Mantri Suraksha Bima Yojana</span>
									</li>
								<li class="elementor-icon-list-item">
											<span class="elementor-icon-list-icon">
							<svg aria-hidden="true" class="svg-inline--fa fa-angle-right fa-w-8" focusable="false" data-prefix="fas" data-icon="angle-right" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512" data-fa-i2svg=""><path fill="currentColor" d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z"></path></svg><!-- <i aria-hidden="true" class="fas fa-angle-right"></i> -->						</span>
										<span class="elementor-icon-list-text">ATAL Pension Yojana</span>
									</li>
						</ul>
				</div>
				</div>
						</div>
					</div>
		</div>
								</div>
					</div>
		</section>
				<section class="elementor-section elementor-inner-section elementor-element elementor-element-41f1929 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="41f1929" data-element_type="section">
						<div class="elementor-container elementor-column-gap-default">
							<div class="elementor-row">
					<div class="elementor-column elementor-col-100 elementor-inner-column elementor-element elementor-element-49e7cc4" data-id="49e7cc4" data-element_type="column">
			<div class="elementor-column-wrap elementor-element-populated">
							<div class="elementor-widget-wrap">
						<div class="elementor-element elementor-element-4cdeba8 elementor-widget elementor-widget-text-editor" data-id="4cdeba8" data-element_type="widget" data-widget_type="text-editor.default">
				<div class="elementor-widget-container">
								<div class="elementor-text-editor elementor-clearfix">
				<p>Prime Minister Narendra Modi in an attempt to adopt GandhiJi’s idea of cleanliness to propagate his ideas and principles of Non-Violence, Swaraj, Simplicity as part of his Gandhiji’s 150th Birthday has been Launched. The BJP State Party has covered “BJP SANKALP YATRA” across Mahabubabad Parliamentary Constituency. I have toured extensively amount around 500+ Km covering Assembly Constituencies, mandals and villages and to create awareness of Modiji Government. Schemes and its benefits to the larger section of the Society.</p>					</div>
						</div>
				</div>
						</div>
					</div>
		</div>
								</div>
					</div>
		</section>
				<div class="elementor-element elementor-element-2203e42 elementor-widget elementor-widget-heading" data-id="2203e42" data-element_type="widget" data-widget_type="heading.default">
				<div class="elementor-widget-container">
			<h2 class="elementor-heading-title elementor-size-default">Social Initiatives:</h2>		</div>
				</div>
				<div class="elementor-element elementor-element-f52e85e elementor-widget elementor-widget-heading" data-id="f52e85e" data-element_type="widget" data-widget_type="heading.default">
				<div class="elementor-widget-container">
			<p class="elementor-heading-title elementor-size-default"><span style="color:#EB8500">Employment to Underprivileged</span> - As a successful entrepreneur, having a thought to generate employment to uplift the under privileged, established his own Venture. Since then, He has been providing employment to hundreds of unemployed people from underprivileged background in State Telangana.<br><br>

<span style="color:#EB8500">Youth and Women Empowerment </span>– Conducted various skill development programs those are helpful in finding employment.<br><br>

<span style="color:#EB8500">Blood Camps</span> – Organized Blood Camps with few hundreds of people have donated blood as a Social Responsibility.<br><br>

<span style="color:#EB8500">Drinking Water</span> – Contributed in providing drinking water to few hamlets in Mahabubabad Constituency.<br><br>

<span style="color:#EB8500">Financial Aid </span>– Contributed financial Aid to the students who are financially weak for pursuing their studies.<br><br>

<span style="color:#EB8500">Roads</span> – Laid Roads to Hamlets where there is no road connectivity.<br><br>

<span style="color:#EB8500">Cultural Programs </span>– Participated in all the festivals and cultural programs irrespective of religion and caste.<br><br>

As a native of Mahabubabad constituency and being closely associated with all sections of people irrespective of their caste, creed and religion since his childhood. He humbly request the Central and State Leadership to consider and allowed him to develop 16 - Mahabubabad Lok Sabha Constituency (S.T. Reserved) in favorable of BJP candidature in next Assembly and Loksabha elections in Telangana State to attain the common core concept of Bharatiya Janata Party (BJP) i.e., to build up India as a strong and Prosperous Nation.<br><br>

Currently serving as <span style="color:#EB8500">Telangana State, Bharatiya Janata Party (BJP) President ST Morcha.</span></p>		</div>
				</div>
						</div>
					</div>
        `,
    }
}