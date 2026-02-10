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
    // 과제 API는 캐시하면 갱신이 안 보일 수 있어서 no-store 추천
    cache: "no-store",
  });

  // 실패 시 디버깅 가능한 메시지
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`[${res.status}] ${res.statusText} - ${text}`);
  }

  // DELETE 같은 응답이 비어있는 경우 대비
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

/** POST /api/{tenantId}/images/upload */
export function uploadImage(file: File): Promise<{ imageUrl: string }> {
  const tenantId = mustTenantId();
  const formData = new FormData();
  // Swagger에서 field name이 image인 경우가 보통이라 image로 둠 (다르면 바꿔야 함)
  formData.append("image", file);

  return request<{ imageUrl: string }>(`/api/${tenantId}/images/upload`, {
    method: "POST",
    body: formData,
  });
}
