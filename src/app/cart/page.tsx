"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

type OrderItem = {
  id: number;
  name: string;
  description: string;
  price: string;
  quantity: number;
  orderid: string;
};

type TokenData = {
  username?: string;
  token?: string;
  useremail?: string;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [showSigninBtn, setShowSigninBtn] = useState(false);
  const [showMenuBtn, setShowMenuBtn] = useState(false);
  const router = useRouter();

  // Fetch token from localStorage
  useEffect(() => {
    const tokenRaw = localStorage.getItem("token");
    if (!tokenRaw) {
      setTokenData(null);
      return;
    }
    try {
      const parsed: TokenData = JSON.parse(tokenRaw);
      setTokenData(parsed);
    } catch {
      localStorage.removeItem("token");
      setTokenData(null);
    }
  }, []);

  // Fetch orders
  useEffect(() => {
    if (!tokenData?.token) return;

    const fetchOrders = async () => {
      try {
        const res = await fetch("https://jessika-patrological-crankly.ngrok-free.dev/users/getorders", {
          headers: {
            Authorization: `Bearer ${tokenData.token}`,
          },
        });

        if (res.status === 403) {
          setTokenData(null)
          setOrders([]);
          return;
        }

        if (res.status === 404) {
          setErrorMsg("Please Add Something in Cart Before Placing an Order!");
          setShowMenuBtn(true);
          setOrders([]);
          return;
        }

        const data = await res.json();
        setOrders(data);
      } catch (err: any) {
        setErrorMsg("⚠️ Something went wrong. Please try again later.");
        console.error(err);
      }
    };

    fetchOrders();
  }, [tokenData]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setTokenData(null);
    router.push("/signup");
  };

  // Calculate total price
  const totalPrice = orders.reduce(
    (acc, order) => acc + parseFloat(order.price) * order.quantity,
    0
  );

  if (!tokenData) {
    return (
       <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-black px-6 overflow-hidden relative">
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
            Please sign in first to view or place an order
          </h2>
          <p className="text-gray-700 dark:text-orange-300 sm:text-lg mb-6 leading-relaxed">
            You need an account to explore our delicious menu 🍴
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4 sm:gap-0">
        <h1 className="text-3xl sm:text-4xl font-bold text-orange-500">
          {tokenData.username ? `Hello, ${tokenData.username}` : "Your Orders"}
        </h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-md transition"
        >
          Logout
        </button>
      </div>

      {/* Error Message */}
      {errorMsg && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl mx-auto text-center mb-6 p-4 bg-red-100 dark:bg-red-800 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 rounded-2xl shadow-md"
        >
          <p className="text-lg">{errorMsg}</p>
          <div className="mt-4 flex justify-center gap-4">
            {showSigninBtn && (
              <button
                onClick={() => router.push("/login")}
                className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow-md transition"
              >
                Go to Sign In
              </button>
            )}
            {showMenuBtn && (
              <button
                onClick={() => router.push("/menu")}
                className="px-5 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl shadow-md transition"
              >
                Go to Menu
              </button>
            )}
          </div>
        </motion.div>
      )}

      {/* Orders Grid */}
      {orders.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {orders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                whileHover={{ scale: 1.03 }}
                className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-orange-200 dark:border-orange-700 p-6 flex flex-col justify-between"
              >
                <div>
                  <h2 className="text-xl font-semibold text-orange-500 mb-2">
                    {order.name} x{order.quantity}
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-3 flex-grow">
                    {order.description}
                  </p>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-bold text-gray-800 dark:text-gray-100">
                      ${order.price}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Quantity: {order.quantity}
                    </span>
                  </div>
                </div>

                <button
                  onClick={async () => {
                    if (!tokenData?.token) return;
                    try {
                      const res = await fetch(
                        `https://jessika-patrological-crankly.ngrok-free.dev/users/deleteorder/${order.orderid}`,
                        {
                          method: "DELETE",
                          headers: { Authorization: `Bearer ${tokenData.token}` },
                        }
                      );
                      if (!res.ok) throw new Error("Failed to delete order");
                      setOrders((prev) => prev.filter((o) => o.id !== order.id));
                    } catch (err: any) {
                      setErrorMsg(`❌ ${err.message}`);
                    }
                  }}
                  className="mt-4 px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-md transition w-full"
                >
                  Cancel
                </button>
              </motion.div>
            ))}
          </div>

 {/* Total Price */}
<div className="max-w-xl mx-auto mt-8 p-4 bg-gradient-to-r from-orange-400 to-orange-600 dark:from-orange-700 dark:to-orange-900 rounded-3xl shadow-lg text-center">
  <p className="text-xl sm:text-2xl font-extrabold text-white drop-shadow-md">
    Total: ${totalPrice.toFixed(2)}
  </p>
</div>

{/* Checkout & Menu Buttons */}
<div className="text-center mt-6 flex flex-col sm:flex-row justify-center gap-4">
  <button
    onClick={() => router.push("/form")}
    className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl shadow-lg transition text-lg font-semibold"
  >
    Proceed to Checkout
  </button>
  <button
    onClick={() => router.push("/menu")}
    className="px-6 py-3 bg-white hover:bg-orange-100 text-orange-600 border-2 border-orange-500 rounded-2xl shadow-lg transition text-lg font-semibold"
  >
    Go to Menu
  </button>
</div>

        </>
      )}
    </div>
  );
}

