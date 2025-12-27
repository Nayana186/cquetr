import React, { useEffect, useState } from "react";
import { collection, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function TreeList() {
  const [trees, setTrees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const unsub = onSnapshot(
      collection(db, "trees"),
      (snapshot) => {
        setTrees(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching trees:", error);
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this tree?")) return;

    try {
      await deleteDoc(doc(db, "trees", id));
    } catch (error) {
      console.error("Error deleting tree:", error);
    }
  };

  if (loading) return <p>Loading trees...</p>;

  const totalCO2PerYear = trees.reduce((sum, t) => sum + (t.co2PerYear || 0), 0);
  const totalCO2TillNow = trees.reduce((sum, t) => sum + (t.totalCO2TillNow || 0), 0);

  return (
    <div style={{ padding: 20 }}>
      <h3>All Trees 🌳</h3>
      <p><b>Total CO₂ / year:</b> {totalCO2PerYear} kg</p>
      <p><b>Total CO₂ till now:</b> {totalCO2TillNow} kg</p>

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
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            {t.imageUrl && (
              <img
                src={t.imageUrl}
                alt={t.species}
                style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 5 }}
              />
            )}

            <div>
              <p>🌱 <b>{t.species}</b></p>
              <p>Age: {t.age} years</p>
              <p>CO₂ / year: {t.co2PerYear} kg</p>
              <p>Total CO₂: {t.totalCO2TillNow} kg</p>

              <button
                onClick={() => handleDelete(t.id)}
                style={{
                  marginTop: 5,
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
          </div>
        ))
      )}
    </div>
  );
}
