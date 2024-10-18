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

export const isFixedRole = (role) => {
  return role === roles.productOwner || role === roles.stakeholder
}

export const authorizedUser = (user) => {
  console.log(user.projectRole, roles.productOwner)
  return user.projectRole === roles.projectManager || user.projectRole === roles.productOwner
}