export const colors = {
  slate: {
    900: "#0F172A",
    800: "#1E293B",
    500: "#64748B",
    400: "#94A3B8",
    300: "#CBD5E1",
    200: "#E2E8F0",
    100: "#F1F5F9",
  },
  violet: {
    600: "#7C3AED",
    100: "#EDE9FE",
  },
  rose: {
    500: "#F43F5E",
  },
  lime: {
    300: "#BEF264",
  },
  amber: {
    800: "#92400E",
  },
} as const;

export const typography = {
  fontFamily: {
    base: [
      "NanumSquare",
      "system-ui",
      "-apple-system",
      "Segoe UI",
      "Roboto",
      "sans-serif",
    ],
  },
  // spec: NanumSquare Bold 20/18/16, Regular 16
  fontSize: {
    title: "20px",
    subtitle: "18px",
    bodyBold: "16px",
    body: "16px",
  },
  fontWeight: {
    bold: 700,
    regular: 400,
  },
  lineHeight: {
    tight: "1.2",
    normal: "1.5",
  },
} as const;
