import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
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
        amber: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        emerald: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        indigo: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        butter: {
          50: '#fffdf5',
          100: '#fff7d6',
          200: '#ffefb3', // Primary Butter
          300: '#f5dc8a',
          400: '#e8c460',
          500: '#d9ac36',
          600: '#b88924',
          700: '#94661c',
          800: '#7a521c',
          900: '#67441c',
        },
        pine: {
          50: '#f0f7f6',
          100: '#d8ebe8',
          200: '#b0d7d1',
          300: '#7ebbb2',
          400: '#4f9a90',
          500: '#0a7a6e',
          600: '#045e54',
          700: '#024d45',
          800: '#013e37', // Primary Deep Green
          900: '#002621', // Dark Night Forest
          950: '#001714',
        },
        parchment: {
          50: '#fffdf9',
          100: '#fdfbf7',
          200: '#f9f4ea',
          300: '#f3e9d2',
          400: '#e7d5b1',
          500: '#d5bd8a',
        }
      },
      fontFamily: {
        sans: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
        display: ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
        storybook: ['var(--font-caveat)', 'cursive', 'sans-serif'],
      },
      boxShadow: {
        'book': '0 20px 40px -15px rgba(30, 27, 75, 0.25), 0 0 0 1px rgba(245, 158, 11, 0.1)',
        'book-lg': '0 25px 50px -12px rgba(15, 23, 42, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.1)',
        'glow-amber': '0 0 35px -5px rgba(245, 158, 11, 0.35)',
        'glow-emerald': '0 0 35px -5px rgba(16, 185, 129, 0.35)',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
};
export default config;
