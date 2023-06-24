import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/pages/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        mc: '#2b309b',
      },
      maxWidth: {
        '1/2': '50%',
      },
    },
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: '#2b309b',

          secondary: '#3ABFF8',

          'primary-content': '#FFFFFF',

          accent: '#37CDBE',

          neutral: '#3D4451',

          'base-100': '#FFFFFF',

          'base-200': '#2b309b',

          info: '#3ABFF8',

          success: '#36D399',

          warning: '#FBBD23',

          error: '#F87272',
        },
      },
    ],
  },
  plugins: [require('daisyui')],
}

export default config
