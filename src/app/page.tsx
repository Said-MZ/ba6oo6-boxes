"use client";

import React, { useState, useEffect } from "react";
import { NextPage } from "next";
import Head from "next/head";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type BoxState = {
  opened: boolean;
  isTreasure: boolean;
};

const TreasureHunt: NextPage = () => {
  const [boxes, setBoxes] = useState<BoxState[]>(
    Array(100).fill({ opened: false, isTreasure: false })
  );
  const [treasureIndex, setTreasureIndex] = useState<number | null>(null);
  const [found, setFound] = useState<boolean>(false);
  const [clicks, setClicks] = useState<number>(0);
  const [showHint, setShowHint] = useState<boolean>(true);

  useEffect(() => {
    const index = Math.floor(Math.random() * 100);
    setTreasureIndex(index);
    const newBoxes = [...boxes];
    newBoxes[index] = { ...newBoxes[index], isTreasure: true };
    setBoxes(newBoxes);
  }, []);

  const handleClick = (index: number) => {
    if (found) return;

    setClicks(clicks + 1);

    const newBoxes = [...boxes];
    newBoxes[index] = { ...newBoxes[index], opened: true };
    setBoxes(newBoxes);

    if (index === treasureIndex) {
      setFound(true);
    }
  };

  const treasureCode = "Ba6oooo6 🐥";

  return (
    <>
      <main className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Treasure Hunt</h1>
        {found ? (
          <Alert className="bg-emerald-500 text-emerald-1000 font-bold">
            <AlertTitle>Congratulations!</AlertTitle>
            <AlertDescription>
              You found the treasure in {clicks} clicks! Your treasure code is:{" "}
              {treasureCode}
            </AlertDescription>
          </Alert>
        ) : (
          <div>
            <p className="mb-4">
              Click the boxes to find the treasure. Clicks: {clicks}
            </p>
            {showHint && treasureIndex !== null && (
              <Alert className="mb-4">
                <AlertTitle>Hint</AlertTitle>
                <AlertDescription>
                  The treasure is in box number: {treasureIndex + 1}
                  <Button
                    className="ml-4"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowHint(false)}
                  >
                    Hide Hint
                  </Button>
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
        <div className="grid grid-cols-10 sm:grid-cols-20 md:grid-cols-25 lg:grid-cols-50 gap-1">
          {boxes.map((box, index) => (
            <Button
              key={index}
              variant={
                box.opened
                  ? box.isTreasure
                    ? "destructive"
                    : "secondary"
                  : "outline"
              }
              size="sm"
              onClick={() => handleClick(index)}
              disabled={found}
              className="w-6 h-6 p-0"
            >
              {box.opened && box.isTreasure ? "💎" : ""}
            </Button>
          ))}
        </div>
      </main>
    </>
  );
};

export default TreasureHunt;
