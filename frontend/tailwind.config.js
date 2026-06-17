/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ssn: {
          50: '#eef5ff',
          100: '#d9e9ff',
          200: '#b8d5ff',
          300: '#89b7ff',
          400: '#5b93ff',
          500: '#2f72ff',
          600: '#0b4ead',
          700: '#083d89',
          800: '#072f67',
          900: '#062449'
        }
      },
      boxShadow: {
        soft: '0 16px 40px rgba(11, 78, 173, 0.10)'
      },
      backgroundImage: {
        hero: 'linear-gradient(180deg, #f7fbff 0%, #eef5ff 100%)'
      }
    }
  },
  plugins: []
};
