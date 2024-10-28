import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";

import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
console.log(__dirname);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + "/../uploads");
  },
  filename: function (req, file, cb) {
    const filename =
      file.fieldname + "-" + uuidv4() + path.extname(file.originalname);

    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

export default upload;
