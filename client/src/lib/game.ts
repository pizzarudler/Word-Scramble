import { getRandomWord, scrambleWord } from "./words";

export type GameState = {
  currentWord: string;
  scrambledWord: string;
  level: number;
  score: number;
  timeLeft: number;
  isComplete: boolean;
};

export const INITIAL_TIME = 30; // Changed from 60 to 30 seconds
export const POINTS_PER_WORD = 100;
export const TIME_BONUS = 10;

export function initializeGame(): GameState {
  const word = getRandomWord(1);
  return {
    currentWord: word,
    scrambledWord: scrambleWord(word),
    level: 1,
    score: 0,
    timeLeft: INITIAL_TIME,
    isComplete: false,
  };
}

export function checkWord(input: string, currentWord: string): boolean {
  return input.toLowerCase() === currentWord.toLowerCase();
}

export function calculateScore(timeLeft: number, level: number): number {
  return POINTS_PER_WORD + (timeLeft * TIME_BONUS * level);
}