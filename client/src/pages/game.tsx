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


  const handleSubmit = useCallback(async () => {
    if (checkWord(input, gameState.currentWord)) {
      const nextLevel = gameState.level + 1;
      const additionalScore = calculateScore(gameState.timeLeft, gameState.level);
      const nextWord = getRandomWord(nextLevel);

      setGameState((prev) => ({
        ...prev,
        level: nextLevel,
        score: prev.score + additionalScore,
        currentWord: nextWord,
        scrambledWord: scrambleWord(nextWord),
        timeLeft: Math.min(prev.timeLeft + 10, INITIAL_TIME),
      }));

      setInput("");
      toast({
        title: "Correct!",
        description: `+${additionalScore} points! Next level: ${nextLevel}`,
      });
    } else {
      toast({
        title: "Incorrect",
        description: "Try again!",
        variant: "destructive",
      });
    }
  }, [input, gameState]);

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
    <div className="min-h-screen w-full p-4 flex flex-col gap-4 items-center justify-center bg-background">
      <motion.div
        className="w-full max-w-md space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <ScoreDisplay score={gameState.score} level={gameState.level} />
        <Timer 
          timeLeft={gameState.timeLeft} 
          maxTime={INITIAL_TIME}
          onTimeUp={handleGameOver}
        />

        <Card className="w-full">
          <CardContent className="p-4 space-y-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Unscramble this word:</p>
              <h2 className="text-4xl font-bold tracking-wider">{gameState.scrambledWord}</h2>
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
                className="w-full"
              >
                Submit
              </Button>
            </div>
          </CardContent>
        </Card>

        {gameState.isComplete && (
          <Button 
            className="w-full" 
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