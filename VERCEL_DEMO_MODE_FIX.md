# Vercel Demo Mode Fix Documentation

## Issue Summary
Demo mode was not working on Vercel deployment - it was showing Supabase data instead of demo data when accessing pages with the `?demo` parameter.

## Root Cause
The issue was a timing problem where:
1. `supabase-config.js` initializes the Supabase client immediately when loaded
2. `demo-data.js` tries to override the Supabase client methods for demo mode
3. On Vercel, due to network latency and script loading order, the demo override was not being applied before the first Supabase queries were made

## Solution Implemented
Created `demo-data-fixed.js` with the following improvements:

1. **Immediate URL Parameter Check**: The script now checks for the `?demo` URL parameter immediately on load, not just through AuthSystem
2. **Supabase Client Waiting**: Instead of assuming SUPABASE_CLIENT exists, it now waits for it to be initialized
3. **Multiple Initialization Points**: Added several fallback initialization points:
   - On script load
   - On DOMContentLoaded
   - On authComplete event
   - On window load event (with 100ms delay for Vercel)
4. **Better Demo Mode Detection**: Checks multiple sources (URL, AuthSystem, localStorage) to determine if demo mode should be active

## Files Updated
- `dashboard.html` - Updated to use `demo-data-fixed.js`
- `candidate-form.html` - Updated to use `demo-data-fixed.js`
- `evaluation-form.html` - Updated to use `demo-data-fixed.js`
- `aptitude-test-form.html` - Updated to use `demo-data-fixed.js`
- `offer-management.html` - Updated to use `demo-data-fixed.js`
- `data-management.html` - Updated to use `demo-data-fixed.js`
- `organization-settings.html` - Updated to use `demo-data-fixed.js`

## Testing
1. **Local Testing**: Test with `?demo` parameter to ensure demo data is displayed
2. **Vercel Testing**: After deployment, test the following URLs:
   - `/demo` - Should show demo landing page
   - `/dashboard?demo` - Should show demo data after login with "demo2024"
   - Check that demo data (山田太郎, 佐藤花子, etc.) appears, not real Supabase data

## Deployment Steps
1. Commit all changes to git
2. Push to the repository
3. Vercel should automatically deploy the changes
4. Test demo mode on the Vercel deployment

## Additional Test Page
Created `test-demo-vercel.html` for debugging demo mode issues. This page:
- Shows the loading status of all required scripts
- Checks if demo mode is properly initialized
- Tests a sample Supabase query to verify demo data is returned
- Can be accessed at `/test-demo-vercel.html?demo` on your deployment

## Future Improvements
Consider lazy-loading the Supabase client or initializing it only after checking for demo mode to avoid timing issues entirely.
</content>
</invoke>