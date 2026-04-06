/** @type {import('tailwindcss').Config} */
export default {
	darkMode: ['class'],
	content: [
		'./app.vue',
		'./error.vue',
		'./components/**/*.{vue,js,ts}',
		'./layouts/**/*.vue',
		'./pages/**/*.vue',
		'./plugins/**/*.{js,ts}',
		'./composables/**/*.{js,ts}',
		'./utils/**/*.{js,ts}',
		'./stores/**/*.{js,ts}',
	],
	theme: {
		extend: {
			colors: {
				primary: {
					DEFAULT   : '#E6B153',
					foreground: '#171717'
				},
				secondary: {
					DEFAULT   : '#3A2620',
					foreground: '#F6E9D7'
				},
				tertiary : '#F6E9D7',
				highlight: {
					red   : '#941708',
					orange: '#FF6F1E'
				},
				dark  : '#171717',
				accent: {
					DEFAULT   : '#FF9A3C',
					foreground: '#F6E9D7'
				},
				background: '#F6E9D7',
				foreground: '#171717',
				card      : {
					DEFAULT   : '#F6E9D7',
					foreground: '#171717'
				},
				popover: {
					DEFAULT   : '#3A2620',
					foreground: '#F6E9D7'
				},
				muted: {
					DEFAULT   : '#3A2620',
					foreground: '#F6E9D7'
				},
				destructive: {
					DEFAULT   : '#941708',
					foreground: '#F6E9D7'
				},
				border: 'hsl(var(--border))',
				input : 'hsl(var(--input))',
				ring  : 'hsl(var(--ring))',
				chart : {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				}
			},
			fontFamily: {
				heading: [
					'"Be Vietnam Pro"',
					'Inter',
					'"QingNiaoHuaGuang"',
					'sans-serif'
				],
				body: [
					'"Nunito"',
					'sans-serif'
				],
				script: [
					'"Biro Script"',
					'"AaManYuShouXieTi"',
					'cursive'
				],
				zh: [
					'"QingNiaoHuaGuang"',
					'sans-serif',
				],
				'zh-body': [
					'"AaManYuShouXieTi"',
					'sans-serif'
				],
				'zh-script': [
					'"AaManYuShouXieTi"',
					'sans-serif'
				],
				serif: [
					'"Times New Roman"',
					'serif'
				]
			},
			borderRadius: {
				'2xl': '1rem',
				'3xl': '1.5rem',
				'4xl': '2rem',
				lg   : 'var(--radius)',
				md   : 'calc(var(--radius) - 2px)',
				sm   : 'calc(var(--radius) - 4px)'
			},
			boxShadow: {
				warm     : '0 4px 32px 0 rgba(230,177,83,0.18)',
				'warm-lg': '0 8px 48px 0 rgba(230,177,83,0.28)',
				dark     : '0 4px 32px 0 rgba(23,23,23,0.25)'
			},
			animation: {
				'fade-in'    : 'fadeIn 0.6s ease both',
				'slide-up'   : 'slideUp 0.6s ease both',
				'slide-right': 'slideRight 0.5s ease both',
				float        : 'float 3s ease-in-out infinite',
				'pulse-warm' : 'pulseWarm 2s ease-in-out infinite',
				'spin-slow'  : 'spin 8s linear infinite'
			},
			keyframes: {
				fadeIn: {
					'0%': {
						opacity: '0'
					},
					'100%': {
						opacity: '1'
					}
				},
				slideUp: {
					'0%': {
						opacity  : '0',
						transform: 'translateY(24px)'
					},
					'100%': {
						opacity  : '1',
						transform: 'translateY(0)'
					}
				},
				slideRight: {
					'0%': {
						opacity  : '0',
						transform: 'translateX(-24px)'
					},
					'100%': {
						opacity  : '1',
						transform: 'translateX(0)'
					}
				},
				float: {
					'0%,100%': {
						transform: 'translateY(0)'
					},
					'50%': {
						transform: 'translateY(-12px)'
					}
				},
				pulseWarm: {
					'0%,100%': {
						boxShadow: '0 0 0 0 rgba(230,177,83,0.4)'
					},
					'50%': {
						boxShadow: '0 0 0 12px rgba(230,177,83,0)'
					}
				}
			},
			backgroundImage: {
				'gradient-warm'    : 'linear-gradient(135deg, #E6B153 0%, #ff9a3c 100%)',
				'gradient-dark'    : 'linear-gradient(135deg, #3A2620 0%, #171717 100%)',
				'gradient-hero'    : 'linear-gradient(160deg, #3A2620 0%, #941708 45%, #FF6F1E 100%)',
				'gradient-tertiary': 'linear-gradient(135deg, #F6E9D7 0%, #E6B153 100%)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
}
