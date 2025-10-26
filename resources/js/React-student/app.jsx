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
import Login from "./pages/Login";
import Otp from "./pages/Otp";
import Register from "./pages/Register";
import "./app.css";

// Get root element
const el = document.getElementById("app");

// Safely parse user data from HTML
let userData = null;
try {
  userData = el?.dataset?.user ? JSON.parse(el.dataset.user) : null;
} catch (err) {
  console.error("Failed to parse user data:", err);
}

// Main App Component
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes OUTSIDE the layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<Otp />} />

        {/* Routes INSIDE the layout */}
        <Route
          path="/*"
          element={
            <MainLayout user={userData}>
              <Routes>
                <Route path="/dashboard" element={<Dashboard user={userData} />} />
                <Route path="/courses" element={<Courses user={userData} />} />
                <Route path="/boards" element={<Boards user={userData} />} />
                <Route path="/subjects" element={<Subjects user={userData} />} />
                <Route path="/books" element={<Books user={userData} />} />
                <Route path="/past-papers" element={<PastPapers user={userData} />} />
                
              </Routes>
            </MainLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

// Render the app
if (el) {
  createRoot(el).render(<App />);
} else {
  console.error("Root element with id='app' not found in HTML.");
}
