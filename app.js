const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("Processing...");
});

// Görüntü sınıflandırma endpoint'i
const goruntuSınıflandırma = require("./routes/resimtanima");
app.use("/classify", goruntuSınıflandırma);

// Yüz Tanıma endpoint'i
const yuzTanima = require("./routes/yuztanima");
app.use("/face", yuzTanima);

// Sınıflandırma sonuçlarını çevirmek için işlev
async function translatePredictions(predictions) {
  const translatedPredictions = await Promise.all(
    predictions.map(async (prediction) => {
      const [translation] = await translate.translate(
        prediction.className,
        "tr"
      );
      return {
        className: translation,
        probability: prediction.probability,
      };
    })
  );
  return translatedPredictions;
}

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor`);
});
