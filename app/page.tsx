"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Container from "@/components/layout/Container";
import SearchBar from "@/components/todo/SearchBar";
import TodoEmpty from "@/components/todo/TodoEmpty";
import TodoItemRow from "@/components/todo/TodoItemRow";
import type { Item } from "@/types/item";
import { createItem, getItems, updateItem } from "@/utils/api";

export default function Home() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [items, setItems] = useState<Item[] | null>(null);

  /**
   * 목록 불러오기
   * - 최초 1회 호출
   */
  useEffect(() => {
    getItems()
      .then(setItems)
      .catch((error) => {
        console.error(error);
      });
  }, []);

  // 추가 -> 생성 후 "상세로 이동 X", 목록에 바로 반영
  const handleSubmit = async () => {
    const name = value.trim();
    if (!name) return;

    try {
      const newItem = await createItem({ name });
      setValue("");

      // 목록 state에 즉시 추가해서 TODO 섹션에 보이게
      setItems((prev) => {
        if (!prev) return [newItem];
        return [newItem, ...prev]; // 최신이 위로 오게
      });

      // 상세 이동 제거
      // router.push(`/items/${newItem.id}`);
    } catch (error) {
      console.error(error);
    }
  };
  /**
   * 완료/미완료 토글 -> API 반영 후 목록 state 업데이트
   */
  const handleToggle = async (item: Item) => {
    try {
      const updated = await updateItem(item.id, {
        isCompleted: !item.isCompleted,
      });

      setItems((prev) => {
        if (!prev) return prev;
        return prev.map((p) => (p.id === updated.id ? updated : p));
      });
    } catch (error) {
      console.error(error);
    }
  };

  const todoItems = (items ?? []).filter((item) => !item.isCompleted);
  const doneItems = (items ?? []).filter((item) => item.isCompleted);

  const isEmpty = !!items && items.length === 0;

  return (
    <main>
      <Header />

      <Container className="mt-6 md:mt-8">
        <SearchBar
          value={value}
          onChange={setValue}
          onSubmit={handleSubmit}
          isEmpty={isEmpty}
        />

        {/* Sections */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* TODO */}
          <section className="min-h-[220px] rounded-2xl p-4">
            <div className="mb-4 flex items-center">
              <img
                src="/assets/icons/img/todo.svg"
                alt="TO DO"
                className="h-9"
                draggable={false}
              />
            </div>

            {items && todoItems.length === 0 ? (
              <TodoEmpty variant="todo" />
            ) : (
              <div className="flex flex-col gap-3">
                {todoItems.map((item) => (
                  <TodoItemRow
                    key={item.id}
                    item={item}
                    onToggle={handleToggle}
                  />
                ))}
              </div>
            )}
          </section>

          {/* DONE */}
          <section className="min-h-[220px] rounded-2xl p-4">
            <div className="mb-4 flex items-center">
              <img
                src="/assets/icons/img/done.svg"
                alt="DONE"
                className="h-9"
                draggable={false}
              />
            </div>

            {items && doneItems.length === 0 ? (
              <TodoEmpty variant="done" />
            ) : (
              <div className="flex flex-col gap-3">
                {doneItems.map((item) => (
                  <TodoItemRow
                    key={item.id}
                    item={item}
                    onToggle={handleToggle}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </Container>
    </main>
  );
}
