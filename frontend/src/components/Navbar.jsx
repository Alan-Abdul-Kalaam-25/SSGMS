import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useNavbarTheme } from "../contexts/NavbarThemeContext";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { BookOpen, Menu, X, User, LogOut, Settings, Bell } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const { navbarTheme } = useNavbarTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 w-full">
      <div className="px-6 py-4">
        <nav className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl max-w-6xl mx-auto shadow-lg shadow-black/10">
          <div className="px-6 py-3">
            <div className="flex items-center justify-between">
              {/* Logo and Brand */}
              <div className="flex items-center">
                <Link to="/" className="flex items-center space-x-3 group">
                  <div className="h-9 w-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <BookOpen className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-bold text-xl text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                    StudyMatcher
                  </span>
                </Link>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-8">
                {isAuthenticated ? (
                  <nav className="flex items-center space-x-6">
                    <Link
                      to="/dashboard"
                      className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 relative group"
                    >
                      Dashboard
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300 rounded-full"></span>
                    </Link>
                    <Link
                      to="/study-groups"
                      className="text-gray-700 hover:text-purple-600 font-medium transition-colors duration-200 relative group"
                    >
                      Groups
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 group-hover:w-full transition-all duration-300 rounded-full"></span>
                    </Link>
                    <Link
                      to="/profile"
                      className="text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-200 relative group"
                    >
                      Profile
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-600 group-hover:w-full transition-all duration-300 rounded-full"></span>
                    </Link>
                    <Link
                      to="/about"
                      className="text-gray-700 hover:text-orange-600 font-medium transition-colors duration-200 relative group"
                    >
                      About
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-600 group-hover:w-full transition-all duration-300 rounded-full"></span>
                    </Link>
                  </nav>
                ) : (
                  <nav className="flex items-center space-x-6">
                    <Link
                      to="/about"
                      className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 relative group"
                    >
                      About
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300 rounded-full"></span>
                    </Link>
                    <Link
                      to="/study-groups"
                      className="text-gray-700 hover:text-purple-600 font-medium transition-colors duration-200 relative group"
                    >
                      Groups
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 group-hover:w-full transition-all duration-300 rounded-full"></span>
                    </Link>
                  </nav>
                )}
              </div>

              {/* Right Side Actions */}
              <div className="flex items-center space-x-4">
                {isAuthenticated ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="relative h-10 w-10 rounded-full hover:bg-gray-100/50 transition-all duration-300"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-semibold">
                            {user?.name?.charAt(0).toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-64 bg-white/95 backdrop-blur-xl border border-gray-200/50 shadow-xl rounded-xl"
                      align="end"
                      sideOffset={8}
                    >
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                              {user?.name?.charAt(0).toUpperCase() || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {user?.name || "User"}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {user?.email || "user@example.com"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-1">
                        <DropdownMenuItem
                          onClick={() => navigate("/profile")}
                          className="px-4 py-3 hover:bg-blue-50 hover:text-blue-700 cursor-pointer transition-all duration-200 group rounded-lg mx-2"
                        >
                          <User className="mr-3 h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors duration-200" />
                          <span className="text-sm text-gray-700 group-hover:text-blue-700 font-medium">
                            Profile
                          </span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="px-4 py-3 hover:bg-gray-50 hover:text-gray-700 cursor-pointer transition-all duration-200 group rounded-lg mx-2">
                          <Settings className="mr-3 h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors duration-200" />
                          <span className="text-sm text-gray-700 group-hover:text-gray-700 font-medium">
                            Settings
                          </span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="px-4 py-3 hover:bg-emerald-50 hover:text-emerald-700 cursor-pointer transition-all duration-200 group rounded-lg mx-2">
                          <Bell className="mr-3 h-4 w-4 text-gray-400 group-hover:text-emerald-600 transition-colors duration-200" />
                          <span className="text-sm text-gray-700 group-hover:text-emerald-700 font-medium">
                            Notifications
                          </span>
                        </DropdownMenuItem>
                      </div>

                      <DropdownMenuSeparator className="my-1" />

                      <div className="py-1">
                        <DropdownMenuItem
                          onClick={handleLogout}
                          className="px-4 py-3 hover:bg-red-50 hover:text-red-700 cursor-pointer transition-all duration-200 group rounded-lg mx-2"
                        >
                          <LogOut className="mr-3 h-4 w-4 text-gray-400 group-hover:text-red-600 transition-colors duration-200" />
                          <span className="text-sm text-gray-700 group-hover:text-red-700 font-medium">
                            Sign out
                          </span>
                        </DropdownMenuItem>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="text-gray-700 hover:text-blue-600 hover:bg-blue-50/50 transition-all duration-300 font-medium"
                    >
                      <Link to="/login">Log in</Link>
                    </Button>
                    <Button
                      size="sm"
                      asChild
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
                    >
                      <Link to="/signup">Sign up</Link>
                    </Button>
                  </div>
                )}

                {/* Mobile menu button */}
                <Button
                  variant="ghost"
                  className="md:hidden h-10 w-10 p-0 hover:bg-gray-100/50 transition-all duration-300"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  {isMenuOpen ? (
                    <X className="h-5 w-5 text-gray-700" />
                  ) : (
                    <Menu className="h-5 w-5 text-gray-700" />
                  )}
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-200/50 bg-white/95 backdrop-blur-xl">
              <div className="px-6 py-4 space-y-2">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/dashboard"
                      className="block px-4 py-3 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50/50 rounded-lg transition-all duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/study-groups"
                      className="block px-4 py-3 text-sm font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50/50 rounded-lg transition-all duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Groups
                    </Link>
                    <Link
                      to="/profile"
                      className="block px-4 py-3 text-sm font-medium text-gray-700 hover:text-emerald-600 hover:bg-emerald-50/50 rounded-lg transition-all duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/about"
                      className="block px-4 py-3 text-sm font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50/50 rounded-lg transition-all duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      About
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/about"
                      className="block px-4 py-3 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50/50 rounded-lg transition-all duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      About
                    </Link>
                    <Link
                      to="/study-groups"
                      className="block px-4 py-3 text-sm font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50/50 rounded-lg transition-all duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Groups
                    </Link>
                    <Link
                      to="/login"
                      className="block px-4 py-3 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50/50 rounded-lg transition-all duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Log in
                    </Link>
                    <Link
                      to="/signup"
                      className="block px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg transition-all duration-300 shadow-lg"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign up
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
