"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

type TokenData = {
  token?: string;
  username?: string;
  useremail?: string;
};

export default function ChatPage() {
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
const [messages, setMessages] = useState<
  { sender: "user" | "agent"; text: string }[]
>([
  {
    sender: "agent",
    text: "👋 Hello! I’m your Menu + Customer Support Agent.\n\nI can help you explore our menu, suggest dishes, and check your previous orders.\n\nHow can I assist you today?"
  }
]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const chatRef = useRef<HTMLDivElement>(null);

  // ✅ Auto scroll to bottom
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  // ✅ Token check
  useEffect(() => {
    const tokenRaw = localStorage.getItem("token");
    if (!tokenRaw) return;
    try {
      const parsed: TokenData = JSON.parse(tokenRaw);
      setTokenData(parsed);
    } catch {
      localStorage.removeItem("token");
      setTokenData(null);
    }
  }, []);

  // ✅ Send message handler
  const handleSend = async () => {
    if (!input.trim()) return;
    if (!tokenData?.token) return;

    const userMessage = input;
    setInput("");

    // Add user + placeholder agent msg
    setMessages((prev) => [
      ...prev,
      { sender: "user", text: userMessage },
      { sender: "agent", text: "Thinking..." }
    ]);
    setLoading(true);

    try {
      const res = await fetch(
        `http://localhost:8000/callAgent/${encodeURIComponent(
          userMessage
        )}/${encodeURIComponent(tokenData.token)}`,
        { method: "POST" }
      );

      if (!res.ok) {
        throw new Error(`Server Error: ${res.status}`);
      }

      const data = await res.json();

      setMessages((prev) => {
        const newMsgs = [...prev];
        newMsgs[newMsgs.length - 1] = {
          sender: "agent",
          text: data.message || "⚠️ Unknown error."
        };
        return newMsgs;
      });

      setLoading(false);
    } catch (err) {
      setMessages((prev) => {
        const newMsgs = [...prev];
        newMsgs[newMsgs.length - 1] = {
          sender: "agent",
          text: "❌ Network/Server error, please try again."
        };
        return newMsgs;
      });
      setLoading(false);
    }
  };

  if (!tokenData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-black px-4 sm:px-6 relative overflow-hidden">
        {/* Animated Background */}
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

        {/* Sign In Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-10 flex flex-col items-center text-center max-w-sm sm:max-w-md"
        >
          <h2 className="text-3xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-orange-600 to-yellow-400 mb-4 drop-shadow-lg">
            Please sign in to explore our chat
          </h2>
          <p className="text-gray-700 dark:text-orange-300 sm:text-lg mb-6 leading-relaxed">
            You need an account to talk with our Agent 🤖
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 to-yellow-100 dark:from-black dark:to-gray-900">
     {/* Header */}
<div className="px-4 sm:px-6 pt-6 text-center mb-2">
  <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-orange-600 via-yellow-500 to-red-500 bg-clip-text text-transparent drop-shadow-md">
    🍽️ Menu + Customer Support Agent 🤖
  </h1>
  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-2">
    Your personal assistant for menu selection and customer support.
  </p>
</div>


      {/* Chat Window */}
      <div
        ref={chatRef}
        className="flex-grow overflow-y-auto backdrop-blur-md bg-white/60 dark:bg-gray-800/60 rounded-2xl mx-4 sm:mx-6 p-4 sm:p-6 shadow-lg space-y-4 mb-20"
      >
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm sm:text-base whitespace-pre-line shadow-md ${
              msg.sender === "user"
                ? "ml-auto bg-gradient-to-r from-orange-500 to-yellow-500 text-white"
                : "mr-auto bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            }`}
          >
            {msg.text}
          </motion.div>
        ))}
      </div>

      {/* Fixed Input Box */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 px-4 sm:px-6 py-3 border-t dark:border-gray-700 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow p-3 rounded-xl border dark:border-gray-700 dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-orange-400 outline-none"
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-bold rounded-xl shadow-lg hover:shadow-2xl transition disabled:opacity-50"
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}


