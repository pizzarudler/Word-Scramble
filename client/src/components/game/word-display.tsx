import { LetterTile } from "./letter-tile";
import { motion } from "framer-motion";

interface WordDisplayProps {
  word: string;
  onLetterClick?: (index: number) => void;
  selectedIndices?: number[];
}

export function WordDisplay({ word, onLetterClick, selectedIndices = [] }: WordDisplayProps) {
  return (
    <motion.div 
      className="flex flex-wrap gap-2 justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {word.split('').map((letter, index) => (
        <LetterTile
          key={`${index}-${letter}`}
          letter={letter}
          onClick={() => onLetterClick?.(index)}
          isSelected={selectedIndices.includes(index)}
        />
      ))}
    </motion.div>
  );
}
