import express from "express";
import connectToDb from "./db";
import dotenv from "dotenv";
import colors from "colors";
import { Request, Response } from "express";
import userRoutes from "./routes/user_routes";
import categoryRoutes from "./routes/category_routes";
import taskRoutes from "./routes/task_routes";
import cors from "cors";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = process.env.PORT || 5001;

connectToDb();

app.get("/ping", (request: Request, response: Response) => {
  response.send("pong");
});

app.use("/users", userRoutes);
app.use("/categories", categoryRoutes);
app.use("/tasks", taskRoutes);

app.listen(port, () => {
  console.log(colors.bgMagenta(`Server is listening to PORT: ${port}`));
});
