import { Response } from "express";
import { AuthRequest } from "../middleware";
import Task from "../models/task_model";
import { ITasks } from "../types";
import Category from "../models/category_model";

export const getAllTask = async (request: AuthRequest, response: Response) => {
  try {
    const userId = request.user;
    if (!userId) {
      return response
        .status(400)
        .send({ message: "User Id is required in the request body" });
    }
    const tasks = await Task.find({ user: userId });
    response.status(200).send({ message: "Available tasks list", tasks });
  } catch (error) {
    response.status(500).send({ message: "Oops something went wrong", error });
  }
};

export const createTask = async (request: AuthRequest, response: Response) => {
  try {
    const userId = request.user;
    const { name, categoryId, date }: ITasks = request.body;
    if (!categoryId) {
      return response
        .status(400)
        .send({ message: "categoryId is required in the request body" });
    }
    const category = await Category.findById(categoryId);

    if (!category) {
      return response.status(404).send({ message: "Category not found" });
    }
    const task = await Task.create({
      name,
      categoryId: category._id,
      date,
      user: userId,
    });
    response.status(201).send({ message: "Task created successfully", task });
  } catch (error) {
    response
      .status(500)
      .send({ message: "Error occurred while creating task", error });
  }
};

export const toggleTaskStatus = async (
  request: AuthRequest,
  response: Response
) => {
  try {
    const { isCompleted } = request.body;
    const { id } = request.params;

    const task = await Task.updateOne(
      { _id: id },
      { isCompleted: isCompleted }
    );
    response
      .status(200)
      .send({ message: "Task status has been updated successfully", task });
  } catch (error) {
    response
      .status(500)
      .send({ message: "Oops! Error occurred while updating the Status" });
  }
};

export const getAllTaskByCategory = async (
  request: AuthRequest,
  response: Response
) => {
  try {
    const userId = request.user;
    const { id } = request.params;
    const tasks = await Task.find({
      user: userId,
      categoryId: id,
    });
    if (tasks.length === 0) {
      return response
        .status(404)
        .send({ message: "No tasks found for the given category" });
    }
    response.status(200).send(tasks);
  } catch (error) {
    response.status(500).send({
      message: "Task could not found or Category is not found",
      error,
    });
  }
};

export const getAllCompletedTask = async (
  request: AuthRequest,
  response: Response
) => {
  try {
    const userId = request.user;
    const tasks = await Task.find({
      user: userId,
      isCompleted: true,
    });

    if (!tasks) {
      response
        .status(400)
        .send({ message: "Task could not found and can not be Completed" });
    }
    response
      .status(200)
      .send({ message: "List of all Completed Tasks", tasks });
  } catch (error) {
    response.status(500).send({
      message: "Completed task could not be updated please try again.",
    });
  }
};

export const getTodayTasks = async (
  request: AuthRequest,
  response: Response
) => {
  try {
    const userId = request.user;
    const todayISODate = new Date();
    todayISODate.setHours(0, 0, 0, 0);

    const todayTasks = await Task.find({
      user: userId,
      date: todayISODate.toISOString(),
    });

    response
      .status(200)
      .send({ message: "List of all Today Tasks", todayTasks });
  } catch (error) {
    response
      .status(500)
      .send({ message: "Error occurred while fetching Today Tasks" });
  }
};

export const editTask = async (request: AuthRequest, response: Response) => {
  try {
    const { name, categoryId, date }: ITasks = request.body;
    const _id = request.params.id;
    const task = await Task.findByIdAndUpdate(
      { _id },
      {
        name,
        categoryId,
        date,
      }
    );
    response.status(200).send({ message: "Task updated successfully", task });
  } catch (error) {
    response
      .status(500)
      .send({ message: "Error occurred while updating the Task.", error });
  }
};

export const deleteTask = async (request: AuthRequest, response: Response) => {
  try {
    const { id } = request.params;
    await Task.deleteOne({
      _id: id,
    });
    response.send({ message: "Task deleted successfully" });
  } catch (error) {
    console.log("error in deleteTask", error);
    response.status(500).send({ error: "Internal Server Error" });
    throw error;
  }
};
