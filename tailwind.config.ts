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
          50: '#fffdf2',
          100: '#fff8d4',
          200: '#ffeb7c', // User Palette: Soft glowing fairy butter (#FFEB7C)
          300: '#f8de66',
          400: '#e5c052',
          500: '#d0a44a', // User Palette: Luminous warm amber / honey (#D0A44A)
          600: '#b28532',
          700: '#8d641d',
          800: '#5f4110',
          900: '#392908', // User Palette: Darkest warm forest bark (#392908)
        },
        pine: {
          50: '#f6f7ed',
          100: '#ebeee0',
          200: '#d6dcc0',
          300: '#b5c18f',
          400: '#8f7f47', // User Palette: Warm golden olive (#8F7F47)
          500: '#747b35',
          600: '#61642f', // User Palette: Warm moss olive (#61642F)
          700: '#4d5322',
          800: '#3e451b', // User Palette: Deep warm forest olive (#3E451B)
          900: '#2a3013', // Warm dark olive forest
          950: '#1b200b', // Deep enchanted warm night forest (#1B200B)
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
        'book': '0 20px 40px -15px rgba(57, 41, 8, 0.35), 0 0 0 1px rgba(208, 164, 74, 0.15)',
        'book-lg': '0 25px 50px -12px rgba(27, 32, 11, 0.45), 0 0 0 1px rgba(255, 235, 124, 0.15)',
        'glow-amber': '0 0 35px -5px rgba(208, 164, 74, 0.45)',
        'glow-emerald': '0 0 35px -5px rgba(97, 100, 47, 0.45)',
        'glow-fairy': '0 0 30px -3px rgba(255, 235, 124, 0.55)',
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
