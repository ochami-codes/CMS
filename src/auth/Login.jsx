import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import Input from "../components/Input";
import Button from "../components/Button";
import {useAuth} from "../hooks/useAuth";

export default function Login() {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error: supaError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (supaError) {
        setError(supaError.message);
      } else {
        setUser(data.user);
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto", paddingTop: "4rem" }}>
      <h2>Login</h2>
      <p style={{ color: "#555", marginBottom: "1rem" }}>Enter your account details.</p>

      <form onSubmit={handleSubmit}>
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />

        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="********"
          required
        />

        {error && <p style={{ color: "red", marginBottom: "12px" }}>{error}</p>}

        <Button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>
      </form>

      <div style={{ marginTop: "1rem", display: "flex", justifyContent: "space-between" }}>
        <Button
          type="button"
          onClick={() => navigate("/reset-password")}
          style={{ background: "#555" }}
        >
          Forgot Password?
        </Button>

        <Button
          type="button"
          onClick={() => navigate("/register")}
          style={{ background: "#555" }}
        >
          Register
        </Button>
      </div>
    </div>
  );
}
