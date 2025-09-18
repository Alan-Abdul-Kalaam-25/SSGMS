import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Users, Clock, BookOpen, MapPin } from "lucide-react";

const Groups = () => {
  const { user } = useAuth();
  const [groups] = useState([
    {
      id: 1,
      name: "Advanced React Concepts",
      subject: "Computer Science",
      members: 4,
      maxMembers: 6,
      schedule: "Mon, Wed 7:00 PM",
      location: "Library Study Room A",
      description:
        "Diving deep into React hooks, context, and advanced patterns",
      tags: ["React", "JavaScript", "Frontend"],
      isActive: true,
    },
    {
      id: 2,
      name: "Calculus Masters",
      subject: "Mathematics",
      members: 3,
      maxMembers: 5,
      schedule: "Tue, Thu 6:00 PM",
      location: "Math Building Room 201",
      description: "Working through calculus problems and preparing for exams",
      tags: ["Calculus", "Problem Solving", "Exam Prep"],
      isActive: true,
    },
    {
      id: 3,
      name: "Organic Chemistry Study Group",
      subject: "Chemistry",
      members: 5,
      maxMembers: 6,
      schedule: "Fri 4:00 PM",
      location: "Science Lab 3",
      description: "Understanding organic reactions and mechanisms",
      tags: ["Organic Chemistry", "Lab Work", "Mechanisms"],
      isActive: false,
    },
  ]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Study Groups</h1>
          <p className="text-gray-600">
            Manage your active study groups and find new ones
          </p>
        </div>
        <Button>Find New Groups</Button>
      </div>

      {/* Active Groups */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">
          Active Groups ({groups.filter((g) => g.isActive).length})
        </h2>
        <div className="grid gap-6">
          {groups
            .filter((group) => group.isActive)
            .map((group) => (
              <Card
                key={group.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{group.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {group.description}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary">{group.subject}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Group Info */}
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {group.members}/{group.maxMembers} members
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {group.schedule}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {group.location}
                        </span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {group.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2 pt-2">
                      <Button size="sm">View Details</Button>
                      <Button size="sm" variant="outline">
                        Schedule Session
                      </Button>
                      <Button size="sm" variant="destructive">
                        Leave Group
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>

      {/* Past Groups */}
      {groups.filter((g) => !g.isActive).length > 0 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Past Groups</h2>
          <div className="grid gap-6">
            {groups
              .filter((group) => !group.isActive)
              .map((group) => (
                <Card key={group.id} className="opacity-75">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{group.name}</CardTitle>
                        <CardDescription className="mt-1">
                          {group.description}
                        </CardDescription>
                      </div>
                      <Badge variant="outline">{group.subject}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Group Info */}
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">
                            {group.members}/{group.maxMembers} members
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">
                            {group.schedule}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">
                            {group.location}
                          </span>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {group.tags.map((tag, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {groups.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No study groups yet
            </h3>
            <p className="text-gray-600 mb-6">
              Get started by finding your first study group match
            </p>
            <Button>Find Study Groups</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Groups;
