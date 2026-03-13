const SPECIAL_ROLES = {
  owner: {
    name: "owner",
    level: -1,
    canAssignAll: true,
  },
};

function buildRoleHierarchy(roles) {
  const roleMap = new Map();
  const levelMap = new Map();

  roles.forEach((role) => {
    roleMap.set(role.id, role);
  });

  roles.forEach((role) => {
    let level = 0;
    let currentParentId = role.parent_id;
    const visited = new Set();

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

function isSpecialRole(roleName) {
  if (!roleName) return false;
  return Object.keys(SPECIAL_ROLES).includes(roleName.toLowerCase().trim());
}

export function getRoleLevel(roles, roleName) {
  if (!Array.isArray(roles) || !roleName) return Infinity;

  const normalizedRoleName = roleName.toLowerCase().trim();

  if (isSpecialRole(normalizedRoleName)) {
    return SPECIAL_ROLES[normalizedRoleName].level;
  }

  const levelMap = buildRoleHierarchy(roles);
  const role = roles.find((r) => r.name?.toLowerCase() === normalizedRoleName);

  if (!role) return Infinity;
  return levelMap.get(role.id) ?? Infinity;
}

export function canEdit({ viewerRoleName, targetRoleName, roles }) {
  if (!viewerRoleName || !Array.isArray(roles)) return false;

  const viewerLevel = getRoleLevel(roles, viewerRoleName);
  const targetLevel = getRoleLevel(roles, targetRoleName);

  return viewerLevel < targetLevel;
}

export function getAssignableRoles(roles, viewerRoleName, currentRoleId) {
  if (!Array.isArray(roles)) return [];

  const viewerLevel = getRoleLevel(roles, viewerRoleName);
  const isOwner = viewerRoleName?.toLowerCase().trim() === "owner";

  return roles.filter((r) => {
    if (!r) return false;

    if (r.name?.toLowerCase() === "super admin") return false;
    if (currentRoleId && String(r.id) === String(currentRoleId)) return false;

    const targetLevel = getRoleLevel(roles, r.name);

    if (isOwner) {
      return true;
    } else {
      return targetLevel > viewerLevel;
    }
  });
}

export function sortRolesByHierarchy(roles) {
  if (!Array.isArray(roles)) return [];

  const levelMap = buildRoleHierarchy(roles);

  return [...roles].sort((a, b) => {
    const levelA = levelMap.get(a.id) ?? Infinity;
    const levelB = levelMap.get(b.id) ?? Infinity;
    return levelA - levelB;
  });
}

export function hasPermission({
  viewerRoleName,
  targetRoleName,
  viewerId,
  targetId,
  roles,
  allowSelf = true, // Can users edit themselves?
}) {
  // Users can always edit themselves if allowSelf is true
  if (
    allowSelf &&
    viewerId &&
    targetId &&
    String(viewerId) === String(targetId)
  ) {
    return true;
  }

  // Check role-based permission
  return canEdit({ viewerRoleName, targetRoleName, roles });
}
