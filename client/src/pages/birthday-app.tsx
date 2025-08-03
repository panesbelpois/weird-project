import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import EmojiQuiz from "@/components/emoji-quiz";
import Confetti from "@/components/confetti";
import ColorfulConfetti from "@/components/colorful-confetti";
import Envelope from "@/components/envelope";
import BirthdayCake from "@/components/birthday-cake";

type PageType = 'quiz' | 'error' | 'success' | 'envelope' | 'letter' | 'fairy' | 'grade' | 'cake' | 'final';

interface Subject {
  name: string;
  sks: number;
  grade: string;
}

const subjects = [
  { name: "Kriptografi", sks: 3 },
  { name: "Machine Learning", sks: 3 },
  { name: "Cyber Security", sks: 3 },
  { name: "Desain Interaksi", sks: 2 },
  { name: "MPTI", sks: 3 },
  { name: "Karier, Etika, dan KWU (ini apadeh?)", sks: 2 },
  { name: "Dan matkul lain yg kamu ambil nanti😯", sks: 100 },
];

const gradeOptions = ["A", "AB", "B", "BC", "C", "D", "E"];

export default function BirthdayApp() {
  const [currentPage, setCurrentPage] = useState<PageType>('quiz');
  const [showConfetti, setShowConfetti] = useState(false);
  const [showLetterConfetti, setShowLetterConfetti] = useState(false);
  const [wish, setWish] = useState("");
  const [grades, setGrades] = useState<Subject[]>(
    subjects.map(subject => ({ ...subject, grade: "" }))
  );
  const [showHackerPopup, setShowHackerPopup] = useState(false);
  const [backgroundClass, setBackgroundClass] = useState("checkered-bg");
  const [showWishError, setShowWishError] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();

  const wishMutation = useMutation({
    mutationFn: async (wishData: { wish: string }) => {
      const response = await apiRequest('POST', '/api/wishes', wishData);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Aaaamiiin (gatau kmu masukin asal atau ga tapi aamiinin aja dulu)", description: "Your wish has been sent to fairy Anisa ✨" });
      setCurrentPage('grade');
    },
  });

  const gradeMutation = useMutation({
    mutationFn: async (gradeData: { subjects: Subject[] }) => {
      const response = await apiRequest('POST', '/api/grades', gradeData);
      return response.json();
    },
    onSuccess: () => {
      setShowHackerPopup(true);
    },
  });

  const handleQuizAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setBackgroundClass("checkered-bg");
      setCurrentPage('success');
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    } else {
      setBackgroundClass("error-bg");
      setCurrentPage('error');
    }
  };

  const handleTryAgain = () => {
    setBackgroundClass("checkered-bg");
    setCurrentPage('quiz');
  };

  const handleWishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (wish.trim()) {
      setShowWishError(false);
      wishMutation.mutate({ wish });
    } else {
      setShowWishError(true); // Munculkan pesan custom
    }
  };

  const handleGradeChange = (index: number, grade: string) => {
    const newGrades = [...grades];
    newGrades[index].grade = grade;
    setGrades(newGrades);
  };

  const handleGradeSubmit = () => {
    const allFilled = grades.every(subject => subject.grade !== "");
    if (allFilled) {
      gradeMutation.mutate({ subjects: grades });
    } else {
      toast({ title: "TETOTTT", description: "isi dulu indeks nilainya 😏", variant: "destructive" });
    }
  };

  const startAudio = () => {
    if (audioRef.current && !isAudioPlaying) {
      audioRef.current.loop = true;
      audioRef.current.play().then(() => {
        setIsAudioPlaying(true);
      }).catch((error) => {
        console.log("Audio play failed:", error);
      });
    }
  };

  const stopAudio = () => {
    if (audioRef.current && isAudioPlaying) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsAudioPlaying(false);
    }
  };

  // Stop audio when reaching final page
  useEffect(() => {
    if (currentPage === 'final') {
      stopAudio();
    }
  }, [currentPage, isAudioPlaying]);

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${backgroundClass}`}>
      {showConfetti && <Confetti />}
      {showLetterConfetti && <ColorfulConfetti />}
      
      <audio ref={audioRef} preload="auto">
        <source src="/src/assets/hbd.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      
      <AnimatePresence mode="wait">
        {currentPage === 'quiz' && (
          <motion.div
            key="quiz"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.5 }}
          >
            <EmojiQuiz onAnswer={handleQuizAnswer} />
          </motion.div>
        )}

        {currentPage === 'error' && (
          <motion.div
            key="error"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <Card className="w-full max-w-md mx-auto border-red-200">
              <CardContent className="pt-4 px-4 sm:pt-6 sm:px-6">
                <div className="w-40 h-40 sm:w-48 sm:h-48 mx-auto mb-4 flex items-center justify-center">
                  <img 
                    src="/src/assets/wrong-answer.png" 
                    alt="Wrong answer" 
                    className="w-36 h-36 sm:w-44 sm:h-44 object-cover"
                  />
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-red-500 mb-4">TETOTTT SALAH</h1>
                <p className="text-gray-600 mb-6">hehe nt, ngak papa coba lagi saja 😏</p>
                <Button 
                  onClick={handleTryAgain}
                  className="bg-red-500 hover:bg-red-400 text-white px-6 py-2 sm:px-8 sm:py-3 rounded-full text-sm sm:text-base"
                >
                  Coba lagi awowkaok
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {currentPage === 'success' && (
          <motion.div
            key="success"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <Card className="w-full max-w-md mx-auto border-green-200 relative overflow-hidden">
              <CardContent className="pt-4 px-4 sm:pt-6 sm:px-6">
                <div className="w-40 h-40 sm:w-48 sm:h-48 mx-auto mb-4 flex items-center justify-center">
                  <img 
                    src="/src/assets/correct-answer.png" 
                    alt="Correct answer" 
                    className="w-36 h-36 sm:w-44 sm:h-44 object-cover"
                  />
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-green-500 mb-2">WOWWW BENARR!!</h1>
                <p className="text-gray-600 mb-6">yhh karna benar kmu dapat ke next quest 🥱</p>
                <Button 
                  onClick={() => setCurrentPage('envelope')}
                  className="bg-green-500 hover:bg-green-400 text-white px-6 py-2 sm:px-8 sm:py-3 rounded-full text-sm sm:text-base"
                >
                  Lanjut pliz
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {currentPage === 'envelope' && (
          <motion.div
            key="envelope"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.5 }}
          >
            <Envelope onOpen={() => {
              startAudio();
              setCurrentPage('letter');
              setShowLetterConfetti(true);
              setTimeout(() => setShowLetterConfetti(false), 5000);
            }} />
          </motion.div>
        )}

        {currentPage === 'letter' && (
          <motion.div
            key="letter"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <Card className="w-full max-w-2xl mx-auto">
              <CardContent className="pt-4 px-4 sm:pt-6 sm:px-6">
                <div className="bg-yellow-50 p-4 sm:p-8 rounded-2xl shadow-inner border-2 border-yellow-200">
                  <h1 className="text-3xl sm:text-5xl font-bold text-blue-500 mb-4 sm:mb-6">Happy Birthday Cikallll</h1>
                  
                  <div className="text-left text-gray-700 leading-relaxed mb-6 sm:mb-8 text-sm sm:text-base">
                    <p className="mb-3 sm:mb-4">
                      Wowwwww hai cikal, as usual apa kabarr? Apkh kmu tau ini hariapa?! 🤔 yuppyuppp selamat ulang tahun ke 20 tahun kall, udah kepala 2 ya ternyata, sudah panjang juga perjalanan hidup kamu tapi perjalanan selanjutnya juga masih panjangggg banget dan di setiap jalan itu aku harap smoga kmu diiringin ama orang2 yang baik ya #anjay
                    </p>
                    
                    <p className="mb-3 sm:mb-4">
                      Harapannya apa ya? Wkwkwk, kita ga sedeket itusi jadi gatau, tapi semoga hari-hari mu berjalan baik, apapun itu yang terjadi di perkuliahan juga makin meningkat, doa terbaik juga untuk keluargamu dan orang-orang yang penting buat kamu. Pokoknya i just wish you all the best and happiness.
                    </p>
                    
                    <p>
                      Jujur gw gajago membuat hal2 kaya gini soalnya iseng. Tapi semoga yang kamu semogakan tersemogakan! once again happy birthday! :3
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-pink-500 font-bold text-sm sm:text-base">TTD Anisah Octa_IF'23 🥳</p>
                  </div>
                </div>
                
                <Button 
                  onClick={() => setCurrentPage('fairy')}
                  className="mt-4 sm:mt-6 bg-blue-500 hover:bg-blue-400 text-white px-6 py-2 sm:px-8 sm:py-3 rounded-full text-sm sm:text-base"
                >
                  Next lagi plsss
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {currentPage === 'fairy' && (
          <motion.div
            key="fairy"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <Card className="w-full max-w-lg mx-auto border-pink-200 relative overflow-hidden">
              <CardContent className="pt-4 px-4 sm:pt-6 sm:px-6">
                <div className="relative w-40 h-40 sm:w-48 sm:h-48 mx-auto mb-4 flex items-center justify-center">
                  <img 
                    src="/src/assets/fairy.png" 
                    alt="Fairy Anisa" 
                    className="w-36 h-36 sm:w-44 sm:h-44 object-cover"
                  />
                  <div className="sparkle-effect absolute inset-0"></div>
                  <div className="sparkle-effect-2 absolute inset-0"></div>
                  <div className="sparkle-effect-3 absolute inset-0"></div>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-pink-500 mb-4 sm:mb-2">
                  Sekarang kamu bertemu dengan ibu peri Anisa Octa 😏
                </h2>
                <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">What is this brooo #BukanMusyrikYyhh</p>
                
                <form onSubmit={handleWishSubmit} className="space-y-4">
                  <Textarea 
                    placeholder="Tuliskan permintaanmu di sini yh kal"
                    value={wish}
                    onChange={(e) => setWish(e.target.value)}
                    className="w-full p-3 sm:p-4 border-2 border-pink-200 rounded-2xl focus:border-pink-500 focus:outline-none resize-none h-24 sm:h-32 text-sm sm:text-base"
                  />
                  {wish.trim() === '' && showWishError && (
                    <p className="text-red-500 text-xs sm:text-sm mt-1">
                      hehehe ini harus diisi 🤓☝️
                    </p>
                  )}
                  <Button 
                    type="submit"
                    disabled={wishMutation.isPending}
                    className="bg-pink-500 hover:bg-pink-400 text-white px-6 py-2 sm:px-8 sm:py-3 rounded-full text-sm sm:text-base"
                  >
                    {wishMutation.isPending ? "Loading lalala..." : "Next lagii hehe"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {currentPage === 'grade' && (
          <motion.div
            key="grade"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <Card className="w-full max-w-4xl mx-auto">
              <CardContent className="pt-4 px-4 sm:pt-6 sm:px-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-blue-500 mb-6 sm:mb-3">Harapan IP di sem 5 🤓☝️</h2>
                <p className="text-gray-600 text-xs sm:text-sm px-4">walau kurikulum baru maju semua dan aneh bet</p>
                <p className="text-gray-600 text-xs sm:text-sm px-4 mb-4">tetap harus semangat berkuliah (ngak ya?)</p>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border-2 border-blue-200 rounded-lg">
                    <thead>
                      <tr className="bg-blue-50">
                        <th className="border border-blue-200 p-2 sm:p-3 text-center text-sm sm:text-base">Matkul pusink</th>
                        <th className="border border-blue-200 p-2 sm:p-3 text-center text-sm sm:text-base">SKS</th>
                        <th className="border border-blue-200 p-2 sm:p-3 text-center text-sm sm:text-base">Index</th>
                      </tr>
                    </thead>
                    <tbody>
                      {grades.map((subject, index) => (
                        <tr key={index}>
                          <td className="border border-blue-200 p-2 sm:p-3 text-sm sm:text-base">{subject.name}</td>
                          <td className="border border-blue-200 p-2 sm:p-3 text-center text-sm sm:text-base">{subject.sks}</td>
                          <td className="border border-blue-200 p-2 sm:p-3 text-center">
                            <Select
                              value={subject.grade}
                              onValueChange={(value) => handleGradeChange(index, value)}
                            >
                              <SelectTrigger className="w-12 sm:w-16 text-sm">
                                <SelectValue placeholder="-" />
                              </SelectTrigger>
                              <SelectContent>
                                {gradeOptions.map((grade) => (
                                  <SelectItem key={grade} value={grade}>
                                    {grade}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <Button 
                  onClick={handleGradeSubmit}
                  disabled={gradeMutation.isPending}
                  className="mt-6 sm:mt-5 bg-blue-500 hover:bg-blue-400 text-white px-6 py-2 sm:px-8 sm:py-3 rounded-full text-sm sm:text-base"
                >
                  {gradeMutation.isPending ? "Submitting..." : "lanjut ngak nih? 🥱"}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {currentPage === 'cake' && (
          <motion.div
            key="cake"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.5 }}
          >
            <BirthdayCake onCandleBlown={() => setCurrentPage('final')} />
          </motion.div>
        )}

        {currentPage === 'final' && (
          <motion.div
            key="final"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <Card className="w-full max-w-lg mx-auto">
              <CardContent className="pt-4 px-4 sm:pt-6 sm:px-6">
                <div className="flex justify-center mb-4">
                  <img 
                    src="/src/assets/drink-water.gif" 
                    alt="Drink water" 
                    className="w-40 h-40 object-contain"
                  />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-blue-500 mb-3 sm:mb-2">Jangan lupa minum air putih 🤗🥛</h2>
        
                <div className="mt-6 sm:mt-3 text-gray-600">
                  <p className="text-sm sm:text-base">adios 🙂‍↔️</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hacker Popup */}
      <AnimatePresence>
        {showHackerPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl p-8 max-w-md mx-auto text-center"
            >
              <div className="w-48 h-48 sm:w-64 sm:h-64 mx-auto mb-4 sm:mb-6 flex items-center justify-center">
                <img 
                  src="/src/assets/hengker.png" 
                  alt="Calon hacker" 
                  className="w-44 h-44 sm:w-60 sm:h-60 object-cover"
                />
              </div>
              
              <p className="text-base sm:text-lg text-gray-700 mb-4 sm:mb-6 px-2">
                Good job calon hengker internasional 😏 makasih udah ngisi index, semoga IP mu sem ini menaik yaa, berapapun ituu
              </p>
              
              <Button 
                onClick={() => {
                  setShowHackerPopup(false);
                  setCurrentPage('cake');
                }}
                className="bg-green-500 hover:bg-green-400 text-white px-6 py-2 sm:px-8 sm:py-3 rounded-full text-sm sm:text-base"
              >
                Last slidee gass
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
