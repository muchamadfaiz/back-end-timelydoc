import express from "express";
import authController from "../controllers/auth.controller";
import scheduleController from "../controllers/schedule.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
const router = express.Router();

router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);
router.post("/schedules", authMiddleware, scheduleController.create);
router.get("/schedules", authMiddleware, scheduleController.findAll);

export default router;
