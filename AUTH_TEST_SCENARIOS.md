# Authentication Test Scenarios

## Issue #24 - Credentials Auth Bug Fix

**Problem**: Login form was sending both `username` and `email` fields when email was entered, causing backend authentication failures.

**Fix**: Modified LoginForm.tsx to send ONLY the appropriate field:
- Email login: sends `{ email, password }`
- Username login: sends `{ username, password }`

---

## Test Scenarios

### 1. Login with Email
**Steps**:
1. Navigate to /login
2. Enter valid email (e.g., user@example.com)
3. Enter valid password
4. Click "Sign In"

**Expected**:
- ✅ Request payload contains: `{ email: "user@example.com", password: "..." }`
- ✅ Request payload does NOT contain `username` field
- ✅ User is authenticated successfully
- ✅ Token is stored in localStorage
- ✅ Cookie is set with token
- ✅ Redux state updated with user data
- ✅ Redirected to intended page (or home)
- ✅ Toast shows "Logged in successfully!"

---

### 2. Login with Username
**Steps**:
1. Navigate to /login
2. Enter valid username (e.g., johndoe)
3. Enter valid password
4. Click "Sign In"

**Expected**:
- ✅ Request payload contains: `{ username: "johndoe", password: "..." }`
- ✅ Request payload does NOT contain `email` field
- ✅ User is authenticated successfully
- ✅ Token is stored in localStorage
- ✅ Cookie is set with token
- ✅ Redux state updated with user data
- ✅ Redirected to intended page (or home)
- ✅ Toast shows "Logged in successfully!"

---

### 3. Login with Invalid Credentials
**Steps**:
1. Navigate to /login
2. Enter email or username
3. Enter incorrect password
4. Click "Sign In"

**Expected**:
- ✅ Error message displayed in red alert box
- ✅ Toast shows error message
- ✅ User remains on login page
- ✅ No token stored
- ✅ Loading state resets

---

### 4. Google Sign-In
**Steps**:
1. Navigate to /login
2. Click "Continue with Google"
3. Complete Google OAuth flow

**Expected**:
- ✅ Google popup opens
- ✅ User selects Google account
- ✅ ID token retrieved
- ✅ Backend receives `{ idToken }` via POST to `api/v1/auth/google-login`
- ✅ Token stored in localStorage
- ✅ Cookie set
- ✅ Redux state updated
- ✅ User redirected
- ✅ Toast shows "Signed in with Google!"

---

### 5. Session Persistence
**Steps**:
1. Log in successfully
2. Navigate to different pages
3. Refresh the page
4. Close and reopen browser

**Expected**:
- ✅ Token persists in localStorage
- ✅ Cookie persists (7-day expiry)
- ✅ User remains logged in after refresh
- ✅ Protected routes remain accessible
- ✅ User data remains in Redux state

---

### 6. Logout
**Steps**:
1. Log in successfully
2. Click logout button/link
3. Verify logout

**Expected**:
- ✅ Token removed from localStorage
- ✅ User data removed from localStorage
- ✅ Cookie cleared (max-age=0)
- ✅ Redux state reset (user=null, isLoggedIn=false)
- ✅ Redirected to /login
- ✅ Protected routes now redirect to login

---

### 7. Expired Session Handling
**Steps**:
1. Log in successfully
2. Manually expire the token (or wait for expiry)
3. Make an API request

**Expected**:
- ✅ Backend returns 401 Unauthorized
- ✅ Interceptor catches 401 error
- ✅ Toast shows "Session expired. Please login again."
- ✅ Token cleared
- ✅ Redirected to login after 2-second delay
- ✅ `from` parameter preserves intended destination

---

### 8. Protected Route Access (Not Logged In)
**Steps**:
1. Ensure not logged in
2. Navigate directly to protected route (e.g., /dashboard)

**Expected**:
- ✅ Redirected to /login
- ✅ `from` parameter includes intended route
- ✅ After login, redirected back to intended route

---

## API Endpoint Expectations

### POST /api/auth/login
**Request Body (Email)**:
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Request Body (Username)**:
```json
{
  "username": "johndoe",
  "password": "securepassword"
}
```

**Response (Success)**:
```json
{
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "username": "johndoe",
    "email": "user@example.com",
    ...
  }
}
```

---

### POST /api/v1/auth/google-login
**Request Body**:
```json
{
  "idToken": "google-id-token-here"
}
```

**Response (Success)**:
```json
{
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "username": "johndoe",
    "email": "user@example.com",
    ...
  }
}
```

---

## Manual Testing Checklist

Before submitting PR:

- [ ] Test email login with valid credentials
- [ ] Test username login with valid credentials
- [ ] Test email login with invalid credentials
- [ ] Test username login with invalid credentials
- [ ] Test Google sign-in flow
- [ ] Test session persistence (page refresh)
- [ ] Test logout functionality
- [ ] Test session expiry handling
- [ ] Verify network tab shows correct payload format
- [ ] Verify no console errors
- [ ] Test on different browsers (Chrome, Firefox, Safari)
- [ ] Test responsive behavior on mobile

---

## Code Changes

**File**: `components/LoginForm.tsx`

**Before**:
```typescript
const loginData = isEmail
  ? { username: values.username, email: values.username, password: values.password }
  : { username: values.username, password: values.password };
```

**After**:
```typescript
const loginData = isEmail
  ? { email: values.username, password: values.password }
  : { username: values.username, password: values.password };
```

**Impact**: Backend now receives the correct field format, enabling proper authentication for both email and username login methods.
