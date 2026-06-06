import { api } from "./client";
import type {
  Contribution,
  CreateContribution,
  Member,
  Settings,
} from "../types";

export const membersApi = {
  list: () => api.get<Member[]>("/members"),
  create: (name: string) => api.post<Member>("/members", { name }),
  remove: (id: string) => api.del(`/members/${id}`),
};

export const contributionsApi = {
  list: () => api.get<Contribution[]>("/contributions"),
  create: (entries: CreateContribution[]) =>
    api.post<Contribution[]>("/contributions", { entries }),
};

export const settingsApi = {
  get: () => api.get<Settings>("/settings"),
  update: (divisor: number) => api.put<Settings>("/settings", { divisor }),
};
