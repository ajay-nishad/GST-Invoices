# Production Deployment Guide

This guide covers the complete production deployment process for GST Invoices application.

## 🚀 Pre-Deployment Checklist

### 1. Code Preparation

- [ ] All environment variables configured
- [ ] Database migrations tested
- [ ] Build process successful locally
- [ ] Tests passing
- [ ] Security headers configured
- [ ] Error handling implemented

### 2. Dependencies Check

- [ ] Node.js version compatibility (Node 18+)
- [ ] Package vulnerabilities resolved (`npm audit`)
- [ ] Production dependencies optimized

## 📦 Vercel Deployment

### 1. Vercel Project Setup

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Initialize project
vercel

# Deploy to production
vercel --prod
```

### 2. Environment Variables Configuration

Set these environment variables in Vercel Dashboard:

#### Required Variables

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Production Settings
NODE_ENV=production
```

#### Optional Variables (for full functionality)

```bash
# Razorpay (for payments)
RAZORPAY_KEY_ID=rzp_live_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Resend (for emails)
RESEND_API_KEY=re_your_resend_api_key
```

### 3. Vercel Configuration

The `vercel.json` file includes:

- **Build optimization**: Custom build commands and output directory
- **Function timeouts**: Extended timeouts for export and payment APIs
- **Headers**: CORS configuration for Razorpay webhooks
- **Regional deployment**: Optimized for Indian users (bom1)

## 🗄️ Supabase Production Setup

### 1. Create Production Project

```bash
# Create new Supabase project
# Go to https://supabase.com/dashboard
# Click "New Project"
# Choose organization and configure:
# - Project name: gst-invoices-prod
# - Database password: Generate strong password
# - Region: Asia South (Mumbai) for Indian users
```

### 2. Link Local Project to Production

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to production project
supabase link --project-ref your-production-project-ref

# Check connection
supabase status
```

### 3. Run Database Migrations

```bash
# Push all migrations to production
supabase db push

# Verify migrations
supabase migration list

# Check database schema
supabase db diff --schema public
```

### 4. Apply RLS Policies

```bash
# Apply all policies
supabase db reset --linked

# Or apply specific policy files
psql -h your-db-host -U postgres -d postgres -f supabase/policies/000_apply_all_policies.sql
```

### 5. Configure Authentication

In Supabase Dashboard:

1. Go to Authentication > Settings
2. Configure Site URL: `https://your-domain.vercel.app`
3. Add Redirect URLs:
   - `https://your-domain.vercel.app/auth/callback`
   - `https://your-domain.vercel.app/auth/signin`
4. Enable email confirmations if needed
5. Configure OAuth providers if used

### 6. Set up Row Level Security

```sql
-- Verify RLS is enabled on all tables
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public' AND rowsecurity = false;

-- Should return no rows if RLS is properly configured
```

## 💳 Razorpay Production Setup

### 1. Production Account Setup

1. Complete KYC verification
2. Get production API keys
3. Configure webhook URLs
4. Set up bank account for settlements

### 2. Webhook Configuration

In Razorpay Dashboard:

1. Go to Settings > Webhooks
2. Add webhook URL: `https://your-domain.vercel.app/api/razorpay/webhook`
3. Select events:
   - `payment.captured`
   - `subscription.charged`
4. Set webhook secret (use in environment variables)

### 3. Test Webhook

```bash
# Test webhook endpoint
curl -X POST https://your-domain.vercel.app/api/razorpay/webhook \
  -H "Content-Type: application/json" \
  -H "X-Razorpay-Signature: test_signature" \
  -d '{"event":"payment.captured","payload":{"payment":{"entity":{"id":"test"}}}}'
```

## 📧 Email Configuration (Resend)

### 1. Production Setup

1. Verify domain in Resend dashboard
2. Configure SPF and DKIM records
3. Get production API key

### 2. DNS Configuration

Add these DNS records for email deliverability:

```
TXT @ "v=spf1 include:resend.com ~all"
CNAME resend._domainkey resend._domainkey.resend.com
```

## 🔧 Post-Deployment Configuration

### 1. Domain Setup

```bash
# Add custom domain in Vercel
vercel domains add your-domain.com

# Configure DNS
# Add CNAME record: www -> your-project.vercel.app
# Add A record: @ -> 76.76.19.61 (Vercel IP)
```

### 2. SSL Certificate

- Vercel automatically provisions SSL certificates
- Verify HTTPS is working: `https://your-domain.com`
- Check SSL rating: https://www.ssllabs.com/ssltest/

### 3. Performance Optimization

```bash
# Enable Vercel Analytics
vercel analytics enable

# Configure caching headers (already in next.config.ts)
# Monitor Core Web Vitals
```

## ✅ Post-Deployment Checklist

### Functionality Tests

- [ ] User registration/login works
- [ ] Database connections established
- [ ] Invoice creation and PDF generation
- [ ] Email sending functionality
- [ ] Payment processing (if configured)
- [ ] File uploads and exports
- [ ] Mobile responsiveness

### Performance Tests

- [ ] Page load times < 3 seconds
- [ ] API response times < 1 second
- [ ] Database query performance
- [ ] CDN and static asset caching

### Security Tests

- [ ] HTTPS enforced
- [ ] Security headers present
- [ ] CORS configured correctly
- [ ] Environment variables secured
- [ ] Database access restricted
- [ ] Authentication working properly

### Monitoring Setup

- [ ] Error tracking configured
- [ ] Performance monitoring active
- [ ] Database monitoring enabled
- [ ] Uptime monitoring setup

## 🚨 Troubleshooting

### Common Issues

#### Build Failures

```bash
# Clear cache and rebuild
vercel build --debug

# Check build logs
vercel logs your-deployment-url
```

#### Database Connection Issues

```bash
# Test connection
supabase status

# Check environment variables
vercel env ls
```

#### Email Delivery Issues

```bash
# Check DNS configuration
dig TXT your-domain.com
dig CNAME resend._domainkey.your-domain.com

# Test email endpoint
curl -X POST https://your-domain.vercel.app/api/test-email
```

#### Payment Webhook Issues

```bash
# Check webhook logs in Razorpay dashboard
# Verify webhook signature validation
# Test webhook endpoint manually
```

## 📊 Monitoring and Maintenance

### Regular Tasks

1. **Weekly**: Check error logs and performance metrics
2. **Monthly**: Update dependencies and security patches
3. **Quarterly**: Review and optimize database performance
4. **Yearly**: Renew SSL certificates (automatic with Vercel)

### Monitoring Tools

- **Vercel Analytics**: Built-in performance monitoring
- **Supabase Dashboard**: Database and API monitoring
- **Razorpay Dashboard**: Payment monitoring
- **Resend Dashboard**: Email delivery monitoring

### Backup Strategy

- **Database**: Supabase automatic backups (7-day retention)
- **Code**: Git repository with regular commits
- **Environment**: Document all environment variables
- **Configurations**: Keep deployment configs in version control

## 🔄 Rollback Procedure

If issues occur after deployment:

```bash
# Rollback to previous deployment
vercel rollback

# Or deploy specific commit
vercel --prod --force

# Rollback database migrations if needed
supabase migration repair --status reverted
```

## 📈 Scaling Considerations

### Database Scaling

- Monitor connection pool usage
- Consider read replicas for heavy read workloads
- Optimize queries with indexes
- Archive old data regularly

### Application Scaling

- Vercel automatically scales serverless functions
- Monitor function execution times
- Consider caching strategies for heavy computations
- Optimize bundle size and loading performance

---

## 🆘 Support

If you encounter issues during deployment:

1. **Check logs**: `vercel logs` for application logs
2. **Supabase logs**: Available in Supabase dashboard
3. **Community support**: Next.js, Supabase, and Vercel communities
4. **Documentation**: Refer to official documentation

Remember to test thoroughly in a staging environment before deploying to production!
