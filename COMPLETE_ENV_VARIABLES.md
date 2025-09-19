# 🔑 Complete Environment Variables - Ready to Copy & Paste

## 🖥️ **BACKEND Environment Variables** (Copy these to Render Backend Service)

### Step 1: Deploy Backend First - Use These Exact Values:

```
NODE_ENV=production
PORT=10000
JWT_SECRET=SSGMS2024SecureTokenKeyForAuthenticationSystem789ABC
MONGODB_URI=mongodb+srv://alanabdulkalaam_db_user:3FDAGf8dXiggoXLN@ssgms.i9urz2v.mongodb.net/ssgms?retryWrites=true&w=majority&appName=SSGMS
```

**Note:** `FRONTEND_URL` will be added after frontend deployment

---

## 🌐 **FRONTEND Environment Variables** (Copy these to Render Static Site)

### Step 2: Deploy Frontend - Use These Values:

```
NODE_ENV=production
VITE_API_URL=https://YOUR-BACKEND-NAME.onrender.com/api
```

**Replace `YOUR-BACKEND-NAME` with your actual backend service name from Step 1**

Example if your backend service is named `ssgms-backend`:

```
NODE_ENV=production
VITE_API_URL=https://ssgms-backend.onrender.com/api
```

---

## 🔄 **BACKEND Update** (After Frontend Deployment)

### Step 3: Add CORS URL to Backend - Add This Variable:

```
FRONTEND_URL=https://YOUR-FRONTEND-NAME.onrender.com
```

**Replace `YOUR-FRONTEND-NAME` with your actual frontend service name from Step 2**

Example if your frontend service is named `ssgms-frontend`:

```
FRONTEND_URL=https://ssgms-frontend.onrender.com
```

---

## 📋 **Complete Backend Variables** (Final State)

After all deployments, your backend should have these 5 variables:

```
NODE_ENV=production
PORT=10000
JWT_SECRET=SSGMS2024SecureTokenKeyForAuthenticationSystem789ABC
MONGODB_URI=mongodb+srv://alanabdulkalaam_db_user:3FDAGf8dXiggoXLN@ssgms.i9urz2v.mongodb.net/ssgms?retryWrites=true&w=majority&appName=SSGMS
FRONTEND_URL=https://YOUR-FRONTEND-NAME.onrender.com
```

---

## 📋 **Complete Frontend Variables** (Final State)

Your frontend should have these 2 variables:

```
NODE_ENV=production
VITE_API_URL=https://YOUR-BACKEND-NAME.onrender.com/api
```

---

## 🎯 **How to Add These in Render:**

### For Backend (Web Service):

1. In Render dashboard → Your backend service
2. Go to "Environment" tab
3. Click "Add Environment Variable"
4. Add each variable one by one:
   - Key: `NODE_ENV`, Value: `production`
   - Key: `PORT`, Value: `10000`
   - Key: `JWT_SECRET`, Value: `SSGMS2024SecureTokenKeyForAuthenticationSystem789ABC`
   - Key: `MONGODB_URI`, Value: `mongodb+srv://alanabdulkalaam_db_user:3FDAGf8dXiggoXLN@ssgms.i9urz2v.mongodb.net/ssgms?retryWrites=true&w=majority&appName=SSGMS`

### For Frontend (Static Site):

1. In Render dashboard → Your frontend service
2. Go to "Environment" tab
3. Add each variable:
   - Key: `NODE_ENV`, Value: `production`
   - Key: `VITE_API_URL`, Value: `https://your-backend-name.onrender.com/api`

## ⚠️ **Important Notes:**

- Use the exact JWT_SECRET provided or generate your own 32+ character string
- MongoDB URI is ready to use as-is
- Replace placeholder URLs with your actual Render service URLs
- Add `FRONTEND_URL` to backend after frontend deployment for CORS to work
