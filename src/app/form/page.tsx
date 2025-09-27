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

export default function CheckoutPage() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [name, setName] = useState("");
  const [tableNo, setTableNo] = useState("");
  const [locationName, setLocationName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [fetchError, setFetchError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Get token data
  useEffect(() => {
    const tokenRaw = localStorage.getItem("token");
    if (!tokenRaw) return;
    try {
      setTokenData(JSON.parse(tokenRaw));
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
        const res = await fetch("http://localhost:8000/users/getorders", {
          headers: { Authorization: `Bearer ${tokenData.token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        setOrders(data);
      } catch (err: any) {
        setFetchError(true); 
        setErrorMsg(err.message);
      }
    };
    fetchOrders();
  }, [tokenData]);

//location fetch
useEffect(() => {
  if (!navigator.geolocation) return setLocationName("Location not available");

  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const { latitude, longitude } = pos.coords;
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
        );
        const data = await res.json();

        const location =
          `${data.address.road || ""}, ${data.address.neighbourhood || ""}, ${data.address.suburb || ""}, ${data.address.city || data.address.town || data.address.village || ""}, ${data.address.state || ""}, ${data.address.country || ""}`.replace(/,\s*,/g, ",");

        setLocationName(location.trim().replace(/^,|,$/g, ""));
      } catch {
        setLocationName(`${latitude}, ${longitude}`);
      }
    },
    () => setLocationName("Permission denied"),
    { enableHighAccuracy: true, timeout: 10000 }
  );
}, []);

  // Total price
  const totalPrice = orders.reduce(
    (acc, order) => acc + parseFloat(order.price) * order.quantity,
    0
  );

  // Submit order
  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    if (!tokenData?.token) {
    setIsSubmitting(false);  
    return;
    }
    if (!name) { 
    setErrorMsg("⚠ Please enter your name");
    setIsSubmitting(false);
    return
    }
    if (!tableNo) { 
    setIsSubmitting(false)  
    setErrorMsg("⚠ Please enter your table number");
    return
    }

    try {
      for (let order of orders) {
        await fetch("http://localhost:8000/users/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenData.token}`,
          },
          body: JSON.stringify({
            name,
            table_no: tableNo,
            useremail: tokenData.useremail,
            item_name: order.name,
            item_description: order.description,
            price: order.price,
            quantity: order.quantity,
            orderid: order.orderid,
            total: parseFloat(order.price) * order.quantity,
            location_name: locationName,
            status: "Pending"
          }),
        });

        await fetch("http://localhost:8000/users/submit2", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenData.token}`,
          },
          body: JSON.stringify({
            name,
            table_no: tableNo,
            useremail: tokenData.useremail,
            item_name: order.name,
            item_description: order.description,
            price: order.price,
            quantity: order.quantity,
            orderid: order.orderid,
            total: parseFloat(order.price) * order.quantity,
            location_name: locationName,
            status: "Pending"
          }),
        });
      }

      await fetch(`http://localhost:8000/users/deleteallorders/${tokenData.useremail}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${tokenData.token}` },
      });

      setOrders([]);
      router.push("/orderstatus");
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

 // --- VIP UI if no token or fetch failed ---
if (!tokenData || fetchError) {
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

  // --- Main Checkout UI ---
  return (
    <div className="min-h-screen bg-white dark:bg-black px-6 py-10 transition-colors duration-300">
      <h1 className="text-3xl sm:text-4xl font-bold text-orange-500 mb-8 text-center">
        Checkout
      </h1>

      {errorMsg && (
        <div className="max-w-xl mx-auto mb-6 p-4 bg-red-100 text-red-700 rounded-xl text-center">
          {errorMsg}
        </div>
      )}

      <div className="max-w-3xl mx-auto grid grid-cols-1 gap-6">
        {/* Name */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <label className="mb-2 font-semibold text-gray-700">Your Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-orange-400 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
          />
        </motion.div>

        {/* Table No */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <label className="mb-2 font-semibold text-gray-700">Table Number</label>
          <input
            type="text"
            value={tableNo}
            onChange={(e) => setTableNo(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-orange-400 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
          />
        </motion.div>

        {/* Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-xl border border-orange-200 dark:border-orange-700"
        >
          <h2 className="text-xl font-bold text-orange-500 mb-4">Your Items</h2>
          {orders.map((order) => (
            <div key={order.id} className="flex justify-between items-center mb-3 border-b pb-2">
              <div>
                <p className="font-semibold">{order.name} x{order.quantity}</p>
                <p className="text-gray-600 dark:text-gray-300 text-sm">${order.price} each</p>
              </div>
              <p className="font-bold">${(parseFloat(order.price) * order.quantity).toFixed(2)}</p>
            </div>
          ))}
          <div className="flex justify-between mt-4 pt-2 border-t">
            <p className="font-bold text-lg">Total</p>
            <p className="font-bold text-lg">${totalPrice.toFixed(2)}</p>
          </div>
          {locationName && (
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Location: {locationName}</p>
          )}
        </motion.div>

    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={handleSubmit}
      disabled={isSubmitting}
      className={`px-6 py-3 rounded-2xl shadow-lg text-lg font-semibold transition-all ${
        isSubmitting
          ? "bg-gray-400 cursor-not-allowed text-white"
          : "bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-yellow-500 text-white"
      }`}
    >
      {isSubmitting ? "Submitting..." : "Submit Order"}
    </motion.button>
      </div>
    </div>
  );
}

