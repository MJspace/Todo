"use client";
import "@/app/globals.css";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Item } from "@/types/item";
import { updateItem, deleteItem /*, uploadImage*/ } from "@/utils/api";

/**
 * 상세 페이지(Client Component)
 * - 사용자 입력(이름/상태/메모/이미지)을 로컬 state로 관리
 * - 수정 완료: updateItem 호출 후 목록(/)으로 이동
 * - 삭제: deleteItem 호출 후 목록(/)으로 이동
 * - 이미지 업로드: 파일명(영문) + 5MB 제한 검사 (업로드 API 연결은 추후)
 *
 * UI 요구사항
 * - 상단 "항목 이름 바" 폭에 맞춰(=max-w) 이미지/메모/버튼 영역도 동일 폭을 사용
 * - 이미지 첨부 컨테이너 배경색은 theme.ts의 slate/300 토큰(CSS 변수) 사용
 */
type Props = {
  initialItem: Item;
};

export default function ItemDetailClient({ initialItem }: Props) {
  const router = useRouter();

  // ===== 로컬 상태(폼) =====
  const [name, setName] = useState(initialItem.name ?? "");
  const [isCompleted, setIsCompleted] = useState(!!initialItem.isCompleted);
  const [memo, setMemo] = useState(initialItem.memo ?? "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // 파일 input 제어용 ref
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  /**
   * 파일명(영문만) + 5MB 제한 검사
   * - 통과 시 imageFile state에 저장
   */
  const handlePickFile = (file: File) => {
    const isUnder5MB = file.size <= 5 * 1024 * 1024;
    const isEnglishName = /^[a-zA-Z0-9._-]+$/.test(file.name);

    if (!isUnder5MB) {
      alert("이미지 파일은 5MB 이하여야 합니다.");
      return;
    }
    if (!isEnglishName) {
      alert("이미지 파일 이름은 영어로만 이루어져야 합니다.");
      return;
    }

    setImageFile(file);
  };

  /**
   * 수정 완료:
   * - updateItem으로 name/memo/isCompleted/imageUrl(추후) 반영
   * - 성공 시 목록(/)으로 이동
   */
  const handleSave = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      alert("할 일 이름을 입력해주세요.");
      return;
    }

    setIsSaving(true);
    try {
      // TODO(추후): imageFile이 있을 경우 업로드 API로 imageUrl 확보 후 update에 포함
      // const uploaded = imageFile ? await uploadImage(imageFile) : null;

      await updateItem(initialItem.id, {
        name: trimmed,
        memo,
        isCompleted,
        // imageUrl: uploaded?.url ?? initialItem.imageUrl
      });

      router.push("/");
    } catch (e) {
      console.error(e);
      alert("수정에 실패했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * 삭제:
   * - deleteItem 호출 후 목록(/)으로 이동
   */
  const handleDelete = async () => {
    const ok = confirm("정말 삭제할까요?");
    if (!ok) return;

    setIsSaving(true);
    try {
      await deleteItem(initialItem.id);
      router.push("/");
    } catch (e) {
      console.error(e);
      alert("삭제에 실패했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full">
      {/* ✅ 이름바 폭(max-w-[720px])과 동일한 폭을 공유하기 위한 공통 래퍼 */}
      <div className="mx-auto w-full max-w-[720px]">
        {/* ===== 이름 박스(상단) ===== */}
        {/* - 둥근 긴 박스 + border + 왼쪽 noncheck 아이콘 + 중앙 텍스트(밑줄은 글자 길이만큼) */}
        <section>
          <div
            className="
              flex items-center justify-center gap-3
              rounded-full border border-slate-900
              px-5
              h-12 md:h-14
              bg-white
            "
          >
            {/* 상태 아이콘(요청: 우선 noncheck 고정) */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1"></div>
              <img
                src="/assets/icons/ic/noncheck.svg"
                alt=""
                className="h-6 w-6 shrink-0"
                draggable={false}
              />

              {/* 할 일 이름: 중앙 정렬 + 밑줄이 텍스트 길이만큼만 보이도록 처리 */}
              <div className="flex flex-1 justify-center">
                <div className="relative inline-block">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="
                    inline-block
                    bg-transparent
                    text-center
                    outline-none
                    px-1
                    border-b border-[var(--color-slate-300)]
                   "
                    aria-label="할 일 이름"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== 본문(이미지 + 메모) ===== */}
        {/* - 데스크탑: 2열, 모바일/태블릿: 세로 스택 */}
        <section className="mt-6 grid gap-6 lg:grid-cols-2 items-start">
          {/* ----- 이미지 첨부 컨테이너 ----- */}
          {/* - 배경색: theme.ts slate/300 (CSS 변수 사용) */}
          <div
            className="
              relative
              w-full
              rounded-4xl
              border border-dashed border-slate-300
              bg-[var(--color-slate-50)]
              min-h-[260px]
              md:min-h-[320px]
            "
          >
            {/* 가운데 아이콘 */}
            <div className="absolute inset-0 grid place-items-center">
              <div className="flex flex-col items-center gap-3">
                <img
                  src="/assets/icons/ic/img.svg"
                  alt=""
                  className="h-10 w-10 opacity-60"
                  draggable={false}
                />
              </div>
            </div>

            {/* 우하단 + 버튼 */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-4 right-4"
              aria-label="이미지 첨부"
              disabled={isSaving}
            >
              <img
                src="/assets/icons/img-plusbtn.svg"
                alt=""
                className="h-12 w-12"
                draggable={false}
              />
            </button>

            {/* 실제 파일 input (숨김) */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                handlePickFile(file);
                // 같은 파일 다시 선택 가능하도록 value 초기화
                e.currentTarget.value = "";
              }}
            />
          </div>

          {/* ----- 메모 컨테이너 ----- */}
          <div
            className="
    relative
    w-full
    min-h-[260px] md:min-h-[320px]
    rounded-2xl
    bg-no-repeat bg-cover bg-center
  "
            style={{
              backgroundImage: "url(/assets/icons/img/memo.svg)",
            }}
          >
            {/* Memo 타이틀 */}
            <div
              className="
      absolute top-4 left-1/2 -translate-x-1/2
      text-[16px] font-bold
      text-[--color-amber-800]
      pointer-events-none
    "
            >
              Memo
            </div>

            {/* 입력 영역 */}
            <div className="absolute inset-0 flex items-center justify-center px-6 py-8">
              <textarea
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                className="
        w-full
        bg-transparent
        outline-none
        resize-none
        text-center
        text-slate-800
        leading-relaxed
      "
                style={{
                  height: "6rem",
                }}
                aria-label="메모"
              />
            </div>
          </div>
        </section>

        {/* ===== 하단 버튼(수정 완료 / 삭제하기) ===== */}
        {/* - 모바일: 가운데 정렬 / 데스크탑: 오른쪽 정렬 */}
        <section className="mt-6 flex justify-center lg:justify-end">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              aria-label="수정 완료"
            >
              <img
                src="/assets/icons/editbtn.svg"
                alt=""
                className="h-12 w-[140px] md:w-[160px]"
                draggable={false}
              />
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={isSaving}
              aria-label="삭제하기"
            >
              <img
                src="/assets/icons/deletebtn.svg"
                alt=""
                className="h-12 w-[140px] md:w-[160px]"
                draggable={false}
              />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
