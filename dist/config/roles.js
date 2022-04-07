const allRoles = {
  user: [],
  admin: ['getUsers', 'manageUsers'],
};
export const roles = Object.keys(allRoles);
export const roleRights = new Map(Object.entries(allRoles));
// # sourceMappingURL=roles.js.map
