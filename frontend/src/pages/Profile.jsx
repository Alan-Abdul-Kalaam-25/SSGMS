import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Badge } from "../components/ui/badge";
import { Loader2, Plus, X } from "lucide-react";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  university: z.string().min(2, "University name is required"),
  year: z.string().min(1, "Academic year is required"),
  major: z.string().min(2, "Major is required"),
});

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [subjects, setSubjects] = useState([
    "Computer Science",
    "Mathematics",
    "Physics",
  ]);
  const [newSubject, setNewSubject] = useState("");
  const [studyGoals, setStudyGoals] = useState([
    "Exam Preparation",
    "Assignment Help",
  ]);
  const [availability, setAvailability] = useState({
    monday: { morning: false, afternoon: false, evening: true },
    tuesday: { morning: false, afternoon: true, evening: true },
    wednesday: { morning: false, afternoon: false, evening: true },
    thursday: { morning: false, afternoon: true, evening: false },
    friday: { morning: false, afternoon: true, evening: false },
    saturday: { morning: true, afternoon: true, evening: false },
    sunday: { morning: true, afternoon: false, evening: false },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      university: user?.university || "",
      year: user?.year || "",
      major: user?.major || "",
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);

    // Here you would typically make an API call to update the profile
    // For now, we'll just simulate the update
    setTimeout(() => {
      updateUser({ ...user, ...data, subjects, studyGoals, availability });
      setIsLoading(false);
      alert("Profile updated successfully!");
    }, 1000);
  };

  const addSubject = () => {
    if (newSubject.trim() && !subjects.includes(newSubject.trim())) {
      setSubjects([...subjects, newSubject.trim()]);
      setNewSubject("");
    }
  };

  const removeSubject = (subjectToRemove) => {
    setSubjects(subjects.filter((subject) => subject !== subjectToRemove));
  };

  const toggleAvailability = (day, timeSlot) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [timeSlot]: !prev[day][timeSlot],
      },
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600">
          Manage your study preferences and personal information
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Your personal details and academic information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  {...register("name")}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="university">University</Label>
                <Input
                  id="university"
                  {...register("university")}
                  className={errors.university ? "border-red-500" : ""}
                />
                {errors.university && (
                  <p className="text-sm text-red-600">
                    {errors.university.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">Academic Year</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="freshman">Freshman</SelectItem>
                    <SelectItem value="sophomore">Sophomore</SelectItem>
                    <SelectItem value="junior">Junior</SelectItem>
                    <SelectItem value="senior">Senior</SelectItem>
                    <SelectItem value="graduate">Graduate</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="major">Major</Label>
                <Input
                  id="major"
                  {...register("major")}
                  className={errors.major ? "border-red-500" : ""}
                />
                {errors.major && (
                  <p className="text-sm text-red-600">{errors.major.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Study Subjects */}
        <Card>
          <CardHeader>
            <CardTitle>Study Subjects</CardTitle>
            <CardDescription>
              Add the subjects you're currently studying or interested in
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Input
                placeholder="Add a subject"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addSubject())
                }
              />
              <Button type="button" onClick={addSubject}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {subjects.map((subject, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="flex items-center space-x-1"
                >
                  <span>{subject}</span>
                  <button
                    type="button"
                    onClick={() => removeSubject(subject)}
                    className="ml-1 hover:text-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Availability */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Availability</CardTitle>
            <CardDescription>
              Select your preferred study times throughout the week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.keys(availability).map((day) => (
                <div key={day} className="flex items-center space-x-4">
                  <div className="w-20 text-sm font-medium capitalize">
                    {day}
                  </div>
                  <div className="flex space-x-2">
                    {["morning", "afternoon", "evening"].map((timeSlot) => (
                      <button
                        key={timeSlot}
                        type="button"
                        onClick={() => toggleAvailability(day, timeSlot)}
                        className={`px-3 py-1 text-xs rounded-md transition-colors ${
                          availability[day][timeSlot]
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        {timeSlot}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Study Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Study Preferences</CardTitle>
            <CardDescription>
              Help us understand your study style and goals
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Preferred Group Size</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select group size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small (2-3 people)</SelectItem>
                  <SelectItem value="medium">Medium (4-6 people)</SelectItem>
                  <SelectItem value="large">Large (7+ people)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Study Style</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select study style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="discussion">Discussion-based</SelectItem>
                  <SelectItem value="quiet">Quiet study</SelectItem>
                  <SelectItem value="problem-solving">
                    Problem-solving focused
                  </SelectItem>
                  <SelectItem value="mixed">Mixed approach</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Experience Level</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                  <SelectItem value="mixed">Mixed levels welcome</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading} size="lg">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Profile
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
