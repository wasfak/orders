"use client";

import React, { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { GetMonthOrder } from "@/lib/actions/userActions";
import OrderDisplayer from "@/components/OrderDisplayer";

const months = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];

interface Order {
  id: string;
  company: string;
  withWho?: string;
  status?: string;
  date?: Date;
  month?: string;
  endDate?: Date | null;
}

export default function SearchPage() {
  const currentMonth = (new Date().getMonth() + 1).toString();
  const [position, setPosition] = useState(currentMonth); // Selected month
  const [loading, setLoading] = useState(false); // Track loading state
  const [orders, setOrders] = useState<Order[]>([]); // Store the orders
  const [errorMessage, setErrorMessage] = useState(""); // Track error messages

  // Fetch orders for the selected month
  const handleMonthSearch = async () => {
    setLoading(true); // Show loading spinner
    const result = await GetMonthOrder(position); // Fetch orders
    setLoading(false); // Stop loading spinner

    if (!result || result.length === 0) {
      setOrders([]); // No orders found, clear the orders list
      setErrorMessage(`No Orders available for month ${position}`); // Show error message
    } else if (Array.isArray(result)) {
      setOrders(result); // Set the fetched orders
      setErrorMessage(""); // Clear error message if orders are found
    } else {
      setErrorMessage("Error fetching orders. Please try again."); // Show error if there was an issue
    }
  };

  // Handle delete action for orders
  const handleDeleteOrder = (id: string) => {
    setOrders((prevOrders) => prevOrders.filter((order) => order.id !== id)); // Remove deleted order
  };

  return (
    <div className="container px-4 py-8">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">{`Month: ${position}`}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
            {months.map((month) => (
              <DropdownMenuRadioItem value={month} key={month}>
                {month}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button onClick={handleMonthSearch} className="mt-4 mx-8">
        Search Orders
      </Button>

      {/* Show loading spinner */}
      {loading && (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        </div>
      )}

      {/* Show error message if there are no orders */}
      {errorMessage && !loading && (
        <p className="text-xl font-bold text-red-500 mt-4">{errorMessage}</p>
      )}

      {/* Show orders if they exist */}
      {orders.length > 0 && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="p-4 border rounded-lg shadow-md hover:shadow-lg transition-shadow bg-white"
            >
              <OrderDisplayer order={order} onDelete={handleDeleteOrder} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
