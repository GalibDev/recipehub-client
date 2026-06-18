const daisyui = require('daisyui');

module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef9f0',
          100: '#d9f0de',
          500: '#16813a',
          600: '#12652c',
          700: '#0d4e22',
          900: '#062c17'
        },
        cream: '#fffaf2'
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        display: ['Manrope', 'sans-serif']
      },
      boxShadow: {
        soft: '0 12px 35px rgba(20,50,30,.08)'
      }
    }
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        light: {
          primary: '#12652c',
          secondary: '#f5a623',
          accent: '#eef9f0',
          neutral: '#10221a',
          'base-100': '#ffffff',
          'base-200': '#f7f9f7',
          'base-300': '#e8eee9',
          'base-content': '#142019',
          info: '#3b82f6',
          success: '#16813a',
          warning: '#f5a623',
          error: '#dc4c4c'
        }
      },
      {
        dark: {
          primary: '#5ecb7e',
          secondary: '#f4b94e',
          accent: '#173f27',
          neutral: '#eaf4ed',
          'base-100': '#0d1913',
          'base-200': '#111f18',
          'base-300': '#1d3025',
          'base-content': '#eaf4ed',
          info: '#60a5fa',
          success: '#5ecb7e',
          warning: '#f4b94e',
          error: '#f87171'
        }
      }
    ]
  }
};
