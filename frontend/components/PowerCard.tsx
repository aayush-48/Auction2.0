"use client";

import { useState } from "react";
import { Separator } from "./ui/separator";
import Image from "next/image";
import { motion } from "framer-motion";

interface PowerCardProps {
  name: string;
  description: string;
}

const getCardImage = (cardName: string): string => {
  const nameLower = cardName.toLowerCase();

  if (nameLower.includes("god's eye")) {
    return "/images/powerCards/gods_eye.png";
  } else if (nameLower.includes("mulligan")) {
    return "/images/powerCards/mulligan.png";
  } else if (nameLower.includes("final strike")) {
    return "/images/powerCards/final_strike.png";
  } else if (nameLower.includes("bid freezer")) {
    return "/images/powerCards/bid_freezer.png";
  } else if (nameLower.includes("silent heist")) {
    return "/images/powerCards/silent_heist.png";
  }

  return "/images/powerCards/default.png";
};

const PowerCard: React.FC<PowerCardProps> = ({ name, description }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const imagePath = getCardImage(name);

  return (
    <div
      className="relative w-[240px] h-[340px] cursor-pointer group"
      style={{ perspective: "2000px" }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="relative w-full h-full"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front of card */}
        <div
          className="absolute w-full h-full rounded-3xl overflow-hidden bg-gradient-to-br from-violet-950 via-purple-900 to-indigo-950 border-2 border-amber-400/40"
          style={{
            backfaceVisibility: "hidden",
            boxShadow: `
              0 0 20px rgba(251,191,36,0.3),
              0 0 40px rgba(251,191,36,0.2),
              inset 0 0 30px rgba(251,191,36,0.2)
            `,
          }}
        >
          <div className="w-full h-full flex flex-col items-center relative">
            <div className="w-full h-[75%] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-violet-950/40 to-transparent z-10" />
              <Image
                src={imagePath}
                alt={name}
                fill
                className="object-cover transform scale-110 hover:scale-105 transition-transform duration-700"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-violet-950" />
            </div>

            <div className="absolute bottom-0 w-full p-4 text-center bg-gradient-to-t from-violet-950 via-violet-950/95 to-transparent">
              <h2 className="text-xl font-bold text-amber-200 mb-2 tracking-wide">
                {name}
              </h2>
              <p className="text-sm text-amber-200/80 mb-2 line-clamp-2 leading-relaxed">
                {description}
              </p>
              <div className="flex justify-center items-center gap-2 text-amber-400/80">
                <span className="text-xs">Tap for details</span>
              </div>
            </div>

            <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-amber-400/30 rounded-tl-xl" />
            <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-amber-400/30 rounded-br-xl" />
          </div>
        </div>

        {/* Back of card */}
        <div
          className="absolute w-full h-full rounded-3xl overflow-hidden bg-gradient-to-br from-violet-950 via-purple-900 to-indigo-950 border-2 border-amber-400/40"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            boxShadow: `
              0 0 20px rgba(251,191,36,0.3),
              0 0 40px rgba(251,191,36,0.2),
              inset 0 0 30px rgba(251,191,36,0.2)
            `,
          }}
        >
          <div className="w-full h-full p-4 flex flex-col bg-gradient-to-br from-violet-900/40 to-transparent relative">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-amber-400/50 shadow-lg">
                <Image
                  src={imagePath}
                  alt={name}
                  width={48}
                  height={48}
                  className="object-cover w-full h-full"
                />
              </div>
              <h3 className="text-lg font-bold text-amber-200 tracking-wide">
                {name}
              </h3>
            </div>

            <Separator className="bg-amber-400/30 mb-4" />

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 max-h-[200px]">
              <h4 className="text-sm font-semibold text-amber-200 mb-2 sticky top-0 bg-violet-900/60 py-1">
                Description
              </h4>
              <p className="text-xs leading-relaxed text-amber-100/90">
                {description}
              </p>
            </div>

            <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-amber-400/30 rounded-tr-xl" />
            <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-amber-400/30 rounded-bl-xl" />
          </div>
        </div>
      </motion.div>

      <style jsx global>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(251, 191, 36, 0.3) transparent;
          scroll-behavior: smooth;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(251, 191, 36, 0.4);
          border-radius: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(251, 191, 36, 0.6);
        }
      `}</style>
    </div>
  );
};

export default PowerCard;
