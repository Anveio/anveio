export const AVATARS = {
  bird: {
    avatarId: "bird",
  },
  bone: {
    avatarId: "bone",
  },
  fish: {
    avatarId: "fish",
  },
  pawprint: {
    avatarId: "pawprint",
  },
  rabbit: {
    avatarId: "rabbit",
  },
  snail: {
    avatarId: "snail",
  },
  turtle: {
    avatarId: "turtle",
  },
  cat: {
    avatarId: "cat",
  },
  dog: {
    avatarId: "dog",
  },
} as const;

export type AvatarId = keyof typeof AVATARS;
export type Avatar = (typeof AVATARS)[AvatarId];
