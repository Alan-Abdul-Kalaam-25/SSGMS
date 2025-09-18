import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Users, Target, Calendar, BookOpen } from "lucide-react";

const Home = () => {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
          Find Your Perfect
          <span className="text-blue-600"> Study Group</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Connect with like-minded students who share your subjects, goals, and
          schedule. Make studying more effective and enjoyable with our smart
          matching system.
        </p>
        <div className="flex justify-center space-x-4">
          <Button size="lg" asChild>
            <Link to="/signup">Get Started</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link to="/login">Sign In</Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="space-y-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Choose StudyMatcher?
          </h2>
          <p className="text-lg text-gray-600">
            Our intelligent matching system ensures you find the most compatible
            study partners
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle>Subject Matching</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Get matched with students studying the same subjects and topics
                as you
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle>Skill Level Alignment</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Find study partners with complementary skill levels for
                effective learning
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle>Schedule Compatibility</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Match with students who have overlapping study schedules and
                availability
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
              <CardTitle>Smart Groups</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Join optimally sized groups that balance diverse perspectives
                with focused discussion
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="space-y-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600">
            Get started in just a few simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto text-white text-2xl font-bold">
              1
            </div>
            <h3 className="text-xl font-semibold">Create Your Profile</h3>
            <p className="text-gray-600">
              Tell us about your subjects, study goals, skill level, and
              availability
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto text-white text-2xl font-bold">
              2
            </div>
            <h3 className="text-xl font-semibold">Get Matched</h3>
            <p className="text-gray-600">
              Our algorithm finds the best study group matches based on your
              preferences
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto text-white text-2xl font-bold">
              3
            </div>
            <h3 className="text-xl font-semibold">Start Studying</h3>
            <p className="text-gray-600">
              Join your matched groups and start collaborative learning sessions
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-50 rounded-lg p-12 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Ready to Transform Your Study Experience?
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Join thousands of students who have already found their perfect study
          groups. Start your journey to more effective and enjoyable learning
          today.
        </p>
        <Button size="lg" asChild>
          <Link to="/signup">Join StudyMatcher Now</Link>
        </Button>
      </section>
    </div>
  );
};

export default Home;
