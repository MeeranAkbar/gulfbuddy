import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', '../../packages/ui/src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: '#0f172a',
        sand: '#f8f5ee',
        gold: '#d6b04d',
        bronze: '#855b2f'
      },
      boxShadow: {
        lift: '0 24px 60px rgba(15, 23, 42, 0.08)'
      },
      borderRadius: {
        shell: '28px'
      }
    }
  },
  plugins: []
};

export default config;
