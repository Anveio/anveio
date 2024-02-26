export const AVATAR_BIRD = 'bird';
export const AVATAR_BONE = 'bone';
export const AVATAR_FISH = 'fish';
export const AVATAR_POINTER = 'pointer';
export const AVATAR_RABBIT = 'rabbit';
export const AVATAR_SNAIL = 'snail';
export const AVATAR_TURTLE = 'turtle';
export const AVATAR_CAT = 'cat';
export const AVATAR_DOG = 'dog';

export const AVATAR_IDS = [
  AVATAR_POINTER,
  AVATAR_BIRD,
  AVATAR_BONE,
  AVATAR_FISH,
  AVATAR_RABBIT,
  AVATAR_SNAIL,
  AVATAR_TURTLE,
  AVATAR_CAT,
  AVATAR_DOG,
] as const;

export type AvatarId = (typeof AVATAR_IDS)[number];
