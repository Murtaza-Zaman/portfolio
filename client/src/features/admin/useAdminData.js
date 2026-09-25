import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { adminApi } from "../../services/adminApi";
import { getAccessToken, useAuthStore } from "../../store/authStore";

export function useAdminList(resource, params = {}) {
  const token = useAuthStore((state) => state.token);
  return useQuery({
    queryKey: ["admin", resource, params, token],
    queryFn: () => adminApi.list(resource, params, getAccessToken()),
    enabled: Boolean(resource),
  });
}

export function useAdminCreate(resource) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => adminApi.create(resource, data, getAccessToken()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", resource] });
      queryClient.invalidateQueries({ queryKey: [resource] });
    },
  });
}

export function useAdminUpdate(resource) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => adminApi.update(resource, id, data, getAccessToken()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", resource] });
      queryClient.invalidateQueries({ queryKey: [resource] });
    },
  });
}

export function useAdminPublish(resource) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => adminApi.publish(resource, id, getAccessToken()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", resource] });
      queryClient.invalidateQueries({ queryKey: [resource] });
    },
  });
}

export function useAdminUnpublish(resource) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => adminApi.unpublish(resource, id, getAccessToken()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", resource] });
      queryClient.invalidateQueries({ queryKey: [resource] });
    },
  });
}

export function useAdminArchive(resource) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => adminApi.archive(resource, id, getAccessToken()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", resource] });
      queryClient.invalidateQueries({ queryKey: [resource] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export function useAdminDelete(resource) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => adminApi.delete(resource, id, getAccessToken()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", resource] });
      queryClient.invalidateQueries({ queryKey: [resource] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export function useAdminUpload() {
  return useMutation({
    mutationFn: ({ file, folder }) => adminApi.upload(file, folder, getAccessToken()),
  });
}

export function useAdminInquiries(params = {}) {
  const token = useAuthStore((state) => state.token);
  return useQuery({
    queryKey: ["admin", "inquiries", params, token],
    queryFn: () => adminApi.list("messages", params, getAccessToken()),
  });
}

export function useAdminUpdateInquiry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status, notes }) => adminApi.updateInquiryStatus(id, { status, notes }, getAccessToken()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "inquiries"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "messages"] });
    },
  });
}

export function useAdminAuditEvents(params = {}) {
  const token = useAuthStore((state) => state.token);
  return useQuery({
    queryKey: ["admin", "audit", params, token],
    queryFn: () => adminApi.getAuditEvents(params, getAccessToken()),
  });
}

