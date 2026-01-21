export function getGoalKey(goalInfo: {
  match_id: string
  player_id: string
  scored_for: string
  main_minute: number
}) {
  return `${goalInfo.match_id}/${goalInfo.player_id}/${goalInfo.scored_for}/${goalInfo.main_minute}`
    .toLowerCase()
    .replace(/\s/g, '')
}
