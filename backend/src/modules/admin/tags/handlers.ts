import { Request, Response } from "express";
import { tagsAdminService } from "./services";
import { sendResponse } from "../../../utils/response";

export const tagsHandlers = {
  getTags: async (req: Request, res: Response) => {
    try {
      const allTags = await tagsAdminService.getTags();
      sendResponse.success(res, allTags);
    } catch (error) {
      sendResponse.error(res, "Lỗi khi lấy danh sách tags");
    }
  },

  createTag: async (req: Request, res: Response) => {
    try {
      const { name } = req.body;
      if (!name) return sendResponse.error(res, "Thiếu tên tag", null, 400);
      const newTag = await tagsAdminService.createTag(name);
      sendResponse.success(res, newTag, "Đã tạo tag mới");
    } catch (error) {
      sendResponse.error(res, "Lỗi khi tạo tag");
    }
  },

  deleteTag: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id || typeof id !== 'string') {
        return sendResponse.error(res, "Thiếu ID tag", null, 400);
      }
      await tagsAdminService.deleteTag(id);
      sendResponse.success(res, null, "Đã xóa tag");
    } catch (error) {
      sendResponse.error(res, "Lỗi khi xóa tag");
    }
  }
};
