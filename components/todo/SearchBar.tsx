"use client";

import Input from "@/components/ui/Input";

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  isEmpty: boolean;
};

export default function SearchBar({
  value,
  onChange,
  onSubmit,
  isEmpty,
}: Props) {
  const desktopBtnSrc = isEmpty
    ? "/assets/icons/add-purple.svg"
    : "/assets/icons/add-white.svg";

  const mobileBtnSrc = isEmpty
    ? "/assets/icons/addbtn-purple.svg"
    : "/assets/icons/addbtn-white.svg";

  return (
    <form
      className="flex w-full items-stretch gap-3"
      onSubmit={(e) => {
        e.preventDefault(); // ✅ Enter submit 단일 경로
        onSubmit();
      }}
    >
      <Input
        value={value}
        onChange={onChange}
        placeholder="할 일을 입력해주세요"
        backgroundImageSrc="/assets/icons/img/search.svg"
        className="flex-1 min-w-0"
      />

      {/* 모바일 */}
      <button
        type="submit"
        className="md:hidden h-14 w-14 shrink-0"
        aria-label="추가하기"
      >
        <img
          src={mobileBtnSrc}
          alt=""
          className="h-full w-full"
          draggable={false}
        />
      </button>

      {/* 태블릿/데스크탑 */}
      <button
        type="submit"
        className="hidden md:inline-flex h-14 w-[180px] shrink-0 items-center justify-center"
        aria-label="추가하기"
      >
        <img
          src={desktopBtnSrc}
          alt=""
          className="h-full w-full"
          draggable={false}
        />
      </button>
    </form>
  );
}
