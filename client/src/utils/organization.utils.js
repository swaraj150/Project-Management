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

export const authorizedUser = (user) => {
  return user.projectRole === roles.productOwner
}