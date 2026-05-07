import { Response } from "express";

export const sendResponse = {
  success: (res: Response, data: any, message = "Thành công", status = 200) => {
    return res.status(status).json({
      success: true,
      message,
      data,
    });
  },

  error: (res: Response, error: string, details: any = null, status = 500) => {
    return res.status(status).json({
      success: false,
      error,
      details,
    });
  },

  validationError: (res: Response, details: any) => {
    return res.status(400).json({
      success: false,
      error: "Dữ liệu không hợp lệ",
      details,
    });
  },

  unauthorized: (res: Response, message = "Chưa đăng nhập hoặc không có quyền") => {
    return res.status(401).json({
      success: false,
      error: message,
    });
  }
};
