import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  BookOpen,
  Trophy,
  Settings,
  Camera,
  Edit,
  Save,
  X,
  Star,
  Users,
  Clock,
  Target,
} from "lucide-react";

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@university.edu",
    phone: "+1 (555) 123-4567",
    university: "Massachusetts Institute of Technology",
    major: "Computer Science",
    year: "Junior",
    bio: "Passionate about algorithms and data structures. Love collaborative learning and helping fellow students succeed.",
    interests: [
      "Machine Learning",
      "Web Development",
      "Data Science",
      "Mathematics",
    ],
    location: "Cambridge, MA",
  });

  const stats = {
    groupsJoined: 8,
    studyHours: 156,
    achievements: 12,
    rating: 4.8,
  };

  const studyGroups = [
    {
      name: "Advanced Algorithms",
      subject: "Computer Science",
      role: "Member",
      joined: "Jan 2024",
    },
    {
      name: "Linear Algebra Study",
      subject: "Mathematics",
      role: "Leader",
      joined: "Sep 2023",
    },
    {
      name: "Machine Learning Basics",
      subject: "AI/ML",
      role: "Co-leader",
      joined: "Mar 2024",
    },
  ];

  const achievements = [
    {
      title: "Study Streak Master",
      description: "Attended 30 consecutive study sessions",
      icon: "🔥",
      date: "March 2024",
    },
    {
      title: "Group Leader",
      description: "Successfully led 5 study groups",
      icon: "👑",
      date: "February 2024",
    },
    {
      title: "Helpful Tutor",
      description: "Helped 50+ students with their studies",
      icon: "🎓",
      date: "January 2024",
    },
    {
      title: "Consistent Learner",
      description: "Completed 100 study hours",
      icon: "📚",
      date: "December 2023",
    },
  ];

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save to backend
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data
  };

  const handleInputChange = (field, value) => {
    setProfileData({ ...profileData, [field]: value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header with Profile Info */}
        <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-0">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row items-start gap-8">
              {/* Profile Picture */}
              <div className="relative">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                  {profileData.firstName[0]}
                  {profileData.lastName[0]}
                </div>
                <Button
                  size="sm"
                  className="absolute -bottom-2 -right-2 rounded-full w-10 h-10 p-0 bg-blue-600 hover:bg-blue-700"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>

              {/* Profile Details */}
              <div className="flex-1 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      {profileData.firstName} {profileData.lastName}
                    </h1>
                    <p className="text-lg text-blue-600">
                      {profileData.major} • {profileData.year}
                    </p>
                    <p className="text-gray-600">{profileData.university}</p>
                  </div>
                  <div className="flex gap-2">
                    {!isEditing ? (
                      <Button onClick={handleEdit} variant="outline">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button onClick={handleSave} size="sm">
                          <Save className="h-4 w-4 mr-2" />
                          Save
                        </Button>
                        <Button
                          onClick={handleCancel}
                          variant="outline"
                          size="sm"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    )}
                    <Button variant="outline">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Button>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    {isEditing ? (
                      <Input
                        value={profileData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        className="h-8"
                      />
                    ) : (
                      profileData.email
                    )}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    {isEditing ? (
                      <Input
                        value={profileData.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        className="h-8"
                      />
                    ) : (
                      profileData.phone
                    )}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {isEditing ? (
                      <Input
                        value={profileData.location}
                        onChange={(e) =>
                          handleInputChange("location", e.target.value)
                        }
                        className="h-8"
                      />
                    ) : (
                      profileData.location
                    )}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    Member since Dec 2023
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">About</h3>
                  {isEditing ? (
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      className="w-full p-3 border rounded-lg resize-none"
                      rows="3"
                    />
                  ) : (
                    <p className="text-gray-600">{profileData.bio}</p>
                  )}
                </div>

                {/* Interests */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Interests
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {profileData.interests.map((interest, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-blue-100 text-blue-700"
                      >
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 mx-auto mb-2 text-blue-200" />
              <p className="text-2xl font-bold">{stats.groupsJoined}</p>
              <p className="text-blue-100 text-sm">Groups Joined</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <Clock className="h-8 w-8 mx-auto mb-2 text-green-200" />
              <p className="text-2xl font-bold">{stats.studyHours}</p>
              <p className="text-green-100 text-sm">Study Hours</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <Trophy className="h-8 w-8 mx-auto mb-2 text-purple-200" />
              <p className="text-2xl font-bold">{stats.achievements}</p>
              <p className="text-purple-100 text-sm">Achievements</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <Star className="h-8 w-8 mx-auto mb-2 text-orange-200" />
              <p className="text-2xl font-bold">{stats.rating}</p>
              <p className="text-orange-100 text-sm">Average Rating</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Study Groups */}
          <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-0">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                My Study Groups
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {studyGroups.map((group, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {group.name}
                      </h3>
                      <p className="text-sm text-gray-600">{group.subject}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Joined {group.joined}
                      </p>
                    </div>
                    <Badge
                      variant={
                        group.role === "Leader" ? "default" : "secondary"
                      }
                      className={group.role === "Leader" ? "bg-blue-600" : ""}
                    >
                      {group.role}
                    </Badge>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                View All Groups
              </Button>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-0">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="h-5 w-5 mr-2" />
                Recent Achievements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <span className="text-2xl">{achievement.icon}</span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {achievement.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {achievement.description}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {achievement.date}
                    </p>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                View All Achievements
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Study Goals */}
        <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-0">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Study Goals & Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">
                    Weekly Study Hours
                  </span>
                  <span className="text-sm text-gray-600">12/15 hours</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: "80%" }}
                  ></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">
                    Group Sessions
                  </span>
                  <span className="text-sm text-gray-600">3/4 sessions</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: "75%" }}
                  ></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">
                    Monthly Goals
                  </span>
                  <span className="text-sm text-gray-600">8/10 completed</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full"
                    style={{ width: "80%" }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
