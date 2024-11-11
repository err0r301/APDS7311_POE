import dotenv from "dotenv";
import https from "https";
import fs from "fs";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import auth from "./routes/authRoutes.js";
import payment from "./routes/paymentRoutes.js";

dotenv.config();

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// Middleware to parse JSON request bodies
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.ATLAS_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Define routes
app.use("/api/auth", auth);
app.use("/api/payment", payment);

const privateKey = fs.readFileSync("keys/privatekey.pem", "utf8");
const certificate = fs.readFileSync("keys/certificate.pem", "utf8");

const credentials = {
  key: privateKey,
  cert: certificate,
};

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(process.env.PORT, () => {
  console.log(`HTTPS Server running on port ${process.env.PORT}`);
});
