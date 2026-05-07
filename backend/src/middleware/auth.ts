import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.admin_token;

  if (!token) {
    return res.status(401).json({ error: "Chưa đăng nhập" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    (req as any).admin = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Phiên đăng nhập không hợp lệ" });
  }
};
