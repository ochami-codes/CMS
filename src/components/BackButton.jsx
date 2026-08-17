import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import styles from "../styles/components/BackButton.module.css";

export default function BackButton({
  label = "Back",
  fallback = "/dashboard",
  className = "",
}) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(fallback, {
        replace: true,
      });
    }
  };

  return (
    <button
      type="button"
      className={`${styles.button} ${className}`}
      onClick={handleBack}
    >
      <ArrowLeft size={18} />
      <span>{label}</span>
    </button>
  );
}