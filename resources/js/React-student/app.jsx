import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/Mainlayout";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import Boards from "./pages/Boards";
import Subjects from "./pages/Subjects";
import Books from "./pages/Books";
import PastPapers from "./pages/PastPapers";
import Profile from "./pages/Profile";
import Wallet from "./pages/Wallet";
import Login from "./pages/Login";
import Otp from "./pages/Otp";
import Register from "./pages/Register";
import ErrorBoundary from "./components/ErrorBoundary";
import "./app.css";

// Get root element
const el = document.getElementById("app");

// Safely parse user data from HTML
let userData = window.authUser || null;
if (!userData) {
  try {
    userData = el?.dataset?.user ? JSON.parse(el.dataset.user) : null;
  } catch (err) {
    console.error("Failed to parse user data:", err);
  }
}

// Main App Component
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />

        {/* Layout */}
        <Route path="/" element={<MainLayout user={userData} />}>
          <Route index element={<Dashboard user={userData} />} />
          <Route path="dashboard" element={<Dashboard user={userData} />} />
          <Route path="courses" element={<Courses />} />
          <Route path="examination-boards" element={<Boards />} />
          <Route path="subjects" element={<Subjects />} />
          <Route path="books" element={<Books />} />
          <Route path="past-papers" element={<PastPapers />} />
          <Route path="profile" element={<Profile />} />
          <Route path="wallet" element={<Wallet />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

// Render the app
if (el) {
  createRoot(el).render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
} else {
  console.error("Root element with id='app' not found in HTML.");
}
