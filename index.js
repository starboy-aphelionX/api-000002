const express = require('express');
const fetch = require('node-fetch');  // or use axios

const app = express();
const PORT = process.env.PORT || 3000;

// Your own API key to protect this endpoint
const VALID_API_KEY = process.env.MY_API_KEY || 'sk-2fbff04521f64bc6a67d69142bf8f529';

// Instagram credentials & tokens – store in .env file
const INSTAGRAM_COOKIES = process.env.INSTAGRAM_COOKIES; // full cookie string
const INSTAGRAM_CSRFTOKEN = process.env.INSTAGRAM_CSRFTOKEN;
const INSTAGRAM_SESSIONID = process.env.INSTAGRAM_SESSIONID;
const INSTAGRAM_USER_ID = process.env.INSTAGRAM_USER_ID; // e.g. 78369659734
const INSTAGRAM_LSD = process.env.INSTAGRAM_LSD;         // e.g. _3Wu5woEdJdy_tNja7Mo8_

// The GraphQL endpoint
const INSTAGRAM_GRAPHQL_URL = 'https://www.instagram.com/graphql/query';

// The static parameters from your curl (most can stay as constants)
const STATIC_PARAMS = {
  av: '17841478352036207',
  __d: 'www',
  __user: '0',
  __a: '1',
  __req: '34',
  __hs: '20498.HYP:instagram_web_pkg.2.1...0',
  dpr: '1',
  __ccg: 'GOOD',
  __rev: '1033485073',
  __s: 'ariq5e:kc559j:hg4oln',
  __hsi: '7606634927508848606',
  __dyn: '7xeUjG1mxu1syaxG4Vp41twWwIxu13wvoKewSAx-bwNw9G2Saxa0DU6u3y4o2Gw6QCwjE1EEc87m0yE462mcw5Mx62G5UswoEcE7O2l0Fwqo31w9a9wlo8od8-U2exi4UaEW2G0AEco5G1HzEjUlwhEe88o5i7U1oEbUGdG1QwTU9UaQ0Lo6-bwHwKG2-2B08-269wr86C1mgcEed6hEhK2OubK5V89FbxG1oxe6U5q0EoKmUhw4rxOi6oGq2Kq11whE984O',
  __csr: 'gjigz4gN5NAld5n7MgTkOEQQDeTXcDaGbtjmyWFIwgDy2JqmB8TlN5lQWiVoxanhV4FbiDAFEwBJ3Cj8vi-Q8F4QAQLqhuiibumELQkGLWQR4F7l4Giufq8ByoIGhQcy9O4J-qinoy8FoCeCUSGGVqi-nRy4KB-qBlpkm9Gmhpq-uoxqAWdnKjAGeUXyaARAKA-noymcGezk8BWggHK9ypXhAVEjhrV4HpEyJ6Sq9yU6Ou2N02683fgeU2Vw05CVwOwOAxh5Az2AkVpo-640CUkw8KcK19Ag198iwqo1xiwdueyEB6W8J0QweH80Laa48vyQ2R7ki0SV6EL43EqxG0hyUmwzwLCt9olwWwcmlwcB3EK0gt0vHglwm8d8y098Cj9xx1KGQ04CFS1bw9q0BUy59ohU26ip648bk2S9Eg0zqwAzOwRghxK22bpFquvB81vhVGgW0Pm7o1lUlE-1lw9C0pe36eodVUB0ro0K4b2Exxvc498a4nyoG0pe3y1EUkB-9Dwko8UbA1-Kp04kwho0RS1cw1ne0qS2XmbU0Zy04Zo7C04o80iyyE7O4U7e31ppu4Q0nC3m0NXe0bvxLw9605e81183awEK0uy0sq1x-B85e',
  __hsdp: 'go4b0D84oatML4NsYYnP8hq7i6KwDW5YKV2Tedd8gh95s5tSML6tT789H0B9O2MgAN4yS21BEe1cjFb2pV35mSpCgy224EeUC422Sjh9Eyu8G26mi4UbUgCAxJ0Lx16ee2e3CUmabxyl5K3-bxmeye2W2GUdF9oCiexjzEtyi7h0agWmeypA3Gqm70ix6fiDxq48713O0gixq2aaCxK4Uy3W0G829wFwJyE2gxa6E4KjwmE7a3-1PxS4E1i4UpWy44A5KKUoypUdoS3B0QweG2i0Ak0gS228wyz8dEO5ohyU8U7y0gm4V8fE4m0E43y5825yUlwHwno4u5K0gOU3bwpXG9CwzDzQ1XxWt0_CgapohwHwjEladwAwWx2ewqo469w8J0',
  __hblp: '0Xg2zzpEnwVxKmq8gV165FE9kcwiU5Gbxi3GiuEaooxkwOVk4KvhoCawCCyVGwCgOdzrAzUPGl6yAvx3gS5az_gB4FGaAhGVVAVRiUSm8y6uE8oixa4ui4p8oGdB-q9GUuxiimcxmnCyeaV8Wmholxyex64-i_DACDJ3GDBgoZ29QAiE4SeUyqFrACwSCBy8fEG8Uyu5k4aGE4d2qxe4V8iwHx68wyyeq1pwbW0KU8XBw5TwoUW0NUC4Gwg8fE2Jxq1lwDxm1gwDobpEW1Bwto5m1tO0hUpS0FEy5UaUO2Gbz8lx6uVXxu1UwkEb829zUjwLwho5a8wh43y58f84ybxm2K2O323V1W2i261MCwkU3bwAgd83hwIBgaEkxy68KagS748wHwECaFHx64EeHDAwCyE4q2K5prxrxm2i4HK741cw',
  __sjsp: 'go4b0D84oatML4NsYYnP9OmB5O6KwDW5YKV2Tedd8gh95s8MPtIbNDtNO2qM9iIwI49ch8hwwowuxoj4WiMCugNlJzQ0wEfEeV87S0nG',
  __comet_req: '7',
  fb_dtsg: 'NAftFxvN_zZEynXGKbTvIzKFlY-43Xs9iJbjp8d4Rniup1bBmxCz5XA:17864721031021537:1767187743',
  jazoest: '26420',
  __spin_r: '1033485073',
  __spin_b: 'trunk',
  __spin_t: '1771057706',
  __crn: 'comet.igweb.PolarisProfilePostsTabRoute',
  fb_api_caller_class: 'RelayModern',
  fb_api_req_friendly_name: 'PolarisProfilePostsTabContentQuery_connection',
  server_timestamps: 'true',
  doc_id: '26035927152742158',
};

// Helper to build the variables JSON (you can modify 'after' cursor dynamically)
function buildVariables(afterCursor = '3628644037991301235_66807133398') {
  return JSON.stringify({
    after: afterCursor,
    before: null,
    data: {
      count: 12,
      include_reel_media_seen_timestamp: true,
      include_relationship_info: true,
      latest_besties_reel_media: true,
      latest_reel_media: true,
    },
    first: 12,
    last: null,
    username: '_chisty_57',
  });
}

// GET endpoint
app.get('/api/instagram-posts', async (req, res) => {
  // 1. API key check
  const apiKey = req.query.api_key;
  if (!apiKey || apiKey !== VALID_API_KEY) {
    return res.status(401).json({ error: 'Invalid or missing API key' });
  }

  // 2. Prepare the POST body (URL-encoded)
  const bodyParams = new URLSearchParams({
    ...STATIC_PARAMS,
    lsd: INSTAGRAM_LSD,
    variables: buildVariables(req.query.after), // allow 'after' cursor as query param
  });

  // 3. Make the request to Instagram
  try {
    const response = await fetch(INSTAGRAM_GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'accept': '*/*',
        'accept-language': 'en-US,en;q=0.9',
        'content-type': 'application/x-www-form-urlencoded',
        'cookie': INSTAGRAM_COOKIES,
        'origin': 'https://www.instagram.com',
        'referer': 'https://www.instagram.com/_chisty_57/',
        'sec-ch-prefers-color-scheme': 'light',
        'sec-ch-ua': '"Not(A:Brand";v="8", "Chromium";v="144", "Google Chrome";v="144"',
        'sec-ch-ua-full-version-list': '"Not(A:Brand";v="8.0.0.0", "Chromium";v="144.0.7559.135", "Google Chrome";v="144.0.7559.135"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-model': '""',
        'sec-ch-ua-platform': '"Windows"',
        'sec-ch-ua-platform-version': '"10.0.0"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36',
        'x-asbd-id': '359341',
        'x-bloks-version-id': '549e3ff69ef67a13c41791a62b2c14e2a0979de8af853baac859e53cd47312a8',
        'x-csrftoken': INSTAGRAM_CSRFTOKEN,
        'x-fb-friendly-name': 'PolarisProfilePostsTabContentQuery_connection',
        'x-fb-lsd': INSTAGRAM_LSD,
        'x-ig-app-id': '936619743392459',
        'x-root-field-name': 'xdt_api__v1__feed__user_timeline_graphql_connection',
      },
      body: bodyParams.toString(),
    });

    if (!response.ok) {
      throw new Error(`Instagram API responded with status ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Instagram request failed:', error);
    res.status(500).json({ error: 'Failed to fetch Instagram data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
