import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: '#0b1220',
        panel: '#121a2b',
        border: '#23314d',
      },
    },
  },
  plugins: [],
};

export default config;
