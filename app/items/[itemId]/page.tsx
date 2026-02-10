import Header from "@/components/layout/Header";
import Container from "@/components/layout/Container";
import { getItem } from "@/utils/api";
import { notFound } from "next/navigation";
import ItemDetailClient from "@/components/todo/ItemDetailClient";

/**
 * 상세 페이지(Server Component)
 * - URL params에서 itemId를 안전하게 파싱
 * - 서버에서 getItem 호출해 초기 데이터를 가져온 뒤
 * - 실제 수정/삭제/업로드 같은 인터랙션은 Client Component로 위임
 * - query string(mode)을 읽어 "생성 직후 화면" 여부를 Client로 전달
 */
type PageProps = {
  // Next 16(Turbopack) 환경에서 params가 Promise로 들어오는 케이스 방지
  params: Promise<{ itemId: string }>;

  // ✅ /items/[id]?mode=new 처럼 query가 들어올 수 있으므로 searchParams 받기
  searchParams?: Promise<{ mode?: string }>;
};

export default async function ItemDetailPage({
  params,
  searchParams,
}: PageProps) {
  const { itemId } = await params;
  const id = Number(itemId);

  // 잘못된 ID면 404 처리 (NaN 방지)
  if (!Number.isFinite(id)) notFound();

  const item = await getItem(id);

  // ✅ mode 파싱 (없으면 undefined)
  const sp = searchParams ? await searchParams : undefined;
  const mode = sp?.mode;

  return (
    <main>
      <Header />

      <Container className="mt-6 md:mt-8">
        {/* ✅ 생성 직후면 편집 모드로 시작하도록 힌트 전달 */}
        <ItemDetailClient initialItem={item} />
      </Container>
    </main>
  );
}
