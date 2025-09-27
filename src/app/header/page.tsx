"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation"; // <-- added

export default function Header() {
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname(); // <-- added

  // Voice Navigation
  useEffect(() => {
    const speak = (text: string) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 1;
      utterance.pitch = 1.2;
      speechSynthesis.cancel(); // stop previous speech
      speechSynthesis.speak(utterance);
    };

    if (pathname === "/") speak("Welcome to Home Page");
    else if (pathname === "/menu") speak("Welcome to Menu Page");
    else if (pathname === "/cart") speak("Welcome to Cart Page");
    else if (pathname === "/chat") speak("Welcome to Chat with AI Page");
    else if (pathname === "/login") speak("Welcome to Sign In Page");
    else if (pathname === "/signup") speak("Welcome to Sign Up Page");
  }, [pathname]);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Menu", href: "/menu" },
    { name: "Cart", href: "/cart" },
    { name: "Chat with AI", href: "/chat" },
    { name: "Sign In", href: "/login" },
    { name: "Sign Up", href: "/signup" },
  ];

  return (
    <header className="top-0 left-0 w-full z-50 bg-white dark:bg-black shadow-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-orange-600 to-yellow-400 dark:from-orange-400 dark:to-orange-500">
          NeuraFry
        </h1>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-8 items-center">
          {navLinks.map((link, i) => (
            <motion.div
              key={link.name}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 * i, type: "spring", stiffness: 300 }}
            >
              {link.href === "#" ? (
                <span className="text-gray-700 dark:text-orange-300 cursor-not-allowed hover:opacity-80 transition">
                  {link.name}
                </span>
              ) : (
                <Link
                  href={link.href}
                  className="text-gray-700 dark:text-orange-300 font-semibold hover:text-orange-500 dark:hover:text-yellow-400 transition"
                >
                  {link.name}
                </Link>
              )}
            </motion.div>
          ))}

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="ml-4 p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition text-lg"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </nav>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition text-lg"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <span
              className="block w-6 h-0.5 bg-gray-700 dark:bg-orange-300 mb-1 transition-transform duration-300"
              style={{
                transform: menuOpen
                  ? "rotate(45deg) translate(5px,5px)"
                  : "rotate(0)",
              }}
            ></span>
            <span
              className="block w-6 h-0.5 bg-gray-700 dark:bg-orange-300 mb-1 transition-opacity duration-300"
              style={{ opacity: menuOpen ? 0 : 1 }}
            ></span>
            <span
              className="block w-6 h-0.5 bg-gray-700 dark:bg-orange-300 transition-transform duration-300"
              style={{
                transform: menuOpen
                  ? "rotate(-45deg) translate(5px,-5px)"
                  : "rotate(0)",
              }}
            ></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white dark:bg-black overflow-hidden shadow-inner"
          >
            <ul className="flex flex-col gap-4 px-6 py-4">
              {navLinks.map((link) => (
                <li key={link.name}>
                  {link.href === "#" ? (
                    <span className="text-gray-700 dark:text-orange-300 cursor-not-allowed hover:opacity-80 transition">
                      {link.name}
                    </span>
                  ) : (
                    <Link
                      href={link.href}
                      className="block text-gray-700 dark:text-orange-300 font-semibold hover:text-orange-500 dark:hover:text-yellow-400 transition"
                      onClick={() => setMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
