# Quick Booking Test Guide

## 🎯 IMMEDIATE FIX - DO THIS NOW

### Step 1: Clear Everything
1. Press `Ctrl+Shift+Delete` (Windows) or `Cmd+Shift+Delete` (Mac)
2. Select "All time"
3. Check all boxes (Cookies, Cache, etc.)
4. Click "Clear data"
5. Close and reopen the browser

### Step 2: Register Fresh Account
1. Go to the website
2. Click **"Login"** in header
3. Click **"Register"** tab (NOT Login tab)
4. Enter:
   - **Full Name:** Test User
   - **Email:** testuser123@example.com
   - **Password:** password123
5. Click **"Register"**
6. Wait 2-3 seconds
7. You should be automatically logged in

### Step 3: Verify Login
Look at the top right corner:
- ✅ If you see a profile icon or your name → You're logged in
- ❌ If you see "Login" button → You're NOT logged in (go back to Step 2)

### Step 4: Book a Slot
1. Click **"Booking"** in the menu
2. Select:
   - Sport: **Badminton**
   - Venue: **Venue 1**
   - Ground: **Ground 1**
   - Date: **Today**
   - Time: **Any GREEN slot**
3. Click **"Confirm Booking"**

### Step 5: Check Result

**✅ SUCCESS - You should see:**
- Toast notification: "Booking Successful"
- Redirect to payment success page
- QR code displayed
- Booking details shown

**❌ FAILURE - If you see "Booking Failed":**
1. Press F12 to open console
2. Look for red error messages
3. Take a screenshot
4. Share the error message

## 🔍 Quick Debug

If booking fails, open browser console (F12) and paste this:

```javascript
// Check if you're logged in
supabase.auth.getSession().then(({data}) => {
  if (data.session) {
    console.log('✅ LOGGED IN');
    console.log('User ID:', data.session.user.id);
    console.log('Email:', data.session.user.email);
  } else {
    console.log('❌ NOT LOGGED IN - Please register/login first');
  }
});
```

## 📝 Expected Console Output (Success)

When you click "Confirm Booking", you should see:

```
Starting booking process...
User: {id: "abc-123-...", email: "testuser123@example.com", ...}
Selected Slot: {id: "slot-123", price: 500, ...}
Booking data: {user_id: "abc-123", slot_id: "slot-123", ...}
Booking created: {id: "booking-123", ...}
```

## ❌ Common Error Messages

### "You must be logged in to create a booking"
**Fix:** Register a new account (Step 2 above)

### "Permission denied"
**Fix:** This should NOT happen anymore. If you see this:
1. Clear browser cache completely
2. Register with a DIFFERENT email
3. Try again

### "Failed to create booking"
**Fix:** 
1. Check console for specific error
2. Make sure you selected a valid slot
3. Try a different time slot

## 🎬 Video Walkthrough (Text Version)

1. **Start:** Open website → See landing page
2. **Login:** Click "Login" → Click "Register" tab
3. **Register:** Fill form → Click "Register" → Wait 2 seconds
4. **Verify:** See your name in header (top right)
5. **Book:** Click "Booking" → Select options → Click "Confirm"
6. **Success:** See QR code page

**Total time:** ~30 seconds

## 🆘 Emergency Troubleshooting

### Nothing works?
1. Try a different browser (Chrome, Firefox, Edge)
2. Try incognito/private mode
3. Disable browser extensions
4. Check internet connection

### Still failing?
Run this diagnostic in console (F12):

```javascript
// Full diagnostic
console.log('=== DIAGNOSTIC START ===');

// Check Supabase connection
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);

// Check auth
supabase.auth.getSession().then(({data, error}) => {
  console.log('Auth Session:', data.session ? 'EXISTS' : 'NULL');
  console.log('Auth Error:', error);
  
  if (data.session) {
    // Check profile
    supabase.from('profiles')
      .select('*')
      .eq('id', data.session.user.id)
      .single()
      .then(({data: profile, error: profileError}) => {
        console.log('Profile:', profile ? 'EXISTS' : 'NULL');
        console.log('Profile Error:', profileError);
        console.log('Profile Data:', profile);
      });
  }
});

console.log('=== DIAGNOSTIC END ===');
```

## ✅ Success Checklist

Before reporting an issue, verify:
- [ ] Cleared browser cache completely
- [ ] Registered with a NEW email (not test@user.com)
- [ ] Can see profile icon/name in header
- [ ] Selected all booking fields (sport, venue, ground, date, time)
- [ ] Clicked on a GREEN time slot (not red or yellow)
- [ ] Checked browser console for errors
- [ ] Tried in incognito mode
- [ ] Tried a different browser

## 📞 Report Issue

If still not working, provide:
1. **Browser:** Chrome/Firefox/Safari/Edge + version
2. **Error Message:** From console (F12)
3. **Steps Taken:** What you did
4. **Screenshot:** Of the error
5. **Console Output:** Copy all red messages

---

**TL;DR:**
1. Clear cache
2. Register new account (testuser123@example.com / password123)
3. Book a slot
4. Should work ✓

If not, check console (F12) for errors.
