import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}', // Pour le dossier app (Next.js 13)
    './pages/**/*.{js,ts,jsx,tsx,mdx}', // Pour les pages
    './components/**/*.{js,ts,jsx,tsx,mdx}', // Pour les composants
    './src/**/*.{js,ts,jsx,tsx,mdx}', // Si vous utilisez un dossier src
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00291b',
        secondary: '#dc9600',
        tertiary: '#E5DFC7',
        primaryLight: '#004d4f',
        secondaryLight: '#f2b700',
        tertiaryLight: '#f3e8d9',
        oliveDark: '#969342',
      },
    },
  },
  plugins: [],
};

export default config;
