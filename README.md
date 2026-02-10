<<<<<<< HEAD
# Todo
코드잇 스프린트 과제
# Todo List

Next.js와 TypeScript를 사용하여 할 일을 관리할 수 있는 Todo List 웹 애플리케이션입니다.  
할 일의 생성, 수정, 삭제 및 상태 관리(진행/완료)를 지원하며, 반응형 웹 디자인을 적용했습니다.

---

## 🛠 기술 스택

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: CSS / Tailwind CSS
- **State Management**: React Hooks (`useState`, `useEffect`)
- **Version Control**: Git & GitHub

---

## 🎨 공통 구현 사항

- 제시된 **컬러 시스템**을 프로젝트 전반에 적용
- 버튼, 입력창 등 **공용 컴포넌트 분리**로 재사용성 고려
- **반응형 웹 디자인** 구현
  - 모바일
  - 태블릿
  - 데스크탑

---

## 📄 페이지 구성

### 1. 할 일 목록 페이지 (`/`)

#### 📌 목록 조회
- 상단의 **로고 버튼 클릭 시 `/` 페이지로 이동**
- 할 일을 **진행 중 / 완료** 상태로 구분하여 조회 가능

#### ➕ 할 일 추가
- 상단 입력창에 할 일 입력
- `추가하기` 버튼 클릭 또는 **Enter 키** 입력 시 할 일 생성

#### ✅ 할 일 완료 처리
- 진행 중 할 일의 왼쪽 버튼 클릭 → 완료 상태로 변경
- 완료된 할 일의 왼쪽 버튼 클릭 → 다시 진행 중 상태로 변경

---

### 2. 할 일 상세 페이지 (`/items/{itemId}`)

#### ✏️ 할 일 수정
- 할 일 항목 클릭 시 상세 페이지로 이동
- 다음 항목 수정 가능:
  - 할 일 이름
  - 할 일 상태 (진행 / 완료)
  - 메모
  - 이미지 첨부
- `수정 완료` 버튼 클릭 시
  - 수정 사항 저장
  - 할 일 목록 페이지(`/`)로 이동

#### 🗑 할 일 삭제
- `삭제하기` 버튼 클릭 시 해당 할 일 삭제
- 삭제 후 할 일 목록 페이지(`/`)로 이동
=======
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
>>>>>>> dd85d39 (Initial commit from Create Next App)
