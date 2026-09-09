import express from "express";

import dotenv from "dotenv";
import { connectDb } from "./config/db.js";

dotenv.config();

const port = process.env.PORT || 8001;

const app = express();

app.get("/", (req, res) => {
  res.json({ message: "hello from auth service" });
});

app.listen(port, () => {
  connectDb();
  console.log(`auth service started at ${port}`);
});
