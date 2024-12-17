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
      },
      fontFamily: {
        'roboto-mono': ['Roboto Mono', 'serif'],
        poppins: ['Poppins', 'serif'],
      }
    },
  },
  plugins: [],
} satisfies Config;
