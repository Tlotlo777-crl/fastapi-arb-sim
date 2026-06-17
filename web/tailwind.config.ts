import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#020b18',
          900: '#050d1a',
          800: '#0a1f44',
          700: '#0e2755',
          600: '#122f66',
          500: '#1a3a6b',
          400: '#2a4f8a',
        },
        fuel: {
          DEFAULT: '#f97316',
          50:  '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        glass: {
          white: 'rgba(255,255,255,0.06)',
          border: 'rgba(255,255,255,0.10)',
          strong: 'rgba(255,255,255,0.12)',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        display: ['var(--font-sora)', 'Sora', 'Inter', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #020b18 0%, #0a1f44 40%, #050d1a 100%)',
        'fuel-glow':    'radial-gradient(circle at center, rgba(249,115,22,0.25) 0%, transparent 70%)',
        'card-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)',
      },
      animation: {
        'ticker':       'ticker 28s linear infinite',
        'pulse-slow':   'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float':        'float 6s ease-in-out infinite',
        'glow-ring':    'glow-ring 2s ease-in-out infinite',
        'scan-line':    'scan-line 2s linear infinite',
        'count-up':     'count-up 0.6s ease-out forwards',
      },
      keyframes: {
        ticker: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-16px)' },
        },
        'glow-ring': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(249,115,22,0.4)' },
          '50%':      { boxShadow: '0 0 0 16px rgba(249,115,22,0)' },
        },
        'scan-line': {
          '0%':   { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        'count-up': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backdropBlur: { xs: '2px' },
      borderRadius: { '4xl': '2rem', '5xl': '2.5rem' },
      boxShadow: {
        'fuel':   '0 0 40px rgba(249,115,22,0.3)',
        'glass':  '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
        'card':   '0 20px 60px rgba(0,0,0,0.5)',
        'glow-sm':'0 0 12px rgba(249,115,22,0.4)',
      },
    },
  },
  plugins: [],
}

export default config
