import { Request, Response } from "express";
import User from "../models/user_model";
import bcrypt from "bcrypt";
import { IUser } from "../types";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../middleware";

export const createUser = async (request: Request, response: Response) => {
  try {
    const { name, email, password } = request.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return response.status(409).send("User already exists");
    }

    if (!password || typeof password !== "string") {
      return response.status(400).send("Invalid password please try again");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: user._id, email, name },
      process.env.USER_TOKEN,
      { expiresIn: "7d" }
    );
    return response
      .status(201)
      .send({ message: "User has been created successfully", user, token });
  } catch (error) {
    return response.status(500).send("Error occurred while creating the user");
  }
};

export const loginUser = async (request: Request, response: Response) => {
  try {
    const { email, password }: IUser = request.body;
    const existingUser: IUser | null = await User.findOne({ email });
    if (!existingUser) {
      return response.status(409).send({ message: "User does not exist" });
    }
    const isPasswordIdentical = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordIdentical) {
      return response
        .status(401)
        .send({ message: "Incorrect password please try again" });
    }

    const token = jwt.sign(
      {
        id: existingUser._id,
        email: existingUser.email,
        name: existingUser.name,
      },
      process.env.USER_TOKEN,
      { expiresIn: "7d" }
    );
    return response.send({
      message: "Login successful",
      name: existingUser.name,
      email: existingUser.email,
      token,
    });
  } catch (error) {
    return response.status(500).send("Error while logging in");
  }
};

export const getUsers = async (request: AuthRequest, response: Response) => {
  try {
    const { userId } = request.body;
    const getUser = await User.find({ userId });
    response.status(200).send({ message: "Available users list", getUser });
  } catch (error) {
    response.status(500).send({ message: "User not found", error });
  }
};
