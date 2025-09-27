"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaStar, FaShoppingCart } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

type MenuItem = {
  id: number;
  title: string;
  desc: string;
  price: string;
  image: string;
  rating: number;
};

type TokenData = {
  username?: string;
  token?: string;
  useremail?: string;
};

type OrderMessage = {
  [key: number]: string;
};

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [username, setUsername] = useState<string>("");
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const [orderMessages, setOrderMessages] = useState<OrderMessage>({});
  const [feedback, setFeedback] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const tokenRaw = localStorage.getItem("token");
    if (!tokenRaw) return;

    try {
      const parsed: TokenData = JSON.parse(tokenRaw);
      setUsername(parsed.username || "");
      setTokenData(parsed);
    } catch {
      localStorage.removeItem("token");
    }
  }, []);

  useEffect(() => {
    if (!tokenData) return;

    const fetchMenu = async () => {
      try {
        const res = await fetch("https://myapiname.loca.lt/users/getmenu", {
          headers: { Authorization: `Bearer ${tokenData.token}` },
        });
        if (res.status === 403) {
          setTokenData(null);
          return;
        }
        const data = await res.json();
        setItems(data);
        const initialQuantities: { [key: number]: number } = {};
        data.forEach((item: MenuItem) => (initialQuantities[item.id] = 1));
        setQuantities(initialQuantities);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMenu();
  }, [tokenData]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUsername("");
    setTokenData(null);
    router.push("/signup");
  };

  const generateRandomId = (length = 6) =>
    Math.random().toString(36).substring(2, length + 2);

  const handleOrder = async (item: MenuItem) => {
    if (!tokenData?.useremail) return;
    const quantity = quantities[item.id] || 1;
    try {
      const res = await fetch("https://jessika-patrological-crankly.ngrok-free.dev/users/orderitem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenData.token}`,
        },
        body: JSON.stringify({
          name: item.title,
          description: item.desc,
          price: item.price,
          quantity: quantity,
          useremail: tokenData.useremail,
          orderid: generateRandomId(),
        }),
      });

      if (res.status === 403) {
        setTokenData(null);
        return;
      }

      setOrderMessages((prev) => ({
        ...prev,
        [item.id]: `✅ ${item.title} x${quantity} added to your orders!`,
      }));
    } catch (err: any) {
      setOrderMessages((prev) => ({
        ...prev,
        [item.id]: `❌ ${err.message}`,
      }));
    }
  };

  const incrementQuantity = (id: number) => {
    setQuantities((prev) => ({ ...prev, [id]: (prev[id] || 1) + 1 }));
  };

  const decrementQuantity = (id: number) => {
    setQuantities((prev) => ({ ...prev, [id]: Math.max(1, prev[id] || 1) }));
  };

 const handleFeedbackSubmit = async () => {
  if (!feedback.trim()) {
    setFeedbackMessage("❌ Please enter a feedback message.");
    return;
  }

  if (!tokenData?.token) {
    setFeedbackMessage("❌ Please login to give feedback.");
    return;
  }

  try {
    const res = await fetch(
      `https://jessika-patrological-crankly.ngrok-free.dev/users/feedback/${encodeURIComponent(feedback)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenData.token}`,
        },
      }
    );

    if (res.ok) {
      setFeedbackMessage("✅ Thanks for your valuable feedback!");
      setFeedback("");
      setTimeout(() => {
        setFeedbackMessage("");
      }, 3000); // <- setInterval ke jagah setTimeout use karo
    } else {
      setFeedbackMessage("❌ Failed to submit feedback. Try again.");
    }
  } catch (err) {
    setFeedbackMessage("❌ Error occurred while submitting feedback.");
  }
};

  if (!tokenData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-black px-4 sm:px-6 relative overflow-hidden">
        <motion.div
          animate={{ x: [0, 60, 0], y: [0, -30, 0] }}
          transition={{ repeat: Infinity, duration: 25, ease: "easeInOut" }}
          className="absolute -top-24 -left-24 w-72 h-72 bg-orange-300 rounded-full opacity-20 filter blur-3xl"
        ></motion.div>
        <motion.div
          animate={{ x: [0, -60, 0], y: [0, 30, 0] }}
          transition={{ repeat: Infinity, duration: 28, ease: "easeInOut" }}
          className="absolute -bottom-24 -right-24 w-72 h-72 bg-orange-500 rounded-full opacity-15 filter blur-3xl"
        ></motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-10 flex flex-col items-center text-center max-w-sm sm:max-w-md"
        >
          <h2 className="text-3xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-orange-600 to-yellow-400 mb-4 drop-shadow-lg">
            Please sign in to explore our menu
          </h2>
          <p className="text-gray-700 dark:text-orange-300 sm:text-lg mb-6 leading-relaxed">
            You need an account to view and place orders 🍴
          </p>
          <button
            onClick={() => router.push("/signup")}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 dark:from-orange-600 dark:to-yellow-500 text-white rounded-full shadow-lg hover:shadow-2xl transition-all font-semibold text-lg w-full sm:w-auto"
          >
            Sign Up
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black px-4 sm:px-6 py-10 transition-colors duration-300 flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-orange-500 text-center sm:text-left">
          Welcome{username ? `, ${username}` : ""} to NeuraFry 🍴
        </h1>
        <div className="flex flex-wrap items-center gap-3 justify-center sm:justify-end">
          <Link href={"/orderhistory"}>
            <FaStar
              className="text-2xl text-blue-500 cursor-pointer hover:scale-110 transition"
              title="Order History"
            />
          </Link>
          <Link href={"/cart"}>
            <FaShoppingCart className="text-2xl text-orange-500 cursor-pointer hover:scale-110 transition" />
          </Link>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-md transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Menu Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 flex-grow">
        {items.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            whileHover={{ scale: 1.03 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden border border-orange-200 dark:border-orange-700 flex flex-col"
          >
            <div className="relative w-full h-44 sm:h-48">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover rounded-t-2xl"
              />
            </div>
            <div className="p-4 sm:p-5 flex flex-col flex-grow">
              <h2 className="text-lg sm:text-xl font-semibold text-orange-500 mb-1 sm:mb-2">
                {item.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-2 sm:mb-3 flex-grow">
                {item.desc}
              </p>
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <span className="text-lg font-bold text-gray-800 dark:text-gray-100">
                  ${item.price}
                </span>
                <div className="flex items-center text-yellow-500 gap-0.5">
                  {Array.from({ length: 5 }, (_, i) => (
                    <FaStar
                      key={i}
                      className={
                        i < item.rating ? "text-yellow-500" : "text-gray-400"
                      }
                    />
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <button
                  onClick={() => decrementQuantity(item.id)}
                  className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  -
                </button>
                <span className="px-2 font-medium">
                  {quantities[item.id] || 1}
                </span>
                <button
                  onClick={() => incrementQuantity(item.id)}
                  className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  +
                </button>
              </div>

              {/* Order Button */}
              <button
                onClick={() => handleOrder(item)}
                className="w-full mt-1 sm:mt-2 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold shadow-md transition"
              >
                Order Now
              </button>

              {/* Order Message */}
              {orderMessages[item.id] && (
                <p className="mt-2 text-sm text-green-600 dark:text-green-400">
                  {orderMessages[item.id]}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Feedback Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mt-12 bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 sm:p-8 border border-orange-200 dark:border-orange-700"
      >
        <h2 className="text-xl sm:text-2xl font-bold text-orange-600 mb-4">
          Share Your Feedback
        </h2>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Write your feedback here..."
          className="w-full p-3 border rounded-lg text-gray-800 dark:text-gray-100 dark:bg-gray-800 focus:ring-2 focus:ring-orange-400 outline-none resize-none mb-4"
          rows={4}
        />
        <button
          onClick={handleFeedbackSubmit}
          className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold shadow-md transition"
        >
          Done
        </button>

        {feedbackMessage && (
          <p className="mt-3 text-sm font-medium text-gray-700 dark:text-gray-300">
            {feedbackMessage}
          </p>
        )}
      </motion.div>
    </div>
  );
}




