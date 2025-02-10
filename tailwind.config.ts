import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        pretendard: ["Pretendard", "pretendard"],
        maru: ["MaruBuri", "maru"],
        nanumdahang: ["NanumDahang", "nanum"],
        goldenplains: ["Golden Plains", "goldenplains"],
        beyondinfinity: ["Beyond Infinity", "beyondinfinity"],
      },
      fontWeight: {
        extraThin: "100",
        thin: "200",
        normal: "400",
        bold: "700",
        extraBold: "900",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
} satisfies Config;
