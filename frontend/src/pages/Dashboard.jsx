import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  BookOpen,
  Calendar,
  Trophy,
  TrendingUp,
  Clock,
  MessageCircle,
  Star,
  Plus,
  ChevronRight,
} from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalGroups: 5,
    activeGroups: 3,
    completedSessions: 24,
    totalHours: 48,
  });

  const studyGroups = [
    {
      id: 1,
      name: "Advanced Calculus Study Group",
      subject: "Mathematics",
      members: 6,
      nextSession: "Today, 3:00 PM",
      progress: 75,
      status: "active",
    },
    {
      id: 2,
      name: "Organic Chemistry Prep",
      subject: "Chemistry",
      members: 4,
      nextSession: "Tomorrow, 1:00 PM",
      progress: 60,
      status: "active",
    },
    {
      id: 3,
      name: "Data Structures & Algorithms",
      subject: "Computer Science",
      members: 8,
      nextSession: "Friday, 10:00 AM",
      progress: 90,
      status: "active",
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: "session",
      title: "Completed Calculus Study Session",
      time: "2 hours ago",
      group: "Advanced Calculus Study Group",
    },
    {
      id: 2,
      type: "join",
      title: "Joined Organic Chemistry Prep",
      time: "1 day ago",
      group: "Organic Chemistry Prep",
    },
    {
      id: 3,
      type: "achievement",
      title: "Earned 'Consistent Learner' badge",
      time: "2 days ago",
      group: null,
    },
    {
      id: 4,
      type: "message",
      title: "New message in Data Structures group",
      time: "3 days ago",
      group: "Data Structures & Algorithms",
    },
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case "session":
        return <BookOpen className="h-4 w-4" />;
      case "join":
        return <Users className="h-4 w-4" />;
      case "achievement":
        return <Trophy className="h-4 w-4" />;
      case "message":
        return <MessageCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case "session":
        return "text-green-500 bg-green-50";
      case "join":
        return "text-blue-500 bg-blue-50";
      case "achievement":
        return "text-yellow-500 bg-yellow-50";
      case "message":
        return "text-purple-500 bg-purple-50";
      default:
        return "text-gray-500 bg-gray-50";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.firstName || "Student"}!
            </h1>
            <p className="text-gray-600 mt-1">
              Here's what's happening with your study groups today.
            </p>
          </div>
          <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg">
            <Plus className="h-4 w-4 mr-2" />
            Find New Groups
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">
                    Total Groups
                  </p>
                  <p className="text-3xl font-bold">{stats.totalGroups}</p>
                </div>
                <Users className="h-8 w-8 text-blue-200" />
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp className="h-4 w-4 text-blue-200 mr-1" />
                <span className="text-blue-100 text-sm">+2 this month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">
                    Active Groups
                  </p>
                  <p className="text-3xl font-bold">{stats.activeGroups}</p>
                </div>
                <BookOpen className="h-8 w-8 text-green-200" />
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp className="h-4 w-4 text-green-200 mr-1" />
                <span className="text-green-100 text-sm">Very active</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">
                    Sessions
                  </p>
                  <p className="text-3xl font-bold">
                    {stats.completedSessions}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-purple-200" />
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp className="h-4 w-4 text-purple-200 mr-1" />
                <span className="text-purple-100 text-sm">+5 this week</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">
                    Study Hours
                  </p>
                  <p className="text-3xl font-bold">{stats.totalHours}</p>
                </div>
                <Trophy className="h-8 w-8 text-orange-200" />
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp className="h-4 w-4 text-orange-200 mr-1" />
                <span className="text-orange-100 text-sm">+8 this week</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Study Groups */}
          <div className="lg:col-span-2">
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold text-gray-900">
                    Your Study Groups
                  </CardTitle>
                  <Button variant="outline" size="sm">
                    View All
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {studyGroups.map((group) => (
                  <div
                    key={group.id}
                    className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {group.name}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {group.members} members
                          </span>
                          <Badge variant="secondary">{group.subject}</Badge>
                        </div>
                      </div>
                      <Badge
                        variant={
                          group.status === "active" ? "default" : "secondary"
                        }
                        className="bg-green-100 text-green-700"
                      >
                        {group.status}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium text-gray-900">
                          {group.progress}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${group.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        <Clock className="h-4 w-4 inline mr-1" />
                        Next: {group.nextSession}
                      </span>
                      <Button size="sm" variant="outline">
                        Join Session
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div>
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900">
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-full ${getActivityColor(
                          activity.type
                        )}`}
                      >
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.title}
                        </p>
                        {activity.group && (
                          <p className="text-xs text-gray-600 mt-1">
                            {activity.group}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0 mt-6">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Study Session
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Find Study Partners
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Message Groups
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Star className="h-4 w-4 mr-2" />
                  Rate Last Session
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
