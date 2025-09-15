import { useBoundStore } from "~/hooks/useBoundStore";
import { fakeUsers } from "~/utils/fakeUsers";

export const useLeaderboardUsers = () => {
  const xpToday = useBoundStore((x) => x.xpToday());
  const name = useBoundStore((x) => x.name);
  const userInfo = {
    name,
    xp: xpToday,
    isCurrentUser: true,
  } as const;
  // Merge motivating dummy users with the real user and sort by XP desc
  return [...fakeUsers, userInfo].sort((a, b) => b.xp - a.xp);
};

export const useLeaderboardRank = () => {
  const leaderboardUsers = useLeaderboardUsers();
  const index = leaderboardUsers.findIndex((user) => user.isCurrentUser);
  return index === -1 ? null : index + 1;
};
