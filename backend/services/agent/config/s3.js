import { S3Client } from "@aws-sdk/client-s3";

const s3Config = {
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID?.trim(),
    secretAccessKey: process.env.AWS_SECRET_KEY?.trim(),
  },
};

if (
  process.env.AWS_SESSION_TOKEN &&
  process.env.AWS_SESSION_TOKEN.trim() &&
  !process.env.AWS_SESSION_TOKEN.includes("////") &&
  !process.env.AWS_ACCESS_KEY_ID?.startsWith("AKIA")
) {
  s3Config.credentials.sessionToken = process.env.AWS_SESSION_TOKEN.trim();
}

export const s3 = new S3Client(s3Config);
