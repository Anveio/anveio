const SAYINGS = [
  'The internet should feel alive.',
  'Hey Siri, how do I live a life worth living?',
  'Every website should be realtime & multi-player.',
] as const;

export const getSaying = (index: 0 | 1 | 2) => {
  return SAYINGS[index];
};
