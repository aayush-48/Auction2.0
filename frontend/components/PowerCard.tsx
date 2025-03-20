import { useState } from "react";
import { Separator } from "./ui/separator";

interface PowerCardProps {
  _id: string;
  name: string;
  description: string;
  assignedTo: string[];
}

const PowerCard: React.FC<PowerCardProps> = ({
  _id,
  name,
  description,
  assignedTo = [],
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

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
          className="absolute w-full h-full rounded-2xl overflow-hidden bg-gradient-to-br from-purple-950 via-purple-900 to-purple-950 border border-amber-400/30"
          style={{
            backfaceVisibility: "hidden",
            boxShadow: `
              0 0 10px rgba(251,191,36,0.5),
              0 0 20px rgba(251,191,36,0.3),
              inset 0 0 15px rgba(251,191,36,0.3)
            `,
          }}
        >
          <div className="w-full h-full flex flex-col items-center bg-gradient-to-b from-transparent via-purple-900/20 to-purple-950/50 relative">
            {/* Card Image or Icon */}
            <div className="w-full h-[65%] relative overflow-hidden flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-amber-400/20 flex items-center justify-center border-2 border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.5)]">
                <svg viewBox="0 0 24 24" className="w-12 h-12 text-amber-400">
                  <path
                    fill="currentColor"
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 1.1-.9 2-2 2h-1v2h2c2.21 0 4-1.79 4-4s-1.79-4-4-4zm-1 9h2v2h-2v-2z"
                  />
                </svg>
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-purple-950/90" />
            </div>

            {/* Card Details */}
            <div className="absolute bottom-0 w-full p-3 text-center">
              <h2 className="text-lg font-bold text-amber-200 mb-1">{name}</h2>
              <p className="text-xs text-amber-200/80 mb-2 line-clamp-2">
                {description}
              </p>
              <div className="flex justify-center items-center px-1">
                <p className="text-sm text-amber-400">Tap to view details</p>
              </div>
            </div>
          </div>
        </div>

        {/* Back of card */}
        <div
          className="absolute w-full h-full rounded-2xl overflow-hidden bg-gradient-to-br from-purple-950 via-purple-900 to-purple-950 border border-amber-400/30"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            boxShadow: `
              0 0 10px rgba(251,191,36,0.5),
              0 0 20px rgba(251,191,36,0.3),
              inset 0 0 15px rgba(251,191,36,0.3)
            `,
          }}
        >
          <div className="w-full h-full p-4 flex flex-col bg-gradient-to-br from-purple-900/40 to-transparent relative">
            <h3 className="text-lg font-bold text-amber-200 mb-2">
              Power Details
            </h3>
            <Separator className="bg-amber-400/30 mb-3" />

            <div className="space-y-2 flex-1 overflow-hidden">
              <div>
                <h4 className="text-sm font-semibold text-amber-200 mb-1">
                  Name:
                </h4>
                <p className="text-sm text-amber-100">{name}</p>
              </div>

              <div className="flex flex-col h-4/5">
                <h4 className="text-sm font-semibold text-amber-200 mb-1">
                  Description:
                </h4>
                <div className="overflow-y-auto pr-1 custom-scrollbar flex-1 my-2">
                  <p className="text-xs text-amber-100">{description}</p>
                </div>
              </div>
            </div>

            {/* Add some global styles for custom scrollbar */}
            <style jsx global>{`
              .custom-scrollbar::-webkit-scrollbar {
                width: 4px;
              }
              .custom-scrollbar::-webkit-scrollbar-track {
                background: rgba(251, 191, 36, 0.1);
                border-radius: 2px;
              }
              .custom-scrollbar::-webkit-scrollbar-thumb {
                background: rgba(251, 191, 36, 0.3);
                border-radius: 2px;
              }
              .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                background: rgba(251, 191, 36, 0.5);
              }
            `}</style>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PowerCard;
