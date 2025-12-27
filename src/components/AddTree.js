import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function AddTree() {
  const [species, setSpecies] = useState("");
  const [age, setAge] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [organ, setOrgan] = useState("leaf");
  const [loading, setLoading] = useState(false);
  const [speciesOptions, setSpeciesOptions] = useState([]);
  const [message, setMessage] = useState("");

  const speciesCO2 = {
    Neem: 22,
    Mango: 30,
    Teak: 50,
    Bamboo: 12,
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  // Replace Firebase Storage with Cloudinary
  const uploadImageToCloudinary = async (file) => {
    const url = "https://api.cloudinary.com/v1_1/dhl70c7m2/upload";
    const preset = "vuddza3n";

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", preset);

    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    return data.secure_url;
  };

  const identifyPlant = async (file) => {
    const formData = new FormData();
    formData.append("organs", organ);
    formData.append("images", file);

    try {
      const response = await fetch("http://localhost:3000/plantnet", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (data && data.results && data.results.length > 0) {
        setSpeciesOptions(data.results.map((r) => r.species.scientificName));
        return data.bestMatch || "Unknown";
      } else {
        return "Unknown";
      }
    } catch (err) {
      console.error("Proxy API error:", err);
      return "Unknown";
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setLoading(true);
    setMessage("Identifying species...");

    const guessedSpecies = await identifyPlant(file);

    if (guessedSpecies === "Unknown") {
      setSpecies("");
      setMessage("Could not identify species automatically. Please select manually.");
    } else {
      setSpecies(guessedSpecies);
      setMessage(`Species guessed: ${guessedSpecies}`);
    }

    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!species || !age || !imageFile) {
      setMessage("Please provide species, age, and an image");
      return;
    }

    setLoading(true);
    setMessage("Uploading tree...");

    try {
      const imageUrl = await uploadImageToCloudinary(imageFile);
      const co2PerYear = speciesCO2[species] || 10;
      const totalCO2TillNow = co2PerYear * Number(age);

      await addDoc(collection(db, "trees"), {
        species,
        age: Number(age),
        co2PerYear,
        totalCO2TillNow,
        imageUrl,
        createdAt: serverTimestamp(),
      });

      setMessage("Tree added successfully 🌱");
      setSpecies("");
      setAge("");
      setImageFile(null);
      setSpeciesOptions([]);
    } catch (err) {
      console.error("Error adding tree:", err);
      setMessage("Failed to add tree");
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: 20, border: "1px solid #ccc", width: 400, marginTop: 20, borderRadius: 5 }}>
      <h2>Add a Tree</h2>
      {message && <p style={{ color: message.includes("Failed") ? "red" : "green" }}>{message}</p>}

      <form onSubmit={handleSubmit}>
        <label>Upload leaf/tree photo:</label>
        <br />
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        {imageFile && <p>Selected file: {imageFile.name}</p>}

        <br />

        <label>Select organ type:</label>
        <br />
        <select value={organ} onChange={(e) => setOrgan(e.target.value)}>
          <option value="leaf">Leaf</option>
          <option value="flower">Flower</option>
          <option value="fruit">Fruit</option>
        </select>

        <br /><br />

        <label>Species:</label>
        <br />
        {speciesOptions.length > 0 ? (
          <select value={species} onChange={(e) => setSpecies(e.target.value)} required>
            <option value="">Select species manually</option>
            {speciesOptions.map((s, i) => (
              <option key={i} value={s}>{s}</option>
            ))}
          </select>
        ) : (
          <input type="text" value={species} readOnly style={{ backgroundColor: "#eee", width: "100%" }} />
        )}

        <br /><br />

        <label>Age (years):</label>
        <br />
        <input type="number" min="1" value={age} onChange={(e) => setAge(e.target.value)} required />

        <br /><br />

        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Add Tree"}
        </button>
      </form>
    </div>
  );
}
