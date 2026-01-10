// src/auth/Register.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import { API_BASE_URL } from "../config/api";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    confirm_password: "",
    church_name: ""
  });

  const [churches, setChurches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Fetch existing churches
  useEffect(() => {
    let isMounted = true;
    const fetchChurches = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/churches`);
        const data = await res.json();
        if (isMounted && Array.isArray(data)) setChurches(data);
      } catch (err) {
        console.error("Failed to fetch churches:", err);
      }
    };
    fetchChurches();
    return () => { isMounted = false; };
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setMessage("");

    if (!form.full_name || !form.email || !form.password || !form.confirm_password || !form.church_name) {
      setError("All fields are required");
      return;
    }

    if (form.password !== form.confirm_password) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: form.full_name,
          email: form.email,
          password: form.password,
          church_name: form.church_name.trim()
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
      } else {
        setMessage(data.message);
        // Redirect after 3s
        setTimeout(() => navigate("/login"), 3000);
      }

    } catch (err) {
      console.error(err);
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Register</h2>

      {error && <p className="text-red-600 mb-2">{error}</p>}
      {message && <p className="text-green-600 mb-2">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="full_name"
          placeholder="Full Name"
          value={form.full_name}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />

        <input
          name="confirm_password"
          type="password"
          placeholder="Confirm Password"
          value={form.confirm_password}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />

        {/* Church selection / typing */}
        <input
          list="churches"
          name="church_name"
          placeholder="Select or type a church"
          value={form.church_name}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <datalist id="churches">
          {churches.map(c => (
            <option key={c.id} value={c.name} />
          ))}
        </datalist>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Creating account…" : "Register"}
        </button>
      </form>
    </div>
  );
}
