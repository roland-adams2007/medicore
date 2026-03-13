/**
 * roleHierarchy.js
 * Single source of truth for role-based permission checks.
 *
 * Role source: selectedClinic.role (current user's role name in this clinic)
 *              selectedClinic.roles (all roles available in this clinic)
 */

// Special roles that aren't in the roles list
const SPECIAL_ROLES = {
  owner: {
    name: 'owner',
    level: -1, // Highest possible authority (even above Clinic Owner)
    canAssignAll: true
  }
};

/**
 * Builds a map of role IDs to their hierarchy level based on parent relationships
 * Lower level = higher authority (Clinic Owner level 0, Clinic Manager level 1, etc.)
 */
function buildRoleHierarchy(roles) {
  const roleMap = new Map();
  const levelMap = new Map();
  
  // First, index roles by ID
  roles.forEach(role => {
    roleMap.set(role.id, role);
  });
  
  // Calculate level for each role (0 = highest, increasing = lower authority)
  roles.forEach(role => {
    let level = 0;
    let currentParentId = role.parent_id;
    const visited = new Set();
    
    // Traverse up the parent chain to calculate depth
    while (currentParentId && !visited.has(currentParentId)) {
      visited.add(currentParentId);
      const parentRole = roleMap.get(currentParentId);
      if (parentRole) {
        level++;
        currentParentId = parentRole.parent_id;
      } else {
        break;
      }
    }
    
    levelMap.set(role.id, level);
  });
  
  return levelMap;
}

/**
 * Checks if a role is a special role (like owner)
 */
function isSpecialRole(roleName) {
  if (!roleName) return false;
  return Object.keys(SPECIAL_ROLES).includes(roleName.toLowerCase().trim());
}

/**
 * Gets the level for any role (including special roles)
 * For regular roles, uses hierarchy. For special roles, uses predefined level.
 * Lower level = higher authority
 */
export function getRoleLevel(roles, roleName) {
  if (!Array.isArray(roles) || !roleName) return Infinity;
  
  const normalizedRoleName = roleName.toLowerCase().trim();
  
  // Check if it's a special role
  if (isSpecialRole(normalizedRoleName)) {
    return SPECIAL_ROLES[normalizedRoleName].level;
  }
  
  // Regular role - find in roles array
  const levelMap = buildRoleHierarchy(roles);
  const role = roles.find(r => r.name?.toLowerCase() === normalizedRoleName);
  
  if (!role) return Infinity;
  return levelMap.get(role.id) ?? Infinity;
}

/**
 * Returns true if the viewer's role strictly outranks the target's role.
 * Uses the parent-child hierarchy from the roles array, with special handling for owner.
 *
 * @param {Object} params
 * @param {string} params.viewerRoleName - selectedClinic.role
 * @param {string} params.targetRoleName - member.role_name
 * @param {Array} params.roles - Full roles array from selectedClinic.roles
 */
export function canEdit({
  viewerRoleName,
  targetRoleName,
  roles,
}) {
  if (!viewerRoleName || !Array.isArray(roles)) return false;
  
  const viewerLevel = getRoleLevel(roles, viewerRoleName);
  const targetLevel = getRoleLevel(roles, targetRoleName);
  
  // Lower level = higher authority
  // Owner has level -1, so it's always less than any positive level
  return viewerLevel < targetLevel;
}

/**
 * Filters a roles array to only roles the viewer is allowed to assign.
 * Viewer can only assign roles BELOW their own authority level in the hierarchy.
 * Owner can assign all roles (except Super Admin).
 * Also excludes "Super Admin" always.
 *
 * @param {Array}  roles            - full roles array (from selectedClinic.roles or store)
 * @param {string} viewerRoleName   - selectedClinic.role
 * @param {string} [currentRoleId]  - optionally exclude the member's current role
 */
export function getAssignableRoles(roles, viewerRoleName, currentRoleId) {
  if (!Array.isArray(roles)) return [];
  
  const viewerLevel = getRoleLevel(roles, viewerRoleName);
  const isOwner = viewerRoleName?.toLowerCase().trim() === 'owner';
  
  console.log('getAssignableRoles:', { 
    roles, 
    viewerRoleName, 
    viewerLevel,
    isOwner,
    currentRoleId
  });

  return roles.filter((r) => {
    if (!r) return false;
    
    // Always exclude Super Admin
    if (r.name?.toLowerCase() === "super admin") return false;
    
    // Exclude current role if specified
    if (currentRoleId && String(r.id) === String(currentRoleId)) return false;
    
    // Get target level from hierarchy
    const targetLevel = getRoleLevel(roles, r.name);
    
    if (isOwner) {
      // Owner can assign any role except Super Admin and their own current role
      // Owner's level is -1, so we just need to ensure it's not the same role
      // and not Super Admin (already filtered)
      return true;
    } else {
      // Regular roles: only roles deeper in the hierarchy (higher level number) are assignable
      return targetLevel > viewerLevel;
    }
  });
}

/**
 * Sorts roles by hierarchy level (highest authority first)
 * Special roles are not included in sorting as they're not in the roles array
 */
export function sortRolesByHierarchy(roles) {
  if (!Array.isArray(roles)) return [];
  
  const levelMap = buildRoleHierarchy(roles);
  
  return [...roles].sort((a, b) => {
    const levelA = levelMap.get(a.id) ?? Infinity;
    const levelB = levelMap.get(b.id) ?? Infinity;
    return levelA - levelB;
  });
}

/**
 * Checks if a user has permission to perform an action on a target user
 * Useful for edit/delete operations
 */
export function hasPermission({
  viewerRoleName,
  targetRoleName,
  viewerId,
  targetId,
  roles,
  allowSelf = true // Can users edit themselves?
}) {
  // Users can always edit themselves if allowSelf is true
  if (allowSelf && viewerId && targetId && String(viewerId) === String(targetId)) {
    return true;
  }
  
  // Check role-based permission
  return canEdit({ viewerRoleName, targetRoleName, roles });
}