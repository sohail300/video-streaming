import express from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import fs from "fs";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
console.log(__dirname);

app.get("/", (req, res) => {
  return res.send("Healthy Server");
});

app.get("/video", (req, res) => {
  const videoPath = path.join(__dirname, "/film.mkv");

  // Check if file exists
  if (!fs.existsSync(videoPath)) {
    console.error("Video file not found:", videoPath);
    return res.status(404).send("Video not found");
  }

  // Get video stats
  let videoStat;
  try {
    videoStat = fs.statSync(videoPath);
  } catch (err) {
    console.error("Error reading video stats:", err);
    return res.status(500).send("Error reading video");
  }

  const fileSize = videoStat.size;
  const range = req.headers.range;

  if (range) {
    try {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      // Validate range
      if (start >= fileSize || end >= fileSize) {
        console.error("Invalid range requested:", range);
        return res.status(416).send("Requested range not satisfiable");
      }

      const chunksize = end - start + 1;
      const stream = fs.createReadStream(videoPath, { start, end });

      const head = {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize,
        "Content-Type": "video/mp4",
      };

      res.writeHead(206, head);

      // Handle stream errors
      stream.on("error", (err) => {
        console.error("Stream error:", err);
        if (!res.headersSent) {
          res.status(500).send("Error streaming video");
        }
      });

      stream.pipe(res);

      // Log successful range request
      console.log(`Serving bytes ${start}-${end}/${fileSize}`);
    } catch (err) {
      console.error("Error handling range request:", err);
      res.status(500).send("Error processing video request");
    }
  } else {
    try {
      const head = {
        "Content-Length": fileSize,
        "Content-Type": "video/mp4",
      };

      res.writeHead(200, head);
      const stream = fs.createReadStream(videoPath);

      // Handle stream errors
      stream.on("error", (err) => {
        console.error("Stream error:", err);
        if (!res.headersSent) {
          res.status(500).send("Error streaming video");
        }
      });

      stream.pipe(res);

      // Log full file request
      console.log(`Serving full video file: ${fileSize} bytes`);
    } catch (err) {
      console.error("Error streaming full video:", err);
      res.status(500).send("Error streaming video");
    }
  }
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
