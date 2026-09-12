/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: 'var(--color-navy)',
        deepNavy: 'var(--color-deepNavy)',
        primaryBlue: 'var(--color-primaryBlue)',
        lightBlue: 'var(--color-lightBlue)',
        white: 'var(--color-white)',
        offWhite: 'var(--color-offWhite)',
        primaryText: 'var(--color-primaryText)',
        secondaryText: 'var(--color-secondaryText)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        error: 'var(--color-error)',
        blockchainAccent: 'var(--color-blockchainAccent)',
      },
      boxShadow: {
        soft: '0 10px 30px rgba(11,31,58,0.08)',
      },
    },
  },
  plugins: [],
};
