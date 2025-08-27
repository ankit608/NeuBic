// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [
//     "./src/**/*.{js,ts,jsx,tsx}",         // React components
//     "./components/**/*.{js,ts,jsx,tsx}",  // Shadcn components
//     "./app/**/*.{js,ts,jsx,tsx}",         // If you're using Next.js or App Router
//   ],
//   theme: {
//     extend: {
//       colors: {
//         // Custom colors (optional)
//         primary: "#1e40af",   // blue-800
//         secondary: "#facc15", // yellow-400
//       },
//       borderRadius: {
//         xl: "1rem",
//         "2xl": "1.5rem",
//       },
//       fontFamily: {
//         sans: ["Inter", "ui-sans-serif", "system-ui"],
//       },
//     },
//   },
//   plugins: [
//     require("tailwindcss-animate"), // Optional: For animations in shadcn
//   ],
// };
// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,html}",
     "./components/**/*.{js,ts,jsx,tsx}",  // Shadcn components
//    
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
