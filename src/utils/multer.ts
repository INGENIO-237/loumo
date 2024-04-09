import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./tmp");
  },

  filename: function (req, file, cb) {
    const suffix = Date.now() + Math.floor(Math.random() * 1e9);
    const splitted = file.originalname.split(".");
    const ext = splitted[splitted.length - 1];

    cb(null, file.fieldname + "-" + suffix + "." + ext);
  },
});

const upload = multer({ storage });

export default upload;
