import dotenv from "dotenv";
dotenv.config();
import express from "express";
import http from "http";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import userRouter from "./routes/userRoutes";
import errorHandlerMiddleware from "./middlewares/errorHandler";
const app = express();
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

app.use(
  cors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean | string) => void
    ) => {
      const allowedOrigins = [
        "http://localhost:5173",
        "https://blog-base-lyart.vercel.app",
      ];

      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        callback(null, origin);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
    ],
    credentials: true,
    exposedHeaders: ["set-cookie"],
    optionsSuccessStatus: 200,
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());
app.use(errorHandlerMiddleware);


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
