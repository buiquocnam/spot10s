import { Request, Response } from "express";
import { placesAdminService } from "./services";
import { sendResponse } from "../../../utils/response";

export const placesHandlers = {
  approvePlace: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id || typeof id !== 'string') {
        return sendResponse.error(res, "Thiếu ID quán", null, 400);
      }
      await placesAdminService.approvePlace(id);
      sendResponse.success(res, null, "Đã duyệt quán");
    } catch (error) {
      console.error("Approve error:", error);
      sendResponse.error(res, "Lỗi khi duyệt quán");
    }
  },

  createPlace: async (req: Request, res: Response) => {
    try {
      const newPlace = await placesAdminService.createPlace(req.body);
      sendResponse.success(res, newPlace, "Đã thêm quán mới");
    } catch (error) {
      console.error("Create error:", error);
      sendResponse.error(res, "Lỗi khi thêm quán mới");
    }
  },

  updatePlace: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id || typeof id !== 'string') {
        return sendResponse.error(res, "Thiếu ID quán", null, 400);
      }
      const updatedPlace = await placesAdminService.updatePlace(id, req.body);
      sendResponse.success(res, updatedPlace, "Cập nhật quán thành công");
    } catch (error) {
      console.error("Update error:", error);
      sendResponse.error(res, "Lỗi khi cập nhật quán");
    }
  },

  deletePlace: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id || typeof id !== 'string') {
        return sendResponse.error(res, "Thiếu ID quán", null, 400);
      }
      await placesAdminService.deletePlace(id);
      sendResponse.success(res, null, "Đã xóa quán");
    } catch (error) {
      console.error("Delete error:", error);
      sendResponse.error(res, "Lỗi khi xóa quán");
    }
  },
};
