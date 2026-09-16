import "dotenv/config";
import express from "express";
import connectDb from "./config/db.js";
import router from "./routes/agent.route.js";

const port = process.env.PORT || 8003;

const app = express();
app.use(express.json());
app.use("/", router);


app.get("/", (req, res) => {
  res.json({ message: "hello from agent" });
});

app.listen(port, () => {
  console.log(`agent started at ${port}`);
  connectDb();
});
