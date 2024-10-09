"use client";

import React, { useState, useEffect } from "react";
import { NextPage } from "next";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Github } from "lucide-react";

const Confetti = dynamic(() => import("react-confetti"), { ssr: false });

type BoxState = {
  opened: boolean;
  isTreasure: boolean;
};

type GameState = {
  found: boolean;
  clicks: number;
  treasureCode: string;
  winTimestamp: string | null;
};

const TreasureHunt: NextPage = () => {
  const [boxes, setBoxes] = useState<BoxState[]>(
    Array(150).fill({ opened: false, isTreasure: false })
  );
  const [treasureIndex, setTreasureIndex] = useState<number | null>(null);
  const [gameState, setGameState] = useState<GameState>({
    found: false,
    clicks: 0,
    treasureCode: "Ba6oooo6 🐥",
    winTimestamp: null,
  });
  const [showHint, setShowHint] = useState<boolean>(true);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);

  useEffect(() => {
    const savedState = localStorage.getItem("treasureHuntState");
    if (savedState) {
      setGameState(JSON.parse(savedState));
    } else {
      const index = Math.floor(Math.random() * 150);
      setTreasureIndex(index);
      const newBoxes = [...boxes];
      newBoxes[index] = { ...newBoxes[index], isTreasure: true };
      setBoxes(newBoxes);
    }
  }, []);

  useEffect(() => {
    if (gameState.found) {
      localStorage.setItem("treasureHuntState", JSON.stringify(gameState));
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  }, [gameState.found]);

  const handleClick = (index: number) => {
    if (gameState.found) return;

    const newGameState = {
      ...gameState,
      clicks: gameState.clicks + 1,
    };

    const newBoxes = [...boxes];
    newBoxes[index] = { ...newBoxes[index], opened: true };
    setBoxes(newBoxes);

    if (index === treasureIndex) {
      const now = new Date();
      newGameState.found = true;
      newGameState.winTimestamp = now.toISOString();
    }

    setGameState(newGameState);
  };

  const handleReset = () => {
    localStorage.removeItem("treasureHuntState");
    window.location.reload();
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    const milliseconds = date.getMilliseconds().toString().padStart(3, "0");
    const ampm = hours >= 12 ? "pm" : "am";
    const formattedHours = (hours % 12 || 12).toString().padStart(2, "0");

    return `${formattedHours}:${minutes}:${seconds}:${milliseconds} ${ampm}`;
  };

  console.log("treasureIndex 🤫", treasureIndex);
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#A3051D] via-[#7D0416] to-[#570310] text-white">
      <main className="container mx-auto p-4 flex flex-col items-center justify-center min-h-screen">
        <motion.h1
          className="text-4xl md:text-5xl font-bold mb-2 text-center text-white"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Treasure Hunt
        </motion.h1>
        <motion.div
          className="mb-2"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/"
            className="flex items-center text-white bg-black/50 px-2 py-4 rounded-xl border-2 gap-2"
          >
            <Github className="w-6 h-6" />
            view code on github
          </Link>
        </motion.div>
        <motion.p
          className="text-lg text-center text-muted mb-12"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          this game was built in less than 30 minutes by the overflow team
        </motion.p>
        <AnimatePresence>
          {gameState.found && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white text-[#A3051D] p-8 rounded-lg shadow-2xl max-w-md w-full"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 500 }}
              >
                <h2 className="text-3xl font-bold mb-4 text-center">
                  Congratulations!
                </h2>
                <p className="mb-4 text-center">
                  You found the treasure in{" "}
                  <span className="font-bold">{gameState.clicks} clicks</span>!
                </p>
                <p className="mb-4 text-center">
                  Your treasure code is:{" "}
                  <span className="font-mono bg-[#A3051D] text-white px-2 py-1 rounded">
                    {gameState.treasureCode}
                  </span>
                </p>
                <p className="mb-6 text-center text-sm">
                  Time of discovery:{" "}
                  <span className="font-mono bg-[#A3051D] text-white px-2 py-1 rounded">
                    {gameState.winTimestamp &&
                      formatTimestamp(gameState.winTimestamp)}
                  </span>
                </p>
                {/* <div className="text-center">
                  <Button
                    onClick={handleReset}
                    className="bg-[#A3051D] hover:bg-[#7D0416] text-white font-bold py-2 px-4 rounded transition duration-200"
                  >
                    Play Again
                  </Button>
                </div> */}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        {!gameState.found && (
          <motion.div
            className="w-full max-w-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <p className="mb-4 text-xl text-center">
              Click the boxes to find the treasure. Clicks: {gameState.clicks}
            </p>
            {/* {showHint && treasureIndex !== null && (
              <Alert className="mb-6 bg-[#7D0416] border border-[#A3051D] text-white">
                <AlertTitle className="text-lg font-semibold">Hint</AlertTitle>
                <AlertDescription className="flex items-center justify-between">
                  <span>
                    The treasure is in box number: {treasureIndex + 1}
                  </span>
                  <Button
                    className="ml-4 bg-[#A3051D] hover:bg-[#7D0416] text-white"
                    size="sm"
                    onClick={() => setShowHint(false)}
                  >
                    Hide
                  </Button>
                </AlertDescription>
              </Alert>
            )} */}
          </motion.div>
        )}
        <motion.div
          className="grid grid-cols-5 sm:grid-cols-10 gap-2 w-full max-w-2xl"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {boxes.map((box, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant={
                  box.opened
                    ? box.isTreasure
                      ? "destructive"
                      : "secondary"
                    : "outline"
                }
                size="lg"
                onClick={() => handleClick(index)}
                disabled={gameState.found}
                className={`w-full aspect-square text-lg md:text-xl transition-all duration-200 ${
                  box.opened
                    ? box.isTreasure
                      ? "bg-yellow-400 hover:bg-yellow-300 text-[#A3051D]"
                      : "bg-gray-300 hover:bg-gray-200 text-[#A3051D]"
                    : "bg-[#52020e] hover:bg-[#7D0416] text-white"
                }`}
              >
                {box.opened && box.isTreasure ? "💎" : ""}
                {box.opened && !box.isTreasure ? "❌" : ""}
                {!box.opened ? "❓" : ""}
              </Button>
            </motion.div>
          ))}
        </motion.div>
      </main>
      {showConfetti && (
        <Confetti
          recycle={false}
          numberOfPieces={200}
          className="z-50"
          colors={["#A3051D", "#7D0416", "#570310", "#FFD700"]}
        />
      )}
      <div>
        <div className="text-center text-white text-sm border-t-2 mt-4 py-3">
          <p>
            Built with {"</>"} by{" "}
            <a
              href="https://said-mz.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Said-MZ
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TreasureHunt;
