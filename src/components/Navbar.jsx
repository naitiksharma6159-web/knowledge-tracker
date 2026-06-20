import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Brain, Menu, X, LayoutDashboard, Calendar, FileText, MessageSquare, Home } from "lucide-react";
import "./Navbar.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className="navbar">
      {/* Left - Logo */}
      <Link to="/" className="logo-container" onClick={closeMenu}>
        <Brain className="logo-icon text-primary icon-spin-slow" size={24} />
        <span className="logo-text">Knowledge Decay Predictor</span>
      </Link>

      {/* Center - Links (Desktop) */}
      <ul className={`nav-links ${isOpen ? "open" : ""}`}>
        <li>
          <NavLink to="/" end onClick={closeMenu} className={({ isActive }) => (isActive ? "active-link" : "")}>
            <Home size={16} />
            <span>Home</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/dashboard" onClick={closeMenu} className={({ isActive }) => (isActive ? "active-link" : "")}>
            <LayoutDashboard size={16} />
            <span>Dashboard</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/tracker" onClick={closeMenu} className={({ isActive }) => (isActive ? "active-link" : "")}>
            <Calendar size={16} />
            <span>Tracker</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/notes" onClick={closeMenu} className={({ isActive }) => (isActive ? "active-link" : "")}>
            <FileText size={16} />
            <span>Notes</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/chat" onClick={closeMenu} className={({ isActive }) => (isActive ? "active-link" : "")}>
            <MessageSquare size={16} />
            <span>Chat Assistant</span>
          </NavLink>
        </li>
      </ul>

      {/* Right - Button (Desktop) & Hamburger Menu */}
      <div className="nav-actions">
        <Link to="/dashboard" className="nav-desktop-btn-link">
          <button className="nav-cta-btn">Get Started</button>
        </Link>

        <button className="hamburger-menu" onClick={toggleMenu} aria-label="Toggle menu">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;