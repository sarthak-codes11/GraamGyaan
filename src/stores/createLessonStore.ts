import { units } from "~/utils/units";
import type { BoundStateCreator } from "~/hooks/useBoundStore";

export type LessonSlice = {
  lessonsCompleted: number;
  milestonesOpened: number;
  increaseLessonsCompleted: (by?: number) => void;
  increaseMilestonesOpened: (by?: number) => void;
  jumpToUnit: (unitNumber: number) => void;
};

export const createLessonSlice: BoundStateCreator<LessonSlice> = (set) => ({
  lessonsCompleted: 0,
  milestonesOpened: 0,
  increaseLessonsCompleted: (by = 1) =>
    set(({ lessonsCompleted }) => ({
      lessonsCompleted: lessonsCompleted + by,
    })),
  increaseMilestonesOpened: (by = 1) =>
    set(({ milestonesOpened }) => ({
      milestonesOpened: milestonesOpened + by,
    })),
  jumpToUnit: (unitNumber: number) =>
    set(({ lessonsCompleted }) => {
      const lessonsPerTile = 4;
      const totalLessonsToJumpToUnit = units
        .filter((unit) => unit.unitNumber < unitNumber)
        .map((unit) => unit.tiles.length * lessonsPerTile)
        .reduce((a, b) => a + b, 0);
      return {
        lessonsCompleted: Math.max(lessonsCompleted, totalLessonsToJumpToUnit),
      };
    }),
});
