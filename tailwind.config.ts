import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        sera: {
          ivory: 'var(--sera-ivory)',
          espresso: 'var(--sera-espresso)',
          champagne: 'var(--sera-champagne)',
          taupe: 'var(--sera-taupe)',
          beige: 'var(--sera-beige)',
          error: 'var(--sera-functional-error)',
        },
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        'surface-inverted': 'var(--surface-inverted)',
        text: {
          DEFAULT: 'var(--text)',
          inverted: 'var(--text-inverted)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
        },
        line: {
          DEFAULT: 'var(--line)',
          strong: 'var(--line-strong)',
        },
        accent: 'var(--accent)',
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'serif'],
        sans: ['var(--font-montserrat)', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '2px',
        sm: '2px',
        md: '2px',
        lg: '4px',
        pill: '999px',
      },
      maxWidth: {
        container: '1280px',
        bleed: '1440px',
      },
    },
  },
  plugins: [],
};
export default config;
