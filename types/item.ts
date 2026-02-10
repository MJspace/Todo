export type Item = {
  id: number;
  tenantId: string;
  name: string;
  memo: string | null;
  imageUrl: string | null;
  isCompleted: boolean; // default false
};

export type CreateItemDto = {
  name: string;
};

export type UpdateItemDto = {
  name?: string;
  memo?: string | null;
  imageUrl?: string | null;
  isCompleted?: boolean;
};
