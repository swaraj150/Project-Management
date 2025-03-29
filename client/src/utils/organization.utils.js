export const roles = {
  projectManager: "PROJECT_MANAGER",
  productOwner: "PRODUCT_OWNER",
  teamLead: "TEAM_LEAD",
  developer: "DEVELOPER",
  qa: "QA",
  stakeholder: "STAKEHOLDER"
}

export const assignableRoles = [
  roles.projectManager,
  roles.teamLead,
  roles.developer,
  roles.qa
]

export const joinableRoles = [
  roles.developer,
  roles.qa,
  roles.stakeholder
]