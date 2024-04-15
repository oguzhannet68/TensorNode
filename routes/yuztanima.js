const express = require("express");
const router = express.Router();
const sharp = require("sharp");
const faceapi = require("face-api.js");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Yüz tanıma modelinin yüklenmesi
async function loadFaceRecognitionModel() {
  await faceapi.nets.tinyFaceDetector.loadFromDisk("./models");
  await faceapi.nets.faceLandmark68Net.loadFromDisk("./models");
  await faceapi.nets.faceRecognitionNet.loadFromDisk("./models");
}

// Yüz tanıma işleminin gerçekleştirilmesi
router.post("/", upload.single("image"), async (req, res) => {
  try {
    // Resmin yüklenmesi
    const imageBuffer = req.file.buffer;
    const image = await sharp(imageBuffer).toBuffer(); // Resmi boyutlandırma veya dönüştürme gerekirse sharp ile işlenebilir

    // Yüz tanıma modelinin yüklenmesi
    await loadFaceRecognitionModel();

    // Yüzlerin tespiti
    const detections = await faceapi
      .detectAllFaces(image)
      .withFaceLandmarks()
      .withFaceDescriptors();

    // Sonuçların işlenmesi
    const results = detections.map((detection) => {
      return {
        box: detection.detection.box,
        landmarks: detection.landmarks,
        descriptor: detection.descriptor,
      };
    });

    // Sonuçların gönderilmesi
    res.json(results);
  } catch (error) {
    console.error("Yüz tanıma sırasında hata oluştu:", error);
    res.status(500).json({ error: "Yüz tanıma sırasında hata oluştu" });
  }
});

module.exports = router;
