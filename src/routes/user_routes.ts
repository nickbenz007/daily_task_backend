import express from "express";
import {createUser,loginUser, getUsers} from "../controller/user_controller";

const userRoutes = express.Router();

userRoutes.route("/create").post(createUser);
userRoutes.route("/login").post(loginUser);
userRoutes.route("/get").get(getUsers);

export default userRoutes;
