import dotenv from "dotenv";
dotenv.config();
import express from "express";
import http from "http";
import cookieParser from "cookie-parser";
const app = express();
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.status(200).send("Server is running ");
});

server.listen(PORT, () => {
  console.log(`Server is running on PORT : ${PORT}`);
});
