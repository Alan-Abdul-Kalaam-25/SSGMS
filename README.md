# 📚 Smart Study Group Matcher System

> An intelligent platform that connects students with compatible study partners based on subjects, schedules, learning styles, and academic goals.

![StudyMatcher](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![React](https://img.shields.io/badge/Frontend-React%2018-blue)
![Node.js](https://img.shields.io/badge/Backend-Node.js%2018-green)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-darkgreen)
![Vercel](https://img.shields.io/badge/Hosting-Vercel-black)

## 🎯 Problem Solved

Students often struggle to find the right study partners, leading to:

- ❌ Mismatched learning levels and goals
- ❌ Conflicting schedules and availability
- ❌ Incompatible study styles
- ❌ Wasted time in unproductive groups

**StudyMatcher** solves this with intelligent compatibility matching!

## ✨ Features

### 🔍 **Smart Matching Algorithm**

- **Subject Compatibility** (30%): Matches students studying the same topics
- **Schedule Alignment** (25%): Ensures overlapping availability
- **Experience Level** (20%): Pairs compatible skill levels
- **Study Style** (15%): Matches learning approaches (discussion, quiet, etc.)
- **Study Goals** (10%): Aligns academic objectives

### 🎨 **Modern User Experience**

- Clean, responsive design with Tailwind CSS + Shadcn UI
- Intuitive profile setup and preference management
- Real-time matching with detailed compatibility scores
- Dashboard with study statistics and progress tracking

### 🔐 **Secure & Scalable**

- JWT-based authentication with secure token management
- MongoDB Atlas integration with optimized schemas
- RESTful API with proper error handling
- Vercel serverless deployment ready

## 🏗️ Technical Architecture

### **Frontend**

- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS + Shadcn UI components
- **State Management**: React Context + Custom hooks
- **Form Handling**: React Hook Form + Zod validation
- **Routing**: React Router v6 with protected routes

### **Backend**

- **Runtime**: Node.js + Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens with bcrypt hashing
- **API**: RESTful endpoints with proper middleware
- **Deployment**: Vercel serverless functions

### **Database Schema**

- **Users**: Comprehensive profiles with preferences and availability
- **StudyGroups**: Full group management with roles and scheduling
- **MatchResults**: Persistent matching history with analytics

## 🚀 Quick Start

### **Local Development**

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/studymatcher.git
   cd studymatcher
   ```

2. **Backend Setup**

   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your MongoDB connection string
   npm run dev
   ```

3. **Frontend Setup**

   ```bash
   cd frontend
   npm install
   cp .env.example .env
   # Edit .env with your backend URL
   npm run dev
   ```

4. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

### **Production Deployment**

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete Vercel deployment instructions.

## 📊 API Endpoints

### **Authentication**

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### **Study Groups**

- `GET /api/groups` - List study groups
- `POST /api/groups` - Create new group
- `GET /api/groups/:id` - Get group details
- `POST /api/groups/:id/join` - Join a group
- `POST /api/groups/:id/leave` - Leave a group

### **Matching**

- `POST /api/groups/match` - Find compatible matches
- `GET /api/groups/suggestions` - Get group formation suggestions

## 🎯 Matching Algorithm

The intelligent matching system considers multiple factors:

```javascript
// Compatibility scoring weights
const weights = {
  subject: 0.3, // Subject overlap
  schedule: 0.25, // Time availability
  experience: 0.2, // Skill level compatibility
  studyStyle: 0.15, // Learning approach
  goals: 0.1, // Academic objectives
};
```

**Example Match Score**: 87% compatibility

- ✅ 3 common subjects (Computer Science, Mathematics, Physics)
- ✅ 5 overlapping time slots (Monday evening, Wednesday afternoon, etc.)
- ✅ Similar experience levels (Intermediate)
- ✅ Compatible study styles (Discussion-based)

## 🔧 Environment Variables

### **Backend (.env)**

```env
MONGODB_URI=mongodb://localhost:27017/studymatcher
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:5173
```

### **Frontend (.env)**

```env
VITE_API_URL=http://localhost:3001/api
VITE_APP_NAME=StudyMatcher
VITE_APP_VERSION=1.0.0
```

## 🧪 Testing

```bash
# Backend API testing
cd backend
npm test

# Frontend component testing
cd frontend
npm test

# End-to-end testing
npm run test:e2e
```

## 📈 Future Enhancements

- [ ] **Real-time Chat**: WebSocket integration for group communication
- [ ] **Calendar Integration**: Sync with Google Calendar/Outlook
- [ ] **AI Recommendations**: Machine learning for better matching
- [ ] **Video Calls**: Integrated study session hosting
- [ ] **Progress Tracking**: Study goal monitoring and analytics
- [ ] **Mobile App**: React Native companion app
- [ ] **Gamification**: Study streaks and achievement system

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Developer**: Alan Abdul Kalaam
- **Project Type**: Full-Stack Study Matching Platform
- **Built With**: ❤️ and lots of ☕

## 🌟 Acknowledgments

- [Shadcn UI](https://ui.shadcn.com/) for beautiful React components
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [Vercel](https://vercel.com/) for seamless deployment
- [MongoDB Atlas](https://cloud.mongodb.com/) for managed database hosting

---

**Made with ❤️ for students, by students**

_Transform your study experience with intelligent partner matching!_ 🚀📚
