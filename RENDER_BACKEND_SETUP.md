# Render Backend Deployment Steps

## 1. Connect GitHub Repository

1. Go to https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Click "Connect GitHub" and authorize Render
4. Select your repository: `SSGMS`

## 2. Configure Backend Service

Fill in these settings:

- **Name**: `ssgms-backend` (or any name you prefer)
- **Root Directory**: `backend`
- **Environment**: `Node`
- **Region**: Choose closest to you
- **Branch**: `main` (or your default branch)
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Instance Type**: `Free` (for testing) or `Starter` ($7/month for always-on)

## 3. Add Environment Variables

Click "Advanced" and add these environment variables:

### Required Variables:

```
NODE_ENV = production
PORT = 10000
JWT_SECRET = [Your generated secret key - at least 32 characters]
MONGODB_URI = [Your MongoDB Atlas connection string from step 1]
```

### Example Values:

```
NODE_ENV = production
PORT = 10000
JWT_SECRET = myApp2024SuperSecretKeyForTokenSigning123456789
MONGODB_URI = mongodb+srv://ssgms-user:mypassword123@cluster0.abcde.mongodb.net/ssgms?retryWrites=true&w=majority
```

## 4. Deploy

1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes)
3. Once deployed, copy your backend URL (e.g., https://ssgms-backend.onrender.com)

## 5. Test Backend

Your backend API will be available at:
https://your-backend-name.onrender.com/api

Test endpoints:

- GET https://your-backend-name.onrender.com/api/health (if you have one)
- Your backend is ready for frontend connection!
