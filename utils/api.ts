// utils/api.ts
import type { CreateItemDto, Item, UpdateItemDto } from "@/types/item";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "https://assignment-todolist-api.vercel.app";
const TENANT_ID = process.env.NEXT_PUBLIC_TENANT_ID;

/** trailing slash 정리 */
function joinUrl(base: string, path: string) {
  return `${base.replace(/\/$/, "")}${path}`;
}

function mustTenantId() {
  if (!TENANT_ID) {
    throw new Error(
      "NEXT_PUBLIC_TENANT_ID가 없습니다. .env.local에 NEXT_PUBLIC_TENANT_ID=본인tenantId 를 추가하세요."
    );
  }
  return TENANT_ID;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(joinUrl(BASE_URL, path), {
    ...init,
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`[${res.status}] ${res.statusText} - ${text}`);
  }

  const contentType = res.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return undefined as T;
  }

  return res.json();
}

/** GET /api/{tenantId}/items */
export function getItems(): Promise<Item[]> {
  const tenantId = mustTenantId();
  return request<Item[]>(`/api/${tenantId}/items`);
}

/** GET /api/{tenantId}/items/{itemId} */
export function getItem(itemId: number): Promise<Item> {
  const tenantId = mustTenantId();
  return request<Item>(`/api/${tenantId}/items/${itemId}`);
}

/** POST /api/{tenantId}/items */
export function createItem(dto: CreateItemDto): Promise<Item> {
  const tenantId = mustTenantId();
  return request<Item>(`/api/${tenantId}/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
}

/** PATCH /api/{tenantId}/items/{itemId} */
export function updateItem(itemId: number, dto: UpdateItemDto): Promise<Item> {
  const tenantId = mustTenantId();
  return request<Item>(`/api/${tenantId}/items/${itemId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
}

/** DELETE /api/{tenantId}/items/{itemId} */
export async function deleteItem(itemId: number): Promise<void> {
  const tenantId = mustTenantId();
  await request<void>(`/api/${tenantId}/items/${itemId}`, { method: "DELETE" });
}

/**
 * POST /api/{tenantId}/images/upload
 * Swagger 응답: { "url": "string" }
 */
export function uploadImage(file: File): Promise<{ url: string }> {
  const tenantId = mustTenantId();
  const formData = new FormData();
  formData.append("image", file);

  return request<{ url: string }>(`/api/${tenantId}/images/upload`, {
    method: "POST",
    body: formData,
  });
}
