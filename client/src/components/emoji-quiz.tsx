import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

interface EmojiQuizProps {
  onAnswer: (isCorrect: boolean) => void;
}

export default function EmojiQuiz({ onAnswer }: EmojiQuizProps) {
  const emojis = [
    { emoji: "😊", isCorrect: false },
    { emoji: "😐", isCorrect: true },
    { emoji: "😜", isCorrect: false },
  ];

  return (
    <Card className="w-full max-w-lg mx-auto bg-white/90 backdrop-blur-sm border-blue-200">
      <CardContent className="pt-4 px-4 sm:pt-6 sm:px-6 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-blue-500 mb-6 sm:mb-8">you can only choose one 😱⁉️</h2>
        
        <div className="flex justify-center gap-3 sm:gap-6 mb-6 sm:mb-8 px-2">
          {emojis.map((item, index) => (
            <motion.button
              key={index}
              onClick={() => onAnswer(item.isCorrect)}
              className="emoji-hover bg-blue-50 rounded-full p-4 sm:p-6 cursor-pointer border-2 border-transparent hover:border-blue-300 flex-shrink-0"
              whileHover={{ scale: 1.1, y: -5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="text-4xl sm:text-6xl">{item.emoji}</div>
            </motion.button>
          ))}
        </div>
        
        <p className="text-gray-600 text-xs sm:text-sm px-4">mang eak ada kau disini kal</p>
      </CardContent>
    </Card>
  );
}
