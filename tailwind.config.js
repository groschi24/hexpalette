const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  theme: {
    // compatible with @nuxtjs/color-mode
    darkSelector: '.dark-mode',
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary: '#265ee0', // EDBF09, 705fd3, 265ee0, 856bd6
      },
      width: {
        500: '500px',
        990: '990px',
        '1/10': '10%',
        '2/10': '20%',
        '3/10': '30%',
        '4/10': '40%',
        '5/10': '50%',
        '6/10': '60%',
        '7/10': '70%',
        '8/10': '80%',
        '9/10': '90%',
      },
      height: {
        500: '500px',
        990: '990px',
        '1/10': '10%',
        '2/10': '20%',
        '3/10': '30%',
        '4/10': '40%',
        '5/10': '50%',
        '6/10': '60%',
        '7/10': '70%',
        '8/10': '80%',
        '9/10': '90%',
      },
    },
    minWidth: {
      0: '0',
      '1/4': '25%',
      '1/2': '50%',
      '3/4': '75%',
      '1/10': '10%',
      '2/10': '20%',
      '3/10': '30%',
      '4/10': '40%',
      '5/10': '50%',
      '6/10': '60%',
      '7/10': '70%',
      '8/10': '80%',
      '9/10': '90%',
      full: '100%',
      '500-px': '500px',
      '990-px': '990px',
    },
    maxWidth: {
      0: '0',
      '1/4': '25%',
      '1/2': '50%',
      '3/4': '75%',
      '1/10': '10%',
      '2/10': '20%',
      '3/10': '30%',
      '4/10': '40%',
      '5/10': '50%',
      '6/10': '60%',
      '7/10': '70%',
      '8/10': '80%',
      '9/10': '90%',
      full: '100%',
      '500-px': '500px',
      '990-px': '990px',
    },
    minHeight: {
      0: '0',
      '1/4': '25%',
      '1/2': '50%',
      '3/4': '75%',
      '1/10': '10%',
      '2/10': '20%',
      '3/10': '30%',
      '4/10': '40%',
      '5/10': '50%',
      '6/10': '60%',
      '7/10': '70%',
      '8/10': '80%',
      '9/10': '90%',
      full: '100%',
      '500-px': '500px',
      '990-px': '990px',
    },
  },
  variants: {
    backgroundColor: [
      'dark',
      'dark-hover',
      'dark-group-hover',
      'dark-even',
      'dark-odd',
      'responsive',
      'hover',
      'focus',
    ],
    borderColor: [
      'dark',
      'dark-focus',
      'dark-focus-within',
      'responsive',
      'hover',
      'focus',
    ],
    textColor: [
      'dark',
      'dark-hover',
      'dark-active',
      'responsive',
      'hover',
      'focus',
    ],
  },
  plugins: [require('tailwindcss-dark-mode')()],
};
