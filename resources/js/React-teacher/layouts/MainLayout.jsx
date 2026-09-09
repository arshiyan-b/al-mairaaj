import React, { useState, useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
import { User, LogOut, Menu, Wallet as WalletIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import logo from "@/assets/logo.png";

const MainLayout = ({ user }) => {
  const [logoutRoute, setLogoutRoute] = useState("");
  const [csrfToken, setCsrfToken] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (window.logoutRoute && window.csrfToken) {
      setLogoutRoute(window.logoutRoute);
      setCsrfToken(window.csrfToken);
    }
  }, []);

  const handleLogout = () => {
    if (!logoutRoute || !csrfToken) {
      window.location.href = "/login";
      return;
    }

    setLoading(true);

    const form = document.createElement("form");
    form.method = "POST";
    form.action = logoutRoute;

    const csrfInput = document.createElement("input");
    csrfInput.type = "hidden";
    csrfInput.name = "_token";
    csrfInput.value = csrfToken;
    form.appendChild(csrfInput);

    document.body.appendChild(form);
    form.submit();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/teacher/dashboard" className="flex items-center gap-2 hover:opacity-80 transition">
              <img src={logo} alt="Al Mairaaj" className="w-44 sm:w-56 h-auto" />
            </Link>

            <div className="flex items-center gap-3">
              <p className="hidden md:block text-sm text-gray-700">
                {user?.name || "Teacher"}
              </p>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full" aria-label="Account menu">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-teal-700 text-white text-sm">
                        {user?.name?.charAt(0)?.toUpperCase() || "T"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-56" align="end">
                  <Link to="/teacher/dashboard" className="w-full">
                    <DropdownMenuItem className="cursor-pointer">
                      <User className="h-4 w-4 mr-2" /> Dashboard
                    </DropdownMenuItem>
                  </Link>
                  <Link to="/teacher/profile" className="w-full">
                    <DropdownMenuItem className="cursor-pointer">
                      <User className="h-4 w-4 mr-2" /> Profile
                    </DropdownMenuItem>
                  </Link>
                  <Link to="/teacher/wallet" className="w-full">
                    <DropdownMenuItem className="cursor-pointer">
                      <WalletIcon className="h-4 w-4 mr-2" /> Wallet
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-600 cursor-pointer"
                    onClick={handleLogout}
                    disabled={loading}
                  >
                    <LogOut className="h-4 w-4 mr-2" /> {loading ? "Logging out..." : "Logout"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;