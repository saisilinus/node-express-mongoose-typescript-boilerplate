const allRoles = {
  user: ['getProducts', 'buyProducts'],
  admin: ['getUsers', 'manageUsers', 'getProducts', 'manageProducts', 'buyProducts'],
};

export const roles: string[] = Object.keys(allRoles);
export const roleRights: Map<string, string[]> = new Map(Object.entries(allRoles));
