import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";

interface TimerProps {
  timeLeft: number;
  maxTime: number;
  onTimeUp: () => void;
}

export function Timer({ timeLeft, maxTime, onTimeUp }: TimerProps) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    setProgress((timeLeft / maxTime) * 100);
  }, [timeLeft, maxTime]);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
    }
  }, [timeLeft, onTimeUp]);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium">Time Left</span>
        <span className="text-sm font-medium">{timeLeft}s</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
}
