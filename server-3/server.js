import express from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";
import cors from "cors";
import upload from "./utils/multer.js";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import { exec } from "child_process";
import { stderr, stdout } from "process";
import path from "path";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(
  cors({
    origin: "http://localhost:5173", // Updated to Vite's default port
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const uploadsPath = path.join(__dirname, "uploads");
app.use("/uploads", express.static(uploadsPath));

app.get("/", (req, res) => {
  return res.send("Healthy Server");
});

app.post("/upload", upload.single("file"), (req, res) => {
  console.log(req.file);
  const videoPath = req.file.path;
  console.log("videoPath", videoPath);
  const lessonId = uuidv4();
  const outputPath = `uploads/courses/${lessonId}`;
  const hlsPath = `${outputPath}/index.m3u8`;
  console.log("hlsPath", hlsPath);

  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
  }

  // ffmpeg
  const ffmpegCommand = `ffmpeg -i ${videoPath} -codec:v libx264 -codec:a aac -hls_time 10 -hls_playlist_type vod -hls_segment_filename "${outputPath}/segment%03d.ts" -start_number 0 ${hlsPath}
  `;

  exec(ffmpegCommand, (error, stdout, stderr) => {
    if (error) {
      console.log("[ERROR] ", error);
    }

    console.log("[INFO] ", stdout);
    console.log("[ERROR] ", stderr);

    const videoUrl = `http://localhost:3002/uploads/courses/${lessonId}/index.m3u8`;

    return res.json({
      msg: "File Uploaded!",
      videoUrl,
      lessonId,
    });
  });
});

app.listen(3002, () => {
  console.log("Server is running on port 3002");
});
