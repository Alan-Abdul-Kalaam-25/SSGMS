# Smart Study Group Matcher - Deployment Guide

## 🚀 Vercel Deployment Instructions

### Prerequisites

1. GitHub account
2. Vercel account (connected to GitHub)
3. MongoDB Atlas account

### Step 1: Database Setup (MongoDB Atlas)

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a new cluster (free tier is fine)
3. Create a database user with read/write permissions
4. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/studymatcher`)
5. Whitelist all IP addresses (0.0.0.0/0) for Vercel deployment

### Step 2: Deploy Backend to Vercel

1. **Push to GitHub:**

   ```bash
   cd backend
   git init
   git add .
   git commit -m "Initial backend commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/studymatcher-backend.git
   git push -u origin main
   ```

2. **Deploy on Vercel:**

   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your backend repository
   - Configure environment variables:
     - `MONGODB_URI`: Your MongoDB Atlas connection string
     - `JWT_SECRET`: A secure random string (generate one)
     - `NODE_ENV`: `production`
     - `FRONTEND_URL`: Your frontend Vercel URL (will be provided after frontend deployment)

3. **Note your backend URL:** Will be something like `https://studymatcher-backend.vercel.app`

### Step 3: Deploy Frontend to Vercel

1. **Update Environment Variables:**

   ```bash
   cd frontend
   # Update .env file with your backend URL
   echo "VITE_API_URL=https://your-backend-url.vercel.app/api" > .env
   ```

2. **Push to GitHub:**

   ```bash
   git init
   git add .
   git commit -m "Initial frontend commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/studymatcher-frontend.git
   git push -u origin main
   ```

3. **Deploy on Vercel:**
   - Import your frontend repository
   - Configure environment variables:
     - `VITE_API_URL`: Your backend Vercel URL + `/api`

### Step 4: Update CORS Settings

After both deployments, update your backend environment variables:

- `FRONTEND_URL`: Your frontend Vercel URL

### Step 5: Test the Deployment

1. Visit your frontend URL
2. Try creating an account
3. Test login functionality
4. Verify API connections

## 🔧 Environment Variables Summary

### Backend (.env)

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/studymatcher
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d
NODE_ENV=production
FRONTEND_URL=https://your-frontend.vercel.app
```

### Frontend (.env)

```
VITE_API_URL=https://your-backend.vercel.app/api
VITE_APP_NAME=StudyMatcher
VITE_APP_VERSION=1.0.0
```

## 🎯 Alternative: Single Repository Deployment

If you prefer to deploy from a single repository:

1. **Monorepo Structure:**

   ```
   studymatcher/
   ├── frontend/
   ├── backend/
   └── vercel.json (root configuration)
   ```

2. **Deploy as Monorepo:**
   - Push entire project to one GitHub repository
   - Vercel will automatically detect the structure
   - Configure environment variables for both frontend and backend

## 🔍 Troubleshooting

### Common Issues:

1. **CORS Errors**: Make sure `FRONTEND_URL` is set correctly in backend
2. **Database Connection**: Verify MongoDB Atlas connection string and IP whitelist
3. **Environment Variables**: Double-check all required variables are set
4. **API Endpoints**: Ensure frontend is calling the correct backend URL

### Testing Locally with Production Settings:

```bash
# Backend
cd backend
npm start

# Frontend (in another terminal)
cd frontend
npm run build
npm run preview
```

## 📱 Post-Deployment

1. **Custom Domain** (Optional): Add custom domain in Vercel dashboard
2. **Analytics**: Enable Vercel Analytics for performance monitoring
3. **SSL**: Automatically provided by Vercel
4. **CDN**: Global distribution included

Your Smart Study Group Matcher system will be live and accessible worldwide! 🌍
