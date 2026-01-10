/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{js,vue,ts}',
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB',
        'bg-light': '#F3F4F6',
        'text-primary': '#111827',
        'text-secondary': '#4B5563',
        'border-light': '#E5E7EB',
        'header-bg': '#F9FAFB',
      },
    },
  },
  plugins: [],
}
