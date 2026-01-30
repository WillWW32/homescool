# HomeScool Academy - Deployment Guide

## Prerequisites
- Supabase account (already configured ✅)
- Vercel account (free tier works)
- Grok API key (already configured ✅)

## Quick Deploy to Vercel

### Option 1: Deploy via Vercel CLI (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   cd homescool-academy
   vercel
   ```

4. **Add Environment Variables**
   After deployment, add these in Vercel Dashboard → Settings → Environment Variables:

   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   NEXT_PUBLIC_GROK_API_KEY=your_grok_api_key
   XAI_API_KEY=your_grok_api_key
   ```

   **Note:** Get your actual keys from your `.env.local` file

5. **Redeploy** after adding environment variables:
   ```bash
   vercel --prod
   ```

### Option 2: Deploy via GitHub + Vercel Dashboard

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Add environment variables (see above)
   - Click "Deploy"

## Post-Deployment Checklist

### 1. Test Core Features
- [ ] Sign up / Login flow
- [ ] Academy page loads with all teachers
- [ ] Click into a classroom and test chat
- [ ] Verify credits are awarded after chat
- [ ] Check profile page shows real data
- [ ] Test gallery and projects pages

### 2. Configure Supabase Production Settings
- [ ] Enable RLS policies (already done ✅)
- [ ] Set up email templates for auth
- [ ] Configure auth providers if needed
- [ ] Set up storage bucket CORS if needed

### 3. Performance Optimization
- [ ] Enable Vercel Analytics
- [ ] Check Core Web Vitals
- [ ] Test on mobile devices
- [ ] Verify loading states work correctly

### 4. Security Review
- [ ] Verify RLS policies are working
- [ ] Test that users can only see their own data
- [ ] Ensure API keys are not exposed in client code
- [ ] Check that service role key is only used server-side

## Environment Variables Reference

| Variable | Purpose | Required |
|----------|---------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase admin key (server only) | ✅ |
| `NEXT_PUBLIC_GROK_API_KEY` | Grok API for teacher chat | ✅ |
| `XAI_API_KEY` | Grok API alternate key | ✅ |

## Troubleshooting

### Build Fails
- Check that all environment variables are set
- Verify `package.json` has correct dependencies
- Check build logs for specific errors

### Database Connection Issues
- Verify Supabase URL and keys are correct
- Check that RLS policies allow access
- Ensure database migration ran successfully

### Grok API Not Working
- Verify API key is correct
- Check Grok API quota/limits
- Review network errors in browser console

### Authentication Issues
- Check Supabase auth settings
- Verify redirect URLs are configured
- Test with email confirmations disabled for development

## Next Steps After Deployment

1. **Set up custom domain** (optional)
   - Configure in Vercel Dashboard
   - Update Supabase auth redirect URLs

2. **Enable monitoring**
   - Vercel Analytics
   - Supabase logs
   - Error tracking (Sentry, etc.)

3. **Create test accounts**
   - Test different user flows
   - Verify all features work in production

4. **Plan content strategy**
   - Add more challenges
   - Expand teacher personas
   - Create video content

## Support

For issues or questions:
- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
- Next.js Docs: https://nextjs.org/docs
