import { Request, Response } from "express";
import { authService } from "./services";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendResponse } from "../../../utils/response";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";

export const authHandlers = {
  login: async (req: Request, res: Response) => {
    try {
      const { identifier, password } = req.body;

      if (!identifier || !password) {
        return sendResponse.error(res, "Vui lòng nhập tài khoản/email và mật khẩu", null, 400);
      }

      const admin = await authService.getAdminByIdentifier(identifier);
      if (!admin) {
        return sendResponse.unauthorized(res, "Tài khoản hoặc mật khẩu không đúng");
      }

      const isMatch = await bcrypt.compare(password, admin.passwordHash);
      if (!isMatch) {
        return sendResponse.unauthorized(res, "Tài khoản hoặc mật khẩu không đúng");
      }

      const token = jwt.sign({ id: admin.id, username: admin.username }, JWT_SECRET, {
        expiresIn: "24h",
      });

      res.cookie("admin_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000,
      });

      sendResponse.success(res, { username: admin.username }, "Đăng nhập thành công");
    } catch (error) {
      console.error("Login error:", error);
      sendResponse.error(res, "Lỗi hệ thống khi đăng nhập");
    }
  },

  logout: (req: Request, res: Response) => {
    res.clearCookie("admin_token");
    sendResponse.success(res, null, "Đã đăng xuất");
  },

  checkAuth: (req: Request, res: Response) => {
    sendResponse.success(res, (req as any).admin);
  },
};
