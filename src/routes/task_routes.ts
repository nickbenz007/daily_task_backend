import express from "express";
import {
  createTask,
  editTask,
  getAllCompletedTask,
  getAllTask,
  getAllTaskByCategory,
  getTodayTasks,
  toggleTaskStatus,
  deleteTask,
} from "../controller/task_controller";
import { authenticationMiddleware } from "../middleware";

const taskRoutes = express.Router();

taskRoutes.use(authenticationMiddleware);

taskRoutes.route("/").get(getAllTask);
taskRoutes.route("/create").post(createTask);
taskRoutes.route("/update/:id").put(toggleTaskStatus);
taskRoutes.route("/tasks-by-categories/:id").get(getAllTaskByCategory);
taskRoutes.route("/completed").get(getAllCompletedTask);
taskRoutes.route("/today-tasks").get(getTodayTasks);
taskRoutes.route("/edit-task/:id").put(editTask);
taskRoutes.route("/:id").delete(deleteTask);
export default taskRoutes;
