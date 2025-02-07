import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, ArrowLeft } from "lucide-react";
import type { Score } from "@shared/schema";

interface LeaderboardProps {
  onBack: () => void;
}

export function Leaderboard({ onBack }: LeaderboardProps) {
  const { data: scores } = useQuery<Score[]>({ 
    queryKey: ["/api/scores"],
  });

  return (
    <Card className="w-full max-w-md mx-auto backdrop-blur-sm bg-white/90">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">
          <Trophy className="w-6 h-6 inline-block mr-2" />
          Leaderboard
        </CardTitle>
        <Button
          variant="outline"
          size="icon"
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {scores?.map((score, index) => (
            <div
              key={score.id}
              className="flex items-center justify-between p-2 rounded-lg bg-accent/50"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold">{index + 1}.</span>
                <div>
                  <p className="font-medium">{score.playerName}</p>
                  <p className="text-sm text-muted-foreground">Level {score.level}</p>
                </div>
              </div>
              <span className="text-xl font-bold">{score.score}</span>
            </div>
          ))}
          {!scores?.length && (
            <p className="text-center text-muted-foreground">No scores yet!</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
