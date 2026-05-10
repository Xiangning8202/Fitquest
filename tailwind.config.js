/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans:    ['"Inter"', '"PingFang SC"', '"Microsoft YaHei"', 'sans-serif'],
        display: ['"Nunito"', '"PingFang SC"', '"Microsoft YaHei"', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          from: { boxShadow: '0 0 5px rgb(168 85 247 / 0.4)' },
          to: { boxShadow: '0 0 20px rgb(168 85 247 / 0.8), 0 0 40px rgb(168 85 247 / 0.4)' },
        },
      },
    },
  },
  plugins: [],
}
