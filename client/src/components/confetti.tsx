import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface ConfettiPiece {
  id: number;
  left: number;
  color: string;
  delay: number;
}

const colors = ['#FFB8D6', '#6B9EFF', '#B8D4FF', '#88FFB8'];

export default function Confetti() {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    const newPieces: ConfettiPiece[] = [];
    
    for (let i = 0; i < 50; i++) {
      newPieces.push({
        id: i,
        left: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 2,
      });
    }
    
    setPieces(newPieces);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {pieces.map((piece) => (
        <motion.div
          key={piece.id}
          className="absolute w-3 h-3 rounded"
          style={{
            left: `${piece.left}%`,
            backgroundColor: piece.color,
          }}
          initial={{ y: -100, rotate: 0, opacity: 1 }}
          animate={{ 
            y: window.innerHeight + 100, 
            rotate: 720, 
            opacity: 0 
          }}
          transition={{
            duration: 3,
            delay: piece.delay,
            ease: "easeOut"
          }}
        />
      ))}
    </div>
  );
}
