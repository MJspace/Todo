"use client";

import { useRouter } from "next/navigation";
import type { Item } from "@/types/item";

type Props = {
  item: Item;
  onToggle: (item: Item) => void | Promise<void>;
};

export default function TodoItemRow({ item, onToggle }: Props) {
  const router = useRouter();

  return (
    <div
      className="flex items-center justify-between rounded-lg bg-white p-3 shadow-sm hover:cursor-pointer hover:bg-slate-50"
      onClick={() => {
        router.push(`/items/${item.id}`);
      }}
    >
      {/* 체크 / 논체크 버튼 */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggle(item);
        }}
        aria-label={
          item.isCompleted ? "Mark as not completed" : "Mark as completed"
        }
        className="mr-3 flex h-6 w-6 items-center justify-center"
      >
        <img
          src={
            item.isCompleted
              ? "/assets/icons/ic/checkbox.svg"
              : "/assets/icons/ic/noncheck.svg"
          }
          alt=""
          className="h-6 w-6"
          draggable={false}
        />
      </button>

      {/* 할 일 제목 */}
      <span
        className={`flex-1 truncate ${
          item.isCompleted ? "line-through text-gray-400" : ""
        }`}
      >
        {item.name}
      </span>
    </div>
  );
}
