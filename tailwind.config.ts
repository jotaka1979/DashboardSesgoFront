import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/**/*.{html,ts}', // Escanea todos tus templates y componentes
  ],
  theme: {
    extend: {
      colors: {
        // 🎨 Colores personalizados
        softBlue: '#60A5FA', // Azul suave (por defecto para botones)
        softRed: '#F87171',  // Rojo suave (para eliminar)
      },
    },
  },
  plugins: [],
} satisfies Config;
