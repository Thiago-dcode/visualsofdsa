import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      screens: {
          phone: "480px",
          tablet: "860px",
          laptop: "1024px",
          desktop: "1440px",
          tv: "1800px",
      },
      colors: {
        app: {
          bg: {
            black: "var(--app-bg-black)",
          },
          off: {
            white: "var(--app-off-white)",
            "white-50": "var(--app-off-white-50)",
            black: "var(--app-off-black)",
            "black-50": "var(--app-off-black-50)",
            gray: "var(--app-off-gray)",
            "gray-50": "var(--app-off-gray-50)",
          },
          bauhaus: {
            red: "var(--app-bauhaus-red)",
            "red-50": "var(--app-bauhaus-red-50)",
            green: "var(--app-bauhaus-green)",
            "green-50": "var(--app-bauhaus-green-50)",
            yellow: "var(--app-bauhaus-yellow)",
            "yellow-50": "var(--app-bauhaus-yellow-50)",
            bone: "var(--app-bauhaus-bone)",
            blue: "var(--app-bauhaus-blue)",
            "blue-50": "var(--app-bauhaus-blue-50)",
            orange: "var(--app-bauhaus-orange)",
            "orange-50": "var(--app-bauhaus-orange-50)",
            indigo: "var(--app-bauhaus-indigo)",
            "indigo-50": "var(--app-bauhaus-indigo-50)",
          },
          
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
