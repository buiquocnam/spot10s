import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { db } from "./db/index";
import placesRoutes from "./modules/places/routes";
import adminRoutes from "./modules/admin/routes";
import morgan from "morgan";
import uploadRoutes from "./routes/upload";
import utilsRoutes from "./routes/utils";

const app = express();
const PORT = process.env.PORT || 8080;

console.log("🛠️ Hệ thống Logging (Morgan) đã sẵn sàng.");
app.use(morgan("dev"));

// Cấu hình CORS chặt chẽ cho Production và linh hoạt cho Dev
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/places", placesRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/utils", utilsRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || "development"
  });
});

// Xử lý lỗi toàn cục
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("🔥 Global Error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Lỗi hệ thống không xác định"
  });
});

app.listen(PORT, () => {
  console.log(`[${new Date().toLocaleTimeString()}] 🚀 Server đang chạy tại http://localhost:${PORT}`);
});

// Tránh crash app khi có lỗi async không được catch
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});
