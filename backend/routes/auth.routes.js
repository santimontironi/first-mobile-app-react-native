import { Router } from "express";
import authController from "../controllers/auth.controller.js";
import { verifyAuth } from "../middlewares/verify-auth.js";

const router = Router();

router.post("/register", authController.registerUser);
router.post("/confirm/:token", authController.confirmUser);
router.post("/login", authController.loginUser);
router.get("/dashboard", verifyAuth, authController.dashboardUser);

export default router;