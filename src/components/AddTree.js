import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

export default function AddTree() {
  const [species, setSpecies] = useState("");
  const [age, setAge] = useState("");

  const speciesCO2 = {
    Neem: 22,
    Mango: 30,
    Teak: 50,
    Bamboo: 12
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const co2PerYear = speciesCO2[species] || 10;

    await addDoc(collection(db, "trees"), {
      species,
      age: Number(age),
      co2PerYear,
      createdAt: new Date(),
    });

    alert("Tree Added!");
    setSpecies("");
    setAge("");
  };

  return (
    <div style={{ padding: 20, border: "1px solid #ccc", width: 300, marginTop: 20 }}>
      <h2>Add a Tree</h2>

      <form onSubmit={handleSubmit}>
        <label>Species:</label><br />
        <select value={species} onChange={(e) => setSpecies(e.target.value)} required>
          <option value="">Select species</option>
          <option value="Neem">Neem</option>
          <option value="Mango">Mango</option>
          <option value="Teak">Teak</option>
          <option value="Bamboo">Bamboo</option>
        </select>

        <br /><br />

        <label>Age (years):</label><br />
        <input 
          type="number" 
          value={age}
          onChange={(e) => setAge(e.target.value)} 
          required 
        />

        <br /><br />
        
        <button type="submit">Add Tree</button>
      </form>
    </div>
  );
}
