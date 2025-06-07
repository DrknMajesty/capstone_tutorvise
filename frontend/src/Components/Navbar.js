import { useState, useEffect } from "react";
import { Menu, X} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom"
import "../Styles/Navbar.css";
import { clearToken } from '../utils/tokenService';

// 🔶 Menu configuration per role
const menuConfig = {
  admin: [
    { label: "Dashboard", path: "/admin/dashboard" },
    { label: "Users", path: "/admin/users" },
    { label: "Packages", path: "/admin/packages" },
    { label: "Timeslots", path:"/admin/timeslots" },
    { label: "Payments", path:"/admin/payments"},
    { label: "Bookings", path: "/admin/bookings" },
    { label: "Profile", path: "/admin/profile" },

  ],
  student: [
    { label: "Home", path: "/student/dashboard" },
    { label: "Applications", path: "/student/bookings" },
    { label: "Bookings", path: "/student/booking-list"},
    { label: "Profile", path: "/student/profile" },
  ],
  tutor: [
    { label: "Home", path: "/tutor/dashboard" },
    { label: "Bookings", path: "/tutor/bookings" },
    { label: "Profile", path: "/tutor/profile" },
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

  // 🔶 Load user and set menu based on role
  useEffect(() => {
    const accountType = sessionStorage.getItem("account_type");
    if (accountType) {
      setMenuItems(menuConfig[accountType] || []);
    }
  }, []);

  // 🔷 Detect current route
  const isLandingPage = location.pathname === "/";
  const isLoginPage = location.pathname === "/login";

  // 🔷 Handle Login/Return button
  const handleNavButtonClick = () => {
    if (isLandingPage) navigate("/login");
    else if (isLoginPage) navigate("/");
  };

  return (
    <div>
      {/* 🔷 Top Navbar */}
      <nav className="navbar">
        <div className="navbar-brand">
          <h1 className="navbar-title">TutorVise</h1>
          <div className="w-4" />  {/* Adds vertical space of 2rem */}
            
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
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link to={item.path} className="nav-link">
                {item.icon}
                {item.label}
              </Link>
            </li>
          ))}

          {isLandingPage || isLoginPage ? (
            <li>
              <button
                onClick={handleNavButtonClick}
                className="nav-link bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
              >
                {isLandingPage ? "Login" : "Return"}
              </button>
            </li>
          ) : (
            <li>
              <button
                onClick={handleLogout}
                className="nav-link bg-red-500 text-white px-4 py-1 rounded hover:text-red-800"
              >
                Logout
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
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link to={item.path} className="nav-link" onClick={toggleSidebar}>
                {item.label}
                {item.icon}
              </Link>
            </li>
          ))}

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
                className="bg-red-500 text-white px-4 py-1 rounded hover:text-white"
              >
                Logout
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
