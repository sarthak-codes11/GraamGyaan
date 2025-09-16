import type { BoundStateCreator } from "~/hooks/useBoundStore";

export type BadgeSlice = {
  badges: string[];
  addBadge: (badge: string) => void;
  hasBadge: (badge: string) => boolean;
};

export const createBadgeSlice: BoundStateCreator<BadgeSlice> = (set, get) => ({
  badges: [
    "First Learner",
    "Starting Steps",
    "Consistency Starter",
  ],
  addBadge: (badge: string) =>
    set(({ badges }) =>
      badges.includes(badge) ? { badges } : { badges: [...badges, badge] }
    ),
  hasBadge: (badge: string) => get().badges.includes(badge),
});


