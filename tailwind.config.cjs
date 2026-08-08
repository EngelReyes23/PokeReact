/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F5F3FF',
          100: '#EDE9FE',
          300: '#C4B5FD',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9'
        },
        surface: '#FFFFFF',
        bg: '#F3F4F6',
        line: '#E5E7EB',
        muted: '#6B7280',
        text: '#111827'
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px'
      },
      boxShadow: {
        sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
        md: '0 4px 12px rgba(0, 0, 0, 0.08)',
        lg: '0 10px 30px rgba(0, 0, 0, 0.12)'
      },
      fontSize: {
        caption: ['12px', { lineHeight: '16px', fontWeight: '500' }],
        label: ['14px', { lineHeight: '20px', fontWeight: '500' }],
        h2: ['20px', { lineHeight: '28px', fontWeight: '600' }],
        h1: ['24px', { lineHeight: '32px', fontWeight: '700' }],
        display: ['30px', { lineHeight: '36px', fontWeight: '700' }]
      }
    }
  },
  plugins: []
}
