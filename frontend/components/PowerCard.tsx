"use client";

import { useState } from "react";
import { Separator } from "./ui/separator";
import Image from "next/image";
import { motion } from "framer-motion";
import { Badge } from "./ui/badge";
import { Clock, CheckCircle2, AlertCircle } from "lucide-react";

interface PowerCardProps {
  name: string;
  description: string;
  assignedTo: { user: string; used: boolean }[];
  userId: string;
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

  return "/images/powerCards/default.jpg";
};

const PowerCard: React.FC<PowerCardProps> = ({
  name,
  description,
  assignedTo,
  userId,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const imagePath = getCardImage(name);

  // Find the user's assigned card details
  const assignedUser = assignedTo.find((entry) => entry.user === userId);
  const isUsed = assignedUser ? assignedUser.used : false;

  // Format timestamp (assuming it would be added in the future)
  const formatTimestamp = (timestamp: string | null) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp).toLocaleString();
  };

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
          className={`absolute w-full h-full rounded-3xl overflow-hidden ${
            isUsed
              ? "bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 border-2 border-gray-500/40"
              : "bg-gradient-to-br from-violet-950 via-purple-900 to-indigo-950 border-2 border-amber-400/40"
          }`}
          style={{
            backfaceVisibility: "hidden",
            boxShadow: isUsed
              ? `0 0 20px rgba(156,163,175,0.3), 0 0 40px rgba(156,163,175,0.2), inset 0 0 30px rgba(156,163,175,0.2)`
              : `0 0 20px rgba(251,191,36,0.3), 0 0 40px rgba(251,191,36,0.2), inset 0 0 30px rgba(251,191,36,0.2)`,
          }}
        >
          <div className="w-full h-full flex flex-col items-center relative">
            {isUsed && (
              <div className="absolute top-0 left-0 w-full z-20 bg-red-900/80 text-white text-center py-1 transform -rotate-2">
                <span className="font-bold tracking-wider text-xs uppercase">
                  Used
                </span>
              </div>
            )}

            <div className="w-full h-[75%] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-violet-950/40 to-transparent z-10" />
              <Image
                src={imagePath}
                alt={name}
                fill
                className={`object-cover transform transition-transform duration-700 ${
                  isUsed ? "grayscale opacity-70" : "hover:scale-105"
                }`}
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-violet-950" />
            </div>

            <div
              className={`absolute bottom-0 w-full p-4 text-center 
              ${
                isUsed
                  ? "bg-gradient-to-t from-gray-900 via-gray-900/95 to-transparent"
                  : "bg-gradient-to-t from-violet-950 via-violet-950/95 to-transparent"
              }`}
            >
              <h2
                className={`text-xl font-bold mb-2 tracking-wide ${
                  isUsed ? "text-gray-300" : "text-amber-200"
                }`}
              >
                {name}
              </h2>
              <p
                className={`text-sm mb-2 line-clamp-2 leading-relaxed ${
                  isUsed ? "text-gray-400/80" : "text-amber-200/80"
                }`}
              >
                {description}
              </p>

              {assignedUser && (
                <div className="flex items-center justify-center gap-2 mb-2">
                  {isUsed ? (
                    <Badge
                      variant="destructive"
                      className="flex items-center gap-1"
                    >
                      <CheckCircle2 size={12} />
                      <span>Used</span>
                    </Badge>
                  ) : (
                    <Badge
                      variant="secondary"
                      className="bg-green-800 text-green-100 flex items-center gap-1"
                    >
                      <Clock size={12} />
                      <span>Available</span>
                    </Badge>
                  )}
                </div>
              )}

              <div
                className={`flex justify-center items-center gap-2 ${
                  isUsed ? "text-gray-400/80" : "text-amber-400/80"
                }`}
              >
                <span className="text-xs">Tap for details</span>
              </div>
            </div>
          </div>
        </div>

        {/* Back of card */}
        <div
          className={`absolute w-full h-full rounded-3xl overflow-hidden p-6 ${
            isUsed
              ? "bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 border-2 border-gray-500/40"
              : "bg-gradient-to-br from-violet-950 via-purple-900 to-indigo-950 border-2 border-amber-400/40"
          }`}
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            boxShadow: isUsed
              ? `0 0 20px rgba(156,163,175,0.3), 0 0 40px rgba(156,163,175,0.2), inset 0 0 30px rgba(156,163,175,0.2)`
              : `0 0 20px rgba(251,191,36,0.3), 0 0 40px rgba(251,191,36,0.2), inset 0 0 30px rgba(251,191,36,0.2)`,
          }}
        >
          <div className="flex flex-col h-full">
            <h2
              className={`text-xl font-bold mb-2 ${
                isUsed ? "text-gray-300" : "text-amber-200"
              }`}
            >
              {name}
            </h2>

            <Separator
              className={`${isUsed ? "bg-gray-600" : "bg-amber-700/40"} my-2`}
            />

            <div className="flex-1 overflow-y-auto">
              <p
                className={`text-sm leading-relaxed mb-4 ${
                  isUsed ? "text-gray-300/90" : "text-amber-100/90"
                }`}
              >
                {description}
              </p>

              <div className="space-y-3">
                <h3
                  className={`text-sm font-semibold ${
                    isUsed ? "text-gray-400" : "text-amber-300"
                  }`}
                >
                  Card Status:
                </h3>

                <div className="space-y-2">
                  {assignedUser && (
                    <>
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs ${
                            isUsed ? "text-gray-400" : "text-amber-200/80"
                          }`}
                        >
                          Status:
                        </span>
                        <Badge
                          variant={isUsed ? "destructive" : "secondary"}
                          className={
                            isUsed ? "" : "bg-green-800 text-green-100"
                          }
                        >
                          {isUsed ? "Used" : "Available"}
                        </Badge>
                      </div>

                      {isUsed && (
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400">
                            Used on:
                          </span>
                          <span className="text-xs text-gray-300">
                            {formatTimestamp(null)}
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4 text-center">
              <span
                className={`text-xs ${
                  isUsed ? "text-gray-400/80" : "text-amber-400/80"
                }`}
              >
                Tap to flip back
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PowerCard;
