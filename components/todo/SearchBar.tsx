"use client";

import Input from "@/components/ui/Input";

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  /** true이면 빈 페이지 상태 → add-purple.svg 사용 */
  isEmpty: boolean;
};

export default function SearchBar({
  value,
  onChange,
  onSubmit,
  isEmpty,
}: Props) {
  const mobileButtonSrc = isEmpty
    ? "/assets/icons/addbtn-purple.svg"
    : "/assets/icons/addbtn-white.svg";

  const desktopButtonSrc = isEmpty
    ? "/assets/icons/add-purple.svg"
    : "/assets/icons/add-white.svg";

  return (
    <div
      className="
        flex w-full items-stretch gap-3
      "
    >
      <Input
        value={value}
        onChange={onChange}
        onEnter={onSubmit}
        placeholder="할 일을 입력해주세요"
        backgroundImageSrc="/assets/icons/img/search.svg"
        className="flex-1 min-w-0"
      />

      {/* 버튼 영역: 모바일/태블릿/데스크탑 공통으로 같은 줄 유지 */}
      <div className="flex shrink-0 items-stretch">
        {/* 모바일: 이미지 자체가 버튼 */}
        <button
          type="button"
          onClick={onSubmit}
          aria-label="할 일 추가하기"
          className="
            flex h-14 w-14 items-center justify-center
            md:hidden
          "
        >
          <img
            src={mobileButtonSrc}
            alt=""
            className="h-full w-full"
            draggable={false}
          />
        </button>

        {/* 태블릿/데스크탑: 이미지 자체가 버튼 */}
        <button
          type="button"
          onClick={onSubmit}
          aria-label="할 일 추가하기"
          className="
            hidden md:inline-flex
            h-14 w-[180px]
            items-center justify-center
          "
        >
          <img
            src={desktopButtonSrc}
            alt=""
            className="h-full w-full"
            draggable={false}
          />
        </button>
      </div>
    </div>
  );
}
