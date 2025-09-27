"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function ThankYou() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 to-white px-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl sm:text-5xl font-extrabold text-orange-600 text-center mb-4"
      >
        Thank You!
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="text-lg sm:text-xl text-gray-700 text-center mb-8 max-w-xl"
      >
        Thank you for your order. Please check your{" "}
        <span className="font-semibold text-orange-500">Order Status</span> in
        Order History.
      </motion.p>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => router.push("/orderhistory")}
        className="px-6 py-3 bg-orange-500 text-white text-lg font-semibold rounded-xl shadow-md hover:bg-orange-600 transition"
      >
        Go to Order History
      </motion.button>
    </div>
  );
}
