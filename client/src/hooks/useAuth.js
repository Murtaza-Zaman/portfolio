import { useAuthStore } from "../store/authStore";
import { SECURITY_STANDARDS } from "../constants/frontendArchitecture";

/**
 * Custom Hook: useAuth
 * Provides access to authentication state, session control, and role-based permissions.
 */
export function useAuth() {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const setSession = useAuthStore((state) => state.setSession);
  const clearSession = useAuthStore((state) => state.clearSession);

  const isAuthenticated = Boolean(token);
  const userRole = user?.role || (isAuthenticated ? "ADMIN" : "GUEST");

  const permissions = SECURITY_STANDARDS.permissions[userRole] || {
    canView: true,
    canEdit: false,
    canDelete: false,
    canManageUsers: false,
    canConfigureSeo: false,
  };

  const isAdmin = userRole === "ADMIN";
  const isEditor = userRole === "EDITOR" || isAdmin;
  const isContentManager = userRole === "CONTENT_MANAGER" || isEditor;

  const canEdit = permissions.canEdit;
  const canDelete = permissions.canDelete;
  const canManageUsers = permissions.canManageUsers;

  return {
    token,
    user,
    isAuthenticated,
    userRole,
    isAdmin,
    isEditor,
    isContentManager,
    canEdit,
    canDelete,
    canManageUsers,
    permissions,
    setSession,
    logout: clearSession,
  };
}
