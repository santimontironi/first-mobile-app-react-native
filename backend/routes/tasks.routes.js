import tasksController from "../controllers/tasks.controller.js";
import { Router } from "express";

const router = Router();

router.post("/new-task", tasksController.createTask);
router.get("/tasks", tasksController.getTasks);
router.get("/tasks/completed", tasksController.getCompletedTasks);
router.get("/tasks/:id", tasksController.taskById);
router.delete("/tasks/:id", tasksController.deleteTask);

export default router;