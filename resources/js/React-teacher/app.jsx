import React, { Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorBoundary from "@/components/ErrorBoundary";
import "@/app.css";

import MainLayout from "./layouts/MainLayout";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Profile = lazy(() => import("./pages/Profile"));
const Wallet = lazy(() => import("./pages/Wallet"));
const LiveClassBatches = lazy(() => import("./pages/LiveClassBatches"));
const LiveClassesBatch = lazy(() => import("./pages/LiveClassesBatch"));
const LiveClass = lazy(() => import("./pages/LiveClass"));

const el = document.getElementById("app");

let userData = window.authUser || null;
if (!userData) {
  try {
    userData = el?.dataset?.user ? JSON.parse(el.dataset.user) : null;
  } catch (err) {
    console.error("Failed to parse user data:", err);
  }
}

function PageLoader() {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      Loading...
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={<MainLayout user={userData} />}>
            <Route path="/teacher/dashboard" element={<Dashboard />} />
            <Route path="/teacher/profile" element={<Profile />} />
            <Route path="/teacher/wallet" element={<Wallet />} />
            <Route path="/teacher/:board/:grade/batches" element={<LiveClassBatches />} />
            <Route path="/teacher/live-class-batch/:id" element={<LiveClassesBatch />} />
            <Route path="/teacher/live-class/:id" element={<LiveClass />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

if (el) {
  createRoot(el).render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
} else {
  console.error("Root element with id='app' not found in HTML.");
}