import Category from "../models/category_model";
import { Response } from "express";
import { ICategory } from "../types";
import { AuthRequest } from "../middleware";

export const getAllCategories = async (
  request: AuthRequest,
  response: Response
) => {
  try {
    const { user } = request;
    const categories = await Category.find({
      user: user,
    });
    return response.status(200).send({ categories });
  } catch (error) {
    return response.status(500).send({ message: "Category could not found" });
  }
};

export const createCategory = async (
  request: AuthRequest,
  response: Response
) => {
  try {
    const { name, color, icon, isEditable }: ICategory = request.body;
    const { user } = request;
    if (!color || !icon) {
      response.status(404).send({ message: "Color or Icon not found" });
    }
    const category = await Category.create({
      name,
      color,
      icon,
      isEditable,
      user: user,
    });
    return response
      .status(200)
      .send({ message: "Category created successfully", category });
  } catch (error) {
    console.log(error);
    return response
      .status(500)
      .send({ message: "Error occurred while creating Category", error });
  }
};

export const updateCategory = async (
  request: AuthRequest,
  response: Response
) => {
  try {
    const { _id, name, color, icon, isEditable }: ICategory = request.body;
    const updateFields: Partial<ICategory> = { name, color, icon, isEditable };
    const updatedCategory = await Category.findOneAndUpdate(
      { _id },
      { $set: updateFields },
      { new: true }
    );
    if (!updatedCategory) {
      return response
        .status(400)
        .send({ message: "Category not found and could not be updated" });
    }
    response.send({
      message: "Category updated successfully",
      updatedCategory,
    });
  } catch (error) {
    console.log(error);
    response.status(500).send({
      message: "Oops.! Something went wrong while updating the category",
    });
  }
};

export const getCategoryById = async (
  request: AuthRequest,
  response: Response
) => {
  try {
    const { id } = request.params;
    const category = await Category.findById(id);
    if (!category) {
      return response.status(404).json({ message: "Category not found" });
    }
    response.status(200).json(category);
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Internal server error" });
  }
};

export const deleteCategory = async (
  request: AuthRequest,
  response: Response
) => {
  try {
    const { id } = request.params;
    await Category.deleteMany({ _id: id });
    response.send({ message: "Category deleted successfully" });
  } catch (error) {
    console.log(error);
    response.status(500).send({ message: "Category could not deleted", error });
  }
};
