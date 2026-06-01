import type { AppSpec, TechPlan } from './types';

export interface ScaffoldFile {
  path: string;
  content: string;
  description: string;
}

export function generateNextJsScaffold(
  projectName: string,
  spec: AppSpec,
  techPlan: TechPlan
): ScaffoldFile[] {
  const files: ScaffoldFile[] = [];
  const slug = projectName.toLowerCase().replace(/\s+/g, '-');

  // package.json
  files.push({
    path: 'package.json',
    description: 'Project dependencies and scripts',
    content: `{
  "name": "${slug}",
  "version": "0.1.0",
  "description": "${spec.summary}",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "jest"
  },
  "dependencies": {
    "next": "^16.2.0",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "lucide-react": "^0.468.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "typescript": "^5.9.0",
    "tailwindcss": "^4.0.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "@tailwindcss/postcss": "^4.0.0"
  }
}
`,
  });

  // tsconfig.json
  files.push({
    path: 'tsconfig.json',
    description: 'TypeScript configuration',
    content: `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "skipDefaultLibCheck": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "jsx": "react-jsx",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
`,
  });

  // next.config.ts
  files.push({
    path: 'next.config.ts',
    description: 'Next.js configuration',
    content: `import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,
};

export default config;
`,
  });

  // Tailwind config
  files.push({
    path: 'tailwind.config.js',
    description: 'Tailwind CSS configuration',
    content: `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
`,
  });

  // PostCSS config
  files.push({
    path: 'postcss.config.mjs',
    description: 'PostCSS configuration',
    content: `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
`,
  });

  // .gitignore
  files.push({
    path: '.gitignore',
    description: 'Git ignore file',
    content: `# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Production
.next/
out/
build/
dist/

# IDE
.idea/
.vscode/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Environment
.env
.env.local
.env.*.local
`,
  });

  // README
  files.push({
    path: 'README.md',
    description: 'Project README',
    content: `# ${projectName}

${spec.summary}

## Overview
${spec.valueProposition}

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

\`\`\`bash
npm install
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to see your app.

## Project Structure

\`\`\`
src/
├── app/           # Next.js App Router
├── components/    # Reusable React components
├── lib/          # Utility functions
└── styles/       # Global styles
\`\`\`

## Core Features

${spec.coreFeatures.map(f => `- **${f.name}**: ${f.description}`).join('\n')}

## Data Model

${spec.dataModel.map(e => `- **${e.name}**: ${e.description}`).join('\n')}

## Tech Stack

${Object.entries(techPlan.stack)
  .map(([k, v]) => `- **${k}**: ${v}`)
  .join('\n')}

## Architecture

${techPlan.architectureDecisions.map(d => `- ${d}`).join('\n')}

## Development

\`\`\`bash
# Run development server
npm run dev

# Build for production
npm run build

# Run production server
npm start

# Lint code
npm run lint
\`\`\`

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
`,
  });

  // src/app/layout.tsx
  files.push({
    path: 'src/app/layout.tsx',
    description: 'Root layout component',
    content: `import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "${projectName}",
  description: "${spec.summary}",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-zinc-50 text-zinc-950">
        {children}
      </body>
    </html>
  );
}
`,
  });

  // src/app/globals.css
  files.push({
    path: 'src/app/globals.css',
    description: 'Global styles',
    content: `@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}
`,
  });

  // src/app/page.tsx - Simplified without JSX syntax in string
  files.push({
    path: 'src/app/page.tsx',
    description: 'Home page',
    content: `export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
      <div className="max-w-4xl mx-auto px-6 py-20">
        <h1 className="text-5xl font-bold text-white mb-4">
          ${projectName}
        </h1>
        <p className="text-xl text-zinc-400 mb-8 max-w-2xl">
          ${spec.summary}
        </p>

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6">Core Features</h2>
          <ul className="space-y-3">
            ${spec.coreFeatures.map(f => `<li className="text-zinc-300">• <strong>${f.name}</strong>: ${f.description}</li>`).join('\n            ')}
          </ul>
        </div>

        <footer className="mt-20 pt-8 border-t border-zinc-700 text-center text-zinc-500 text-sm">
          <p>Built with Next.js, React, and Tailwind CSS</p>
        </footer>
      </div>
    </main>
  );
}
`,
  });

  // src/components/Button.tsx
  files.push({
    path: 'src/components/Button.tsx',
    description: 'Reusable Button component',
    content: `import { ReactNode } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger";
}

export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-zinc-700 hover:bg-zinc-600 text-white",
    danger: "bg-red-600 hover:bg-red-700 text-white",
  };

  return (
    <button
      className={"px-4 py-2 rounded-lg font-medium transition " + variants[variant] + " " + className}
      {...props}
    >
      {children}
    </button>
  );
}
`,
  });

  // src/lib/types.ts
  files.push({
    path: 'src/lib/types.ts',
    description: 'Shared TypeScript types',
    content: `// Add your shared types here
${spec.dataModel
  .map(
    entity => `export interface ${entity.name} {
  id: string;
  // Add properties based on your data model
  createdAt: Date;
  updatedAt: Date;
}
`
  )
  .join('\n')}
`,
  });

  return files;
}
