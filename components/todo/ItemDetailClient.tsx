"use client";
import "@/app/globals.css";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Item } from "@/types/item";
import { updateItem, deleteItem, uploadImage } from "@/utils/api";

/**
 * 상세 페이지(Client Component)
 * - 사용자 입력(이름/상태/메모/이미지)을 로컬 state로 관리
 * - 수정 완료: (선택) 이미지 업로드 -> updateItem(PATCH) -> 목록(/) 이동
 * - 삭제: deleteItem(DELETE) -> 목록(/) 이동
 * - 이미지 업로드 제약: 파일명(영문만) + 5MB 이하
 *
 * IMPORTANT
 * - objectURL 미리보기는 "새로고침/재진입" 시 사라지는 게 정상.
 *   영구 표시하려면 서버에 imageUrl 저장(updateItem) 후,
 *   다음 진입 시 initialItem.imageUrl로 렌더되어야 함.
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

  // 파일(로컬) + 서버 URL(영구)
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>(initialItem.imageUrl ?? "");

  // 미리보기 URL(objectURL)
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const [isSaving, setIsSaving] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  /**
   * ✅ "활성화(보라색)" 여부는 state로 저장하지 말고,
   * 서버에 저장되는 값(memo/imageUrl/isCompleted)을 기준으로 매 렌더 계산
   */
  const hasMemo = memo.trim().length > 0;
  const hasImage = Boolean(imageUrl) || Boolean(previewUrl);
  const isActive = isCompleted || hasMemo || hasImage;

  /**
   * 파일 선택 시 objectURL 생성(화면 미리보기)
   * - 새로고침하면 사라지는 게 정상(브라우저 메모리 URL)
   */
  useEffect(() => {
    if (!imageFile) {
      setPreviewUrl("");
      return;
    }
    const url = URL.createObjectURL(imageFile);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  /**
   * 파일명(영문만) + 5MB 제한 검사
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
   * 1) (선택) imageFile 있으면 uploadImage -> url 확보
   * 2) updateItem에 imageUrl 포함해서 PATCH
   * 3) 성공 시 "/"로 이동
   */
  const handleSave = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      alert("할 일 이름을 입력해주세요.");
      return;
    }

    setIsSaving(true);
    try {
      let nextImageUrl = imageUrl;

      // 1) 이미지가 새로 선택된 경우에만 업로드
      if (imageFile) {
        console.log("[upload] start", imageFile.name, imageFile.size);

        // ✅ Swagger 응답: { "url": "string" }
        const uploaded = await uploadImage(imageFile);
        console.log("[upload] success", uploaded);

        nextImageUrl = uploaded.url;
        setImageUrl(nextImageUrl); // 화면 state에도 반영
      }

      // 2) PATCH
      console.log("[patch] start", {
        id: initialItem.id,
        name: trimmed,
        memo,
        isCompleted,
        imageUrl: nextImageUrl,
      });

      const updated = await updateItem(initialItem.id, {
        name: trimmed,
        memo,
        isCompleted,
        imageUrl: nextImageUrl,
      });

      console.log("[patch] success", updated);

      // ✅ 서버 최신값으로 state 동기화 (중요: 다음 렌더에도 "활성" 판단이 정확해짐)
      setName(updated.name ?? "");
      setMemo(updated.memo ?? "");
      setIsCompleted(Boolean(updated.isCompleted));
      setImageUrl(updated.imageUrl ?? "");
      setImageFile(null); // 새 파일 선택 상태 제거

      // 3) 목록으로 이동
      router.push("/");
    } catch (e) {
      console.error(e);
      alert("수정에 실패했습니다. (콘솔/Network 탭 확인)");
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * 삭제
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

  // ✅ 화면에 보여줄 이미지 우선순위: (1) 로컬 미리보기 -> (2) 서버 저장 imageUrl
  const displayImageSrc = previewUrl || imageUrl;

  return (
    <div className="w-full">
      <div className="mx-auto w-full max-w-[720px]">
        {/* ===== 이름 바 ===== */}
        <section>
          <div
            className={`
              flex items-center justify-center gap-3
              rounded-full border border-slate-900
              px-5
              h-12 md:h-14
              ${isActive ? "bg-[var(--color-violet-100)]" : "bg-white"}
            `}
          >
            <div className="flex items-center gap-1">
              {/* 체크 아이콘(일단 isCompleted로 분기 가능) */}
              <img
                src={
                  isActive
                    ? "/assets/icons/ic/checkbox.svg"
                    : "/assets/icons/ic/noncheck.svg"
                }
                alt=""
                className="h-6 w-6 shrink-0"
                draggable={false}
              />

              {/* 할 일 이름 */}
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="
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
        </section>

        {/* ===== 본문(이미지 + 메모) ===== */}
        <section className="mt-6 grid gap-6 lg:grid-cols-2 items-start">
          {/* ----- 이미지 첨부 컨테이너 ----- */}
          <div
            className="
              relative
              w-full
              rounded-4xl
              border border-dashed border-slate-300
              bg-[var(--color-slate-50)]
              min-h-[260px]
              md:min-h-[320px]
              overflow-hidden
            "
          >
            {displayImageSrc ? (
              <img
                src={displayImageSrc}
                alt="첨부 이미지"
                className="absolute inset-0 h-full w-full object-cover"
                draggable={false}
              />
            ) : (
              <div className="absolute inset-0 grid place-items-center">
                <img
                  src="/assets/icons/ic/img.svg"
                  alt=""
                  className="h-10 w-10 opacity-60"
                  draggable={false}
                />
              </div>
            )}

            {/* ✅ 버튼 아이콘: 활성화면 "수정(연필)" / 비활성화면 "플러스" */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-4 right-4"
              aria-label="이미지 첨부"
              disabled={isSaving}
            >
              <img
                src={
                  isActive
                    ? "/assets/icons/img-editbtn.svg" // ← 연필 버튼(네가 가진 경로로 맞춰줘)
                    : "/assets/icons/img-plusbtn.svg"
                }
                alt=""
                className="h-12 w-12"
                draggable={false}
              />
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                handlePickFile(file);
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
            style={{ backgroundImage: "url(/assets/icons/img/memo.svg)" }}
          >
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
                style={{ height: "6rem" }}
                aria-label="메모"
              />
            </div>
          </div>
        </section>

        {/* ===== 하단 버튼 ===== */}
        <section className="mt-6 flex justify-center lg:justify-end">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              aria-label="수정 완료"
              className={isSaving ? "opacity-60" : ""}
            >
              <img
                src={
                  isActive
                    ? "/assets/icons/edit.svg"
                    : "/assets/icons/editbtn.svg"
                }
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
              className={isSaving ? "opacity-60" : ""}
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
