<img width="2125" height="575" alt="devpress-banner" src="https://github.com/user-attachments/assets/d7661e22-a1b4-4b76-abf9-1b772ae08042" />


**DevPress** is a modern, full-stack blogging application built to demonstrate a **clean**, **type-safe**, and **scalable** architecture.  
It allows users to **create**, **read**, **edit**, and **delete** blog posts, manage categories, upload images, and search for content — all through a seamless and responsive interface.

> 🧠 Built as part of a 7-day technical assessment focused on code quality, scalability, and modern best practices.


## 🌐 Live Demo
👉 **[https://anishvkalbhor-devpress.vercel.app](https://anishvkalbhor-devpress.vercel.app)**  

[![wakatime](https://wakatime.com/badge/user/00316d4c-bca5-4d5a-a80c-8a03f29d77e5/project/32ae1300-2ba3-46f0-9cad-6188c2c29639.svg)](https://wakatime.com/badge/user/00316d4c-bca5-4d5a-a80c-8a03f29d77e5/project/32ae1300-2ba3-46f0-9cad-6188c2c29639)

## ✨ Features Overview

DevPress successfully implements all **Priority 1 & 2** features, plus several **Priority 3** “Nice-to-Have” enhancements for a complete, production-ready experience.

### 🧩 Priority 1: Core Features
- ✅ Blog Post **CRUD** (Create, Read, Update, Delete)
- ✅ Category **CRUD**
- ✅ Assign multiple **Categories** per post
- ✅ **Blog Listing** with pagination (`/blog`)
- ✅ **Single Post Page** (`/posts/[slug]`)
- ✅ **Category Filtering** (`/blog?category=design`)
- ✅ Responsive, professional **UI**
- ✅ **Mobile navigation** with hamburger menu

### 🧱 Priority 2: Expected Features
- ✅ 5-section **Landing Page**
- ✅ **Dashboard** for managing posts
- ✅ Draft / Published **Status Toggle**
- ✅ Fully **responsive** across devices
- ✅ Rich-text editor using **Tiptap**

### 💎 Priority 3: Nice-to-Have Features
- ✅ **Full-text Search** (title, content, author)
- ✅ **Reading Time** estimate on posts
- ✅ **Image Uploads** with Vercel Blob
- ✅ **Dynamic SEO Meta Tags**
- ✅ **Pagination** on blog & dashboard

---

## ⚙️ Tech Stack

| 🧠 Icon | 🛠️ Technology | 💬 Description |
|:--------:|:--------------|:---------------|
| <img src="https://skillicons.dev/icons?i=nextjs" width="40" /> | **Next.js 15 (App Router)** | Framework for SSR, SSG, and routing |
| <img src="https://skillicons.dev/icons?i=typescript" width="40" /> | **TypeScript** | Static typing across frontend and backend |
| 🌀 | **tRPC** | End-to-end type-safe API layer |
| <img src="https://skillicons.dev/icons?i=postgres" width="40" /> | **PostgreSQL** | Scalable relational database (hosted on Vercel) |
| 🧱 | **Drizzle ORM** | Type-safe, lightweight ORM for Postgres |
| <img src="https://skillicons.dev/icons?i=reactquery" width="40" /> | **TanStack Query (React Query)** | Data fetching and caching layer |
| <img src="https://skillicons.dev/icons?i=tailwind" width="40" /> | **Tailwind CSS** | Utility-first CSS framework |
| <img src="https://skillicons.dev/icons?i=react" width="40" /> | **shadcn/ui + Aceternity + MagicUI** | Modular, themeable UI component systems |
| ✏️ | **Tiptap** | Rich text WYSIWYG editor |
| ☁️ | **Vercel Blob** | File upload & cloud storage |
| 🧩 | **Zod** | Schema validation & type inference |
| 🔔 | **Sonner** | Elegant toast notifications |
| <img src="https://skillicons.dev/icons?i=vercel" width="40" /> | **Vercel** | Hosting and CI/CD deployment platform |
| <img src="https://skillicons.dev/icons?i=pnpm" width="40" /> | **pnpm Monorepo** | Workspace setup for modular architecture |

---

## 🧭 Project Architecture

DevPress is built using a **pnpm monorepo** structure for clear separation of concerns, modularity, and type safety.

- **`apps/web`** → Frontend (Next.js App) + tRPC Client  
- **`packages/api`** → Backend tRPC Routers + Validation  
- **`packages/db`** → Drizzle ORM Schema + Database Migrations  

---

## 📁 Folder Structure

```bash
.
├── .eslintrc.js
├── .gitignore
├── README.md
├── apps
│   └── web
│       ├── next.config.ts
│       ├── postcss.config.js
│       ├── tailwind.config.ts
│       ├── src
│       │   ├── app
│       │   │   ├── api/uploadthing
│       │   │   │   ├── core.ts
│       │   │   │   └── route.ts
│       │   │   ├── blog/[slug]/page.tsx
│       │   │   ├── blog/page.tsx
│       │   │   ├── categories/page.tsx
│       │   │   ├── dashboard/page.tsx
│       │   │   ├── editor/[postId]/page.tsx
│       │   │   ├── editor/page.tsx
│       │   │   ├── layout.tsx
│       │   │   ├── globals.css
│       │   │   └── page.tsx
│       │   ├── components
│       │   │   ├── layout/{footer,header,main,theme-provider}.tsx
│       │   │   ├── tiptap-ui/{index,link-edit-popover,code-block-button}.tsx
│       │   │   ├── ui/{button,card,dialog,form,input,table,textarea,...}.tsx
│       │   │   ├── {editor,file-dialog,icons,pagination,providers,theme-toggle,user-nav}.tsx
│       │   ├── lib/{editor,fonts,uploadthing,utils}.ts
│       │   └── trpc/{client,provider}.ts
│       └── tsconfig.json
├── packages
│   ├── api
│   │   ├── src/{root,trpc}.ts
│   │   └── tsconfig.json
│   ├── db
│   │   ├── prisma/schema.prisma
│   │   ├── src/index.ts
│   │   └── tsconfig.json
│   └── ui
│       └── src/button.tsx
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── tsconfig.json
└── turbo.json
```
## 🧩 tRPC Router Overview
| 🗂 Router            | ⚙️ Description                                                    |
| -------------------- | ----------------------------------------------------------------- |
| `router/post.ts`     | CRUD for blog posts, with search, publish, and image upload logic |
| `router/category.ts` | CRUD for categories                                               |
| `validation.ts`      | Shared Zod schemas for API + forms                                |
| `root.ts`            | Combines all routers into the `appRouter`                         |
| `trpc.ts`            | Sets up context (DB, procedures) & initializes tRPC server        |

## ⚡ Local Setup

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/anishvkalbhor/fullstack_blogging_application.git
cd fullstack_blogging_application
```

### 2️⃣ Install Dependencies
```sh
pnpm install
```

### 3️⃣ Set Up Environment Variables
A. Root .env
```sh
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."
```
B. packages/db/.env
```sh
DATABASE_URL="postgres://..."
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."
```

### 4️⃣ Run Migrations
```sh
pnpm --filter db db:migrate
```

### 5️⃣ Start Development Server
```sh
pnpm --filter web dev
```
Then open → http://localhost:3000

## 💡 Trade-offs & Key Decisions

### 🧠 1. tRPC vs REST/GraphQL

Chose **tRPC** for end-to-end type safety and faster development.
It eliminates redundant schema definitions, making it ideal for solo or small-team TypeScript projects.

### 🧱 2. Monorepo Architecture

Adopted a **pnpm monorepo** despite its initial complexity — it pays off in scalability and maintainability.
It enables shared types, isolated packages, and clear boundaries between `web`, `api`, and `db`.

### ⚙️ 3. Server vs Client Components

Leveraged **Next.js App Router** for a hybrid rendering model:

* **Server Components** for performance and SEO
* **Client Components** for interactivity (forms, toasts, menus)

### 🖼️ 4. Image Uploads with Vercel Blob

Implemented **drag-and-drop file uploads** with Vercel Blob instead of basic URLs — resulting in a smoother, production-ready UX.

### 🎨 5. UI/UX Customization

Combined **shadcn/ui**, **Aceternity**, and **MagicUI** for a modern, minimalist design system with complete customization control.

# 🏁 Summary

DevPress blends modern web architecture, type safety, and production-grade UI to deliver a fully functional blogging platform — built in just **7 days**.

> 💡 A project that demonstrates how clean code, tRPC, and Next.js 15 can come together to build a scalable, real-world application.


# 👨‍💻 Author

**Anish V. Kalbhor**

📧 [anishvkalbhor@gmail.com](mailto:anishvkalbhor@gmail.com)

🔗 [GitHub Profile](https://github.com/anishvkalbhor)
