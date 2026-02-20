/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        // Tech Graphite
        dark: {
          DEFAULT: "#141A22",
          50: "#F5F7FA",
          100: "#E9EEF5",
          200: "#CBD5E1",
          300: "#94A3B8",
          400: "#64748B",
          500: "#475569",
          600: "#334155",
          700: "#1F2937",
          800: "#141A22",
          900: "#0F141A",
        },

        // Cold neon accent (primary)
        primary: {
          DEFAULT: "#00B3FF",
          50: "#ECFAFF",
          100: "#D6F3FF",
          200: "#AEE7FF",
          300: "#76D6FF",
          400: "#33C2FF",
          500: "#00B3FF",
          600: "#008FCC",
          700: "#006B99",
          800: "#004766",
          900: "#002433",
        },

        // Secondary accent (subtle, tech)
        secondary: {
          DEFAULT: "#7C3AED",
          50: "#F4EDFF",
          100: "#E9DAFF",
          200: "#D2B6FF",
          300: "#B58BFF",
          400: "#9A63FF",
          500: "#7C3AED",
          600: "#632EC2",
          700: "#4A228F",
          800: "#31165C",
          900: "#190B2E",
        },
      },

      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Orbitron", "Inter", "sans-serif"],
        mono: ["Fira Code", "monospace"],
      },

      fontSize: {
        "display-1": ["4rem", { lineHeight: "1.05", fontWeight: "750" }],
        "display-2": ["3rem", { lineHeight: "1.12", fontWeight: "750" }],
        "display-3": ["2rem", { lineHeight: "1.2", fontWeight: "650" }],
      },

      spacing: {
        18: "4.5rem",
        88: "22rem",
        112: "28rem",
        128: "32rem",
      },

      animation: {
        "fade-in": "fadeIn 0.6s ease-out",
        "fade-in-up": "fadeInUp 0.7s ease-out",
        "slide-in": "slideIn 0.55s ease-out",
        glow: "glow 1.8s ease-in-out infinite alternate",
        float: "float 3s ease-in-out infinite",
      },

      keyframes: {
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        glow: {
          "0%": {
            boxShadow:
              "0 0 8px rgba(0,179,255,.18), 0 0 22px rgba(0,179,255,.10)",
          },
          "100%": {
            boxShadow:
              "0 0 16px rgba(0,179,255,.32), 0 0 44px rgba(0,179,255,.18)",
          },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
      },

      backdropBlur: { xs: "2px" },

      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-hero":
          "linear-gradient(135deg, #0F141A 0%, #141A22 55%, #0F141A 100%)",
        "gradient-accent": "linear-gradient(90deg, #00B3FF 0%, #9DE8FF 100%)",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
