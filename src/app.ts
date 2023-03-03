import express, { Response, Request, NextFunction } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import { ConnectOptions, connect } from "mongoose";
import { json, urlencoded } from "body-parser";
import { authRouter } from "./routes";

dotenv.config();

const app = express();

// Connect to MongoDB
connect(process.env.MONGODB_URI || "mongodb://localhost:27017/mydb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as ConnectOptions);

// Middleware
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
app.use("/auth", authRouter);
// app.use("/users", userRouter);
// app.use("/bosses", bossRouter);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

export default app;
