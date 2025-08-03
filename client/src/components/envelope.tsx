import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const surat1 = "/src/assets/surat1.png";
const surat2 = "/src/assets/surat2.png";

interface EnvelopeProps {
  onOpen: () => void;
}

export default function Envelope({ onOpen }: EnvelopeProps) {
  const [isOpening, setIsOpening] = useState(false);

  const handleClick = () => {
    setIsOpening(true);
    setTimeout(() => {
      onOpen();
    }, 2000);
  };

  return (
    <Card className="w-full max-w-lg mx-auto bg-white/90 backdrop-blur-sm">
      <CardContent className="pt-4 px-4 sm:pt-6 sm:px-6 text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-blue-500 mb-1 sm:mb-1">Eummm ini surat apedah, emang hari ini hari apa yak? 🤔</h2>
        
        <motion.div
          className="relative mx-auto w-80 h-56 sm:w-96 sm:h-72 cursor-pointer overflow-hidden"
          onClick={handleClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <img 
            src={isOpening ? surat2 : surat1} 
            alt={isOpening ? "Opened envelope" : "Closed envelope"} 
            className="w-full h-full object-cover transition-all duration-2000" 
          />
        </motion.div>
        
        <p className="text-gray-600 mt-4 text-sm sm:text-base">
          {isOpening ? "wait yak loadink..." : "Klik amplop ini agar muncul jumpscare"}
        </p>
      </CardContent>
    </Card>
  );
}
