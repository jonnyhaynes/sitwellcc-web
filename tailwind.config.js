const defaultTheme = require('tailwindcss/defaultTheme');
const { colors } = defaultTheme;

module.exports = {
    mode: 'jit',
    purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
    content: [
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
      ],
      theme: {
        fontFamily: {
            arial: ['Arial', ...defaultTheme.fontFamily.sans],
            ropa: ['Ropa Sans Pro Bold', ...defaultTheme.fontFamily.sans],
            'ropa-bold': ['Ropa Sans Pro ExtraBold', ...defaultTheme.fontFamily.sans],
        },
        // opacity: {
        //   '0': '0',
        //   '25': '.25',
        //   '50': '.5',
        //   '75': '.75',
        //   '90': '.9',
        //   '100': '1',
        // },
        colors: {
            transparent: 'transparent',
            current: 'currentColor',
            'green': '#109a49',
            'yellow': '#fbdf08',
            'amber': '#ef9014',
            'red': '#d61e1e',
            'brown': '#a15433',
            'blue': '#1d5ee3',
            'white': '#FFFFFF',
            'black': '#000000',
            'instagram': '#E1306C',
            'twitter': '#1DA1F2',
            'facebook': '#3A559F',
            'strava': '#FC4C02',
        },
        listStyleType: {
            alpha: 'upper-alpha',
            roman: 'upper-roman',
        },
        filter: {
            'none': 'none',
            'grayscale': 'grayscale(1)',
            'invert': 'invert(1)',
            'sepia': 'sepia(1)',
        },
        backdropFilter: {
            'none': 'none',
            'blur': 'blur(20px)',
        },
        extend: {
            fontSize: {
                '3xs': ['0.625rem', '0.75rem'],
                '2xs': ['0.75rem', '1rem'],
            },
        },
    },
    variants: {
        filter: ['responsive'],
        backdropFilter: ['responsive'],
        extend: {
            opacity: ['disabled'],
            textColor: ['group-focus'],
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('tailwindcss-filters'),
    ]
}
