import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";

export default function Leaderboard() {
  const [trees, setTrees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopTrees = async () => {
      try {
        const treesRef = collection(db, "trees");
        const q = query(treesRef, orderBy("totalCO2TillNow", "desc"), limit(10));
        const snapshot = await getDocs(q);
        const topTrees = snapshot.docs.map(doc => doc.data());
        setTrees(topTrees);
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopTrees();
  }, []);

  if (loading) return <p>Loading leaderboard...</p>;

  return (
    <div style={{ padding: 20, maxWidth: 600 }}>
      <h2>Leaderboard - Top Trees by CO₂ Absorbed</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>Species</th>
            <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>Age (yrs)</th>
            <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>CO₂ Absorbed</th>
            <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>Image</th>
          </tr>
        </thead>
        <tbody>
          {trees.map((tree, index) => (
            <tr key={index}>
              <td>{tree.species}</td>
              <td>{tree.age}</td>
              <td>{tree.totalCO2TillNow} kg</td>
              <td>
                {tree.imageUrl && (
                  <img src={tree.imageUrl} alt={tree.species} width={50} height={50} style={{ borderRadius: 5 }} />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
