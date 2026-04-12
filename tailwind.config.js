/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        bg: {
          DEFAULT: '#070b14',
          secondary: '#0d1117',
          tertiary: '#111827',
        },
        surface: {
          DEFAULT: '#0f1623',
          hover: '#141c2e',
          active: '#1a2540',
        },
        border: {
          DEFAULT: '#1e2a3d',
          subtle: '#151e2e',
          glow: '#3b82f620',
        },
        accent: {
          DEFAULT: '#3b82f6',
          hover: '#60a5fa',
          glow: '#3b82f640',
          dim: '#1d4ed8',
        },
        violet: {
          DEFAULT: '#8b5cf6',
          hover: '#a78bfa',
          glow: '#8b5cf640',
        },
        verified: {
          DEFAULT: '#22c55e',
          glow: '#22c55e30',
          dim: '#15803d',
        },
        suspicious: {
          DEFAULT: '#f59e0b',
          glow: '#f59e0b30',
          dim: '#b45309',
        },
        danger: {
          DEFAULT: '#ef4444',
          glow: '#ef444430',
          dim: '#b91c1c',
        },
        muted: '#4b5563',
        subtle: '#6b7280',
        text: {
          primary: '#f1f5f9',
          secondary: '#94a3b8',
          muted: '#64748b',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-glass':
          'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))',
        'gradient-accent':
          'linear-gradient(135deg, #3b82f6, #8b5cf6)',
        'gradient-crisis':
          'linear-gradient(135deg, #ef4444, #f59e0b)',
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
        glow: '0 0 20px rgba(59, 130, 246, 0.3)',
        'glow-sm': '0 0 10px rgba(59, 130, 246, 0.2)',
        'glow-violet': '0 0 20px rgba(139, 92, 246, 0.3)',
        danger: '0 0 20px rgba(239, 68, 68, 0.3)',
        card: '0 4px 24px rgba(0, 0, 0, 0.5)',
        'card-hover': '0 8px 40px rgba(0, 0, 0, 0.7)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        shimmer: 'shimmer 2s linear infinite',
        'fade-in': 'fadeIn 0.4s ease forwards',
        'slide-up': 'slideUp 0.4s ease forwards',
        'slide-in-right': 'slideInRight 0.35s ease forwards',
        ticker: 'ticker 80s linear infinite',
        'ping-slow': 'ping 2s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        glow: 'glow 2s ease-in-out infinite alternate',
        'scale-in': 'scaleIn 0.3s ease forwards',
        'bounce-slow': 'bounceSlow 2.5s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideUp: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: 0, transform: 'translateX(20px)' },
          '100%': { opacity: 1, transform: 'translateX(0)' },
        },
        ticker: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(59,130,246,0.3)' },
          '100%': { boxShadow: '0 0 20px rgba(59,130,246,0.6)' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: 0 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
        bounceSlow: {
          '0%, 100%': { transform: 'translateX(-50%) translateY(0)' },
          '50%':       { transform: 'translateX(-50%) translateY(6px)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
};
