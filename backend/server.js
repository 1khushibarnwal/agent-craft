import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import chatRouter from "./routes/chat.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/chat", chatRouter);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
