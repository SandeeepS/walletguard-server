import dotenv from "dotenv";
dotenv.config();
import express from "express";
import http from "http";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import userRouter from "./routes/userRoutes";
const app = express();
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

const uri: string =
  process.env.MONGODB_URL || "mongodb://localhost:27017/your-app";

(async () => {
  try {
    await mongoose.connect(uri);
    console.log("Connected to the database");
  } catch (error) {
    console.error(error);
  }
})();

app.use("/api/user", userRouter);

app.get("/", (req, res) => {
  res.status(200).send("Server is running ");
});

server.listen(PORT, () => {
  console.log(`Server is running on PORT : ${PORT}`);
});
