import { Card, CardContent } from "@/components/ui/card";

interface ScoreDisplayProps {
  score: number;
  level: number;
}

export function ScoreDisplay({ score, level }: ScoreDisplayProps) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Score</p>
            <p className="text-2xl font-bold">{score}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Level</p>
            <p className="text-2xl font-bold">{level}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
