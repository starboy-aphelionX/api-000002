const express = require("express");
const axios = require("axios");

const app = express();

app.get("/generate", async (req, res) => {
  try {
    // GET method e body use hoy na, tai query theke nite hobe
    const prompt = req.query.prompt;

    if (!prompt) {
      return res.status(400).json({
        status: false,
        message: "Please provide prompt as query parameter"
      });
    }

    const response = await axios.post(
      "https://notegpt.io/api/v2/images/start",
      {
        image_urls: [],
        type: 60,
        user_prompt: prompt,
        aspect_ratio: "match_input_image",
        num: 1,
        model: "",
        sub_type: 3,
        upscale: 2,
        resolution: "2k",
        sign: "PUT_REAL_SIGN_HERE",
        t: Math.floor(Date.now() / 1000)
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Origin": "https://notegpt.io",
          "Referer": "https://notegpt.io/ai-image-generator",
          "User-Agent": "Mozilla/5.0"
        }
      }
    );

    res.json({
      status: true,
      data: response.data
    });

  } catch (error) {
    res.status(500).json({
      status: false,
      error: error.response?.data || error.message
    });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
