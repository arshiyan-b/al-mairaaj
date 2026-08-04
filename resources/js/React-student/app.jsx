import React, { Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import "./app.css";

// Layout can stay eager since it wraps most routes and loads immediately anyway
import MainLayout from "./layouts/Mainlayout";

// Lazy-loaded pages
const Index = lazy(() => import("./pages/Index"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Courses = lazy(() => import("./pages/Courses"));
const Course = lazy(() => import("./pages/Course"));
const Video = lazy(() => import("./pages/Video"));
const LiveClasses = lazy(() => import("./pages/LiveClasses"));
const BrowseLiveClasses = lazy(() => import("./pages/BrowseLiveClasses"));
const LiveClassesBatch = lazy(() => import("./pages/LiveClassesBatch"));
const Boards = lazy(() => import("./pages/Boards"));
const Subjects = lazy(() => import("./pages/Subjects"));
const Books = lazy(() => import("./pages/Books"));
const PastPapers = lazy(() => import("./pages/PastPapers"));
const Teachers = lazy(() => import("./pages/Teachers"));
const Teacher = lazy(() => import("./pages/Teacher"));
const Profile = lazy(() => import("./pages/Profile"));
const Chatbot = lazy(() => import("./pages/Chatbot"));
const Login = lazy(() => import("./pages/Login"));
const Otp = lazy(() => import("./pages/Otp"));
const Register = lazy(() => import("./pages/Register"));
const Wallet = lazy(() => import("./pages/Wallet"));
const Topup = lazy(() => import("./pages/Topup"));
const Withdraw = lazy(() => import("./pages/Withdraw"));

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

// Simple fallback shown while a chunk loads
function PageLoader() {
  return (
    <div className="page-loader" style={{ padding: "2rem", textAlign: "center" }}>
      Loading...
    </div>
  );
}

// Main App Component
function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
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
            <Route path="browse_live_classes" element={<BrowseLiveClasses />} />
            <Route path="live_classes_batch/:id" element={<LiveClassesBatch />} />
            <Route path="examination-boards" element={<Boards />} />
            <Route path="subjects" element={<Subjects />} />
            <Route path="books" element={<Books />} />
            <Route path="past-papers" element={<PastPapers />} />
            <Route path="teachers" element={<Teachers />} />
            <Route path="teacher/:id" element={<Teacher />} />
            <Route path="profile" element={<Profile user={userData} />} />
            <Route path="wallet" element={<Wallet user={userData} />} />
            <Route path="top-up" element={<Topup user={userData} />} />
            <Route path="withdraw" element={<Withdraw user={userData} />} />
          </Route>
        </Routes>
      </Suspense>
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