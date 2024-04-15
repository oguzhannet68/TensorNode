const express = require("express");
const router = express.Router();

const { Translate } = require("@google-cloud/translate").v2;

// Google Translate API anahtarı oluşturun
const dotenv = require("dotenv");
dotenv.config();
const translate = new Translate({
  key: process.env.GOOGLE_TRANSLATE_API,
});

// Çeviri endpoint'i
router.post("/", async (req, res) => {
  try {
    const target = "tr";
    const { text } = req.body;

    const [translation] = await translate.translate(text, target);

    res.json({ translation });
  } catch (error) {
    console.error("Çeviri sırasında hata oluştu:", error);
    res.status(500).json({ error: "Çeviri sırasında hata oluştu" });
  }
});

module.exports = router;
