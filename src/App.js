import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./AuthProvider";
import AddTree from "./components/AddTree";
import TreeList from "./components/TreeList";
import AuthPage from "./components/Login"; // Login / Signup page
import { signOut } from "firebase/auth";
import { auth } from "./firebase";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);      // Sign out from Firebase
    navigate("/login");       // Redirect to login page
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: 30, position: "relative" }}>
      <h1 style={{ textAlign: "center" }}>🌿 CQuester Prototype</h1>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          padding: "5px 10px",
          cursor: "pointer",
          background: "red",
          color: "white",
          border: "none",
          borderRadius: 4,
        }}
      >
        Logout
      </button>

      <div
        style={{
          display: "flex",
          gap: "40px",
          marginTop: "40px",
        }}
      >
        {/* LEFT SIDE - Add Tree */}
        <div style={{ flex: 1 }}>
          <AddTree />
        </div>

        {/* RIGHT SIDE - Tree List */}
        <div style={{ flex: 2 }}>
          <TreeList />
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<AuthPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
