import { useState } from "react";
import { GiCricketBat } from "react-icons/gi";
import { FaBowlingBall } from "react-icons/fa";
interface PlayerCardProps {
  name: string;
  country: string;
  gender: string;
  type: string;
  slot_num: number;
  basePrice: number;
  finalPrice: number[];
  src?: string;
  rtmTeam?: string;
  overallRating: number;
  captaincyRating: number;
  ratings: {
    batting: {
      powerplay: number;
      middleOvers: number;
      deathOvers: number;
    };
    bowling: {
      powerplay: number;
      middleOvers: number;
      deathOvers: number;
    };
  };
  isLegendary: boolean;
  isUnderdog: boolean;
}

const RatingBar = ({ rating, label }: { rating: number; label: string }) => (
  <div className="flex items-center mb-2 group">
    <span className="w-24 text-sm text-amber-200 group-hover:text-amber-400 transition-colors">
      {label}
    </span>
    <div className="flex-grow bg-purple-900/30 rounded-full h-2.5 shadow-[0_0_10px_rgba(251,191,36,0.3)] group-hover:shadow-[0_0_15px_rgba(251,191,36,0.4)] transition-all">
      <div
        className="bg-gradient-to-r from-amber-400 to-amber-500 h-2.5 rounded-full shadow-[0_0_8px_rgba(251,191,36,0.5)] group-hover:shadow-[0_0_12px_rgba(251,191,36,0.6)] transition-all"
        style={{ width: `${rating * 10}%` }}
      />
    </div>
    <span className="ml-2 text-sm text-amber-200 group-hover:text-amber-400 transition-colors">
      {rating}
    </span>
  </div>
);

const RatingCircle = ({
  rating,
  label,
  highlight = false,
}: {
  rating: number;
  label: string;
  highlight?: boolean;
}) => (
  <div className={`flex flex-col items-center ${highlight ? "scale-110" : ""}`}>
    <div
      className={`w-10 h-10 rounded-full flex items-center justify-center text-cyan-200 font-bold
      ${
        highlight
          ? "bg-cyan-400/30 border-2 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.5)]"
          : "bg-cyan-400/20 border border-cyan-400/50"
      }`}
    >
      {rating}
    </div>
    <span className="text-[10px] text-cyan-200/80 mt-1">{label}</span>
  </div>
);

const teamFlags: Record<string, string> = {
  RCB: "/images/teamFlags/RCB.png",
  CSK: "/images/teamFlags/CSK.jpg",
  DC: "/images/teamFlags/DC.png",
  GT: "/images/teamFlags/GT.jpeg",
  KKR: "/images/teamFlags/KKR.png",
  LSG: "/images/teamFlags/LSG.jpg",
  MI: "/images/teamFlags/MI.jpeg",
  PBKS: "/images/teamFlags/PK.jpg",
  RR: "/images/teamFlags/RR.png",
  SRH: "/images/teamFlags/SRH.jpg",
};

const countryFlags: Record<string, string> = {
  ind: "/images/countryFlags/ind.png",
  sa: "/images/countryFlags/sa.png",
  afg: "/images/countryFlags/afg.png",
  aus: "/images/countryFlags/aus.jpeg",
  eng: "/images/countryFlags/eng.jpg",
  ire: "/images/countryFlags/ire.png",
  nz: "/images/countryFlags/nz.png",
  sl: "/images/countryFlags/sl.jpeg",
  wi: "/images/countryFlags/wi.jpg",
  zim: "/images/countryFlags/zim.jpeg",
};

const PlayerCard: React.FC<PlayerCardProps> = ({
  name,
  country,
  slot_num,
  type,
  basePrice,
  finalPrice,
  src,
  rtmTeam = "MI",
  overallRating = 8.5,
  captaincyRating = 9.0,
  ratings,
  isLegendary = false,
  isUnderdog = false,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const finalPriceNum =
    finalPrice.find((slot) => Number(slot.slot_num) === slot_num)?.price || 0;
  const getGlowColor = () => {
    if (isLegendary) return "rgba(255, 215, 0, 0.7)"; // Gold glow
    if (isUnderdog) return "rgba(192, 192, 192, 0.7)"; // Silver glow
    return "rgba(34, 211, 238, 0.5)"; // Default cyan glow
  };

  const glowColor = getGlowColor();

  const showBatting =
    type.toLowerCase() === "batsman" ||
    type.toLowerCase() === "all rounder" ||
    type.toLowerCase() === "wicket keeper";
  const showBowling =
    type.toLowerCase() === "bowler" || type.toLowerCase() === "all rounder";
  const showCaptaincy = captaincyRating > 0;
  const showRtmTeam = !isLegendary && !isUnderdog && rtmTeam !== "";

  const getCountryFlagSrc = () => {
    if (country && countryFlags[country]) {
      return countryFlags[country];
    }
    return "/images/countryFlags/ind.png";
  };

  return (
    <div
      className="relative w-[220px] h-[300px] cursor-pointer group mb-4"
      style={{ perspective: "2000px" }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className="relative w-full h-full transition-transform duration-1000 ease-in-out"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front of card */}
        <div
          className="absolute w-full h-full rounded-2xl overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-blue-950 border border-cyan-400/30"
          style={{
            backfaceVisibility: "hidden",
            boxShadow: `
              0 0 10px ${glowColor},
              0 0 20px ${glowColor},
              inset 0 0 15px ${glowColor}
            `,
          }}
        >
          <div className="w-full h-full flex flex-col items-center bg-gradient-to-b from-transparent via-blue-900/20 to-blue-950/50 relative">
            {/* Top ratings */}
            <div className="absolute top-0 w-full p-2 flex justify-between z-10">
              <RatingCircle rating={overallRating} label="" />
              {showCaptaincy && (
                <RatingCircle rating={captaincyRating} label="CAPTAINCY" />
              )}
            </div>

            <div className="w-full h-[65%] relative overflow-hidden">
              <img
                src={
                  src ||
                  "https://images.unsplash.com/photo-1546525848-3ce03ca516f6?w=400"
                }
                alt={name}
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-blue-950/90" />
            </div>

            <div className="absolute bottom-0 w-full p-3 text-center">
              <h2 className="text-lg font-bold text-white mb-1">{name}</h2>
              <p className="text-xs text-cyan-200/90 mb-2">{type}</p>
              <div className="flex justify-between items-center px-1">
                <p className="text-base font-bold text-cyan-400">
                  {finalPriceNum != 0 ? (
                    <div className="flex text-sm gap-2">
                      <div className="flex flex-col">
                        <span className="text-[0.6rem] text-cyan-600">BP</span>
                        <span>{basePrice} Cr</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[0.6rem] text-cyan-600">FP</span>
                        <span>{finalPriceNum} Cr</span>
                      </div>
                    </div>
                  ) : (
                    <>{basePrice} Cr</>
                  )}
                </p>
                <div className="flex items-center gap-2">
                  {showRtmTeam && rtmTeam && teamFlags[rtmTeam] && (
                    <img
                      src={teamFlags[rtmTeam]}
                      alt={`${rtmTeam} flag`}
                      className="w-10 h-7 object-cover rounded-sm shadow-lg"
                    />
                  )}
                  <img
                    src={getCountryFlagSrc()}
                    alt={`${country} flag`}
                    className="w-10 h-7 object-cover rounded-sm shadow-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back of card */}
        <div
          className="absolute w-full h-full rounded-2xl overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-blue-950 border border-cyan-400/30"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            boxShadow: `
              0 0 10px ${glowColor},
              0 0 20px ${glowColor},
              inset 0 0 15px ${glowColor}
            `,
          }}
        >
          <div className="w-full h-full p-4 flex flex-col bg-gradient-to-br from-blue-900/40 to-transparent relative">
            <h3 className="text-lg font-bold text-white mb-4">
              Player Ratings
            </h3>

            {showBatting && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-cyan-200 mb-2 flex items-center">
                  <GiCricketBat className="mr-2 text-cyan-400 text-lg" />{" "}
                  Batting
                </h4>
                <div className="space-y-2">
                  <RatingBar
                    rating={ratings.batting.powerplay}
                    label="Powerplay"
                  />
                  <RatingBar
                    rating={ratings.batting.middleOvers}
                    label="Middle"
                  />
                  <RatingBar
                    rating={ratings.batting.deathOvers}
                    label="Death"
                  />
                </div>
              </div>
            )}

            {showBowling && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-cyan-200 mb-2 flex items-center">
                  <FaBowlingBall className="mr-2 text-cyan-400 text-lg" />{" "}
                  Bowling
                </h4>
                <div className="space-y-2">
                  <RatingBar
                    rating={ratings.bowling.powerplay}
                    label="Powerplay"
                  />
                  <RatingBar
                    rating={ratings.bowling.middleOvers}
                    label="Middle"
                  />
                  <RatingBar
                    rating={ratings.bowling.deathOvers}
                    label="Death"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;