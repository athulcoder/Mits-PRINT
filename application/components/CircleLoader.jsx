"use client";

import { motion } from "framer-motion";

const MPRotatingLoader = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-white/40 backdrop-blur-[2px]"
    >
      <div className="relative h-14 w-14">
        {/* Outer red ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-red-600 border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 0.8,
            ease: "linear",
          }}
        />

        {/* Inner white ring */}
        <motion.div
          className="absolute inset-2 rounded-full border-4 border-white border-b-transparent"
          animate={{ rotate: -360 }}
          transition={{
            repeat: Infinity,
            duration: 1.2,
            ease: "linear",
          }}
        />
      </div>
    </motion.div>
  );
};

export default MPRotatingLoader;
