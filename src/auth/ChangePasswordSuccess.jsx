import { useAuth } from "../context/AuthContext";
import EncouragementRedirect from "../components/EncouragementRedirect";

export default function ChangePasswordSuccess() {
  const { logout } = useAuth();

  return (
    <EncouragementRedirect
      title="Password updated 🔐"
      message="Your password has been changed successfully. You’ll be signed out shortly."
      redirectTo="/login"
      delay={8000} // show message 8s
      onComplete={async () => {
        await logout(); // logout after encouragement
      }}
    />
  );
}
