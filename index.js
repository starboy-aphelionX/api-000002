const express = require("express");
const axios = require("axios");

const app = express();
const PORT = 3000;

// Common headers (Cloudflare protected site)
const headers = {
  "accept": "*/*",
  "accept-language": "en-US,en;q=0.9",
  "content-type": "application/json",
  "origin": "https://embed.dlsrv.online",
  "referer": "https://embed.dlsrv.online/v1/search?query=starboy",
  "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36",
  "cookie": "__cf_bm=YOUR_COOKIE; cf_clearance=YOUR_COOKIE"
};

// 🔎 Search API (GET)
app.get("/search", async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ error: "Missing search query" });
    }

    const response = await axios.post(
      "https://embed.dlsrv.online/api/search",
      { query },
      { headers }
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      error: "Search failed",
      message: error.message
    });
  }
});

// ⬇️ Download API (GET)
app.get("/download", async (req, res) => {
  try {
    const { videoId, quality } = req.query;

    if (!videoId) {
      return res.status(400).json({ error: "Missing videoId" });
    }

    const response = await axios.post(
      "https://embed.dlsrv.online/api/download/mp3",
      {
        videoId,
        format: "mp3",
        quality: quality || "320"
      },
      { headers }
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      error: "Download failed",
      message: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
