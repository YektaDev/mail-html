import defaultTheme from 'tailwindcss/defaultTheme';
import colors from 'tailwindcss/colors';

/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
        screens: {
            'xs': '400px',
            ...defaultTheme.screens,
        },
        extend: {
            colors: {
                primary: colors.emerald,
            },
            fontFamily: {
                sans: ['"Overpass Variable"', ...defaultTheme.fontFamily.sans],
                mono: ['"JetBrains Mono Variable"', ...defaultTheme.fontFamily.mono]
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
    ],
}
