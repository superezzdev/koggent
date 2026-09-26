import { cert, initializeApp, getApps } from "firebase-admin/app";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getServiceAccount() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      const raw = process.env.FIREBASE_SERVICE_ACCOUNT.trim();
      const jsonStr = raw.startsWith("{")
        ? raw
        : Buffer.from(raw, "base64").toString("utf-8");
      return JSON.parse(jsonStr);
    } catch (err) {
      console.error(
        "Failed to parse FIREBASE_SERVICE_ACCOUNT environment variable:",
        err.message,
      );
    }
  }

  if (process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    return {
      projectId: process.env.FIREBASE_PROJECT_ID || "koggent-cd5cc",
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    };
  }

  const keyPath = path.resolve(__dirname, "../serviceAccountKey.json");
  if (fs.existsSync(keyPath)) {
    try {
      return JSON.parse(fs.readFileSync(keyPath, "utf-8"));
    } catch (err) {
      console.error("Failed to read serviceAccountKey.json:", err.message);
    }
  }

  console.warn(
    "Warning: No Firebase credentials found in env or serviceAccountKey.json",
  );
  return null;
}

const serviceAccount = getServiceAccount();

export const app =
  getApps()[0] ||
  initializeApp(
    serviceAccount ? { credential: cert(serviceAccount) } : undefined,
  );

