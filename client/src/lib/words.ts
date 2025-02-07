const easyWords = [
  "cat", "dog", "hat", "run", "fun", "sun", "map", "tap", "nap", "cap"
];

const mediumWords = [
  "house", "plant", "dream", "beach", "train", "cloud", "green", "music", 
  "table", "phone"
];

const hardWords = [
  "amazing", "perfect", "dolphin", "rainbow", "whisper", "silence", 
  "mystery", "journey", "victory", "freedom"
];

export const wordsByLevel = {
  1: easyWords,
  2: mediumWords,
  3: hardWords,
};

export function getRandomWord(level: number): string {
  const words = wordsByLevel[level as keyof typeof wordsByLevel] || easyWords;
  return words[Math.floor(Math.random() * words.length)];
}

export function scrambleWord(word: string): string {
  return word.split('')
    .sort(() => Math.random() - 0.5)
    .join('');
}
