"use client";

import Link from "next/link";
import Container from "@/components/layout/Container";

export default function Header() {
  return (
    <header className="border-b border-slate-200">
      <Container className="py-2 md:py-3">
        <Link href="/" aria-label="홈으로 이동" className="inline-flex">
          {/* 모바일: sm 로고 */}
          <img
            src="/assets/logo/logo-sm.svg"
            alt="do it"
            className="block md:hidden"
            draggable={false}
          />

          {/* 태블릿/데스크탑: lg 로고 */}
          <img
            src="/assets/logo/logo-lg.svg"
            alt="do it"
            className="hidden md:block"
            draggable={false}
          />
        </Link>
      </Container>
    </header>
  );
}
