"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

type Order = {
  orderid: string;
  name: string;
  table_no: string;
  useremail: string;
  item_name: string;
  item_description: string;
  price: string;
  quantity: number;
  total: number;
  location_name: string;
  status: string;
};

export default function OrderStatus() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const router = useRouter();

  const fetchOrders = async () => {
    const tokenRaw = localStorage.getItem("token");
    if (!tokenRaw) {
      setIsAuthenticated(false);
      return;
    }

    const tokenData = JSON.parse(tokenRaw);
    setIsAuthenticated(true);

    try {
      const res = await fetch("http://localhost:8000/users/getstatus", {
        headers: { Authorization: `Bearer ${tokenData.token}` },
      });

      if (!res.ok) {
        if (res.status === 403) {
          setOrders([]);
          setIsAuthenticated(false)
          return;
        }
        else if (res.status === 404) {
          setOrders([]);
          setIsAuthenticated(true)
          return;
        }
      }

      const data = await res.json();
      setOrders(Array.isArray(data) ? data : data.orders || []);
      setIsAuthenticated(true)
    } catch (err: any) {
      setIsAuthenticated(false)
    }
  };

  useEffect(() => {
    fetchOrders();
    if (isAuthenticated === true){
      const interval = setInterval(fetchOrders, 10000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  // 🔑 Agar token missing hai to login button dikhao
  if (isAuthenticated === false) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-black px-6 overflow-hidden relative">
        {/* Animated Background Blobs */}
        <motion.div
          animate={{ x: [0, 80, 0], y: [0, -40, 0] }}
          transition={{ repeat: Infinity, duration: 25, ease: "easeInOut" }}
          className="absolute -top-32 -left-32 w-96 h-96 bg-orange-300 rounded-full opacity-20 filter blur-3xl"
        ></motion.div>
        <motion.div
          animate={{ x: [0, -80, 0], y: [0, 40, 0] }}
          transition={{ repeat: Infinity, duration: 28, ease: "easeInOut" }}
          className="absolute -bottom-32 -right-32 w-96 h-96 bg-orange-500 rounded-full opacity-15 filter blur-3xl"
        ></motion.div>

        {/* Central Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-10 flex flex-col items-center text-center max-w-xl"
        >
          <h2 className="text-4xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-orange-600 to-yellow-400 mb-4 drop-shadow-lg">
            Please sign in first to checkout your order
          </h2>
          <p className="text-gray-700 dark:text-orange-300 sm:text-lg mb-6 leading-relaxed">
            You need an account to place an order 🍴
          </p>
          <button
            onClick={() => router.push("/signup")}
            className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 dark:from-orange-600 dark:to-yellow-500 text-white rounded-full shadow-xl hover:shadow-2xl transition-all font-semibold text-lg"
          >
            Go to Sign Up
          </button>
        </motion.div>

        {/* Floating Food Emojis */}
        <motion.div
          animate={{ y: [0, -12, 0], rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="absolute top-10 right-10 text-4xl opacity-50"
        >
          🍔
        </motion.div>
        <motion.div
          animate={{ y: [0, -15, 0], rotate: [0, -10, 10, 0] }}
          transition={{ repeat: Infinity, duration: 3.5 }}
          className="absolute bottom-12 left-12 text-5xl opacity-40"
        >
          🍕
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 px-6 py-10">
      <h1 className="text-3xl font-bold text-orange-500 mb-6 text-center dark:text-orange-400">
        Order Status
      </h1>
      {isAuthenticated === true && orders.length === 0 ? (
        <p className="text-gray-600 text-center dark:text-gray-400">
          No active orders.
        </p>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg space-y-4"
        >
          {orders.map((order) => (
            <motion.div
              key={order.orderid}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between shadow-sm hover:shadow-md transition bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
            >
              <div className="flex-1">
                <p className="font-bold text-lg text-gray-800 dark:text-gray-100">
                  {order.item_name}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {order.item_description}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Rs {order.price} × {order.quantity} ={" "}
                  <span className="font-semibold text-gray-900 dark:text-white">
                    Rs {order.total}
                  </span>
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Table No: {order.table_no} • Location: {order.location_name}
                </p>
              </div>

              <span
                className={`mt-3 sm:mt-0 px-3 py-1 rounded-lg text-sm font-semibold text-center min-w-[90px] ${order.status === "Approved & Now Processing"
                    ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-200"
                    : order.status === "Rejected"
                      ? "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-300"
                      : order.status === "Order Done"
                        ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-300"
                        : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  }`}
              >
                {order.status || "Pending"}
              </span>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}


