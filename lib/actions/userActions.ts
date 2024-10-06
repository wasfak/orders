"use server";

import { revalidatePath } from "next/cache";

import prisma from "../db/prisma";
import { Order } from "@prisma/client";

type CreateUserInput = {
  clerkId: string;
  email: string;
  username: string;
  photo: string;
  firstName?: string;
  lastName?: string;
};
// CREATE
export async function createUser(user: CreateUserInput) {
  try {
    // Check if a user already exists with the given email
    const existingUser = await prisma.user.findUnique({
      where: {
        email: user.email,
      },
    });

    if (existingUser) {
      // User already exists, handle accordingly
      // For example, you can return a message or throw an error
      throw new Error("A user with this email already exists.");
    }

    // If no user exists, create a new user
    const newUser = await prisma.user.create({ data: user });

    // Optionally, return the new user after stripping Prisma metadata
    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    console.log(error);
  }
}

// READ
export async function getUserById(userId: string) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        clerkId: userId,
      },
    });

    if (!user) throw new Error("User not found");

    return JSON.parse(JSON.stringify(user));
  } catch (error) {}
}

declare type UpdateUserParams = {
  firstName: string;
  lastName: string;
  username: string;
  photo: string;
};

// UPDATE
export async function updateUser(clerkId: string, user: UpdateUserParams) {
  try {
    const updatedUser = await prisma.user.update({
      where: {
        clerkId: clerkId,
      },
      data: user,
    });
    if (!updatedUser) throw new Error("User update failed");

    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error) {}
}

// DELETE
export async function deleteUser(clerkId: string) {
  try {
    // Find user to delete
    const userToDelete = await prisma.user.findUnique({
      where: {
        clerkId: clerkId,
      },
    });

    if (!userToDelete) {
      throw new Error("User not found");
    }

    // Delete user
    const deletedUser = await prisma.user.delete({
      where: {
        clerkId: clerkId,
      },
    });
    revalidatePath("/");

    return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null;
  } catch (error) {}
}
interface OrderFace {
  company: string;
  withWho: string;
}

export async function addOrder(values: OrderFace) {
  try {
    const currentMonth = (new Date().getMonth() + 1).toString();
    const addOrdder = await prisma.order.create({
      data: {
        company: values.company,
        withWho: values.withWho,
        month: currentMonth,
        status: "pending",
      },
    });
    revalidatePath("/");
    return JSON.parse(JSON.stringify(addOrdder));
  } catch (error) {
    console.log(error);
  }
}

export async function GetOrders() {
  try {
    const currentMonth = (new Date().getMonth() + 1).toString();
    const orders = await prisma.order.findMany({
      where: {
        month: currentMonth,
      },
    });
    revalidatePath("/orders");
    return JSON.parse(JSON.stringify(orders));
  } catch (error) {
    console.log(error);
  }
}

export async function DeleteOrder(id: string) {
  try {
    // Delete the order with the provided id
    await prisma.order.delete({
      where: {
        id: id,
      },
    });

    // Revalidate the orders page to refresh the data after the delete
    revalidatePath("/orders");

    return { success: true }; // Indicate successful deletion
  } catch (error) {
    console.error("Error deleting order:", error);
    return { success: false }; // Handle the error case
  }
}
