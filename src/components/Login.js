import React, { useState } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [loginMode, setLoginMode] = useState(true);
  const navigate = useNavigate(); // ← for redirection

  const handleSubmit = async () => {
    try {
      if (loginMode) {
        await signInWithEmailAndPassword(auth, email, pw);
      } else {
        await createUserWithEmailAndPassword(auth, email, pw);
      }
      // Redirect to dashboard after successful login/signup
      navigate("/"); 
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 400, margin: "50px auto", border: "1px solid #ddd", borderRadius: 8 }}>
      <h2>{loginMode ? "Login" : "Sign Up"}</h2>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ display: "block", marginTop: 10, width: "100%", padding: 8 }}
      />

      <input
        type="password"
        placeholder="Password"
        value={pw}
        onChange={(e) => setPw(e.target.value)}
        style={{ display: "block", marginTop: 10, width: "100%", padding: 8 }}
      />

      <button onClick={handleSubmit} style={{ marginTop: 20, padding: 10, width: "100%", cursor: "pointer", background: "green", color: "white", border: "none" }}>
        {loginMode ? "Login" : "Create Account"}
      </button>

      <p
        style={{ marginTop: 10, cursor: "pointer", color: "blue" }}
        onClick={() => setLoginMode(!loginMode)}
      >
        {loginMode ? "Create new account" : "Already have an account? Login"}
      </p>
    </div>
  );
}
