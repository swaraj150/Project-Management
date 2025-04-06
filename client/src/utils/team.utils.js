export const headings = [
  'Team Name',
  'Team Lead',
  'Members',
  'Developers',
  'Testers'
]

export const membersCount = (team) => {
  return team.developers.length + team.testers.length + 1
}

export const developersCount = (team) => {
  return team.developers.length
}

export const testersCount = (team) => {
  return team.testers.length
}