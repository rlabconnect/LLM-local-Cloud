/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./views/*.ejs",            // Matches all HTML files in the root directory
    "./public/**/*.js",    // Matches all JS files inside the 'public' folder and its subfolders
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
