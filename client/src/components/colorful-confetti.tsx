import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface ConfettiPiece {
  id: number;
  left: number;
  color: string;
  delay: number;
  size: number;
  shape: string;
}

const colors = [
  '#FF69B4', '#FFB6C1', '#87CEEB', '#98FB98', 
  '#DDA0DD', '#F0E68C', '#FFA07A', '#20B2AA',
  '#FF1493', '#00CED1', '#FFD700', '#FF6347',
  '#9370DB', '#32CD32', '#FF4500', '#1E90FF'
];

const shapes = ['●', '■', '▲', '♦', '★', '♥', '♠', '♣'];

export default function ColorfulConfetti() {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    const newPieces: ConfettiPiece[] = [];
    
    for (let i = 0; i < 120; i++) {
      newPieces.push({
        id: i,
        left: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 3,
        size: Math.random() * 8 + 4,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
      });
    }
    
    setPieces(newPieces);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {pieces.map((piece) => (
        <motion.div
          key={piece.id}
          className="absolute font-bold select-none"
          style={{
            left: `${piece.left}%`,
            color: piece.color,
            fontSize: `${piece.size}px`,
          }}
          initial={{ y: -100, rotate: 0, opacity: 1, scale: 0 }}
          animate={{ 
            y: window.innerHeight + 100, 
            rotate: Math.random() > 0.5 ? 1080 : -1080, 
            opacity: 0,
            scale: 1
          }}
          transition={{
            duration: Math.random() * 2 + 3,
            delay: piece.delay,
            ease: "easeOut"
          }}
        >
          {piece.shape}
        </motion.div>
      ))}
    </div>
  );
}