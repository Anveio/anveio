const SAYINGS = [
  "The internet should feel alive.",
  "Hey Siri, how do I live a life worth living?",
  "Every website should be realtime & multi-player.",
];

export const getRandomSaying = () => {
  return SAYINGS[Math.floor(Math.random() * SAYINGS.length)];
};
