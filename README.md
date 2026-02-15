# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## 🚀 NEW: Server-Side Gemini Generation

This project now includes production-grade server-side AI generation using Google Gemini! 

### Quick Setup

1. **Get API Keys:**
   - Gemini API Key: https://aistudio.google.com/app/apikey
   - Supabase Service Key: Your Supabase Dashboard → Settings → API

2. **Update .env:**
   ```bash
   GEMINI_API_KEY="your_actual_key_here"
   SUPABASE_SERVICE_ROLE_KEY="your_service_key_here"
   ```

3. **Test:**
   ```bash
   npm run dev
   # Visit a generator and try creating a prompt
   ```

### Documentation

- **📖 [Implementation Summary](IMPLEMENTATION_SUMMARY.md)** - Start here for overview
- **⚡ [Quick Start Guide](QUICKSTART.md)** - Fast setup and testing
- **🔄 [Migration Guide](MIGRATION_GUIDE.md)** - Update your generators
- **🏗️ [Architecture](ARCHITECTURE.md)** - System design and flow
- **📚 [Full Documentation](GEMINI_IMPLEMENTATION.md)** - Complete technical details

### Features

- ✅ Server-side Gemini API integration
- ✅ Strict request/response validation with Zod
- ✅ Automatic JSON repair for malformed outputs
- ✅ Preserves field values exactly (e.g., aspectRatio)
- ✅ Only includes selected fields (no invented values)
- ✅ Comprehensive error handling
- ✅ TypeScript type safety
- ✅ Production-ready authentication

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- **Google Gemini API** (for AI generation)
- **Supabase** (for authentication & database)
- **Zod** (for schema validation)

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

**Important for Production:**
Before deploying, make sure to add these environment variables to your hosting platform:
- `GEMINI_API_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `GEMINI_MODEL` (optional, defaults to gemini-2.0-flash-exp)
- `GENERATION_TIMEOUT_MS` (optional, defaults to 40000)

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
