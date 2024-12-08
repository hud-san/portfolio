// app/components/loading-bar.tsx
import { motion } from "framer-motion";

export const LoadingBar = () => {
  return (
    <motion.div 
      className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-[18rem] sm:w-[28rem] h-[1px] bg-muted overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="h-full bg-primary/50"
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </motion.div>
  );
};