"use client";

import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { DeleteOrder } from "@/lib/actions/userActions";

interface Order {
  id: string;
  company: string;
  withWho?: string; // Optional field
  status?: string; // Optional field
  date?: Date; // Optional field
  month?: string; // Optional field
  endDate?: Date | null; // Optional field
}

interface OrderDisplayerProps {
  order: Order; // Use the Prisma Order type
  onDelete: (id: string) => void; // Prop for parent to handle UI update
}

export default function OrderDisplayer({
  order,
  onDelete,
}: OrderDisplayerProps) {
  const [position, setPosition] = useState(order.status || "Pending");
  const [showDeleteModal, setShowDeleteModal] = useState(false); // State to control modal visibility
  const [isDeleting, setIsDeleting] = useState(false); // Track delete state

  // Safely format the date field with a fallback
  const formattedDate = order.date
    ? new Date(order.date).toLocaleDateString("en-GB", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      })
    : "No date available"; // Fallback message if date is undefined

  // Handle the modify button click
  const handleModify = async (id: string) => {
    console.log(id, position);
    // Add your modify logic here
  };

  // Handle delete logic
  const handleDelete = async (id: string) => {
    setIsDeleting(true); // Start delete state
    const result = await DeleteOrder(id); // Call delete API

    if (result.success) {
      console.log(`Order with id ${id} deleted.`);
      onDelete(id); // Call the parent callback to update UI
    } else {
      console.error(`Failed to delete order with id ${id}`);
    }

    setIsDeleting(false); // Reset delete state
    setShowDeleteModal(false); // Close modal after delete
  };

  return (
    <div className="flex justify-center flex-col gap-y-4 w-full md:w-[300px] p-4 text-gray-700">
      <p className="capitalize text-red-900 font-bold">
        Order Name: {order.company}
      </p>
      <p className="capitalize text-red-900 font-bold">
        With Who: {order.withWho || "N/A"}
      </p>
      {/* Fallback for withWho */}
      <p className="capitalize">Date: {formattedDate}</p>
      <p className="capitalize">Month: {order.month || "N/A"}</p>
      {/* Fallback for month */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="text-blue-600 border-blue-600">
            {position}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
            <DropdownMenuRadioItem value="Pending">
              Pending
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="Done">Done</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <div className="flex justify-between gap-x-2">
        <Button
          onClick={() => handleModify(order.id)}
          className="w-full bg-blue-600 text-white hover:bg-blue-700"
        >
          Modify
        </Button>
        <Button
          onClick={() => setShowDeleteModal(true)} // Open delete confirmation modal
          variant="destructive"
          className="w-full bg-red-600 text-white hover:bg-red-700"
        >
          Delete
        </Button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Are you sure you want to delete this order?
            </h2>
            <p className="text-gray-600 mb-6">
              This action cannot be undone. You are about to delete the order:{" "}
              <strong>{order.company}</strong>.
            </p>
            <div className="flex justify-end gap-4">
              <Button
                className="bg-gray-300 text-gray-700 hover:bg-gray-400"
                onClick={() => setShowDeleteModal(false)} // Close modal on cancel
              >
                Cancel
              </Button>
              <Button
                className="bg-red-600 text-white hover:bg-red-700"
                onClick={() => handleDelete(order.id)} // Proceed with delete
                disabled={isDeleting} // Disable button while deleting
              >
                {isDeleting ? "Deleting..." : "Confirm Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
