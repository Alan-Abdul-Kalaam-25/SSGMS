# Environment Variables Quick Reference

## Backend Environment Variables (Render Dashboard)

```
NODE_ENV = production
PORT = 10000
JWT_SECRET = [Generate a 32+ character random string]
MONGODB_URI = [Get from MongoDB Atlas after setup]
FRONTEND_URL = [Get after frontend deployment]
```

## Frontend Environment Variables (Render Dashboard)

```
NODE_ENV = production
VITE_API_URL = [Get after backend deployment]/api
```

## Your Actual Values (Use these in Render Dashboard)

### Backend Environment Variables:

```
NODE_ENV = production
PORT = 10000
JWT_SECRET = [Generate your own 32+ character random string]
MONGODB_URI = mongodb+srv://alanabdulkalaam_db_user:3FDAGf8dXiggoXLN@ssgms.i9urz2v.mongodb.net/ssgms?retryWrites=true&w=majority&appName=SSGMS
FRONTEND_URL = [Will be set after frontend deployment]
```

### Example JWT_SECRET (Generate your own):

```
JWT_SECRET = SSGMS2024SecureTokenKeyForAuthenticationSystem789
```

## Example Values (Replace with your actual values)

### Backend:

```
NODE_ENV = production
PORT = 10000
JWT_SECRET = myApp2024SuperSecretKeyForJWTSigning123456789
MONGODB_URI = mongodb+srv://ssgmsuser:mypassword123@cluster0.abcde.mongodb.net/ssgms?retryWrites=true&w=majority
FRONTEND_URL = https://ssgms-frontend.onrender.com
```

### Frontend:

```
NODE_ENV = production
VITE_API_URL = https://ssgms-backend.onrender.com/api
```

## How to Generate JWT_SECRET

Use any of these methods:

1. Online generator: https://randomkeygen.com/ (use "CodeIgniter Encryption Keys")
2. Node.js: `require('crypto').randomBytes(32).toString('hex')`
3. Manual: Create a random 32+ character string

## Important Notes

- Never commit these values to GitHub
- JWT_SECRET should be unique and secure
- MongoDB URI contains your database password
- URLs are case-sensitive
