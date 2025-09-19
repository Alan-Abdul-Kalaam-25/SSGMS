# SSGMS Deployment Guide for Render

## Prerequisites

1. GitHub account with your code pushed to a repository
2. Render account (free tier available)

## Backend Deployment Steps

### 1. Deploy Backend First

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Select the repository containing your project
5. Configure the service:
   - **Name**: `ssgms-backend`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free (or paid for better performance)

### 2. Environment Variables for Backend

Add these environment variables in Render dashboard:

```
NODE_ENV=production
PORT=10000
JWT_SECRET=your-super-secret-jwt-key-here
DB_CONNECTION_STRING=your-database-connection-string
```

### 3. Database Setup (if needed)

- For PostgreSQL: Create a PostgreSQL database on Render
- For MongoDB: Use MongoDB Atlas (free tier available)
- Copy the connection string to your environment variables

## Frontend Deployment Steps

### 1. Deploy Frontend

1. In Render Dashboard, click "New +" → "Static Site"
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: `ssgms-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

### 2. Environment Variables for Frontend

Add these environment variables:

```
NODE_ENV=production
VITE_API_URL=https://your-backend-service-name.onrender.com
```

### 3. Update API URLs in Frontend

Make sure your frontend is configured to use the correct backend URL.

## Important Notes

### For Backend:

- Render's free tier has a cold start delay (services sleep after 15 minutes of inactivity)
- Use environment variables for sensitive data
- Ensure CORS is configured to allow your frontend domain

### For Frontend:

- All routes will work correctly with React Router
- Static assets will be served efficiently
- Vite's build optimization will apply

### Performance Tips:

1. **Upgrade to Paid Plans**: For production use, consider paid plans to avoid cold starts
2. **Database**: Use a dedicated database service for better performance
3. **CDN**: Render automatically provides CDN for static sites

## Troubleshooting

### Common Issues:

1. **Build Failures**: Check build logs in Render dashboard
2. **API Connection**: Verify CORS settings and API URLs
3. **Environment Variables**: Ensure all required variables are set
4. **Cold Starts**: First request after inactivity may be slow (free tier)

### Debugging:

- Check logs in Render dashboard
- Use Render's shell access for backend debugging
- Test API endpoints directly

## Production Checklist

- [ ] Backend deployed and accessible
- [ ] Database connected and migrations run
- [ ] Frontend deployed and loading
- [ ] API calls working between frontend and backend
- [ ] Environment variables configured
- [ ] Custom domain configured (optional)
- [ ] SSL certificates active (automatic on Render)

## Cost Considerations

- **Free Tier**: Limited but good for testing
- **Paid Plans**: Start at $7/month per service for always-on instances
- **Database**: PostgreSQL starts at $7/month

Your application should work exactly as it does locally once properly deployed!
