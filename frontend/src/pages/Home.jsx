import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavbarTheme, navbarThemes } from "../contexts/NavbarThemeContext";
import {
  Users,
  BookOpen,
  Calendar,
  Trophy,
  Star,
  ChevronRight,
} from "lucide-react";

const Home = () => {
  const { updateNavbarTheme } = useNavbarTheme();

  useEffect(() => {
    updateNavbarTheme(navbarThemes.home);
  }, [updateNavbarTheme]);

  const features = [
    {
      icon: Users,
      title: "Smart Matching",
      description:
        "AI-powered algorithm connects you with compatible study partners based on subjects, schedule, and learning style.",
    },
    {
      icon: BookOpen,
      title: "Subject Expertise",
      description:
        "Find study groups for any subject - from mathematics and science to literature and history.",
    },
    {
      icon: Calendar,
      title: "Flexible Scheduling",
      description:
        "Coordinate study sessions that work for everyone with integrated calendar management.",
    },
    {
      icon: Trophy,
      title: "Track Progress",
      description:
        "Monitor your study goals and achievements with detailed analytics and progress tracking.",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      subject: "Computer Science",
      rating: 5,
      text: "Found my perfect study group within hours! The matching algorithm is incredibly accurate.",
    },
    {
      name: "Marcus Johnson",
      subject: "Pre-Med",
      rating: 5,
      text: "Improved my grades significantly since joining study groups through this platform.",
    },
    {
      name: "Elena Rodriguez",
      subject: "Business",
      rating: 5,
      text: "The scheduling features make it so easy to coordinate with multiple study partners.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 via-purple-600/10 to-pink-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Find Your Perfect
              <span className="block bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Study Partners
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
              Connect with like-minded students, form effective study groups,
              and achieve academic success together. Smart matching meets
              flexible scheduling for the ultimate collaborative learning
              experience.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <Button size="lg" asChild className="text-lg px-8 py-3">
                <Link to="/signup">
                  Get Started Free
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="text-lg px-8 py-3"
              >
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white/70 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Excel
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to enhance your study experience and
              boost academic performance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group border-0 bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl hover:shadow-violet-200/50 transition-all duration-300 hover:-translate-y-2"
              >
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="py-20 bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="text-white">
              <div className="text-4xl md:text-5xl font-bold mb-2">10K+</div>
              <div className="text-xl text-violet-100">Active Students</div>
            </div>
            <div className="text-white">
              <div className="text-4xl md:text-5xl font-bold mb-2">2.5K+</div>
              <div className="text-xl text-purple-100">Study Groups Formed</div>
            </div>
            <div className="text-white">
              <div className="text-4xl md:text-5xl font-bold mb-2">95%</div>
              <div className="text-xl text-pink-100">Success Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-24 bg-gradient-to-br from-gray-50 to-violet-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Students Say
            </h2>
            <p className="text-xl text-gray-600">
              Real experiences from students who've found success through our
              platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="border-0 bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl hover:shadow-violet-200/50 transition-all duration-300 hover:-translate-y-1"
              >
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 text-amber-400 fill-current"
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 italic leading-relaxed">
                    "{testimonial.text}"
                  </p>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {testimonial.name}
                    </div>
                    <div className="text-violet-600 font-medium">
                      {testimonial.subject}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-24 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 animate-gradient-x"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-float"></div>
          <div className="absolute top-20 right-20 w-24 h-24 bg-purple-500/10 rounded-full blur-xl animate-float" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-pink-500/10 rounded-full blur-xl animate-float" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="relative max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 text-blue-200 text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
              Join 10,000+ Active Students
            </div>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight">
            Ready to Transform Your
            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Study Experience?
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-blue-100 mb-12 leading-relaxed max-w-3xl mx-auto">
            Join thousands of students who have already discovered the power of
            collaborative learning. Start your journey to academic excellence today.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6 mb-12">
            <Button
              size="lg"
              asChild
              className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 px-8 py-4 text-lg font-semibold"
            >
              <Link to="/signup">
                <span className="flex items-center">
                  Start Your Journey
                  <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="group bg-white/10 border-2 border-white/50 text-white hover:bg-white hover:text-indigo-600 hover:border-white backdrop-blur-sm transition-all duration-300 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl"
            >
              <Link to="/login">
                <span className="flex items-center">
                  Already Have an Account?
                  <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </Button>
          </div>
          
          {/* Trust indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-white/20">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">24/7</div>
              <div className="text-blue-200">Support Available</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">100%</div>
              <div className="text-purple-200">Free to Start</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">5★</div>
              <div className="text-pink-200">Student Rating</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
