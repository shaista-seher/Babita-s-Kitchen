import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import type { CreateOrderRequest, AddAddressRequest } from "@shared/schema";
import { z } from "zod";

function parseWithLogging<T>(schema: z.ZodSchema<T>, data: unknown, label: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error(`[Zod] ${label} validation failed:`, result.error.format());
    throw result.error;
  }
  return result.data;
}

export function useProducts(params?: Record<string, string | boolean | undefined>) {
  return useQuery({
    queryKey: [api.products.list.path, params],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== "") {
            queryParams.append(key, String(value));
          }
        });
      }
      const url = `${api.products.list.path}${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      return parseWithLogging(api.products.list.responses[200], data, "products.list");
    },
  });
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: [api.products.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.products.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch product");
      const data = await res.json();
      return parseWithLogging(api.products.get.responses[200], data, "products.get");
    },
  });
}

export function useCategories() {
  return useQuery({
    queryKey: [api.categories.list.path],
    queryFn: async () => {
      const res = await fetch(api.categories.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data = await res.json();
      return parseWithLogging(api.categories.list.responses[200], data, "categories.list");
    },
  });
}

export function useOrders() {
  return useQuery({
    queryKey: [api.orders.list.path],
    queryFn: async () => {
      const res = await fetch(api.orders.list.path, { credentials: "include" });
      if (res.status === 401) throw new Error("Unauthorized");
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      return parseWithLogging(api.orders.list.responses[200], data, "orders.list");
    },
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (orderData: CreateOrderRequest) => {
      const validated = api.orders.create.input.parse(orderData);
      const res = await fetch(api.orders.create.path, {
        method: api.orders.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 401) throw new Error("Unauthorized");
        throw new Error("Failed to create order");
      }
      const data = await res.json();
      return parseWithLogging(api.orders.create.responses[201], data, "orders.create");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.orders.list.path] });
    },
  });
}

export function useAddresses() {
  return useQuery({
    queryKey: [api.addresses.list.path],
    queryFn: async () => {
      const res = await fetch(api.addresses.list.path, { credentials: "include" });
      if (res.status === 401) throw new Error("Unauthorized");
      if (!res.ok) throw new Error("Failed to fetch addresses");
      const data = await res.json();
      return parseWithLogging(api.addresses.list.responses[200], data, "addresses.list");
    },
    retry: false,
  });
}

export function useCreateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (addressData: AddAddressRequest) => {
      const validated = api.addresses.create.input.parse(addressData);
      const res = await fetch(api.addresses.create.path, {
        method: api.addresses.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 401) throw new Error("Unauthorized");
        throw new Error("Failed to add address");
      }
      const data = await res.json();
      return parseWithLogging(api.addresses.create.responses[201], data, "addresses.create");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.addresses.list.path] });
    },
  });
}
