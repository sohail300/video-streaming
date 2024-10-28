import express from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.get("/", (req, res) => {
  return res.send("Healthy Server");
});

app.get("/video", (req, res) => {
  console.log(__dirname);
  return res.sendFile(__dirname + "/film.mkv");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
