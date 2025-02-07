const easyWords = [
  "cat", "dog", "hat", "run", "fun", "sun", "map", "tap", "nap", "cap",
  "pen", "box", "cup", "sky", "red", "big", "log", "hop", "fan", "bat"
];

const mediumWords = [
  "house", "plant", "dream", "beach", "train", "cloud", "green", "music", 
  "table", "phone", "happy", "smile", "dance", "light", "quiet", "bread",
  "grass", "paint", "sweet", "clear"
];

const hardWords = [
  "amazing", "perfect", "dolphin", "rainbow", "whisper", "silence", 
  "mystery", "journey", "victory", "freedom", "sparkle", "harmony",
  "blossom", "inspire", "achieve", "explore", "wonder", "delight",
  "cascade", "vibrant"
];

export const wordsByLevel = {
  1: easyWords,
  2: mediumWords,
  3: hardWords,
};

let usedWords = new Set<string>();

export function getRandomWord(level: number): string {
  const words = wordsByLevel[level as keyof typeof wordsByLevel] || easyWords;

  // Reset used words if we've used too many
  if (usedWords.size >= words.length * 0.75) {
    usedWords.clear();
  }

  // Get available words
  const availableWords = words.filter(word => !usedWords.has(word));

  // If no available words, clear used words and try again
  if (availableWords.length === 0) {
    usedWords.clear();
    return getRandomWord(level);
  }

  const word = availableWords[Math.floor(Math.random() * availableWords.length)];
  usedWords.add(word);
  return word;
}

export function scrambleWord(word: string): string {
  let scrambled = word;

  // Keep scrambling until we get a different arrangement
  while (scrambled === word) {
    scrambled = word.split('')
      .sort(() => Math.random() - 0.5)
      .join('');
  }

  return scrambled;
}