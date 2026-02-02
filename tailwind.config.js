/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          black: '#1a1a1a',
          charcoal: '#2d2d2d',
          stone: '#4a4a4a',
          slate: '#6b6b6b',
          mist: '#a8a8a8',
          whisper: '#d4d4d4',
          pearl: '#f0f0f0',
          white: '#fafafa',
          gray: {
            50: '#f9fafb',
            100: '#f3f4f6',
            200: '#e5e7eb',
            300: '#d1d5db',
            400: '#9ca3af',
            500: '#6b7280',
            600: '#4b5563',
            700: '#374151',
            800: '#1f2937',
            900: '#111827',
          },
        },
        gold: {
          dark: '#8b7355',
          DEFAULT: '#c9a96e',
          light: '#e6d5b8',
          pale: '#f5efe3',
        },
        'sage-gold': '#c9a96e',
        'sage-gold-dark': '#8b7355',
        'sage-gray-50': '#f9fafb',
        'sage-gray-100': '#f3f4f6',
        'sage-gray-200': '#e5e7eb',
        'sage-gray-300': '#d1d5db',
        'sage-gray-500': '#6b7280',
        'sage-gray-600': '#4b5563',
        'sage-gray-700': '#374151',
        'sage-black': '#1a1a1a',
        'sage-white': '#fafafa',
        destructive: '#ef4444',
        card: '#ffffff',
        background: '#ffffff',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      animation: {
        'shimmer': 'shimmer 2s infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'spin': 'spin 1s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      boxShadow: {
        'elegant': '0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.06)',
        'elegant-lg': '0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04)',
        'gold': '0 2px 8px rgba(201, 169, 110, 0.15), 0 1px 2px rgba(201, 169, 110, 0.1)',
        'gold-lg': '0 4px 16px rgba(201, 169, 110, 0.2), 0 2px 6px rgba(201, 169, 110, 0.15)',
      },
    },
  },
  plugins: [],
}
