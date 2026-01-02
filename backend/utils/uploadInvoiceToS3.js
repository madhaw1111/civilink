const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION
});

module.exports = async function uploadInvoice(buffer) {
  const key = `invoices/invoice-${uuidv4()}.pdf`;

  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key,
    Body: buffer,
    ContentType: "application/pdf"
  };

  const result = await s3.upload(params).promise();
  return result.Location; // ✅ public/private URL
};
