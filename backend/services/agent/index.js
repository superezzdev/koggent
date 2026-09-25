import "dotenv/config";
import express from "express";
import connectDb from "./config/db.js";
import router from "./routes/agent.route.js";

const port = process.env.PORT || 8003;

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use("/", router);

app.get("/", (req, res) => {
  res.json({ message: "hello from agent" });
});

app.use((err, req, res, next) => {
  console.error("agent service error:", err.message);
  const status = err.status || 500;
  res.status(status).json({
    message: err.data?.message || err.message || "An error occurred in agent service",
    ...(err.data || {}),
  });
});

app.listen(port, () => {
  console.log(`agent started at ${port}`);
  connectDb();
});
