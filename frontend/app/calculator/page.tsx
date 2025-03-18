"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuction, type Player } from "../../context/AuctionContext";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { setUserScore } from "../api/api";
import { getPlayersByUser } from "../api/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ArrowRightIcon,
  ArrowLeftIcon,
  UserIcon,
  XIcon,
  BarChart3Icon,
  CheckCircleIcon,
  ShieldIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const fetchUserPlayers = async (id: string) => {
  const response = await getPlayersByUser(id);
  return response.data;
};

// Helper function to get player type badge color
const getTypeColor = (type) => {
  const typeMap = {
    batsman: "bg-blue-500",
    "wicket keeper": "bg-purple-500",
    "wicket-keeper": "bg-purple-500",
    bowler: "bg-red-500",
    "all rounder": "bg-green-500",
  };
  return typeMap[type.toLowerCase()] || "bg-gray-500";
};

const STORAGE_KEY_PREFIX = "cricket_team_";
const STORAGE_KEYS = {
  BATTING_POWERPLAY: `${STORAGE_KEY_PREFIX}batting_powerplay`,
  BATTING_MIDDLE: `${STORAGE_KEY_PREFIX}batting_middle`,
  BATTING_DEATH: `${STORAGE_KEY_PREFIX}batting_death`,
  BOWLING_POWERPLAY: `${STORAGE_KEY_PREFIX}bowling_powerplay`,
  BOWLING_MIDDLE: `${STORAGE_KEY_PREFIX}bowling_middle`,
  BOWLING_DEATH: `${STORAGE_KEY_PREFIX}bowling_death`,
  CAPTAIN: `${STORAGE_KEY_PREFIX}captain`,
  CURRENT_STEP: `${STORAGE_KEY_PREFIX}current_step`,
};

export default function Calculator() {
  const router = useRouter();
  const { user } = useAuction();
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [teamScore, setTeamScore] = useState(0);
  const [currentStep, setCurrentStep] = useState(0); // Start at step 0 (which is now batting powerplay)
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [battingSelection, setBattingSelection] = useState({
    powerplay: Array(4).fill(null),
    middleOvers: Array(4).fill(null),
    deathOvers: Array(3).fill(null),
  });
  const [bowlingSelection, setBowlingSelection] = useState({
    powerplay: Array(3).fill(null),
    middleOvers: Array(3).fill(null),
    deathOvers: Array(4).fill(null),
  });
  const [captain, setCaptain] = useState(null);
  const [showScoreDetails, setShowScoreDetails] = useState(false);
  const [scoreBreakdown, setScoreBreakdown] = useState({
    baseScore: 0,
    battingBonus: 0,
    bowlingBonus: 0,
    captaincyBonus: 0,
  });
  const [players, setPlayers] = useState([]);
  const [flag, setFlag] = useState(false);
  useEffect(() => {
    const fetchPlayers = async () => {
      if (user) {
        const fetchedPlayers = await fetchUserPlayers(user._id);
        setPlayers(fetchedPlayers);
      }
    };
    fetchPlayers();
  }, [user, flag]);

  // Define the steps for the sequential flow
  const steps = [
    {
      name: "Batting Powerplay",
      description: "Assign 4 batsmen for powerplay overs",
      category: "batting",
      phase: "powerplay",
      count: 4,
    },
    {
      name: "Batting Middle",
      description: "Assign 4 batsmen for middle overs",
      category: "batting",
      phase: "middleOvers",
      count: 4,
    },
    {
      name: "Batting Death",
      description: "Assign 3 batsmen for death overs",
      category: "batting",
      phase: "deathOvers",
      count: 3,
    },
    {
      name: "Bowling Powerplay",
      description: "Assign 3 bowlers for powerplay overs",
      category: "bowling",
      phase: "powerplay",
      count: 3,
    },
    {
      name: "Bowling Middle",
      description: "Assign 3 bowlers for middle overs",
      category: "bowling",
      phase: "middleOvers",
      count: 3,
    },
    {
      name: "Bowling Death",
      description: "Assign 4 bowlers for death overs",
      category: "bowling",
      phase: "deathOvers",
      count: 4,
    },
    {
      name: "Select Captain",
      description: "Choose one player as team captain",
      category: "captain",
      phase: "selection",
      count: 1,
    },
    { name: "Results", description: "View your team's performance score" },
  ];

  // Fetch players on component mount
  useEffect(() => {
    const fetchPlayers = async () => {
      if (user) {
        const fetchedPlayers = await fetchUserPlayers(user._id);
        setPlayers(fetchedPlayers);
      }
    };
    fetchPlayers();
  }, [user, flag]);

  // Set selected players when players are loaded
  useEffect(() => {
    if (players && players.length > 0) {
      // Set all players as selected players automatically
      setSelectedPlayers(players);
    }
  }, [players]);

  // Save selections to localStorage whenever they change
  useEffect(() => {
    //console.log(JSON.stringify(battingSelection.powerplay.map((p) => p._id)));
    if (typeof window !== "undefined" && players.length > 0) {
      // Save batting selections
      localStorage.setItem(
        STORAGE_KEYS.BATTING_POWERPLAY,
        JSON.stringify(
          battingSelection.powerplay.map((p) => (p ? p._id : null))
        )
      );
      localStorage.setItem(
        STORAGE_KEYS.BATTING_MIDDLE,
        JSON.stringify(
          battingSelection.middleOvers.map((p) => (p ? p._id : null))
        )
      );
      localStorage.setItem(
        STORAGE_KEYS.BATTING_DEATH,
        JSON.stringify(
          battingSelection.deathOvers.map((p) => (p ? p._id : null))
        )
      );

      // Save bowling selections
      localStorage.setItem(
        STORAGE_KEYS.BOWLING_POWERPLAY,
        JSON.stringify(
          bowlingSelection.powerplay.map((p) => (p ? p._id : null))
        )
      );
      localStorage.setItem(
        STORAGE_KEYS.BOWLING_MIDDLE,
        JSON.stringify(
          bowlingSelection.middleOvers.map((p) => (p ? p._id : null))
        )
      );
      localStorage.setItem(
        STORAGE_KEYS.BOWLING_DEATH,
        JSON.stringify(
          bowlingSelection.deathOvers.map((p) => (p ? p._id : null))
        )
      );

      // Save captain
      localStorage.setItem(STORAGE_KEYS.CAPTAIN, captain ? captain._id : "");

      // Save current step
      localStorage.setItem(STORAGE_KEYS.CURRENT_STEP, currentStep.toString());
    }
  }, [battingSelection, bowlingSelection, captain, currentStep]);

  // Load saved selections from localStorage when players are loaded
  useEffect(() => {
    if (typeof window !== "undefined" && players.length > 0) {
      try {
        // Helper function to convert player IDs to player objects
        const getPlayerById = (id) => {
          return players.find((player) => player._id === id) || null;
        };

        // Helper function to load and parse array data from localStorage
        const loadPlayerArrayFromStorage = (key) => {
          const storedData = localStorage.getItem(key);
          if (!storedData) return null;

          try {
            const playerIds = JSON.parse(storedData);
            return playerIds.map((id) => (id ? getPlayerById(id) : null));
          } catch (e) {
            console.error(`Error parsing ${key} from localStorage:`, e);
            return null;
          }
        };

        // Load batting selections
        const storedBattingPowerplay = loadPlayerArrayFromStorage(
          STORAGE_KEYS.BATTING_POWERPLAY
        );
        console.log(storedBattingPowerplay);
        const storedBattingMiddle = loadPlayerArrayFromStorage(
          STORAGE_KEYS.BATTING_MIDDLE
        );
        const storedBattingDeath = loadPlayerArrayFromStorage(
          STORAGE_KEYS.BATTING_DEATH
        );

        // Load bowling selections
        const storedBowlingPowerplay = loadPlayerArrayFromStorage(
          STORAGE_KEYS.BOWLING_POWERPLAY
        );
        const storedBowlingMiddle = loadPlayerArrayFromStorage(
          STORAGE_KEYS.BOWLING_MIDDLE
        );
        const storedBowlingDeath = loadPlayerArrayFromStorage(
          STORAGE_KEYS.BOWLING_DEATH
        );

        // Load captain
        const storedCaptainId = localStorage.getItem(STORAGE_KEYS.CAPTAIN);
        const storedCaptain = storedCaptainId
          ? getPlayerById(storedCaptainId)
          : null;

        // Load current step
        const storedStep = localStorage.getItem(STORAGE_KEYS.CURRENT_STEP);

        // Update state with loaded values if they exist
        if (storedBattingPowerplay) {
          setBattingSelection((prev) => ({
            ...prev,
            powerplay: storedBattingPowerplay,
          }));
        }

        if (storedBattingMiddle) {
          setBattingSelection((prev) => ({
            ...prev,
            middleOvers: storedBattingMiddle,
          }));
        }

        if (storedBattingDeath) {
          setBattingSelection((prev) => ({
            ...prev,
            deathOvers: storedBattingDeath,
          }));
        }

        if (storedBowlingPowerplay) {
          setBowlingSelection((prev) => ({
            ...prev,
            powerplay: storedBowlingPowerplay,
          }));
        }

        if (storedBowlingMiddle) {
          setBowlingSelection((prev) => ({
            ...prev,
            middleOvers: storedBowlingMiddle,
          }));
        }

        if (storedBowlingDeath) {
          setBowlingSelection((prev) => ({
            ...prev,
            deathOvers: storedBowlingDeath,
          }));
        }

        if (storedCaptain) {
          setCaptain(storedCaptain);
        }

        if (storedStep && !isNaN(parseInt(storedStep))) {
          setCurrentStep(parseInt(storedStep));
        }
      } catch (error) {
        console.error("Error loading data from localStorage:", error);
      }
    }
  }, [players]);

  useEffect(() => {
    recalculateTeamScore();
  }, [battingSelection, bowlingSelection, captain]);

  const handleAssignPlayer = (player, stepIndex) => {
    const currentStepData = steps[stepIndex];
    const { category, phase } = currentStepData;

    // Captain selection handling
    if (category === "captain") {
      setCaptain(player);
      recalculateTeamScore();
      return true;
    }

    // Type validation
    if (
      category === "batting" &&
      player.type.toLowerCase() !== "batsman" &&
      player.type.toLowerCase() !== "all rounder" &&
      player.type.toLowerCase() !== "wicket keeper"
    ) {
      alert(
        "Only batsmen, wicket keepers, and all-rounders can be assigned to batting positions."
      );
      return false;
    }

    if (
      category === "bowling" &&
      player.type.toLowerCase() !== "bowler" &&
      player.type.toLowerCase() !== "all rounder"
    ) {
      alert(
        "Only bowlers and all-rounders can be assigned to bowling positions."
      );
      return false;
    }

    // Check if this player is already assigned to this phase
    const selections =
      category === "batting" ? battingSelection : bowlingSelection;
    if (selections[phase].some((p) => p && p._id === player._id)) {
      alert(`${player.name} is already assigned to this position.`);
      return false;
    }

    // Count player's current assignments in this category
    const usageCount = Object.values(selections)
      .flat()
      .filter((p) => p && p._id === player._id).length;

    if (usageCount >= 2) {
      alert(
        `${player.name} can only be assigned to 2 positions in ${category}.`
      );
      return false;
    }

    // Find an empty slot
    const emptySlotIndex = selections[phase].findIndex((slot) => slot === null);
    if (emptySlotIndex === -1) {
      alert(
        `All ${phase} positions are filled. Remove a player to add a new one.`
      );
      return false;
    }

    // Assign player
    if (category === "batting") {
      setBattingSelection((prev) => {
        const updated = [...prev[phase]];
        updated[emptySlotIndex] = player;
        return { ...prev, [phase]: updated };
      });
    } else {
      setBowlingSelection((prev) => {
        const updated = [...prev[phase]];
        updated[emptySlotIndex] = player;
        return { ...prev, [phase]: updated };
      });
    }
    recalculateTeamScore();

    return true;
  };

  const handleRemoveAssignedPlayer = (category, phase, index) => {
    if (category === "batting") {
      setBattingSelection((prev) => {
        const updated = [...prev[phase]];
        updated[index] = null;
        return { ...prev, [phase]: updated };
      });
    } else {
      setBowlingSelection((prev) => {
        const updated = [...prev[phase]];
        updated[index] = null;
        return { ...prev, [phase]: updated };
      });
    }
    recalculateTeamScore();
  };

  const handleRemoveCaptain = () => {
    setCaptain(null);
    recalculateTeamScore();
  };

  const isPlayerEligibleForAssignment = (player, stepIndex) => {
    if (!player) return false;

    const currentStepData = steps[stepIndex];
    const { category, phase } = currentStepData;

    // For captain selection, all players are eligible
    if (category === "captain") {
      // Check if a captain is already assigned
      return captain === null || captain._id !== player._id;
    }

    // Type validation
    if (
      category === "batting" &&
      player.type.toLowerCase() !== "batsman" &&
      player.type.toLowerCase() !== "all rounder" &&
      player.type.toLowerCase() !== "wicket keeper"
    ) {
      return false;
    }

    if (
      category === "bowling" &&
      player.type.toLowerCase() !== "bowler" &&
      player.type.toLowerCase() !== "all rounder"
    ) {
      return false;
    }

    // Check if already assigned to this phase
    const selections =
      category === "batting" ? battingSelection : bowlingSelection;
    if (selections[phase].some((p) => p && p._id === player._id)) {
      return false;
    }

    // Check usage limits
    const usageCount = Object.values(selections)
      .flat()
      .filter((p) => p && p._id === player._id).length;

    if (usageCount >= 2) {
      return false;
    }

    // Check if slots are available
    const emptySlotCount = selections[phase].filter(
      (slot) => slot === null
    ).length;
    if (emptySlotCount === 0) {
      return false;
    }

    return true;
  };

  const recalculateTeamScore = () => {
    let newBaseScore = 0;

    // Batting section scores
    ["powerplay", "middleOvers", "deathOvers"].forEach((category) => {
      battingSelection[category].forEach((player) => {
        if (!player) return;
        newBaseScore += player.overallRating;
      });
    });

    // Bowling section scores
    ["powerplay", "middleOvers", "deathOvers"].forEach((category) => {
      bowlingSelection[category].forEach((player) => {
        if (!player) return;
        newBaseScore += player.overallRating;
      });
    });

    // Bonus Calculation
    const calculateBonus = (players, category) => {
      const validPlayers = players.filter((p) => p !== null);
      if (validPlayers.length === 0) return 0;

      const maxPoints = validPlayers.length * 10;
      const actualPoints = validPlayers.reduce(
        (sum, player) =>
          sum +
          player.ratings[category === "batting" ? "batting" : "bowling"][
            players === battingSelection.powerplay ||
            players === bowlingSelection.powerplay
              ? "powerplay"
              : players === battingSelection.middleOvers ||
                players === bowlingSelection.middleOvers
              ? "middleOvers"
              : "deathOvers"
          ],
        0
      );

      const percentage = (actualPoints / maxPoints) * 100;

      if (percentage > 90) return 5;
      if (percentage > 80) return 3;
      if (percentage >= 70) return 1;
      return 0;
    };

    // Calculate Batting Bonuses
    const battingBonus =
      calculateBonus(battingSelection.powerplay, "batting") +
      calculateBonus(battingSelection.middleOvers, "batting") +
      calculateBonus(battingSelection.deathOvers, "batting");

    // Calculate Bowling Bonuses
    const bowlingBonus =
      calculateBonus(bowlingSelection.powerplay, "bowling") +
      calculateBonus(bowlingSelection.middleOvers, "bowling") +
      calculateBonus(bowlingSelection.deathOvers, "bowling");

    // Calculate Captain Bonus
    const captaincyBonus = captain ? captain.captaincyRating || 0 : 0;

    // Update the state
    setScoreBreakdown({
      baseScore: Math.round(newBaseScore * 100) / 100,
      battingBonus,
      bowlingBonus,
      captaincyBonus,
    });

    setTeamScore(newBaseScore + battingBonus + bowlingBonus + captaincyBonus);
  };

  const isStepComplete = (stepIndex) => {
    const step = steps[stepIndex];

    if (stepIndex === 7) {
      // Results step
      return showScoreDetails;
    } else if (stepIndex === 6) {
      // Captain selection step
      return captain !== null;
    } else {
      const { category, phase } = step;
      const selections =
        category === "batting" ? battingSelection : bowlingSelection;
      return selections[phase].every((slot) => slot !== null);
    }
  };

  const canProceedToNextStep = () => {
    return isStepComplete(currentStep);
  };

  const renderPlayerCard = (
    player,
    showRemoveButton = false,
    isAssignmentStep = false,
    isDisabled = false,
    isCaptain = false
  ) => {
    if (!player) return null;

    return (
      <Card
        key={player._id}
        className={`relative group transition-all ${
          isDisabled ? "opacity-50" : "hover:shadow-md"
        } ${isCaptain ? "border-2 border-yellow-500" : ""}`}
      >
        {showRemoveButton && (
          <button
            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
            onClick={() => handleRemovePlayer(player)}
          >
            <XIcon size={14} />
          </button>
        )}

        <div className="absolute top-0 left-0 right-0">
          <Badge
            className={`${getTypeColor(player.type)} text-black text-xs m-2`}
          >
            {player.type}
          </Badge>
          {isCaptain && (
            <Badge className="bg-yellow-500 text-black text-xs m-2 ml-0">
              Captain
            </Badge>
          )}
        </div>

        <div className="pt-6">
          <div className="flex justify-center">
            <img
              src={player.src}
              alt={player.name}
              className="rounded-full w-24 h-24 object-cover border-2 border-gray-200"
            />
          </div>

          <CardContent className="text-center pb-2 pt-3">
            <h3 className="font-semibold truncate">{player.name}</h3>
            <p className="text-xs text-gray-500">{player.country}</p>
            <div className="flex justify-center mt-2">
              <Badge variant="outline" className="bg-amber-100 text-black">
                Rating: {player.overallRating}
              </Badge>
              {player.captaincyRating ? (
                <Badge
                  variant="outline"
                  className="bg-yellow-100 text-black ml-1"
                >
                  Captaincy: {player.captaincyRating}
                </Badge>
              ) : (
                ""
              )}
            </div>
          </CardContent>

          {isAssignmentStep && !isDisabled && (
            <CardFooter className="pt-0 pb-3 justify-center">
              <Button
                size="sm"
                className="w-full"
                onClick={() => handleAssignPlayer(player, currentStep)}
              >
                {currentStep === 6 ? "Select as Captain" : "Assign"}
              </Button>
            </CardFooter>
          )}
        </div>
      </Card>
    );
  };

  const renderAssignedSlots = (category, phase, count) => {
    const selections =
      category === "batting" ? battingSelection : bowlingSelection;

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-4">
        {selections[phase].map((player, idx) => (
          <Card
            key={idx}
            className={`relative group min-h-[120px] flex items-center justify-center ${
              captain && player && captain._id === player._id
                ? "border-2 border-yellow-500"
                : ""
            }`}
          >
            {player ? (
              <>
                <div className="absolute top-1 right-1">
                  <button
                    className="bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() =>
                      handleRemoveAssignedPlayer(category, phase, idx)
                    }
                  >
                    <XIcon size={14} />
                  </button>
                </div>
                <CardContent className="text-center p-3">
                  <img
                    src={player.src}
                    alt={player.name}
                    className="rounded-full w-12 h-12 mx-auto mb-2 object-cover border-2 border-gray-200"
                  />
                  <h4 className="font-medium text-sm truncate">
                    {player.name}
                  </h4>
                  <Badge
                    className={`${getTypeColor(
                      player.type
                    )} text-white text-xs mt-1`}
                  >
                    {player.type}
                  </Badge>
                  {captain && player && captain._id === player._id && (
                    <Badge className="bg-yellow-500 text-white text-xs mt-1 ml-1">
                      C
                    </Badge>
                  )}
                </CardContent>
              </>
            ) : (
              <div className="text-gray-400 flex flex-col items-center p-3">
                <UserIcon size={24} />
                <p className="text-sm mt-1">Empty Slot</p>
              </div>
            )}
          </Card>
        ))}
      </div>
    );
  };

  const renderCaptainSelection = () => {
    return (
      <div>
        {captain ? (
          <Card className="relative group min-h-[150px] border-2 border-yellow-500 max-w-xs mx-auto">
            <div className="absolute top-1 right-1">
              <button
                className="bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={handleRemoveCaptain}
              >
                <XIcon size={14} />
              </button>
            </div>
            <CardContent className="text-center p-4 flex flex-col items-center">
              <ShieldIcon className="text-yellow-500 w-8 h-8 mb-2" />
              <img
                src={captain.src}
                alt={captain.name}
                className="rounded-full w-16 h-16 mx-auto mb-2 object-cover border-2 border-yellow-500"
              />
              <h4 className="font-medium text-lg">{captain.name}</h4>
              <Badge
                className={`${getTypeColor(
                  captain.type
                )} text-white text-xs mt-1`}
              >
                {captain.type}
              </Badge>
              <div className="mt-2">
                <Badge variant="outline" className="bg-yellow-100 text-black">
                  Captaincy Rating: {captain.captaincyRating || 0}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="text-gray-400 flex flex-col items-center p-6 border rounded-lg mx-auto max-w-xs">
            <ShieldIcon size={32} />
            <p className="text-sm mt-2">No Captain Selected</p>
          </div>
        )}
      </div>
    );
  };

  const renderStepContent = () => {
    const step = steps[currentStep];

    // Step 7: Results
    if (currentStep === 7) {
      return (
        <div className="space-y-6">
          <div className="flex flex-col items-center py-6">
            <div className="text-6xl font-bold text-indigo-600">
              {Math.round(teamScore * 100) / 100}
            </div>
            <p className="text-gray-500 mt-2">Total Team Score</p>
          </div>

          <div className="bg-black p-6 rounded-lg">
            <h3 className="font-medium text-lg mb-4">Score Breakdown</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Base Player Scores:</span>
                <span className="font-medium text-lg">
                  {scoreBreakdown.baseScore}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Batting Bonus:</span>
                <span className="font-medium text-lg text-green-600">
                  +{scoreBreakdown.battingBonus}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Bowling Bonus:</span>
                <span className="font-medium text-lg text-green-600">
                  +{scoreBreakdown.bowlingBonus}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Captaincy Bonus:</span>
                <span className="font-medium text-lg text-green-600">
                  +{scoreBreakdown.captaincyBonus}
                </span>
              </div>
              <div className="border-t pt-3 flex justify-between font-medium text-xl">
                <span>Total:</span>
                <span>{Math.round(teamScore * 100) / 100}</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <Tabs defaultValue="battingPowerplay">
              <TabsList className="w-full grid grid-cols-7">
                <TabsTrigger value="battingPowerplay">
                  Batting Powerplay
                </TabsTrigger>
                <TabsTrigger value="battingMiddle">Batting Middle</TabsTrigger>
                <TabsTrigger value="battingDeath">Batting Death</TabsTrigger>
                <TabsTrigger value="bowlingPowerplay">
                  Bowling Powerplay
                </TabsTrigger>
                <TabsTrigger value="bowlingMiddle">Bowling Middle</TabsTrigger>
                <TabsTrigger value="bowlingDeath">Bowling Death</TabsTrigger>
                <TabsTrigger value="captain">Captain</TabsTrigger>
              </TabsList>

              <TabsContent value="battingPowerplay">
                {renderAssignedSlots("batting", "powerplay")}
              </TabsContent>

              <TabsContent value="battingMiddle">
                {renderAssignedSlots("batting", "middleOvers")}
              </TabsContent>

              <TabsContent value="battingDeath">
                {renderAssignedSlots("batting", "deathOvers")}
              </TabsContent>

              <TabsContent value="bowlingPowerplay">
                {renderAssignedSlots("bowling", "powerplay")}
              </TabsContent>

              <TabsContent value="bowlingMiddle">
                {renderAssignedSlots("bowling", "middleOvers")}
              </TabsContent>

              <TabsContent value="bowlingDeath">
                {renderAssignedSlots("bowling", "deathOvers")}
              </TabsContent>

              <TabsContent value="captain">
                {renderCaptainSelection()}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      );
    }

    // Step 6: Captain Selection
    if (currentStep === 6) {
      return (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2 text-black">
              Select Team Captain
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Choose one player to lead your team. Their captaincy rating will
              be added to your final team score.
            </p>

            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Selected Captain</h3>
              {renderCaptainSelection()}
            </div>

            <ScrollArea className="h-96 border rounded-lg p-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {selectedPlayers.map((player) =>
                  renderPlayerCard(
                    player,
                    false,
                    true,
                    captain && captain._id === player._id,
                    captain && captain._id === player._id
                  )
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      );
    }

    // Steps 0-5: Assignment Steps
    const { category, phase, count } = step;

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-2 text-black">
            Assign Players for {step.name}
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            {category === "batting"
              ? "Select players who will bat during this phase"
              : "Select players who will bowl during this phase"}
          </p>

          <ScrollArea className="h-96 border rounded-lg p-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {selectedPlayers
                .filter((player) => {
                  // Filter based on the current step's category
                  if (step.category === "batting") {
                    // Only show batsmen, wicket keepers, and all-rounders in batting
                    return (
                      player.type.toLowerCase() === "batsman" ||
                      player.type.toLowerCase() === "wicket keeper" ||
                      player.type.toLowerCase() === "all rounder"
                    );
                  }

                  if (step.category === "bowling") {
                    // Only show bowlers and all-rounders in bowling
                    return (
                      player.type.toLowerCase() === "bowler" ||
                      player.type.toLowerCase() === "all rounder"
                    );
                  }

                  return true;
                })
                .map((player) =>
                  renderPlayerCard(
                    player,
                    false,
                    true,
                    !isPlayerEligibleForAssignment(player, currentStep),
                    captain && captain._id === player._id
                  )
                )}
            </div>
          </ScrollArea>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">
            Selected {step.name} Players
          </h3>
          {renderAssignedSlots(category, phase, count)}
        </div>
      </div>
    );
  };

  const handleSubmit = async (e) => {
    console.log(teamScore);
    let res;
    try {
      res = await setUserScore(localStorage.getItem("id") || "", teamScore);
      if (res.status === 200) {
        localStorage.setItem("userScore", res.data.newScore);
        router.push("/leaderboard");
      } else {
        router.refresh();
      }
    } catch (err) {
      if (err && err.response && err.response.status == 400) {
        setErrorMsg(err.response.data.msg);
        setIsDialogOpen(true);
      }
      console.error(err);
    }
  };

  useEffect(() => {
    if (
      !localStorage.getItem("token") ||
      !localStorage.getItem("slot") ||
      !localStorage.getItem("id") ||
      !localStorage.getItem("role")
    ) {
      localStorage.clear();
      router.push("/login");
      return;
    }

    if (localStorage.getItem("userScore") != null) {
      router.push("/leaderboard");
    }
  }, []);

  return (
    <div className="space-y-4 max-w-6xl mx-auto my-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-lg overflow-hidden"
      >
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 flex justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">
              Cricket Team Calculator
            </h2>
            <p className="text-purple-100 text-sm">
              Build and optimize your dream cricket team
            </p>
          </div>
          <Button
            className="m-5"
            variant={"outline"}
            onClick={() => setFlag((prevFlag) => !prevFlag)}
          >
            Refresh
          </Button>
        </div>

        <div className="p-4 bg-gray-50 border-b">
          <div className="flex overflow-x-auto">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center min-w-max">
                {index > 0 && <div className="w-8 h-px bg-gray-300"></div>}
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                    currentStep === index
                      ? "bg-indigo-600 text-white"
                      : isStepComplete(index)
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {isStepComplete(index) ? (
                    <CheckCircleIcon size={16} />
                  ) : (
                    index + 1
                  )}
                </div>
                <div className="ml-2 mr-4">
                  <div className="text-sm font-medium">{step.name}</div>
                  <div className="text-xs text-gray-500">
                    {step.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6">{renderStepContent()}</div>

        <div className="p-4 bg-gray-50 border-t flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="flex items-center"
          >
            <ArrowLeftIcon className="mr-2" size={16} />
            Previous
          </Button>

          {currentStep < steps.length - 1 ? (
            <Button
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={!canProceedToNextStep()}
              className="flex items-center"
            >
              Next
              <ArrowRightIcon className="ml-2" size={16} />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              className="bg-green-600 hover:bg-green-700 flex items-center"
            >
              Submit Score
              <BarChart3Icon className="ml-2" size={16} />
            </Button>
          )}
        </div>
      </motion.div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-500">Error</DialogTitle>
            <DialogDescription>{errorMsg}</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
    
  );
}
