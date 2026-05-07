import { Request, Response } from "express";
import { placesService } from "./services";
import { z } from "zod";
import { sendResponse } from "../../utils/response";

const contributeSchema = z.object({
  name: z.string().min(2),
  lat: z.number(),
  lng: z.number(),
  address: z.string(),
  plusCode: z.string().optional(),
  tags: z.array(z.string()).default([]),
  priceRange: z.string().optional(),
  oneLiner: z.string().optional(),
  openHours: z.string().optional(),
  contributedBy: z.string().optional(),
  images: z.array(z.string()).optional(),
});

export const placesHandler = {
  getAll: async (req: Request, res: Response) => {
    try {
      const queryStatus = req.query.status;
      const status = typeof queryStatus === 'string' ? queryStatus : undefined;
      const places = await placesService.getAllPlaces(status);
      sendResponse.success(res, places);
    } catch (error) {
      console.error("Error in getAll:", error);
      sendResponse.error(res, "Lỗi khi lấy danh sách quán");
    }
  },

  getById: async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const lat = req.query.lat ? parseFloat(req.query.lat as string) : undefined;
      const lng = req.query.lng ? parseFloat(req.query.lng as string) : undefined;

      if (typeof id !== 'string' || !id) {
        return sendResponse.error(res, "ID quán không hợp lệ", null, 400);
      }
      
      const place = await placesService.getPlaceById(id, lat, lng);
      if (!place) return sendResponse.error(res, "Không tìm thấy quán", null, 404);
      sendResponse.success(res, place);
    } catch (error) {
      console.error("Error in getById:", error);
      sendResponse.error(res, "Lỗi khi lấy chi tiết quán");
    }
  },

  getNearby: async (req: Request, res: Response) => {
    try {
      const latStr = req.query.lat;
      const lngStr = req.query.lng;
      
      const lat = typeof latStr === 'string' ? parseFloat(latStr) : NaN;
      const lng = typeof lngStr === 'string' ? parseFloat(lngStr) : NaN;
      const category = typeof req.query.category === 'string' ? req.query.category : undefined;
      const search = typeof req.query.search === 'string' ? req.query.search : undefined;

      const radius = typeof req.query.radius === 'string' ? parseFloat(req.query.radius) : undefined;
      const minRating = typeof req.query.minRating === 'string' ? parseFloat(req.query.minRating) : undefined;

      if (isNaN(lat) || isNaN(lng)) {
        return sendResponse.error(res, "Thiếu tọa độ lat/lng hợp lệ", null, 400);
      }

      const places = await placesService.getNearbyPlaces(lat, lng, 20, category, search, radius, minRating);
      sendResponse.success(res, places);
    } catch (error) {
      console.error("Error in getNearby:", error);
      sendResponse.error(res, "Lỗi hệ thống khi lấy danh sách quán");
    }
  },

  contribute: async (req: Request, res: Response) => {
    try {
      const validatedData = contributeSchema.parse(req.body);
      const newPlace = await placesService.contributePlace(validatedData);
      sendResponse.success(res, newPlace[0], "Cảm ơn bạn đã đóng góp! Quán đang chờ duyệt.", 201);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return sendResponse.validationError(res, error.issues);
      }
      console.error("Error in contribute:", error);
      sendResponse.error(res, "Lỗi hệ thống khi gửi đóng góp");
    }
  }
};
