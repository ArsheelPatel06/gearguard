/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#1F2933', // Slate / Graphite
                surface: '#F5F7FA',    // Off-white
                primary: '#3A6EA5',    // Steel Blue
                primaryHover: '#2C5282',
                secondary: '#64748B',

                // Strict Status Colors
                status: {
                    new: '#9CA3AF',       // Neutral Gray
                    inProgress: '#2563EB',// Blue
                    repaired: '#15803D',  // Muted Green
                    overdue: '#D97706',   // Amber
                    scrap: '#B91C1C',     // Red
                },

                // Text Colors
                text: {
                    main: '#1F2933',      // Dark Slate
                    muted: '#64748B',     // Gray
                    inverted: '#FFFFFF',  // White
                },

                sidebar: '#1F2933',
            },
            fontFamily: {
                sans: ['Inter', 'Source Sans Pro', 'sans-serif'],
            },
            boxShadow: {
                'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                'modal': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            },
            animation: {
                'fade-in': 'fadeIn 0.2s ease-out',
                'slide-in': 'slideIn 0.3s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideIn: {
                    '0%': { transform: 'translateY(10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
            }
        },
    },
    plugins: [],
}
