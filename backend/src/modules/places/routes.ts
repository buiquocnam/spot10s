import { Router } from "express";
import { placesHandler } from "./handlers";

const router = Router();

router.get("/", placesHandler.getAll);
router.get("/nearby", placesHandler.getNearby);
router.get("/:id", placesHandler.getById);
router.post("/contribute", placesHandler.contribute);

export default router;
