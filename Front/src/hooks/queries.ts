import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { contributionsApi, membersApi, settingsApi } from "../api/endpoints";
import type { Contribution, CreateContribution, MemberStats } from "../types";
import { fmt } from "../lib/search";

const keys = {
  members: ["members"] as const,
  contributions: ["contributions"] as const,
  settings: ["settings"] as const,
};

/* ---------- Members ---------- */
export function useMembers() {
  return useQuery({ queryKey: keys.members, queryFn: membersApi.list });
}

export function useCreateMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => membersApi.create(name),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.members }),
  });
}

export function useDeleteMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => membersApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.members });
      qc.invalidateQueries({ queryKey: keys.contributions });
    },
  });
}

/* ---------- Contributions ---------- */
export function useContributions() {
  return useQuery({
    queryKey: keys.contributions,
    queryFn: contributionsApi.list,
  });
}

export function useCreateContributions() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (entries: CreateContribution[]) =>
      contributionsApi.create(entries),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.contributions }),
  });
}

/* ---------- Settings ---------- */
export function useSettings() {
  return useQuery({ queryKey: keys.settings, queryFn: settingsApi.get });
}

export function useUpdateDivisor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (divisor: number) => settingsApi.update(divisor),
    onSuccess: (data) => qc.setQueryData(keys.settings, data),
  });
}

/* ---------- Derived ---------- */
export function memberStats(
  contributions: Contribution[],
  memberId: string
): MemberStats {
  let mat = 0;
  let event = 0;
  for (const c of contributions) {
    if (c.memberId !== memberId) continue;
    if (c.type === "Event") event += c.points;
    else mat += c.points;
  }
  return { mat: fmt(mat), event: fmt(event), total: fmt(mat + event) };
}
