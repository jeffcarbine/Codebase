import { userRoles } from "../models/User.js";

export const checkRole =
  (minimumRole = "member") =>
  async (req, res, next) => {
    const user = req.user,
      userRole = user.role,
      minimumRoleIndex = userRoles.indexOf(minimumRole),
      userRoleIndex = userRoles.indexOf(userRole);

    if (minimumRoleIndex > userRoleIndex) {
      return res.redirect("/login");
    } else {
      next();
    }
  };
