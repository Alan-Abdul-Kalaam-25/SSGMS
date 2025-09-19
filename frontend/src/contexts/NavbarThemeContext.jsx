import React, { createContext, useContext, useState } from "react";

const NavbarThemeContext = createContext();

export const useNavbarTheme = () => {
  const context = useContext(NavbarThemeContext);
  if (!context) {
    throw new Error("useNavbarTheme must be used within a NavbarThemeProvider");
  }
  return context;
};

export const NavbarThemeProvider = ({ children }) => {
  const [navbarTheme, setNavbarTheme] = useState({
    background: "bg-transparent",
    border: "border-white/20",
  });

  const updateNavbarTheme = (theme) => {
    setNavbarTheme(theme);
  };

  return (
    <NavbarThemeContext.Provider value={{ navbarTheme, updateNavbarTheme }}>
      {children}
    </NavbarThemeContext.Provider>
  );
};

// Predefined themes for different pages
export const navbarThemes = {
  home: {
    background: "bg-transparent",
    border: "border-white/20",
  },
  dashboard: {
    background: "bg-transparent",
    border: "border-white/20",
  },
  studyGroups: {
    background: "bg-transparent",
    border: "border-white/20",
  },
  profile: {
    background: "bg-transparent",
    border: "border-white/20",
  },
  about: {
    background: "bg-transparent",
    border: "border-white/20",
  },
  auth: {
    background: "bg-transparent",
    border: "border-white/20",
  },
};
