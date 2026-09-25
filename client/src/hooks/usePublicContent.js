import { useMutation, useQuery } from "@tanstack/react-query";

import { publicApi } from "../services/publicApi";

const queryOptions = (queryKey, queryFn, enabled = true) => ({
  queryKey,
  queryFn,
  enabled,
  staleTime: 60_000,
});

export function useProfile() {
  return useQuery(queryOptions(["profile"], publicApi.getProfile));
}

export function useServices(params) {
  return useQuery(queryOptions(["services", params], () => publicApi.getServices(params)));
}

export function useService(slug) {
  return useQuery(queryOptions(["service", slug], () => publicApi.getService(slug), Boolean(slug)));
}

export function useProjects(params) {
  return useQuery(queryOptions(["projects", params], () => publicApi.getProjects(params)));
}

export function useProject(slug) {
  return useQuery(queryOptions(["project", slug], () => publicApi.getProject(slug), Boolean(slug)));
}

export function useResume() {
  return useQuery(queryOptions(["resume"], publicApi.getResume));
}

export function useShowcaseCards() {
  return useQuery(queryOptions(["showcaseCards"], publicApi.getShowcaseCards));
}

export function useNodeGraph() {
  return useQuery(queryOptions(["nodeGraph"], publicApi.getNodeGraph));
}

export function useCreateInquiry() {
  return useMutation({
    mutationFn: publicApi.createInquiry,
  });
}
