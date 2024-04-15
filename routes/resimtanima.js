const express = require("express");
const router = express.Router();

const tf = require("@tensorflow/tfjs-node");
const mobilenet = require("@tensorflow-models/mobilenet");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Görüntü sınıflandırma endpoint'i
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const imageBuffer = req.file.buffer;

    const image = tf.node.decodeImage(imageBuffer, 3);

    const model = await mobilenet.load();

    const resizedImage = tf.image.resizeBilinear(image, [224, 224]);

    const predictions = await model.classify(resizedImage);

    res.json(predictions);
  } catch (error) {
    console.error("Sınıflandırma sırasında hata oluştu:", error);
    res.status(500).json({ error: "Sınıflandırma sırasında hata oluştu" });
  }
});

module.exports = router;
