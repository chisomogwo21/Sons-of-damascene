# Deployment Guide (GitHub Pages)

This guide walks you through deploying the Sons of Damascene website to GitHub Pages using GitHub Actions.

---

### 1. Repository Visibility
- Ensure your GitHub repository is **Public** (GitHub Pages with GitHub Actions is free for public repositories):
  - Go to **Settings** → **General** → **Danger Zone** → **Change repository visibility** → **Make public**.

---

### 2. Enable GitHub Pages Source
1. In your GitHub repository, navigate to **Settings** → **Pages** (under the "Code and automation" section).
2. Under **Build and deployment** → **Source**, select **GitHub Actions**.

---

### 3. Configure Repository Secrets
Navigate to **Settings** → **Secrets and variables** → **Actions** → **Secrets tab**, and add the following three repository secrets:

| Secret Name | Value | Description |
| :--- | :--- | :--- |
| `SUPABASE_URL` | `https://<your-project>.supabase.co` | Your Supabase project URL |
| `SUPABASE_ANON_KEY` | `eyJ...` | Your Supabase anon / public API key |
| `VITE_WEB3FORMS_KEY` | `your_web3forms_access_key` | Access key from [web3forms.com](https://web3forms.com) for contact submissions |

> **Security Reminder:** Never commit `.env` files or real credentials into the repository. The `.gitignore` is configured to keep credentials out of version control.

---

### 4. Optional Custom Domain Variable
- By default, the workflow sets the base path to `/Sons-of-damascene/` (suitable for `https://<username>.github.io/Sons-of-damascene/`).
- If you attach a custom root domain (e.g., `sonsofdamascene.com`):
  1. Go to **Settings** → **Secrets and variables** → **Actions** → **Variables tab**.
  2. Add a new variable `VITE_BASE` with the value `/`.

---

### 5. Trigger the First Deployment
1. Go to the **Actions** tab in your GitHub repository.
2. Under "All workflows", select **Build and deploy site**.
3. Click the **Run workflow** dropdown, choose branch `main`, and click **Run workflow**.
4. The workflow will:
   - Export data from Supabase (`content.json`).
   - Download and optimize all site media into `public/media/`.
   - Build the production bundle without Supabase in the public entry chunk.
   - Generate static routes for all pages and products.
   - Deploy the site to GitHub Pages.

---

### 6. Where to Find Your Live Site URL
- Once the workflow completes, go to **Settings** → **Pages** or look at the deployment environment link on the repository's main page or Actions run summary.
- The default URL will be:
  `https://chisomogwo21.github.io/Sons-of-damascene/`

---

### 7. Automated Updates & Troubleshooting
- **Hourly Updates:** A cron job runs every hour (`17 * * * *`). It reads content from Supabase. If no changes occurred since the previous run, it exits early without rebuilding, keeping Supabase active and keeping the deploy clean.
- **Immediate Updates:** Whenever you push code to `main` or manually click "Run workflow", the site rebuilds and deploys immediately.
- **Admin Note:** Changes made in the Supabase Admin dashboard appear on the live site within about an hour.
- **If a Run Fails:**
  - Click on the failed workflow run in the **Actions** tab.
  - Expand the failing step (e.g., "Run build-time export script" or "Build site").
  - Verify that `SUPABASE_URL` and `SUPABASE_ANON_KEY` secrets are entered correctly.
  - Verify your Supabase instance is active and not paused.
  - Notice that if the export fails, the previous live site deployment remains active and unaffected.
