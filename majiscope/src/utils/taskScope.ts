import type { Task } from '../types/task';

type LeaderScopeUser = {
  name?: string | null;
  team?: string | null;
  teamId?: string | null;
};

const normalize = (value?: string | null) => value?.trim().toLowerCase() || '';

export const taskMatchesLeaderScope = (task: Task, currentUser?: LeaderScopeUser | null) => {
  if (!currentUser) return true;

  const teamName = normalize(currentUser.team);
  const teamId = normalize(currentUser.teamId);
  const leaderName = normalize(currentUser.name);
  const hasScope = Boolean(teamName || teamId || leaderName);

  if (!hasScope) return true;

  return (
    (teamId.length > 0 && normalize(task.teamId) === teamId) ||
    (teamName.length > 0 && normalize(task.assignedTeam) === teamName) ||
    (leaderName.length > 0 && normalize(task.teamLeader) === leaderName)
  );
};
