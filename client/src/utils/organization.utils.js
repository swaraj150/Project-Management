export const roles = {
  productOwner: 'PRODUCT_OWNER',
  projectManager: 'PROJECT_MANAGER',
  teamLead: 'TEAM_LEAD',
  developer: 'DEVELOPER',
  qa: 'QA',
  stakeholder: 'STAKEHOLDER'
}

export const rolesMap = {
  PRODUCT_OWNER: 'Product Owner',
  PROJECT_MANAGER: 'Project Manager',
  TEAM_LEAD: 'Team Lead',
  DEVELOPER: 'Developer',
  QA: 'QA',
  STAKEHOLDER: 'Stakeholder'
}

export const joinableRoles = [
  { value: roles.projectManager, label: 'Project Manager' },
  { value: roles.developer, label: 'Developer' },
  { value: roles.qa, label: 'QA' },
  { value: roles.stakeholder, label: 'Stakeholder' }
]