import type { BoundStateCreator } from "~/hooks/useBoundStore";

export type GoalXp = 1 | 10 | 20 | 30 | 50 | 100;

export type GoalXpSlice = {
  goalXp: GoalXp;
  setGoalXp: (newGoalXp: GoalXp) => void;
};

export const createGoalXpSlice: BoundStateCreator<GoalXpSlice> = (set) => ({
  goalXp: 100 as GoalXp,
  setGoalXp: (newGoalXp: GoalXp) => set({ goalXp: newGoalXp }),
});
