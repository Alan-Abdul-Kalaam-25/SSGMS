# Render Frontend Deployment Steps

## 1. Create Static Site

1. In Render dashboard, click "New +" → "Static Site"
2. Select your GitHub repository: `SSGMS`

## 2. Configure Frontend Service

Fill in these settings:

- **Name**: `ssgms-frontend` (or any name you prefer)
- **Root Directory**: `frontend`
- **Branch**: `main` (or your default branch)
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`

## 3. Add Environment Variables

Click "Advanced" and add these environment variables:

```
NODE_ENV = production
VITE_API_URL = [Your backend URL from previous step]/api
```

### Example:

```
NODE_ENV = production
VITE_API_URL = https://ssgms-backend.onrender.com/api
```

## 4. Deploy

1. Click "Create Static Site"
2. Wait for deployment (3-5 minutes)
3. Once deployed, copy your frontend URL (e.g., https://ssgms-frontend.onrender.com)

## 5. Update Backend CORS (Important!)

1. Go back to your backend service on Render
2. Add this environment variable:

```
FRONTEND_URL = [Your frontend URL from step 4]
```

Example:

```
FRONTEND_URL = https://ssgms-frontend.onrender.com
```

3. Click "Save Changes" (this will redeploy your backend)

## 6. Test Your Application

1. Visit your frontend URL
2. All your navbar styling and functionality should work
3. Try logging in/signing up to test backend connection
