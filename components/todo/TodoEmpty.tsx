import { colors, typography } from "@/styles/theme";

type Props = {
  variant: "todo" | "done";
};

export default function TodoEmpty({ variant }: Props) {
  const isTodo = variant === "todo";

  const desktopSrc = isTodo
    ? "/assets/icons/todo-lg.svg"
    : "/assets/icons/done-lg.svg";
  const mobileSrc = isTodo
    ? "/assets/icons/todo-sm.svg"
    : "/assets/icons/done-sm.svg";

  const text = isTodo ? (
    <>
      할 일이 없어요.
      <br />
      TODO를 새롭게 추가해주세요!
    </>
  ) : (
    <>
      아직 다 한 일이 없어요.
      <br />
      해야 할 일을 체크해보세요!
    </>
  );

  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      {/* 모바일 / 데스크탑 별 이미지 */}
      <img
        src={mobileSrc}
        alt={isTodo ? "TODO 비어 있음" : "DONE 비어 있음"}
        className="block h-24 w-auto md:hidden"
        draggable={false}
      />
      <img
        src={desktopSrc}
        alt={isTodo ? "TODO 비어 있음" : "DONE 비어 있음"}
        className="hidden h-32 w-auto md:block"
        draggable={false}
      />

      <p
        className="mt-4"
        style={{
          fontFamily: typography.fontFamily.base.join(", "),
          fontWeight: typography.fontWeight.bold,
          fontSize: typography.fontSize.bodyBold,
          lineHeight: typography.lineHeight.normal,
          color: colors.slate[400],
        }}
      >
        {text}
      </p>
    </div>
  );
}
