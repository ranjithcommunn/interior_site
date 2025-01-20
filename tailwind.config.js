/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
  	extend: {
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {},
		fontFamily:{
			"Poppins":["Poppins"],
			"Roboto":["Roboto"],
			"DMSans":["DM Sans"]
		},
		fontSize:{
			"heading1":["32px"],
			"heading2":["24px"],
			"heading3":["20px"],
			"button1":["18px"],
			"button2":["16px"],
			"button3":["12.71px"],
			"text1":["16px"]
		},
		lineHeight:{
			"heading1":["48px"],
			"heading2":["36px"],
			"heading3":["30px"],
			"button1":["27px"],
			"button2":["24px"],
			"button3":["19.06px"],
			"text1":["24px"]

		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}
