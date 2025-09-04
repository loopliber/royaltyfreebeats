# Complete Migration Plan: Base44 → Vercel + Supabase + Cloudflare

## Prerequisites ✅
- [ ] Supabase account (free tier available)
- [ ] Vercel account (free tier available)  
- [ ] Cloudflare account (free tier available)
- [ ] Stripe account for payments
- [ ] Export all data from Base44 (CSV/JSON format)
- [ ] Download all audio files and cover art from Base44

## Phase 1: Initial Vercel Deployment (15 minutes)

### 1.1 Deploy Current Project to Vercel
1. Install Vercel CLI: `npm install -g vercel`
2. In your project directory: `vercel`
3. Follow the prompts:
   - Set up and deploy? `Y`
   - Which scope? (your account)
   - Link to existing project? `N`
   - Project name: `royaltyfreebeats`
   - Directory: `./` (current directory)
   - Override settings? `N`
4. Note your deployment URL (e.g., `royaltyfreebeats-xyz.vercel.app`)

### 1.2 Verify Deployment
1. Visit your Vercel URL
2. The site should load (may have errors due to Base44 dependency)
3. Go to Vercel dashboard to confirm deployment

## Phase 2: Supabase Database Setup (30 minutes)

### 2.1 Create Supabase Project
1. Go to https://supabase.com and create account
2. Click "New Project"  
3. Choose organization and project name: "royalty-free-beats"
4. Choose region closest to your users
5. Set a strong database password
6. Wait for setup to complete (~2 minutes)

### 2.2 Database Schema Setup
1. Go to SQL Editor in Supabase dashboard
2. Copy and paste the entire contents of `migration/01_supabase_schema.sql`
3. Click "Run" to execute the schema
4. Verify tables are created in Table Editor

### 2.3 Storage Setup in Supabase
1. Go to Storage in Supabase dashboard
2. Create bucket: `licenses` (for PDF storage)
3. Make it public
4. Set up RLS policies for file access

### 2.4 Get Your Supabase Keys
1. Go to Settings → API
2. Copy your Project URL
3. Copy your anon/public key
4. Copy your service_role key (keep this secret!)

## Phase 3: Cloudflare R2 Storage Setup (20 minutes)

### 2.1 Create Cloudflare Account & R2 Bucket
1. Go to https://cloudflare.com and create account
2. Go to R2 Object Storage
3. Create bucket: `royalty-free-beats-storage`
4. Enable public access for bucket
5. Note your account ID from the dashboard

### 2.2 Get R2 Access Keys
1. Go to R2 → Manage R2 API tokens
2. Create API token with R2 permissions
3. Save Access Key ID and Secret Access Key

### 2.3 Upload Your Files
1. Create folder structure in R2:
   - `/audio/` for beat files
   - `/covers/` for cover art
2. Upload all your audio files and cover art
3. Note the new URLs for database updates

## Phase 3: Environment Setup (10 minutes)

### 3.1 Set Up Environment Variables
1. Copy `.env.example` to `.env.local`
2. Fill in all the values:

```bash
# Supabase
VITE_SUPABASE_URL=https://odoepomdbdmdrwmbghqi.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9kb2Vwb21kYmRtZHJ3bWJnaHFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5ODE2ODQsImV4cCI6MjA3MjU1NzY4NH0.V0K7mkNg66zYh2Rh0a5yw9GquG-JIGBXnEHxaJifZ-o
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9kb2Vwb21kYmRtZHJ3bWJnaHFpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Njk4MTY4NCwiZXhwIjoyMDcyNTU3Njg0fQ.sAqlDWKhq8VmdFc1XrpUumjzRWLw7WoDM68OaBCUm0Y

# Stripe 
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Cloudflare R2
CLOUDFLARE_R2_ACCESS_KEY_ID=aac38f7d043b2b744e06b1cc16a287aa
CLOUDFLARE_R2_SECRET_ACCESS_KEY=71e0ea14098eace224223691478c661699fb82804c8fb64661ddb92b5dbf65fc
CLOUDFLARE_R2_BUCKET_NAME=royalty-free-beats-storage
CLOUDFLARE_R2_ACCOUNT_ID=d3819f3d9dd8c4c388208c3f88d27724

# URLs
VERCEL_URL=https://royaltyfreebeats-6kqp147l2-ajs-projects-e9a66ff0.vercel.app/
VITE_APP_URL=http://localhost:5173
```

### 3.2 Add Environment Variables to Vercel
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add all the variables from your `.env.local` file
3. Set them for Production, Preview, and Development environments

## Phase 4: Data Migration (30 minutes)

### 4.1 Export Data from Base44
1. Export these tables as CSV:
   - beats
   - users  
   - purchases
   - beat_likes
   - leads
   - blog_posts

### 4.2 Import Data to Supabase
1. Place CSV files in `migration/data/` folder
2. Use Supabase dashboard Table Editor to import CSVs
3. Or use the import script: `migration/02_import_data.sh`
4. Update file URLs to point to Cloudflare R2

### 4.3 Verify Data Integrity
1. Check row counts match
2. Verify relationships are intact
3. Test a few queries in SQL Editor

## Phase 5: Code Migration (45 minutes)

### 5.1 Install New Dependencies
```bash
npm install
```

### 5.2 Update API Calls
The new Supabase client is already set up in `src/api/supabaseClient.js`

Replace Base44 imports in your components:
```javascript
// OLD
import { Beat, User } from './api/entities'
import { createCheckoutSession } from './api/functions'

// NEW  
import { db, auth } from './api/supabaseClient'
```

### 5.3 Update Component Usage
Update your components to use the new API:

```javascript
// OLD Base44 way
const beats = await Beat.find()
const user = await User.getUser()

// NEW Supabase way
const { data: beats } = await db.beats.getAll()
const { data: { user } } = await auth.getUser()
```

## Phase 6: Final Deployment & Configuration (20 minutes)

### 6.1 Deploy Updated Code with Migration
```bash
# Install dependencies with new packages
npm install

# Deploy updated code
vercel --prod
```

### 6.2 Verify Deployment
1. Go to Vercel dashboard → Project Settings → Environment Variables
2. Add all your environment variables
3. Redeploy: `vercel --prod`

### 6.4 Set Up Custom Domain (Optional)
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

## Phase 7: Stripe Webhooks Setup (15 minutes)

### 7.1 Configure Webhook Endpoint
1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://your-domain.vercel.app/api/stripe-webhook`
3. Select events:
   - `checkout.session.completed`
   - `payment_intent.payment_failed`
4. Copy webhook secret

### 7.2 Update Environment Variable
Add the webhook secret to your Vercel environment variables

## Phase 8: Testing & Validation (30 minutes)

### 8.1 Test Core Functionality
- [ ] User registration/login
- [ ] Browse beats
- [ ] Audio playback
- [ ] Add to cart
- [ ] Checkout process
- [ ] Payment completion
- [ ] License PDF generation
- [ ] File downloads

### 8.2 Test Data Migration
- [ ] All beats display correctly
- [ ] User accounts work
- [ ] Purchase history shows
- [ ] Liked beats preserved

## Migration Checklist Summary

### Pre-Migration
- [ ] Export all data from Base44
- [ ] Download all media files
- [ ] Set up Supabase project
- [ ] Set up Cloudflare R2
- [ ] Set up environment variables

### Migration
- [ ] Run database schema script
- [ ] Import data to Supabase
- [ ] Upload files to Cloudflare R2
- [ ] Update code to use new APIs
- [ ] Deploy to Vercel
- [ ] Configure Stripe webhooks

### Post-Migration
- [ ] Test all functionality
- [ ] Update DNS (if using custom domain)
- [ ] Monitor for errors
- [ ] Update any remaining hardcoded URLs

## Rollback Plan

If something goes wrong:
1. Keep Base44 running until migration is 100% verified
2. Use git to revert code changes: `git checkout main`
3. Redeploy previous version to Vercel
4. Update DNS back to original setup

## Support & Troubleshooting

### Common Issues:
1. **CORS errors**: Check Supabase RLS policies
2. **File upload fails**: Verify Cloudflare R2 permissions
3. **Payments not working**: Check Stripe webhook URL and secret
4. **Auth issues**: Verify Supabase auth settings

### Getting Help:
- Supabase Discord: https://discord.supabase.com
- Vercel Discord: https://discord.gg/vercel
- Cloudflare Community: https://community.cloudflare.com

---

## Estimated Total Time: 3-4 hours

This migration will give you:
- ✅ Better performance and scalability
- ✅ Lower costs (especially for file storage)
- ✅ More control over your data
- ✅ Modern tech stack
- ✅ Better developer experience

Ready to start? Begin with Phase 1! 🚀
