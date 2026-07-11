import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/Mainlayout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import Course from "./pages/Course";
import Video from "./pages/Video";
import LiveClasses from "./pages/LiveClasses";
import Boards from "./pages/Boards";
import Subjects from "./pages/Subjects";
import Books from "./pages/Books";
import PastPapers from "./pages/PastPapers";
import Teachers from "./pages/Teachers";
import Teacher from "./pages/Teacher";
import Profile from "./pages/Profile";
import Wallet from "./pages/Wallet";
import Chatbot from "./pages/Chatbot";
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

// Safely parse subjects/grades/boards data (only present on the Subjects page)
let subjectsData = [];
let gradesData = [];
let boardsData = [];
try {
  subjectsData = el?.dataset?.subjects ? JSON.parse(el.dataset.subjects) : [];
  gradesData = el?.dataset?.grades ? JSON.parse(el.dataset.grades) : [];
  boardsData = el?.dataset?.boards ? JSON.parse(el.dataset.boards) : [];
} catch (err) {
  console.error("Failed to parse subjects/grades/boards data:", err);
}

// Main App Component
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/otp" element={<Otp />} />
        <Route path="/chatbot" element={<Chatbot />} />

        {/* Layout */}
        <Route element={<MainLayout user={userData} />}>
          <Route path="dashboard" element={<Dashboard user={userData} />} />
          <Route path="courses" element={<Courses />} />
          <Route path="course/:id" element={<Course />} />
          <Route path="video/:id" element={<Video />} />
          <Route path="live_classes" element={<LiveClasses />} />
          <Route path="examination-boards" element={<Boards />} />
          <Route
            path="subjects"
            element={
              <Subjects subjects={subjectsData} grades={gradesData} boards={boardsData} />
            }
          />
          <Route path="books" element={<Books />} />
          <Route path="past-papers" element={<PastPapers />} />
          <Route path="teachers" element={<Teachers />} />
          <Route path="teacher/:id" element={<Teacher />} />
          <Route path="profile" element={<Profile user={userData} />} />
          <Route path="wallet" element={<Wallet user={userData} />} />
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