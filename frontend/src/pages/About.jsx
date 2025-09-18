import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  BookOpen,
  Calendar,
  Trophy,
  Heart,
  Target,
  Lightbulb,
  Shield,
  ChevronRight,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const About = () => {
  const features = [
    {
      icon: Users,
      title: "Smart Matching Algorithm",
      description:
        "Our AI-powered system analyzes your study preferences, schedule, and learning style to connect you with the most compatible study partners and groups.",
    },
    {
      icon: Calendar,
      title: "Seamless Scheduling",
      description:
        "Integrated calendar system makes it easy to coordinate study sessions, track your commitments, and never miss an important group meeting.",
    },
    {
      icon: BookOpen,
      title: "Subject Diversity",
      description:
        "From STEM subjects to humanities, find study groups for virtually any academic subject or professional certification exam.",
    },
    {
      icon: Trophy,
      title: "Progress Tracking",
      description:
        "Monitor your learning journey with detailed analytics, achievement badges, and progress reports to stay motivated and on track.",
    },
  ];

  const values = [
    {
      icon: Heart,
      title: "Community First",
      description:
        "We believe that learning is better when it's collaborative. Building supportive academic communities is at the heart of everything we do.",
    },
    {
      icon: Target,
      title: "Academic Excellence",
      description:
        "Our platform is designed to help students achieve their academic goals through effective peer-to-peer learning and knowledge sharing.",
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description:
        "We constantly innovate to provide the best study experience, leveraging technology to make learning more accessible and effective.",
    },
    {
      icon: Shield,
      title: "Safe & Secure",
      description:
        "Student safety and privacy are paramount. We maintain a secure, moderated environment where everyone can learn comfortably.",
    },
  ];

  const stats = [
    {
      number: "50K+",
      label: "Active Students",
      description: "Students worldwide using our platform",
    },
    {
      number: "10K+",
      label: "Study Groups",
      description: "Active study groups across all subjects",
    },
    {
      number: "500+",
      label: "Universities",
      description: "Universities represented on our platform",
    },
    {
      number: "95%",
      label: "Success Rate",
      description: "Students report improved academic performance",
    },
  ];

  const team = [
    {
      name: "Sarah Johnson",
      role: "Founder & CEO",
      description:
        "Former educator with 10+ years experience in academic technology",
      image: "SJ",
    },
    {
      name: "Michael Chen",
      role: "CTO",
      description: "AI researcher focused on educational matching algorithms",
      image: "MC",
    },
    {
      name: "Emily Rodriguez",
      role: "Head of Community",
      description: "Student success advocate and community building expert",
      image: "ER",
    },
    {
      name: "David Kim",
      role: "Lead Designer",
      description:
        "UX designer passionate about creating intuitive learning experiences",
      image: "DK",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Revolutionizing
              <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Collaborative Learning
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
              We're on a mission to transform how students learn together,
              creating meaningful connections that lead to academic success and
              lifelong friendships.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Our Mission
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              To democratize access to quality education by connecting students
              worldwide, fostering collaborative learning environments, and
              empowering every learner to achieve their full academic potential
              through the power of community.
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How We're Different
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Advanced technology meets human connection to create the ultimate
              study experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border-0"
              >
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mb-6">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
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

      {/* Stats Section */}
      <div className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Impact by the Numbers
            </h2>
            <p className="text-xl text-blue-100">
              See how we're transforming education worldwide
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center text-white">
                <div className="text-4xl md:text-5xl font-bold mb-2">
                  {stat.number}
                </div>
                <div className="text-xl font-semibold text-blue-100 mb-1">
                  {stat.label}
                </div>
                <div className="text-blue-200 text-sm">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card
                key={index}
                className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-0 text-center"
              >
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <value.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600">
              Passionate educators and technologists working to improve learning
              for everyone
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card
                key={index}
                className="bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border-0 text-center"
              >
                <CardContent className="p-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-xl font-bold">
                    {member.image}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {member.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="py-20 bg-gradient-to-br from-slate-900 to-blue-900">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Get in Touch
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Have questions or want to learn more? We'd love to hear from you.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center text-white">
              <Mail className="h-8 w-8 mx-auto mb-3 text-blue-300" />
              <h3 className="font-semibold mb-1">Email Us</h3>
              <p className="text-blue-200">hello@studygroups.com</p>
            </div>
            <div className="text-center text-white">
              <Phone className="h-8 w-8 mx-auto mb-3 text-blue-300" />
              <h3 className="font-semibold mb-1">Call Us</h3>
              <p className="text-blue-200">+1 (555) STUDY-01</p>
            </div>
            <div className="text-center text-white">
              <MapPin className="h-8 w-8 mx-auto mb-3 text-blue-300" />
              <h3 className="font-semibold mb-1">Visit Us</h3>
              <p className="text-blue-200">San Francisco, CA</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              size="lg"
              asChild
              className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Link to="/signup">
                Join Our Community
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 transition-all duration-300"
            >
              <Link to="/contact">Contact Support</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
