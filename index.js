const express = require("express");
const axios = require("axios");

const app = express();
const PORT = 3000;

app.get("/api/ig", async (req, res) => {
  const username = req.query.username;

  if (!username) {
    return res.status(400).json({
      status: false,
      message: "Username is required"
    });
  }

  try {
    const url = `https://www.instagram.com/${username}/?__a=1&__d=dis`;

    const response = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    const user = response.data.graphql.user;

    res.json({
      status: true,
      name: user.full_name,
      username: user.username,
      bio: user.biography,
      followers: user.edge_followed_by.count,
      following: user.edge_follow.count,
      posts: user.edge_owner_to_timeline_media.count,
      profile_pic: user.profile_pic_url_hd,
      link: `https://instagram.com/${user.username}`
    });

  } catch (err) {
    res.status(500).json({
      status: false,
      message: "User not found or Instagram blocked request"
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
