"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black px-6 py-12 relative overflow-hidden">
      {/* Background Floating Elements */}
      <motion.div
        animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
        transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
        className="absolute -top-32 -left-32 w-96 h-96 bg-orange-300 rounded-full opacity-20 filter blur-3xl"
      ></motion.div>
      <motion.div
        animate={{ x: [0, -100, 0], y: [0, 50, 0] }}
        transition={{ repeat: Infinity, duration: 25, ease: "easeInOut" }}
        className="absolute -bottom-32 -right-32 w-96 h-96 bg-orange-500 rounded-full opacity-15 filter blur-3xl"
      ></motion.div>

      {/* Central Text / Heading */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative flex flex-col items-center text-center px-4 sm:px-6 md:px-0"
      >
        <h1 className="text-6xl sm:text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 dark:from-orange-500 dark:via-yellow-500 dark:to-orange-400 mb-6 drop-shadow-lg">
          Welcome to NeuraFry 🍴
        </h1>

        <p className="text-gray-700 dark:text-orange-300 sm:text-lg md:text-xl mb-10 max-w-2xl leading-relaxed tracking-wide">
          Experience the best dishes delivered straight to your door. Explore our menu and order with ease.
        </p>

        <Link href="/menu">
          <motion.button
            whileHover={{ scale: 1.1, rotate: 1 }}
            whileTap={{ scale: 0.95, rotate: -1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="px-14 py-4 bg-gradient-to-r from-orange-500 to-orange-600 dark:from-orange-600 dark:to-yellow-500 text-white rounded-full shadow-xl hover:shadow-2xl transition-all font-bold text-lg"
          >
            Explore Menu
          </motion.button>
        </Link>
      </motion.div>

      {/* Floating Food Icons */}
      <motion.div
        animate={{ y: [0, -15, 0], rotate: [0, 10, -10, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
        className="absolute top-8 right-10 text-4xl opacity-50"
      >
        🍔
      </motion.div>
      <motion.div
        animate={{ y: [0, -18, 0], rotate: [0, -10, 10, 0] }}
        transition={{ repeat: Infinity, duration: 3.5 }}
        className="absolute bottom-12 left-12 text-5xl opacity-40"
      >
        🍕
      </motion.div>
    </div>
  );
}
