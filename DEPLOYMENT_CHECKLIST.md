# Migration Deployment Checklist

## ✅ Pre-Deployment Checklist

### Supabase Setup
- [ ] Supabase project created
- [ ] Database schema deployed (`migration/01_supabase_schema.sql`)
- [ ] Data imported from Base44 CSV exports
- [ ] Row Level Security (RLS) policies configured
- [ ] Storage bucket created for licenses
- [ ] Auth settings configured

### Cloudflare R2 Setup  
- [ ] R2 bucket created: `royalty-free-beats-storage`
- [ ] API tokens generated
- [ ] Files uploaded with correct folder structure:
  - `/audio/` - beat files
  - `/covers/` - cover art
  - `/images/` - other images
- [ ] Public access configured

### Environment Variables
- [ ] `.env.local` file created and populated
- [ ] All required variables set:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_KEY`
  - `VITE_STRIPE_PUBLISHABLE_KEY`
  - `STRIPE_SECRET_KEY`
  - `STRIPE_WEBHOOK_SECRET`
  - `CLOUDFLARE_R2_ACCESS_KEY_ID`
  - `CLOUDFLARE_R2_SECRET_ACCESS_KEY`
  - `CLOUDFLARE_R2_BUCKET_NAME`
  - `CLOUDFLARE_R2_ACCOUNT_ID`

### Code Migration
- [ ] Dependencies updated (`npm install`)
- [ ] Component migration script run (`node migration/04_migrate_components.mjs`)
- [ ] Manual code review completed
- [ ] Base44 imports removed
- [ ] Supabase client integrated

## 🚀 Deployment Steps

### 1. Local Testing
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Test core functionality:
# - User authentication
# - Beat browsing
# - Audio playback
# - Cart functionality
# - Checkout process
```

### 2. Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts to:
# - Link to existing project or create new
# - Set build settings (auto-detected for Vite)
# - Deploy
```

### 3. Configure Vercel Environment Variables
In Vercel Dashboard → Project Settings → Environment Variables:
- Add all environment variables from `.env.local`
- Set for Production, Preview, and Development environments
- Redeploy after adding variables

### 4. Set Up Stripe Webhooks
- Go to Stripe Dashboard → Webhooks
- Add endpoint: `https://your-domain.vercel.app/api/stripe-webhook`
- Select events: `checkout.session.completed`, `payment_intent.payment_failed`
- Copy webhook secret to Vercel environment variables

### 5. DNS Configuration (if using custom domain)
- In Vercel: Project Settings → Domains
- Add your domain
- Update your DNS provider with Vercel's records

## 🧪 Post-Deployment Testing

### Critical Paths to Test
- [ ] Homepage loads correctly
- [ ] User registration works
- [ ] User login works
- [ ] Browse beats page displays beats
- [ ] Audio player functionality
- [ ] Search and filters work
- [ ] Add beats to cart
- [ ] Checkout process completes
- [ ] Payment processing works
- [ ] License PDF generation works
- [ ] File downloads work
- [ ] User profile/dashboard works

### Test User Journey
1. **New User Registration**
   - Visit site
   - Sign up with email
   - Verify account creation in Supabase
   
2. **Browse and Purchase**
   - Browse beats
   - Play audio previews
   - Add to cart
   - Complete checkout
   - Verify payment in Stripe
   - Verify purchase record in Supabase
   - Download license PDF

3. **Returning User**
   - Sign in
   - View purchase history
   - Access downloaded files

### Performance Testing
- [ ] Page load times acceptable
- [ ] Audio streaming works smoothly  
- [ ] File downloads are fast
- [ ] Mobile responsiveness
- [ ] SEO meta tags working

## 🛠️ Troubleshooting Common Issues

### CORS Errors
- Check Supabase RLS policies
- Verify allowed origins in Supabase auth settings

### File Upload/Download Issues
- Verify Cloudflare R2 permissions
- Check bucket public access settings
- Confirm API tokens have correct permissions

### Payment Issues
- Verify Stripe keys (test vs production)
- Check webhook endpoint URL
- Confirm webhook secret matches

### Authentication Issues
- Check Supabase auth configuration
- Verify JWT settings
- Check redirect URLs

### Database Connection Issues
- Verify Supabase credentials
- Check RLS policies
- Confirm database is not paused

## 📊 Monitoring & Analytics

### Set Up Monitoring
- [ ] Vercel Analytics enabled
- [ ] Supabase monitoring dashboard
- [ ] Stripe Dashboard monitoring
- [ ] Error tracking (Sentry, LogRocket, etc.)

### Key Metrics to Track
- Page load times
- Conversion rates (browse → purchase)
- Error rates
- User engagement
- Revenue metrics

## 🔄 Rollback Plan

If critical issues arise:

1. **Immediate Rollback** (DNS)
   - Update DNS to point back to Base44
   - Keep Base44 running until migration verified

2. **Code Rollback**
   ```bash
   git checkout main  # or previous working commit
   vercel --prod      # redeploy previous version
   ```

3. **Data Sync**
   - Export any new data from Supabase
   - Import back to Base44 if needed

## 📋 Go-Live Checklist

### Final Steps Before Go-Live
- [ ] All tests passing
- [ ] Performance acceptable
- [ ] Error monitoring configured
- [ ] Backup strategy in place
- [ ] Team notified of go-live
- [ ] Support documentation updated

### Post Go-Live (24 hours)
- [ ] Monitor error rates
- [ ] Check conversion metrics
- [ ] Verify payment processing
- [ ] Monitor user feedback
- [ ] Document any issues and fixes

---

## 🎉 Success Criteria

Migration is considered successful when:
- ✅ All core functionality works
- ✅ No critical errors
- ✅ Performance is acceptable
- ✅ Users can complete purchases
- ✅ Data integrity maintained
- ✅ File uploads/downloads work
- ✅ Zero downtime achieved

## 📞 Support Contacts

- **Supabase**: Discord support channel
- **Vercel**: Support tickets in dashboard  
- **Cloudflare**: Community forum
- **Stripe**: Dashboard support chat

Good luck with your migration! 🚀
