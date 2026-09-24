import express from "express";
import dotenv from "dotenv";
import proxy from "express-http-proxy";
dotenv.config();
import cors from "cors";
import cookieParser from "cookie-parser";
import { proxyWithHeader } from "./utils/proxyWithHeader.js";
import morgan from "morgan";
import { getCurrentUser } from "./controllers/user.controller.js";
import protect from "./middleware/auth.middleware.js";

const port = process.env.PORT || 8000;

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(morgan("dev"));

app.use(cookieParser());
app.use(
  "/api/auth",
  proxy(process.env.AUTH_SERVICE, { limit: "50mb", parseReqBody: false }),
);
app.use("/api/chat", protect, proxyWithHeader(process.env.CHAT_SERVICE));
app.use("/api/agent", protect, proxyWithHeader(process.env.AGENT_SERVICE));
app.use("/api/billing", protect, proxyWithHeader(process.env.BILLING_SERVICE));
app.get("/api/me", protect, getCurrentUser);

app.get("/", (req, res) => {
  res.json({ message: "hello from gateway" });
});

app.use((err, req, res, next) => {
  console.error("gateway error:", err.message);
  const status = err.status || 500;
  res.status(status).json({ message: err.message || "Gateway error" });
});

app.listen(port, () => {
  console.log(`gateway started at ${port}`);
});