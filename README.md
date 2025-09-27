# GST Invoices

A modern GST invoice management system built with Next.js 15, TypeScript, Tailwind CSS, and shadcn/ui.

## Features

- ⚡ **Next.js 15** with App Router
- 🔷 **TypeScript** for type safety
- 🎨 **Tailwind CSS** for styling
- 🧩 **shadcn/ui** for beautiful components
- 🎭 **Framer Motion** for animations
- 🌙 **Dark/Light theme** support
- 📏 **ESLint** for code linting
- 💅 **Prettier** for code formatting
- 🐕 **Husky** for git hooks
- 🔍 **Type checking** with TypeScript

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd gst-invoices
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

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run type-check` - Run TypeScript type checking
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── globals.css     # Global styles with Tailwind
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/         # React components
│   ├── ui/            # shadcn/ui components
│   └── theme-provider.tsx
├── lib/               # Utility functions
│   └── utils.ts       # Tailwind class utilities
├── hooks/             # Custom React hooks
└── types/             # TypeScript type definitions
```

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion
- **Theme**: next-themes
- **Linting**: ESLint
- **Formatting**: Prettier
- **Git Hooks**: Husky

## Development

The project uses:

- **Absolute imports** with `@/*` alias
- **Pre-commit hooks** for linting and formatting
- **Type checking** on build
- **Modern CSS** with Tailwind utilities

## License

ISC
