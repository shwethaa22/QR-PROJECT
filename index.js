import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import qr from "qr-image";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index", { qrGenerated: false });
});

app.post("/generate", (req, res) => {
  const url = req.body.url;
  const qrSvg = qr.imageSync(url, { type: "png" });

  fs.writeFileSync(path.join(__dirname, "public", "qr_img.png"), qrSvg);
  fs.writeFile("URL.txt", url, (err) => {
    if (err) throw err;
  });

  res.render("index", { qrGenerated: true, url });
});

app.get("/download", (req, res) => {
  const filePath = path.join(__dirname, "public", "qr_img.png");
res.download(filePath, "qr_img.png");

});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
