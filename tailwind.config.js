/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        pops: "Poppins",
        rob: "Roboto",
        pacific: "Pacifico",
      },
      backgroundImage: {
        registration: "url('/registration.jpeg')",
        login: "url('/login.jpg')",
        coverphoto: "url('/defCover.jpg')",
      },
    },
  },
  plugins: [],
};
