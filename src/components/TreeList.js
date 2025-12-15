import React, { useEffect, useState } from "react";
import { collection, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useUser } from "../AuthProvider";
import { useNavigate } from "react-router-dom";

export default function TreeList() {
  const { user } = useUser() || {};
  const navigate = useNavigate();

  const [trees, setTrees] = useState([]);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [loadingTrees, setLoadingTrees] = useState(true);

  // Wait for AuthProvider to finish loading
  useEffect(() => {
    if (user === null) {
      // user is null, redirect to login
      navigate("/login");
    } else if (user) {
      setLoadingAuth(false);
    }
  }, [user, navigate]);

  // Listen to Firestore only if user exists
  useEffect(() => {
    if (!user) return;

    setLoadingTrees(true);
    const unsub = onSnapshot(
      collection(db, "trees"),
      (snapshot) => {
        setTrees(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        setLoadingTrees(false);
      },
      (error) => {
        console.error("Error fetching trees:", error);
        setLoadingTrees(false);
      }
    );

    return () => unsub();
  }, [user]);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "trees", id));
    } catch (error) {
      console.error("Error deleting tree:", error);
    }
  };

  // Show loading until auth and trees are ready
  if (loadingAuth || loadingTrees) {
    return <p>Loading...</p>;
  }

  const totalCO2 = trees.reduce((sum, t) => sum + (t.co2PerYear || 0), 0);

  return (
    <div style={{ padding: 20 }}>
      <h3>Your Trees</h3>
      <p>
        <b>Total CO₂ Offset per year:</b> {totalCO2} kg
      </p>

      {trees.length === 0 ? (
        <p>No trees added yet.</p>
      ) : (
        trees.map((t) => (
          <div
            key={t.id}
            style={{
              border: "1px solid #ddd",
              marginTop: 10,
              padding: 10,
              borderRadius: 5,
            }}
          >
            <p>
              🌱 <b>{t.species}</b>
            </p>
            <p>Age: {t.age} years</p>
            <p>CO₂ per year: {t.co2PerYear || 0} kg</p>

            <button
              onClick={() => handleDelete(t.id)}
              style={{
                marginTop: 10,
                background: "red",
                color: "white",
                border: "none",
                padding: "5px 10px",
                cursor: "pointer",
                borderRadius: 3,
              }}
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}
