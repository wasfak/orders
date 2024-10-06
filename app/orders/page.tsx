"use client";

import OrderDisplayer from "@/components/OrderDisplayer";
import { Input } from "@/components/ui/input";
import { GetOrders } from "@/lib/actions/userActions";
import React, { useEffect, useState } from "react";

// Define the type for an Order object
interface Order {
  id: string;
  company: string;
  withWho?: string;
  status?: string;
  date?: Date;
  month?: string;
  endDate?: Date | null;
}

export default function OrdersPage() {
  const [mounted, setMounted] = useState(false);
  const [loading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchInput, setSearchInput] = useState("");

  // Fetch orders from the API
  const getOrders = async () => {
    setIsLoading(true);
    const fetchedOrders = await GetOrders();
    setOrders(fetchedOrders);
    setFilteredOrders(fetchedOrders);
    setIsLoading(false);
  };

  useEffect(() => {
    setMounted(true);
    getOrders();
  }, []);

  // Filter orders dynamically as the user types
  useEffect(() => {
    const newOrders = orders.filter((order) =>
      order?.company.toLowerCase().includes(searchInput.toLowerCase())
    );
    setFilteredOrders(newOrders);
  }, [searchInput, orders]);

  // Handle delete action in the parent component
  const handleDeleteOrder = (id: string) => {
    setOrders((prevOrders) => prevOrders.filter((order) => order.id !== id));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white"></div>
      </div>
    );
  }

  if (!mounted) {
    return "";
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="block w-full md:w-1/3 lg:w-1/4 mb-6">
        <Input
          placeholder="Search by Company"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg mb-4"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="p-4 border rounded-lg shadow-md hover:shadow-lg transition-shadow bg-white"
            >
              <OrderDisplayer order={order} onDelete={handleDeleteOrder} />
            </div>
          ))
        ) : (
          <h1 className="text-xl font-bold text-gray-500">No Orders Found</h1>
        )}
      </div>
    </div>
  );
}
