/**
 * User roles for role-based access control (RBAC).
 */
export const ROLES = Object.freeze({
  STUDENT: 'student',
  INSTRUCTOR: 'instructor',
  ADMIN: 'admin',
});

/**
 * Array of all valid roles — useful for Mongoose enum validation.
 */
export const ALL_ROLES = Object.values(ROLES);
