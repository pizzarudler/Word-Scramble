import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Timer } from "@/components/game/timer";
import { ScoreDisplay } from "@/components/game/score-display";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { initializeGame, checkWord, calculateScore, INITIAL_TIME, type GameState } from "@/lib/game";
import { getRandomWord, scrambleWord } from "@/lib/words";
import { apiRequest } from "@/lib/queryClient";

export default function Game() {
  const [gameState, setGameState] = useState<GameState>(initializeGame());
  const [input, setInput] = useState<string>("");
  const queryClient = useQueryClient();

  useEffect(() => {
    const timer = setInterval(() => {
      setGameState((prev) => ({
        ...prev,
        timeLeft: Math.max(0, prev.timeLeft - 1),
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleNextWord = useCallback(() => {
    const nextLevel = gameState.level + 1;
    const nextWord = getRandomWord(nextLevel);

    setGameState((prev) => ({
      ...prev,
      level: nextLevel,
      currentWord: nextWord,
      scrambledWord: scrambleWord(nextWord),
      timeLeft: Math.min(prev.timeLeft + 10, INITIAL_TIME),
    }));

    setInput("");
  }, [gameState.level]);

  const handleSubmit = useCallback(async () => {
    if (checkWord(input, gameState.currentWord)) {
      const additionalScore = calculateScore(gameState.timeLeft, gameState.level);

      setGameState((prev) => ({
        ...prev,
        score: prev.score + additionalScore,
      }));

      toast({
        title: "Correct!",
        description: `+${additionalScore} points! Moving to next level...`,
      });

      handleNextWord();
    } else {
      toast({
        title: "Incorrect",
        description: `The correct word was: ${gameState.currentWord}`,
        variant: "destructive",
      });

      // Move to next word after showing the answer
      setTimeout(() => {
        const nextWord = getRandomWord(gameState.level);
        setGameState((prev) => ({
          ...prev,
          currentWord: nextWord,
          scrambledWord: scrambleWord(nextWord),
        }));
        setInput("");
      }, 2000);
    }
  }, [input, gameState, handleNextWord]);

  const handleGameOver = useCallback(async () => {
    setGameState((prev) => ({ ...prev, isComplete: true }));

    try {
      await apiRequest("POST", "/api/scores", {
        playerName: "Player",
        score: gameState.score,
        level: gameState.level,
      });

      queryClient.invalidateQueries({ queryKey: ["/api/scores"] });

      toast({
        title: "Game Over!",
        description: `Final Score: ${gameState.score}`,
      });
    } catch (error) {
      toast({
        title: "Error saving score",
        variant: "destructive",
      });
    }
  }, [gameState.score, gameState.level, queryClient]);

  return (
    <div className="min-h-screen w-full p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 opacity-20 animate-gradient" />
      <div className="absolute inset-0 bg-grid-white/10" />

      <motion.div
        className="relative w-full max-w-md mx-auto space-y-4 mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <ScoreDisplay score={gameState.score} level={gameState.level} />
        <Timer 
          timeLeft={gameState.timeLeft} 
          maxTime={INITIAL_TIME}
          onTimeUp={handleGameOver}
        />

        <Card className="w-full backdrop-blur-sm bg-white/90">
          <CardContent className="p-4 space-y-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Unscramble this word:</p>
              <h2 className="text-4xl font-bold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                {gameState.scrambledWord}
              </h2>
            </div>

            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Type your answer"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyUp={(e) => {
                  if (e.key === "Enter") {
                    handleSubmit();
                  }
                }}
                className="text-center text-xl"
              />
              <Button 
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                Submit
              </Button>
            </div>
          </CardContent>
        </Card>

        {gameState.isComplete && (
          <Button 
            className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700" 
            onClick={() => {
              setGameState(initializeGame());
              setInput("");
            }}
          >
            Play Again
          </Button>
        )}
      </motion.div>
    </div>
  );
}