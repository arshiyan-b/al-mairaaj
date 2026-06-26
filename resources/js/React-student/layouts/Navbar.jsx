import { useLocation, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const navigationItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Courses", href: "/courses" },
  { label: "Live Classes", href: "/live_classes" },
  { label: "Examination Boards", href: "/examination-boards" },
  { label: "Subjects", href: "/subjects" },
  { label: "Books", href: "/books" },
  { label: "Past Papers", href: "/past-papers" },
  { label: "Teachers", href: "/teachers" },
];

export const Navbar = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const activeLabel = (() => {
    const match = navigationItems.find((i) => i.href === location.pathname);
    return match ? match.label : "Home";
  })();

  const goto = (href) => {
    navigate(href);
    setIsMobileMenuOpen(false); // close after click
  };

  return (
    <>
      {/* Desktop */}
      <nav className="hidden md:block bg-gray-900 border-b border-gray-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-12">
            <ul className="flex space-x-6">
              {navigationItems.map((item) => (
                <li key={item.label}>
                  <Link to={item.href}>
                    <Button
                      variant="ghost"
                      className={`text-white hover:bg-gray-400 hover:text-black px-3 py-2 text-sm font-medium transition-colors ${activeLabel === item.label ? "bg-gray-700 text-teal-400" : ""
                        }`}
                    >
                      {item.label}
                    </Button>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div
        className={`md:hidden fixed inset-0 z-[999] flex transition-opacity duration-300 ${
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Clickable Overlay */}
        <div
          className="absolute inset-0 bg-black/50 transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Sidebar */}
        <nav
          className={`relative h-full w-72 bg-gray-900 text-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <span className="text-lg font-semibold">Menu</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Links */}
          <ul className="p-2 space-y-1">
            {navigationItems.map((item) => (
              <li key={item.label}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start px-4 py-2 ${
                    activeLabel === item.label ? "bg-gray-800 text-teal-400" : ""
                  }`}
                  onClick={() => goto(item.href)}
                >
                  {item.label}
                </Button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

    </>
  );
};
