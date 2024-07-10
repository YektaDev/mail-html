/** @type {import("prettier").Config} */
export default {
    "arrowParens": "avoid",
    "semi": true,
    "tabWidth": 2,
    "printWidth": 100,
    "singleQuote": false,
    "jsxSingleQuote": false,
    "trailingComma": "all",
    "bracketSpacing": true,
    "endOfLine": "lf",
    plugins: ["prettier-plugin-astro", "prettier-plugin-tailwindcss"],
    overrides: [
        {
            files: '*.astro',
            options: {
                parser: 'astro',
            },
        },
    ],
};
