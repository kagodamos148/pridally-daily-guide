# Pridally Daily Guide

A comprehensive daily health guide built with Next.js, React, and Tailwind CSS.

## 🚀 Features

- Daily health check-ins
- Health calendar tracking
- Doctor scheduling
- Health chatbot
- Responsive design with Tailwind CSS
- Modern UI components with ShadCN/UI

## 🛠️ Tech Stack

- **Framework:** Next.js 15.5.4
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** ShadCN/UI + Radix UI
- **State Management:** React Context + React Query
- **Icons:** Lucide React

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/kagodamos148/pridally-daily-guide.git
cd pridally-daily-guide
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Build & Export

To build for production:
```bash
npm run build
```

To export as static files:
```bash
npm run export
```

## 🚀 Deployment to GitHub Pages

This project is configured for automatic deployment to GitHub Pages using GitHub Actions.

### Setup Instructions:

1. **Enable GitHub Pages:**
   - Go to your repository on GitHub
   - Navigate to Settings → Pages
   - Under "Source", select "GitHub Actions"

2. **Push to main branch:**
   ```bash
   git add .
   git commit -m "Setup GitHub Pages deployment"
   git push origin main
   ```

3. **Automatic Deployment:**
   - The GitHub Actions workflow will automatically build and deploy your site
   - Your site will be available at: `https://kagodamos148.github.io/pridally-daily-guide/`

### Manual Deployment:
If you prefer to deploy manually:

1. Build the static files :
```bash
npm run build
```

2. The static files will be in the `out` directory
3. Upload the contents of the `out` directory to your web server

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx          # Home page
│   ├── not-found.tsx     # 404 page
│   └── providers.tsx     # Client providers
├── src/
│   ├── components/       # Reusable components
│   │   ├── auth/        # Authentication components
│   │   ├── dashboard/   # Dashboard components
│   │   ├── landing/     # Landing page components
│   │   └── ui/          # UI components (ShadCN)
│   ├── contexts/        # React contexts
│   ├── hooks/           # Custom hooks
│   └── lib/             # Utility functions
├── public/              # Static assets
└── .github/workflows/   # GitHub Actions
```

## 🔧 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 🎨 Styling

This project uses Tailwind CSS with a custom healthcare-focused design system featuring calming blues and greens. The color scheme is defined in `app/globals.css`.

## 📝 License

This project is private and not licensed for public use.
