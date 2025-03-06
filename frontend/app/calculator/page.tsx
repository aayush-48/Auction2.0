"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuction, type Player } from "../../context/AuctionContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";

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
} from "lucide-react";

const calculateOverallRating = (player) => {
  const { ratings, type } = player;
  const { batting, bowling, rtmElite, captaincy } = ratings;
  let overallRating;

  if (
    type.toLowerCase() === "batsman" ||
    type.toLowerCase() === "wicket-keeper"
  ) {
    const battingAvg =
      (batting.powerplay + batting.middleOvers + batting.deathOvers) / 3;
    overallRating = (battingAvg + rtmElite + captaincy) / 3;
  } else if (type.toLowerCase() === "bowler") {
    const bowlingAvg =
      (bowling.powerplay + bowling.middleOvers + bowling.deathOvers) / 3;
    overallRating = (bowlingAvg + rtmElite + captaincy) / 3;
  } else {
    // All-rounder
    const battingAvg =
      (batting.powerplay + batting.middleOvers + batting.deathOvers) / 3;
    const bowlingAvg =
      (bowling.powerplay + bowling.middleOvers + bowling.deathOvers) / 3;
    overallRating = (battingAvg + bowlingAvg + rtmElite + captaincy) / 4;
  }

  return (Math.round(overallRating * 10) / 10).toFixed(1);
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

export default function Calculator() {
  const { userPlayers } = useAuction();
  const [availablePlayers, setAvailablePlayers] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [teamScore, setTeamScore] = useState(0);
  const [currentStep, setCurrentStep] = useState(0); // Start at step 0 (which is now batting powerplay)
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
  const [showScoreDetails, setShowScoreDetails] = useState(false);
  const [scoreBreakdown, setScoreBreakdown] = useState({
    baseScore: 0,
    battingBonus: 0,
    bowlingBonus: 0,
  });
  const players = userPlayers;

  // Define the steps for the sequential flow - remove the first selection step
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
    { name: "Results", description: "View your team's performance score" },
  ];

  useEffect(() => {
    if (players && players.length > 0) {
      // Set all players as selected players automatically
      setSelectedPlayers(players);
      setAvailablePlayers(players);
    }
  }, [players]);

  useEffect(() => {
    recalculateTeamScore();
  }, [battingSelection, bowlingSelection]);

  const handleAssignPlayer = (player, stepIndex) => {
    const currentStepData = steps[stepIndex];
    const { category, phase } = currentStepData;

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

  const isPlayerEligibleForAssignment = (player, stepIndex) => {
    if (!player) return false;

    const currentStepData = steps[stepIndex];
    const { category, phase } = currentStepData;

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
        newBaseScore += player.ratings.batting[category];
      });
    });

    // Bowling section scores
    ["powerplay", "middleOvers", "deathOvers"].forEach((category) => {
      bowlingSelection[category].forEach((player) => {
        if (!player) return;
        newBaseScore += player.ratings.bowling[category];
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

    // Update the state
    setScoreBreakdown({
      baseScore: Math.round(newBaseScore * 100) / 100,
      battingBonus,
      bowlingBonus,
    });

    setTeamScore(newBaseScore + battingBonus + bowlingBonus);
  };

  const calculateTeamScore = () => {
    // Get all selected players from batting and bowling categories
    const battingPlayers = Object.values(battingSelection)
      .flat()
      .filter((p) => p !== null);

    const bowlingPlayers = Object.values(bowlingSelection)
      .flat()
      .filter((p) => p !== null);

    // Check if all positions are filled
    const allBattingSlots = Object.values(battingSelection).flat().length;
    const allBowlingSlots = Object.values(bowlingSelection).flat().length;
    const filledBattingSlots = battingPlayers.length;
    const filledBowlingSlots = bowlingPlayers.length;

    if (
      filledBattingSlots < allBattingSlots ||
      filledBowlingSlots < allBowlingSlots
    ) {
      alert(
        "Please fill all batting and bowling positions before calculating the score."
      );
      return;
    }

    // Calculate base score
    let baseScore = 0;

    // Batting section scores
    ["powerplay", "middleOvers", "deathOvers"].forEach((category) => {
      battingSelection[category].forEach((player) => {
        if (!player) return;
        baseScore += player.ratings.batting[category];
      });
    });

    // Bowling section scores
    ["powerplay", "middleOvers", "deathOvers"].forEach((category) => {
      bowlingSelection[category].forEach((player) => {
        if (!player) return;
        baseScore += player.ratings.bowling[category];
      });
    });

    // Bonus Calculation Function
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

    // Set score breakdown
    setScoreBreakdown({
      baseScore: Math.round(baseScore * 100) / 100,
      battingBonus,
      bowlingBonus,
    });

    // Final Team Score
    setTeamScore(baseScore + battingBonus + bowlingBonus);
    setShowScoreDetails(true);
    setCurrentStep(6); // Move to results step
  };

  const isStepComplete = (stepIndex) => {
    const step = steps[stepIndex];

    if (stepIndex === 6) {
      // Results step (was 7, now 6)
      return showScoreDetails;
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
    isDisabled = false
  ) => {
    if (!player) return null;

    return (
      <Card
        key={player._id}
        className={`relative group transition-all ${
          isDisabled ? "opacity-50" : "hover:shadow-md"
        }`}
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
                Rating: {calculateOverallRating(player)}
              </Badge>
            </div>
          </CardContent>

          {isAssignmentStep && !isDisabled && (
            <CardFooter className="pt-0 pb-3 justify-center">
              <Button
                size="sm"
                className="w-full"
                onClick={() => handleAssignPlayer(player, currentStep)}
              >
                Assign
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
            className="relative group min-h-[120px] flex items-center justify-center"
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

  const renderStepContent = () => {
    const step = steps[currentStep];

    // Step 6 (was 7): Results
    if (currentStep === 6) {
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
              <div className="border-t pt-3 flex justify-between font-medium text-xl">
                <span>Total:</span>
                <span>{Math.round(teamScore * 100) / 100}</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <Tabs defaultValue="battingPowerplay">
              <TabsList className="w-full grid grid-cols-6">
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
            </Tabs>
          </div>
        </div>
      );
    }

    // Steps 0-5: Assignment Steps (was 1-6)
    const { category, phase, count } = step;

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-2">
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
                    !isPlayerEligibleForAssignment(player, currentStep)
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

  return (
    <div className="space-y-4 max-w-6xl mx-auto my-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-lg overflow-hidden"
      >
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4">
          <h2 className="text-xl font-bold text-white">
            Cricket Team Calculator
          </h2>
          <p className="text-purple-100 text-sm">
            Build and optimize your dream cricket team
          </p>
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
            onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
            disabled={currentStep === 0}
            className="flex items-center"
          >
            <ArrowLeftIcon size={16} className="mr-2" />
            Previous
          </Button>

          {currentStep < 5 ? (
            <>
              <div className="flex gap-5">
                <p className="text-gray-500 mt-2">Total Team Score</p>
                <div className="text-3xl font-bold text-indigo-600">
                  {Math.round(teamScore * 100) / 100}
                </div>
              </div>
              <Button
                onClick={() => { console.log(currentStep);
                 setCurrentStep((prev) => prev + 1)}}
                disabled={!canProceedToNextStep()}
                className="bg-indigo-600 hover:bg-indigo-700 flex items-center"
              >
                Next
                <ArrowRightIcon size={16} className="ml-2" />
              </Button>
            </>
          ) : currentStep === 5 ? (
            <Button
              onClick={calculateTeamScore}
              disabled={!canProceedToNextStep()}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Calculate Team Score
              <BarChart3Icon size={16} className="ml-2" />
            </Button>
          ) : (
            <Button
              className="bg-indigo-600 hover:bg-indigo-700"
              variant="outline"
              onClick={() => {
                // Reset everything
                setBattingSelection({
                  powerplay: Array(4).fill(null),
                  middleOvers: Array(4).fill(null),
                  deathOvers: Array(3).fill(null),
                });
                setBowlingSelection({
                  powerplay: Array(3).fill(null),
                  middleOvers: Array(3).fill(null),
                  deathOvers: Array(4).fill(null),
                });
                setTeamScore(0);
                setShowScoreDetails(false);
                setCurrentStep(0);
              }}
            >
              Start Over
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
}