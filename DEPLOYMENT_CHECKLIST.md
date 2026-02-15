# Production Deployment Checklist

Use this checklist to ensure your Gemini integration is production-ready.

## Pre-Deployment Checklist

### 1. Environment Variables ✓/✗

- [ ] `GEMINI_API_KEY` set (get from https://aistudio.google.com/app/apikey)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` set (from Supabase Dashboard)
- [ ] `NEXT_PUBLIC_SUPABASE_URL` set
- [ ] `GEMINI_MODEL` set (default: `gemini-2.0-flash-exp`)
- [ ] `GENERATION_TIMEOUT_MS` set (default: `40000`)
- [ ] All keys are properly secured (not in public repos)

### 2. Local Testing ✓/✗

- [ ] Build completes without errors (`npm run build`)
- [ ] Dev server runs successfully (`npm run dev`)
- [ ] `/api/generate` endpoint responds
- [ ] Authentication works (session validation)
- [ ] Test with Image generator
- [ ] Test with Video generator
- [ ] Test with Website generator
- [ ] aspectRatio preserved exactly in response
- [ ] Empty fields NOT sent to API
- [ ] humanReadable text displays correctly
- [ ] JSON output is valid and formatted
- [ ] Error handling works (try invalid input)

### 3. Integration Updates ✓/✗

- [ ] Image Generator updated to use `generatePromptWithGemini`
- [ ] Video Generator updated to use `generatePromptWithGemini`
- [ ] Website Generator updated to use `generatePromptWithGemini`
- [ ] Field mapping correct (e.g., `style` → `stylePreset`)
- [ ] Only selected fields passed (conditional spreading used)
- [ ] Loading states work correctly
- [ ] Error toasts display properly
- [ ] Clear button resets form

### 4. Code Quality ✓/✗

- [ ] No TypeScript errors
- [ ] No console errors in browser
- [ ] No lint warnings
- [ ] Comments added where needed
- [ ] Code formatted consistently
- [ ] Unused imports removed
- [ ] Dead code removed (old mock functions)

### 5. Security ✓/✗

- [ ] API keys never exposed to client
- [ ] Session authentication required
- [ ] Input validation with Zod in place
- [ ] No sensitive data logged to console (production)
- [ ] Rate limiting considered (add if needed)
- [ ] CORS configured correctly

## Deployment Steps

### Step 1: Prepare Environment

```bash
# Verify environment variables
cat .env | grep -E "(GEMINI|SUPABASE)" | wc -l
# Should show 5 variables

# Build for production
npm run build

# Check for errors
echo $?  # Should be 0
```

### Step 2: Deploy to Hosting Platform

Choose your platform:

#### Option A: Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel Dashboard:
# Settings → Environment Variables
# Add all 5 required variables
```

#### Option B: Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod

# Add environment variables in Netlify Dashboard:
# Site Settings → Build & Deploy → Environment
# Add all 5 required variables
```

#### Option C: Your Platform
1. Build the project: `npm run build`
2. Upload `dist/` folder
3. Configure environment variables
4. Set Node.js version (18+)

### Step 3: Post-Deployment Verification

- [ ] Site loads without errors
- [ ] API endpoint accessible (`https://yoursite.com/api/generate`)
- [ ] Authentication works
- [ ] Test generation with each type (image/video/website)
- [ ] Check server logs for errors
- [ ] Verify Gemini API calls succeed
- [ ] Confirm correct responses received
- [ ] Test error scenarios (invalid input, network issues)

### Step 4: Monitoring Setup (Recommended)

- [ ] Set up error tracking (Sentry, Rollbar, etc.)
- [ ] Monitor API response times
- [ ] Track Gemini API usage/costs
- [ ] Set up uptime monitoring
- [ ] Configure alerts for errors

## Testing in Production

### Acceptance Tests

Use these to verify everything works:

#### Test 1: Exact Field Preservation
```
Input:
- type: "image"
- aspectRatio: "16:9"
- stylePreset: "Cinematic"
- useCase: "Instagram Story"

Expected Output:
- jsonPrompt.aspectRatio === "16:9"
- jsonPrompt.stylePreset === "Cinematic"
- jsonPrompt.useCase === "Instagram Story"
- No extra fields invented
```

#### Test 2: Omitted Fields
```
Input:
- type: "image"
- userText: "A sunset"
- (no stylePreset)

Expected Output:
- jsonPrompt.stylePreset === undefined
- No default style invented
```

#### Test 3: Error Handling
```
Input:
- Invalid/missing auth token

Expected Output:
- 401 Unauthorized error
- Clear error message displayed
```

#### Test 4: Multi-Type Support
```
Input (separately):
- type: "image"
- type: "video"
- type: "website"

Expected Output:
- All three work correctly
- Appropriate prompts generated
```

## Performance Benchmarks

Track these metrics:

- [ ] Average response time: _____ seconds (target: <5s)
- [ ] 95th percentile: _____ seconds (target: <8s)
- [ ] Error rate: _____ % (target: <1%)
- [ ] Uptime: _____ % (target: >99.9%)

## Rollback Plan

If issues occur in production:

1. **Immediate:**
   ```bash
   # Revert to previous deployment
   git revert <commit-hash>
   git push
   # Redeploy
   ```

2. **Temporary Fix:**
   - Add feature flag to disable Gemini
   - Fall back to old n8n workflow
   - Investigate issues offline

3. **Communication:**
   - [ ] Notify users if needed
   - [ ] Update status page
   - [ ] Document issue for future reference

## Common Issues & Solutions

### Issue: High latency (>10s responses)
**Solution:**
- Check Gemini API quota
- Reduce GENERATION_TIMEOUT_MS
- Consider adding caching

### Issue: JSON parse errors
**Solution:**
- Check Gemini model version
- Verify system instruction format
- Review auto-repair logs

### Issue: Authentication failures
**Solution:**
- Verify SUPABASE_SERVICE_ROLE_KEY
- Check session token expiry
- Review auth middleware

### Issue: High costs
**Solution:**
- Monitor API usage
- Add request caching
- Implement rate limiting
- Consider cheaper model

## Maintenance

### Weekly:
- [ ] Review error logs
- [ ] Check API usage/costs
- [ ] Monitor performance metrics

### Monthly:
- [ ] Update dependencies
- [ ] Review security
- [ ] Optimize as needed

### As Needed:
- [ ] Update Gemini model version
- [ ] Refine system prompts
- [ ] Add new features

## Documentation Updates

After deployment, update:

- [ ] README.md with production URL
- [ ] API documentation with examples
- [ ] User guide with screenshots
- [ ] Changelog with new features

## Sign-Off

### Testing Team
- [ ] All acceptance tests passed
- [ ] Performance benchmarks met
- [ ] Security review completed

### Development Team
- [ ] Code reviewed
- [ ] Documentation complete
- [ ] Environment variables configured

### Product Team
- [ ] Features working as expected
- [ ] User experience validated
- [ ] Ready for announcement

---

## Deployment Date: __________

## Deployed By: __________

## Version: __________

## Notes:
_Add any deployment-specific notes here_

---

**Status**: [ ] Not Started | [ ] In Progress | [ ] Complete | [ ] Rolled Back

**Production URL**: ___________________________

**Last Updated**: ___________________________
