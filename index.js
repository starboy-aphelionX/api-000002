const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/api/igsearch", async (req, res) => {
  const username = req.query.username;

  if (!username)
    return res.status(400).json({ status: false, message: "Username required" });

  try {
    const response = await axios.post(
      "https://www.instagram.com/graphql/query",
      new URLSearchParams({
        av: "17841478352036207",
        __user: "0",
        __a: "1",
        __req: "2n",
        __ccg: "GOOD",
        fb_api_caller_class: "RelayModern",
        fb_api_req_friendly_name: "PolarisSearchBoxRefetchableQuery",
        variables: JSON.stringify({
          data: {
            context: "blended",
            include_reel: "true",
            query: username,
            search_surface: "web_top_search"
          },
          hasQuery: true
        }),
        doc_id: "24146980661639222"
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": "Mozilla/5.0",
          "x-ig-app-id": "936619743392459"
        }
      }
    );

    const users =
      response.data?.data?.xdt_api__v1__fbsearch__topsearch_connection?.users ||
      [];

    if (!users.length)
      return res.json({ status: false, message: "User not found" });

    const user = users[0].user;

    res.json({
      status: true,
      name: user.full_name,
      username: user.username,
      profile_pic: user.profile_pic_url,
      link: `https://instagram.com/${user.username}`
    });

  } catch (error) {
    res.json({
      status: false,
      message: "Instagram blocked or token expired"
    });
  }
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
