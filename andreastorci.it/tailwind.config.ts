import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        sidebar: "#D0E3CC",
        sidebar2: "#F3F8F2",
        sidebar3: "#EBFEFF",
        sidebarDark: "#343434",
        borderSidebarDark: "#525252",
        flax: "#EFD780",
        'picton-blue': "#56ABDC",
        purple: "#610F7F",
        'purple-light': "#F9EDFD",
        russian: "#2F0147",
        sandy: "#FF9F45",
        peach: "#FFC085",
        'sandy-light': "#FFDFC2",
        'sandy-brown': "#FFAB5C",
        'antique-white': "#FFEAD6",
        turquoise: "#41D3BD",
        'white-smoke': "#F5F5F5",
      },
      fontFamily: {
        'roboto-mono': ['Roboto Mono', 'serif'],
        poppins: ['Poppins', 'serif'],
      }
    },
  },
  plugins: [],
} satisfies Config;
