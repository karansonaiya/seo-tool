# SEO Auto Fix Tool

A production-ready SaaS application that analyzes any website URL and automatically detects SEO problems, generates SEO scores, and provides AI-powered fix suggestions.

![SEO Auto Fix](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?style=flat-square&logo=tailwindcss)

## 🚀 Features

### Core Analysis
- **Complete SEO Audit** — Meta tags, headings, links, canonical, robots.txt, sitemap analysis
- **Page Speed Analysis** — Lighthouse-powered scoring with LCP, CLS, FID, and Core Web Vitals
- **Image SEO Checker** — Missing alt text, oversized images, unoptimized formats, lazy loading
- **Technical SEO** — HTML structure, schema markup, canonicals, internal linking

### AI-Powered
- **AI Fix Suggestions** — Optimized titles, descriptions, content and keyword suggestions
- **Smart Recommendations** — Contextual fixes based on issue severity and impact

### Business Features
- **SEO Score Dashboard** — Visual charts with technical, performance, and content scores
- **Competitor Analysis** — Compare your site against up to 5 competitors
- **Automated Monitoring** — Weekly audits with alerts for score drops and broken links

### Design
- ✨ Premium dark/light theme with glassmorphism
- 📱 Fully responsive, mobile-first design
- 🎨 Smooth Framer Motion animations
- 📊 Interactive charts via Recharts

## 🏗️ Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| UI Components | Radix UI (Shadcn-style) |
| Animations | Framer Motion |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| SEO Engine | Cheerio (HTML parsing) |
| AI | OpenAI (optional) |
| Database | MongoDB + Mongoose (optional) |
| Auth | NextAuth (optional) |
| Theme | next-themes |

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/audit/          # SEO audit API endpoint
│   ├── audit/              # Audit page
│   ├── dashboard/          # Dashboard page
│   ├── reports/            # Reports listing page
│   ├── competitors/        # Competitor analysis page
│   ├── monitoring/         # SEO monitoring page
│   ├── pricing/            # Pricing page
│   ├── settings/           # User settings page
│   ├── sitemap.ts          # Dynamic sitemap generation
│   ├── robots.ts           # robots.txt generation
│   ├── layout.tsx          # Root layout with metadata
│   └── page.tsx            # Landing page
├── components/
│   ├── ui/                 # Shadcn-style UI components
│   ├── forms/              # Form components
│   ├── dashboard/          # Dashboard charts
│   ├── seo/                # SEO report components
│   ├── theme-provider.tsx  # Theme provider
│   └── theme-toggle.tsx    # Theme toggle button
├── services/
│   ├── seo-analyzer.ts     # Core SEO analysis engine
│   └── ai-suggestions.ts   # AI suggestion generator
├── hooks/
│   └── useSEOAudit.ts      # SEO audit state hook
├── lib/
│   ├── utils.ts            # Utility functions
│   ├── mongodb.ts          # Database connection
│   └── models.ts           # Mongoose models
├── schemas/
│   └── index.ts            # Zod validation schemas
├── types/
│   └── index.ts            # TypeScript types
└── constants/
    └── index.ts            # App-wide constants
```

## ⚡ Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd seo-tool

# Install dependencies
npm install --legacy-peer-deps

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Optional Services

The app works out of the box with basic functionality. For full features, configure:

| Service | Purpose | Required? |
|---------|---------|-----------|
| MongoDB | Store audit reports & user data | No |
| OpenAI API | AI-generated SEO suggestions | No (uses fallback) |
| PageSpeed API | Real Lighthouse metrics | No (uses simulated) |
| Google OAuth | Social login | No |
| Redis | Background job queue | No |

## 🔧 Environment Variables

See `.env.example` for all available configuration options.

### Key Variables

```env
# Required
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional — enhances functionality
MONGODB_URI=mongodb://localhost:27017/seo-auto-fix
OPENAI_API_KEY=your-openai-key
PAGESPEED_API_KEY=your-pagespeed-key
```

## 📦 Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🔒 Security

- **Rate Limiting** — API requests are rate-limited per IP
- **Input Validation** — All inputs validated with Zod schemas
- **SSRF Protection** — Private IPs blocked in URL crawling
- **Security Headers** — X-Frame-Options, X-Content-Type-Options, Referrer-Policy
- **URL Sanitization** — Only public HTTP/HTTPS URLs allowed

## 📊 SEO Implementation

The app itself implements full SEO best practices:

- Next.js Metadata API for all pages
- Open Graph and Twitter Card tags
- Dynamic sitemap.xml generation
- robots.txt configuration
- Semantic HTML throughout
- Core Web Vitals optimized 
- Inter font from Google Fonts

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.
