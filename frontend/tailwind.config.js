// frontend/tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        'background-pan': 'background-pan 10s ease-in-out infinite alternate',
        'float-y': 'float-y 6s ease-in-out infinite', // Durée ajustée
      },
      keyframes: {
        'background-pan': {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '100% 50%' },
        },
        'float-y': { // Keyframes ajustés pour un mouvement vertical
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-16px)' },
        },
      },
    },
  },
  plugins: [],
};
