// src/auth/EmailVerified.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

export default function EmailVerified() {
  const navigate = useNavigate();

  useEffect(() => {
    // Clean up any stored unverified email
    localStorage.removeItem("unverifiedEmail");
  }, []);

  return (
    <div className="max-w-md mx-auto mt-20 text-center">
      <h2 className="text-2xl font-bold text-green-600">
        Email Verified 🎉
      </h2>

      <p className="mt-3 text-gray-700">
        Your email has been successfully verified. You can now sign in.
      </p>

      <div className="mt-6">
        <Button onClick={() => navigate("/login")}>
          Proceed to Login
        </Button>
      </div>
    </div>
  );
}
