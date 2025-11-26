/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'rgba(255, 255, 255, 0.1)',
        input: 'rgba(255, 255, 255, 0.1)',
        ring: '#DAA520',
        background: '#05080F',
        foreground: '#F8FAFC',
        primary: {
          DEFAULT: '#DAA520',
          foreground: '#05080F',
        },
        secondary: {
          DEFAULT: 'rgba(255, 255, 255, 0.05)',
          foreground: '#F8FAFC',
        },
        destructive: {
          DEFAULT: '#EF4444',
          foreground: '#F8FAFC',
        },
        muted: {
          DEFAULT: 'rgba(255, 255, 255, 0.05)',
          foreground: 'rgba(248, 250, 252, 0.72)',
        },
        accent: {
          DEFAULT: '#DAA520',
          foreground: '#F8FAFC',
        },
        popover: {
          DEFAULT: '#0E141B',
          foreground: '#F8FAFC',
        },
        card: {
          DEFAULT: 'rgba(255, 255, 255, 0.05)',
          foreground: '#F8FAFC',
        },
        success: {
          DEFAULT: '#35E1A6',
          foreground: '#05080F',
        },
      },
      borderRadius: {
        lg: '16px',
        md: '12px',
        sm: '8px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'elegant': '0 20px 60px rgba(2, 6, 23, 0.65)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

