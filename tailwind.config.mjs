import defaultTheme from 'tailwindcss/defaultTheme';
import colors from 'tailwindcss/colors';

/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
        extend: {
            colors: {
                primary: colors.slate,
            },
            fontFamily: {
                sans: ['"Overpass Variable"', ...defaultTheme.fontFamily.sans],
                mono: ['"JetBrains Mono Variable"', ...defaultTheme.fontFamily.mono]
            },
        },
    },
    plugins: [],
}
