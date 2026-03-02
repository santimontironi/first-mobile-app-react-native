import tasksController from "../controllers/tasks.controller.js";
import { verifyAuth } from "../middlewares/verify-auth.js";
import { Router } from "express";

const router = Router();

router.post("/new-task", verifyAuth, tasksController.createTask);
router.patch("/tasks/:id", verifyAuth, tasksController.completeTask);
router.get("/tasks", verifyAuth, tasksController.getTasks);
router.get("/tasks/completed", verifyAuth, tasksController.getCompletedTasks);
router.get("/tasks/:id", verifyAuth, tasksController.taskById);
router.delete("/tasks/:id", verifyAuth, tasksController.deleteTask);

export default router;