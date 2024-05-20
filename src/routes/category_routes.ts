import express from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
  getCategoryById,
} from "../controller/category_controller";
import { authenticationMiddleware } from "../middleware";

const categoryRoutes = express.Router();

categoryRoutes.use(authenticationMiddleware);
categoryRoutes.route("/").get(getAllCategories);
categoryRoutes.route("/:id").get(getCategoryById);
categoryRoutes.route("/create").post(createCategory);
categoryRoutes.route("/category/:id").delete(deleteCategory);
categoryRoutes.route("/category/update").put(updateCategory);

export default categoryRoutes;
