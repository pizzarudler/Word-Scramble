import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LetterTileProps {
  letter: string;
  onClick?: () => void;
  isSelected?: boolean;
}

export function LetterTile({ letter, onClick, isSelected }: LetterTileProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className={cn(
        "w-16 h-16 rounded-lg text-3xl font-bold shadow-lg",
        "flex items-center justify-center",
        "touch-manipulation select-none",
        isSelected
          ? "bg-primary text-primary-foreground"
          : "bg-card hover:bg-accent"
      )}
      onClick={onClick}
    >
      {letter.toUpperCase()}
    </motion.button>
  );
}
