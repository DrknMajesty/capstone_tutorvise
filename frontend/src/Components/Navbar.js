import { useState, useEffect } from "react";
import { Menu, X, LogOut, CircleUser } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../Styles/Navbar.css";
import { clearToken } from '../utils/tokenService';
import NotificationBell from './notificationBell';

const menuConfig = {
  admin: [
    { label: "Dashboard", path: "/admin/dashboard" },
    { label: "Users", path: "/admin/users" },
    { label: "Packages", path: "/admin/packages" },
    { label: "Timeslots", path: "/admin/timeslots" },
    { label: "Payments", path: "/admin/payments" },
    { label: "Bookings", path: "/admin/bookings" },
    { label: "Schedules", path: "/admin/schedules" },
    { label: "Sessions", path: "/admin/sessions" },
    { label: "Reports", path: "/admin/reports" },
    { label: "Profile", path: "/admin/profile", icon: <CircleUser size={18} /> },
  ],
  "admin staff": [
    { label: "Dashboard", path: "/admin-staff/dashboard" },
    { label: "Users", path: "/admin-staff/users" },
    { label: "Packages", path: "/admin-staff/packages" },
    { label: "Payments", path: "/admin-staff/payments" },
    { label: "Schedules", path: "/admin-staff/schedules" },
    { label: "Sessions", path: "/admin-staff/sessions" },
    { label: "Profile", path: "/admin-staff/profile" },
  ],
  student: [
    { label: "Home", path: "/student/dashboard" },
    { label: "Applications", path: "/student/bookings" },
    { label: "Bookings", path: "/student/booking-list" },
    { label: "Sessions", path: "/student/sessions" },
    { label: "Payments", path: "/student/payments" },
    { label: "Profile", path: "/student/profile", icon: <CircleUser size={18} /> },
  ],
  tutor: [
    { label: "Home", path: "/tutor/dashboard" },
    { label: "Bookings", path: "/tutor/bookings" },
    { label: "Sessions", path: "/tutor/sessions" },
    { label: "Profile", path: "/tutor/profile", icon: <CircleUser size={18} /> },
  ]
};

export default function ResponsiveNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => setIsOpen(!isOpen);
  const handleLogout = () => {
    clearToken();
    navigate("/");
  };

  useEffect(() => {
    const accountType = sessionStorage.getItem("account_type");
    if (accountType) {
      setMenuItems(menuConfig[accountType] || []);
    }
  }, []);

  const isLandingPage = location.pathname === "/";
  const isLoginPage = location.pathname === "/login";
  const handleNavButtonClick = () => {
    if (isLandingPage) navigate("/login");
    else if (isLoginPage) navigate("/");
  };

  const userId = sessionStorage.getItem("user_id");

  return (
    <div>
      {/* 🔷 Top Navbar */}
      <nav className="navbar">
        <div className="navbar-brand">
          <h1 className="navbar-title">TutorVise</h1>
          <div className="w-4" />

          {!isLandingPage && !isLoginPage && (
            <>
              <div className="w-1 h-10 bg-white mr-2" />
              <h2 className="navbar-username">
                {sessionStorage.getItem("username") || "User"}
              </h2>
            </>
          )}
        </div>

        {/* 🔷 Desktop Menu */}
        <ul className="nav-links-horizontal">
        {/* Notification Bell */}
          {!isLandingPage && !isLoginPage && userId && (
            <li>
              <NotificationBell userId={userId} />
            </li>
          )}

          {menuItems.map((item) => (
            <li key={item.path}>
              <Link to={item.path} className="nav-link" title={item.label}>
                {item.icon ? item.icon : item.label}
              </Link>
            </li>
          ))}


          {/* Login / Logout Buttons */}
          {isLandingPage || isLoginPage ? (
            <li>
              <button
                onClick={handleNavButtonClick}
                className="nav-link bg-brown-600 text-white px-4 py-1 rounded hover:bg-yellow-700"
              >
                {isLandingPage ? "Login" : "Return"}
              </button>
            </li>
          ) : (
            <li>
              <button
                onClick={handleLogout}
                className="nav-link bg-red-500 text-white px-3 py-1 rounded hover:text-red-800 flex items-center"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </li>
          )}
        </ul>

        {/* 🔷 Mobile Menu Button */}
        <button
          className="menu-button"
          onClick={toggleSidebar}
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="spacer" />

      {/* 🔶 Sidebar for Mobile */}
      <div className={`sidebar ${isOpen ? "sidebar-open" : "sidebar-closed"}`}>
        <div className="sidebar-header">
          <h2 className="text-lg font-semibold">Menu</h2>
        </div>
        <ul className="nav-links-vertical">
          {/* Mobile Notification Bell */}
          {!isLandingPage && !isLoginPage && userId && (
            <li>
              <NotificationBell userId={userId} />
            </li>
          )}

          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className="nav-link flex items-center gap-2"
                onClick={toggleSidebar}
              >
                {item.icon && <span>{item.icon}</span>}
                <span>{item.label}</span>
              </Link>
            </li>
          ))}



          {/* Login / Logout Buttons */}
          {isLandingPage || isLoginPage ? (
            <li>
              <button
                onClick={() => {
                  handleNavButtonClick();
                  toggleSidebar();
                }}
                className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
              >
                {isLandingPage ? "Login" : "Return"}
              </button>
            </li>
          ) : (
            <li>
              <button
                onClick={() => {
                  handleLogout();
                  toggleSidebar();
                }}
                className="bg-red-500 text-white px-3 py-1 rounded hover:text-white flex items-center"
                title="Logout"
              >
                <LogOut size={18} />
                <span className="ml-2">Logout</span>
              </button>
            </li>
          )}
        </ul>
      </div>

      {/* 🔷 Overlay */}
      {isOpen && <div className="overlay" onClick={toggleSidebar} />}
    </div>
  );
}
