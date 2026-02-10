import Container from "@/components/layout/Container";

export default function Home() {
  return (
    <main className="py-6 md:py-8">
      <Container>
        {/* Header */}
        <div className="mb-4">로고 영역</div>

        {/* Add bar */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="h-10 flex-1 rounded-full bg-slate-100" />
          <div className="h-10 w-full md:w-28 rounded-full bg-violet-600" />
        </div>

        {/* Sections */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section className="min-h-[200px] rounded-2xl bg-slate-100 p-4">
            TODO
          </section>
          <section className="min-h-[200px] rounded-2xl bg-slate-100 p-4">
            DONE
          </section>
        </div>
      </Container>
    </main>
  );
}
