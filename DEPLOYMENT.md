# Deploying Habit Tracker to GitHub Pages

This guide explains how to deploy your SvelteKit habit tracker to GitHub Pages.

## Prerequisites

1. A GitHub account
2. Your habit tracker code in a GitHub repository
3. Node.js and pnpm installed locally

## Setup Instructions

### 1. Repository Setup

1. Create a new repository on GitHub (if you haven't already)
2. Push your habit tracker code to the repository:

```bash
git init
git add .
git commit -m "Initial commit: Habit tracker app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git
git push -u origin main
```

### 2. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on **Settings** tab
3. Scroll down to **Pages** section
4. Under **Source**, select **GitHub Actions**

### 3. Automatic Deployment (Recommended)

The repository includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that automatically builds and deploys your app when you push to the main branch.

**How it works:**
- Triggers on every push to `main` branch
- Builds the SvelteKit app with static adapter
- Deploys to GitHub Pages
- Your app will be available at: `https://YOUR_USERNAME.github.io/YOUR_REPOSITORY_NAME`

**To trigger deployment:**
```bash
git add .
git commit -m "Update habit tracker"
git push origin main
```

### 4. Manual Deployment (Alternative)

If you prefer manual deployment, you can use the included npm script:

```bash
# Build and deploy manually
pnpm run deploy
```

This will:
1. Build the static site
2. Push the `build` folder to the `gh-pages` branch
3. GitHub Pages will serve from the `gh-pages` branch

## Configuration Details

### SvelteKit Static Adapter
The app is configured with `@sveltejs/adapter-static` in `svelte.config.js`:

```javascript
adapter: adapter({
  pages: 'build',
  assets: 'build',
  fallback: undefined,
  precompress: false,
  strict: true
})
```

### Base Path Handling
The app automatically handles the base path for GitHub Pages:
- In development: no base path
- In production: uses the repository name as base path

### PWA Configuration
The PWA manifest and service worker are configured to work with GitHub Pages paths.

## Troubleshooting

### Build Errors
If you get build errors:
1. Check that all dependencies are installed: `pnpm install`
2. Test the build locally: `pnpm run build`
3. Check the GitHub Actions logs for detailed error messages

### 404 Errors
If you get 404 errors on deployed site:
1. Ensure GitHub Pages is enabled in repository settings
2. Check that the repository name matches the base path configuration
3. Wait a few minutes for GitHub Pages to update

### PWA Not Working
If the PWA features don't work on the deployed site:
1. Ensure HTTPS is enabled (GitHub Pages uses HTTPS by default)
2. Check browser console for service worker errors
3. Clear browser cache and try again

## Development vs Production

- **Development**: Run `pnpm run dev` - no base path, works on localhost
- **Production**: Uses repository name as base path for GitHub Pages

## Custom Domain (Optional)

To use a custom domain:
1. Add a `CNAME` file to the `static` folder with your domain
2. Configure DNS settings with your domain provider
3. Enable custom domain in GitHub repository settings

## Security Notes

- The app stores data locally using IndexedDB
- No server-side storage - all data stays on the user's device
- Perfect for privacy-focused habit tracking

## Updates

To update your deployed app:
1. Make your changes locally
2. Test with `pnpm run dev`
3. Commit and push to main branch
4. GitHub Actions will automatically deploy the updates
