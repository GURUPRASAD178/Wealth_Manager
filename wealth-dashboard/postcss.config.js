// postcss.config.js
const { tailwindcss } = require('@tailwindcss/postcss');

module.exports = {
  plugins: {
    tailwindcss: {}, // ⬅️ Calls the plugin properly
    autoprefixer: {},
  },
};
