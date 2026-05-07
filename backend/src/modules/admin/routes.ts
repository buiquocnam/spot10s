import { Router } from "express";
import { authHandlers } from "./auth/handlers";
import { placesHandlers } from "./places/handlers";
import { tagsHandlers } from "./tags/handlers";
import { authMiddleware } from "../../middleware/auth";

const router = Router();

// Xác thực
router.post("/login", authHandlers.login);
router.post("/logout", authHandlers.logout);
router.get("/me", authMiddleware, authHandlers.checkAuth);

// Quản lý quán
router.patch("/places/:id/approve", authMiddleware, placesHandlers.approvePlace);
router.post("/places", authMiddleware, placesHandlers.createPlace);
router.put("/places/:id", authMiddleware, placesHandlers.updatePlace);
router.delete("/places/:id", authMiddleware, placesHandlers.deletePlace);

// Quản lý Tags
router.get("/tags", authMiddleware, tagsHandlers.getTags);
router.post("/tags", authMiddleware, tagsHandlers.createTag);
router.delete("/tags/:id", authMiddleware, tagsHandlers.deleteTag);

export default router;
