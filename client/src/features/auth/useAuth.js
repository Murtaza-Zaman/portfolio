import { useMutation, useQuery } from "@tanstack/react-query";

import { useAuthStore } from "../../store/authStore";
import { authApi } from "../../services/authApi";

export function useCurrentUser() {
  const token = useAuthStore((state) => state.token);
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => authApi.me(token),
    enabled: Boolean(token),
    retry: false,
  });
}

export function useLogin() {
  return useMutation({ mutationFn: authApi.login });
}