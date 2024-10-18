import { roles, roleFormatter } from "./roles.util"

const authorizedUtil = (user) => {
  const role = roleFormatter(user.projectRole)
  return role === roles.projectManager || role === roles.productOwner
}

export default authorizedUtil