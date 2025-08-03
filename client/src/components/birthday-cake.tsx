import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

// Gambar kue - kue1.png (sebelum ditiup), kue2.png (setelah ditiup)
const kue1 = "/src/assets/kue1.png";
const kue2 = "/src/assets/kue2.png";

interface BirthdayCakeProps {
  onCandleBlown: () => void;
}

export default function BirthdayCake({ onCandleBlown }: BirthdayCakeProps) {
  const [candleBlown, setCandleBlown] = useState(false);

  const handleCandleClick = () => {
    setCandleBlown(true);
    setTimeout(() => {
      onCandleBlown();
    }, 2000);
  };

  return (
    <Card className="w-full max-w-lg mx-auto bg-white/90 backdrop-blur-sm border-pink-200">
      <CardContent className="pt-4 px-4 sm:pt-6 sm:px-6 text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-pink-500 mb-3 sm:mb-4">Sekarang tiup lilinnya tiup lilinnya tiup lilinnya sekarang juga 🎂🥳</h2>
        <p className="text-gray-600 mb-6 sm:mb-4 text-sm sm:text-base">klik kue ini untuk mendapatkan $1000000 (am i mr beast)</p>
        
        <motion.div 
          className="relative mx-auto w-64 h-64 sm:w-80 sm:h-80 cursor-pointer"
          onClick={handleCandleClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <img 
            src={candleBlown ? kue2 : kue1} 
            alt={candleBlown ? "Birthday cake with blown candle" : "3D birthday cake with lit candle"} 
            className="w-full h-full object-cover" 
          />
          
          <motion.div 
            className={`candle-flame absolute top-6 sm:top-8 left-1/2 transform -translate-x-1/2 w-3 h-4 sm:w-4 sm:h-6 rounded-full ${candleBlown ? 'candle-blown' : ''}`}
            animate={candleBlown ? { opacity: 0, scale: 0 } : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          />
        </motion.div>
        
        <p className="text-gray-600 text-sm sm:text-base">
          {candleBlown ? "YEYYYY! 🎉 Selamat ultahh sekali lagi kal" : "apakah kue ini rasa kertas"}
        </p>
      </CardContent>
    </Card>
  );
}
