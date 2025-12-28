const multer = require("multer");
const multerS3 = require("multer-s3");
const s3 = require("../config/s3");

const uploadToS3 = (folder) =>
  multer({
    storage: multerS3({
      s3: s3,
      bucket: process.env.AWS_S3_BUCKET,
      key: (req, file, cb) => {
        const fileName = `${folder}/${Date.now()}-${file.originalname}`;
        cb(null, fileName);
      }
    })
  });

module.exports = uploadToS3;
