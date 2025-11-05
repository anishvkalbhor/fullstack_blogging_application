import type { Config } from 'tailwindcss';

const config: Config = {
  // --- 1. THIS IS THE FIX ---
  // Ensure the 'content' array includes all of these paths.
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // --- END FIX ---
  
  prefix: "",
  theme: {
    // ... (your existing theme)
  },
  plugins: [
    require('tailwindcss-animate'),
    
    // 2. This plugin MUST be here for 'prose' to work.
    require('@tailwindcss/typography'),
  ],
};

export default config;