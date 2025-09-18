import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  Users,
  Calendar,
  Clock,
  MapPin,
  Star,
  Plus,
  BookOpen,
  Globe,
  Video,
} from "lucide-react";

const StudyGroups = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const studyGroups = [
    {
      id: 1,
      name: "Advanced Calculus Mastery",
      subject: "Mathematics",
      description:
        "Intensive study group for Calculus III with weekly problem-solving sessions and exam prep.",
      members: 8,
      maxMembers: 12,
      meetingTime: "Tue, Thu 6:00 PM",
      location: "Library Room 204",
      type: "in-person",
      difficulty: "Advanced",
      rating: 4.8,
      tags: ["Calculus", "Problem Solving", "Exam Prep"],
      nextSession: "Today, 6:00 PM",
      university: "MIT",
    },
    {
      id: 2,
      name: "Organic Chemistry Study Circle",
      subject: "Chemistry",
      description:
        "Collaborative learning for Organic Chemistry with visual aids and interactive sessions.",
      members: 6,
      maxMembers: 10,
      meetingTime: "Mon, Wed, Fri 3:00 PM",
      location: "Online via Zoom",
      type: "online",
      difficulty: "Intermediate",
      rating: 4.9,
      tags: ["Organic Chemistry", "Mechanisms", "Lab Prep"],
      nextSession: "Tomorrow, 3:00 PM",
      university: "Stanford",
    },
    {
      id: 3,
      name: "Data Structures & Algorithms",
      subject: "Computer Science",
      description:
        "Coding interviews preparation with leetcode practice and system design discussions.",
      members: 15,
      maxMembers: 20,
      meetingTime: "Daily 8:00 PM",
      location: "Discord Server",
      type: "online",
      difficulty: "Advanced",
      rating: 4.7,
      tags: ["Algorithms", "Coding", "Interview Prep"],
      nextSession: "Today, 8:00 PM",
      university: "Berkeley",
    },
    {
      id: 4,
      name: "Shakespeare Literature Study",
      subject: "Literature",
      description:
        "Deep dive into Shakespeare's works with analysis, discussion, and essay writing practice.",
      members: 5,
      maxMembers: 8,
      meetingTime: "Sat 2:00 PM",
      location: "Campus Coffee Shop",
      type: "in-person",
      difficulty: "Beginner",
      rating: 4.6,
      tags: ["Shakespeare", "Analysis", "Writing"],
      nextSession: "Saturday, 2:00 PM",
      university: "Harvard",
    },
    {
      id: 5,
      name: "Financial Accounting Fundamentals",
      subject: "Business",
      description:
        "Master the basics of financial accounting with real-world case studies and practice problems.",
      members: 12,
      maxMembers: 15,
      meetingTime: "Sun 10:00 AM",
      location: "Business Building 301",
      type: "hybrid",
      difficulty: "Beginner",
      rating: 4.5,
      tags: ["Accounting", "Finance", "Case Studies"],
      nextSession: "Sunday, 10:00 AM",
      university: "Wharton",
    },
    {
      id: 6,
      name: "Quantum Physics Research Group",
      subject: "Physics",
      description:
        "Advanced quantum mechanics study with research paper discussions and problem sets.",
      members: 4,
      maxMembers: 6,
      meetingTime: "Thu 7:00 PM",
      location: "Physics Lab 401",
      type: "in-person",
      difficulty: "Expert",
      rating: 4.9,
      tags: ["Quantum", "Research", "Advanced"],
      nextSession: "Thursday, 7:00 PM",
      university: "Caltech",
    },
  ];

  const subjects = [
    "All",
    "Mathematics",
    "Computer Science",
    "Chemistry",
    "Physics",
    "Literature",
    "Business",
  ];
  const difficulties = [
    "All",
    "Beginner",
    "Intermediate",
    "Advanced",
    "Expert",
  ];

  const filteredGroups = studyGroups.filter((group) => {
    const matchesSearch =
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesFilter =
      selectedFilter === "all" ||
      group.subject.toLowerCase() === selectedFilter.toLowerCase() ||
      group.difficulty.toLowerCase() === selectedFilter.toLowerCase();

    return matchesSearch && matchesFilter;
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
        return "bg-green-100 text-green-700";
      case "intermediate":
        return "bg-yellow-100 text-yellow-700";
      case "advanced":
        return "bg-orange-100 text-orange-700";
      case "expert":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "online":
        return <Globe className="h-4 w-4" />;
      case "in-person":
        return <MapPin className="h-4 w-4" />;
      case "hybrid":
        return <Video className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "online":
        return "bg-blue-100 text-blue-700";
      case "in-person":
        return "bg-purple-100 text-purple-700";
      case "hybrid":
        return "bg-indigo-100 text-indigo-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Discover Study Groups
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join collaborative learning communities and accelerate your academic
            journey
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search groups by name, subject, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2">
                {[...subjects, ...difficulties].map((filter) => (
                  <Button
                    key={filter}
                    variant={
                      selectedFilter === filter.toLowerCase()
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() => setSelectedFilter(filter.toLowerCase())}
                    className="capitalize"
                  >
                    {filter}
                  </Button>
                ))}
              </div>

              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                <Plus className="h-4 w-4 mr-2" />
                Create Group
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-gray-600">
            Found{" "}
            <span className="font-semibold text-gray-900">
              {filteredGroups.length}
            </span>{" "}
            study groups
          </p>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">Sort by: Most Popular</span>
          </div>
        </div>

        {/* Study Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredGroups.map((group) => (
            <Card
              key={group.id}
              className="bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-2">
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-700"
                  >
                    {group.subject}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-gray-700">
                      {group.rating}
                    </span>
                  </div>
                </div>
                <CardTitle className="text-lg font-bold text-gray-900 leading-tight">
                  {group.name}
                </CardTitle>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {group.description}
                </p>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Group Info */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center text-gray-600">
                      <Users className="h-4 w-4 mr-1" />
                      {group.members}/{group.maxMembers} members
                    </span>
                    <Badge className={getDifficultyColor(group.difficulty)}>
                      {group.difficulty}
                    </Badge>
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-1" />
                    {group.meetingTime}
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center text-gray-600">
                      {getTypeIcon(group.type)}
                      <span className="ml-1">{group.location}</span>
                    </span>
                    <Badge className={getTypeColor(group.type)}>
                      {group.type}
                    </Badge>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {group.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Next Session */}
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-blue-600 font-medium">
                        Next Session
                      </p>
                      <p className="text-sm font-semibold text-blue-900">
                        {group.nextSession}
                      </p>
                    </div>
                    <Calendar className="h-5 w-5 text-blue-500" />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    size="sm"
                  >
                    Join Group
                  </Button>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredGroups.length === 0 && (
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
            <CardContent className="p-12 text-center">
              <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No study groups found
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search terms or filters, or create a new
                study group.
              </p>
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Group
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default StudyGroups;
