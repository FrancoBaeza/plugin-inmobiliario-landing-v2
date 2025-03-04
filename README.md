# MatchFloor Landing Page

A modern and appealing web landing page for MatchFloor, a company that provides a web plugin for scheduling and managing property visits.

## Features

- Modern, responsive design with smooth scrolling experience
- Multilingual support (Spanish and English)
- Dynamic pricing section that fetches data from an API
- Animated sections using Framer Motion
- Fully customizable with Tailwind CSS

## Tech Stack

- React 19
- TypeScript
- Tailwind CSS for styling
- i18next for internationalization
- Framer Motion for animations
- React Scroll for smooth scrolling
- Axios for API requests

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/plugin-inmobiliario-landing-v2.git
cd plugin-inmobiliario-landing-v2
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:5173
```

## Project Structure

```
src/
├── assets/         # Static assets like images
├── components/     # React components
├── hooks/          # Custom React hooks
├── i18n/           # Internationalization files
│   └── locales/    # Translation files
├── App.tsx         # Main application component
├── index.css       # Global styles
└── main.tsx        # Application entry point
```

## Customization

### Colors

The color palette can be customized in the `tailwind.config.js` file:

```js
theme: {
  extend: {
    colors: {
      primary: '#4D2EA9',
      secondary: '#E5F500',
      'secondary-2': '#9FAA00',
      background: '#F6F6F6',
    },
  },
},
```

### Translations

Translations are stored in JSON files in the `src/i18n/locales` directory. You can modify or add new translations by editing these files.

## Deployment

To build the project for production:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Design inspired by modern SaaS landing pages
- Icons from Heroicons
