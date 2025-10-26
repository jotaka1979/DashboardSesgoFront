import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        softBlue: '#60A5FA',
        softRed: '#F87171',
      },
    },
  },
  plugins: [],
}

export default config
