export const roles = {
  projectManager: "Project Manager",
  productOwner: "Product Owner",
  teamLead: "Team Lead",
  developer: "Developer",
  qa: "QA",
  stakeholder: "Stakeholder"
}

export const assignableRoles = [
  roles.projectManager,
  roles.teamLead,
  roles.developer,
  roles.qa
]

export const roleFormatter = (role) => {
  return role
    .toLowerCase()
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export const isFixedRole = (role) => {
  const formattedRole = roleFormatter(role)
  return formattedRole === roles.productOwner || formattedRole === roles.stakeholder
}