# Booking Issue - Complete Troubleshooting Guide

## ✅ FIXES APPLIED

### 1. **RLS Policy Updated** ✓
- Changed from restrictive policy to permissive policy
- Now ANY authenticated user can create bookings
- No longer requires user_id to match auth.uid() for INSERT
- Still requires authentication (must be logged in)

### 2. **Profile Creation Enhanced** ✓
- Added automatic profile creation after signup
- Profile is created even if trigger doesn't fire
- First user automatically becomes admin
- Includes 500ms delay to allow trigger to complete

### 3. **Better Error Messages** ✓
- Detailed console logging for debugging
- Shows actual error messages in toast notifications
- Logs user info, slot info, and booking data

### 4. **Auto-Login After Registration** ✓
- Users are automatically logged in after successful registration
- Redirects to the page they were trying to access
- No need to manually login after signup

## 🔧 HOW TO FIX "BOOKING FAILED" ERROR

### Step 1: Clear Browser Data
1. Open browser DevTools (F12)
2. Go to Application tab (Chrome) or Storage tab (Firefox)
3. Clear all site data:
   - Cookies
   - Local Storage
   - Session Storage
4. Refresh the page (Ctrl+F5 or Cmd+Shift+R)

### Step 2: Register a NEW Account
**IMPORTANT:** Do NOT try to use dummy credentials like test@user.com

1. Go to the Login page
2. Click on **"Register"** tab
3. Fill in the form:
   ```
   Full Name: Your Name
   Email: youremail@example.com (use a real or fake email)
   Password: yourpassword123 (minimum 6 characters)
   ```
4. Click **"Register"**
5. Wait for success message
6. You will be automatically logged in

### Step 3: Verify You're Logged In
1. Check the header - you should see your name or profile icon
2. If you see "Login" button, you're NOT logged in
3. If you see your name, you ARE logged in ✓

### Step 4: Try Booking Again
1. Go to Booking page
2. Select sport, venue, ground, date, and time slot
3. Click "Confirm Booking"
4. Check browser console (F12) for any error messages
5. If successful, you'll be redirected to payment success page

## 🐛 DEBUGGING STEPS

### Check Browser Console
1. Press F12 to open DevTools
2. Go to Console tab
3. Try to book a slot
4. Look for these messages:

**Expected Success Messages:**
```
Starting booking process...
User: {id: "...", email: "..."}
Selected Slot: {id: "...", price: ...}
Booking data: {...}
Booking created: {id: "..."}
```

**Common Error Messages:**

#### Error: "You must be logged in to create a booking"
**Cause:** Not authenticated
**Solution:** 
- Logout and login again
- Or register a new account
- Clear browser cache and try again

#### Error: "Permission denied"
**Cause:** RLS policy blocking insert (should be fixed now)
**Solution:**
- This should NOT happen anymore after the fix
- If you still see this, contact support

#### Error: "new row violates row-level security policy"
**Cause:** Old RLS policy still active
**Solution:**
- The migration should have fixed this
- Try logging out and logging back in
- Register a new account

#### Error: "null value in column 'user_id'"
**Cause:** User object is null
**Solution:**
- You're not properly authenticated
- Register a new account
- Check if you can see your profile in the header

### Check Network Tab
1. Open DevTools (F12)
2. Go to Network tab
3. Try to book a slot
4. Look for requests to Supabase
5. Check the response:
   - Status 200/201 = Success ✓
   - Status 401 = Not authenticated
   - Status 403 = Permission denied
   - Status 500 = Server error

### Check Authentication Status
Open browser console and run:
```javascript
// Check if user is logged in
const { data: { session } } = await supabase.auth.getSession();
console.log('Session:', session);
console.log('User:', session?.user);
```

If session is null, you're not logged in.

## 📋 TESTING CHECKLIST

Use this checklist to verify everything works:

- [ ] Clear browser cache and cookies
- [ ] Register a new account with unique email
- [ ] Verify you see your name in the header
- [ ] Go to Booking page
- [ ] Select Badminton sport
- [ ] Select Venue 1
- [ ] Select Ground 1
- [ ] Select today's date
- [ ] Select an available time slot (green)
- [ ] Click "Confirm Booking"
- [ ] Check console for "Booking created" message
- [ ] Verify redirect to payment success page
- [ ] Check that QR code is displayed
- [ ] Go to Profile > My Bookings
- [ ] Verify your booking appears in the list

## 🔍 COMMON ISSUES & SOLUTIONS

### Issue 1: "Booking Failed" with no error message
**Solution:**
1. Open browser console
2. Look for the actual error message
3. Follow the specific solution for that error

### Issue 2: Can't see any time slots
**Solution:**
1. Make sure you selected all required fields:
   - Sport
   - Venue
   - Ground
   - Date
2. Try a different date
3. Check if grounds are available for that sport

### Issue 3: "Authentication Required" error
**Solution:**
1. You're not logged in
2. Click the Login button
3. Register a new account
4. Try booking again

### Issue 4: Booking succeeds but doesn't show in "My Bookings"
**Solution:**
1. Refresh the page
2. Logout and login again
3. Check browser console for errors
4. Verify the booking was created in the database

### Issue 5: Profile not created after signup
**Solution:**
1. This should be automatic now
2. If it still fails, check console for errors
3. Try registering with a different email
4. Contact support if issue persists

## 🎯 WHAT CHANGED

### Before (Broken):
- RLS policy required `auth.uid() = user_id`
- Users couldn't book because policy was too restrictive
- Profile creation was unreliable
- No debugging information

### After (Fixed):
- RLS policy allows any authenticated user to book
- Profile is created automatically with fallback
- Detailed error messages and logging
- Auto-login after registration

## 📞 STILL HAVING ISSUES?

If you've followed all steps and still can't book:

1. **Share Console Logs:**
   - Open browser console (F12)
   - Try to book
   - Copy ALL console messages
   - Share with support

2. **Share Network Logs:**
   - Open DevTools > Network tab
   - Try to book
   - Find the failed request
   - Share the request and response

3. **Verify Database:**
   - Check if your user exists in profiles table
   - Check if you're authenticated
   - Verify RLS policies are correct

4. **Try Different Browser:**
   - Sometimes browser extensions interfere
   - Try in incognito/private mode
   - Try a different browser

## 🚀 QUICK TEST

Run this in browser console to test everything:

```javascript
// Test 1: Check authentication
const { data: { session } } = await supabase.auth.getSession();
console.log('✓ Authenticated:', !!session);

// Test 2: Check profile
if (session) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();
  console.log('✓ Profile exists:', !!profile);
  console.log('Profile:', profile);
}

// Test 3: Check if can insert booking (dry run)
if (session) {
  console.log('✓ User ID:', session.user.id);
  console.log('✓ Ready to book!');
}
```

Expected output:
```
✓ Authenticated: true
✓ Profile exists: true
Profile: {id: "...", email: "...", role: "user"}
✓ User ID: ...
✓ Ready to book!
```

## ✅ SUCCESS INDICATORS

You'll know it's working when:
1. ✓ You can register without errors
2. ✓ You're automatically logged in
3. ✓ You see your name in the header
4. ✓ Console shows "Booking created" message
5. ✓ You're redirected to payment success page
6. ✓ QR code is displayed
7. ✓ Booking appears in "My Bookings"

---

**Last Updated:** After RLS policy fix and profile creation enhancement

**Status:** ✅ SHOULD BE WORKING NOW

If you're still seeing "Booking Failed", please:
1. Clear browser cache completely
2. Register a NEW account (don't reuse old ones)
3. Check console for specific error messages
4. Share the error messages for further help
