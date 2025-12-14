// src/auth/Register.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Input from '../components/Input';
import Button from '../components/Button';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (loading) return; // prevent double submit
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
        },
      });

      if (error) throw error;

      /**
       * IMPORTANT:
       * If email confirmation is enabled,
       * user is NOT logged in yet.
       */
      if (!data.session) {
        setSuccess(
          'Registration successful! Please check your email to confirm your account.'
        );
        return;
      }

      // If email confirmation is OFF
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-10">
          <p className="text-sm">Creating your account…</p>
        </div>
      )}

      <h2>Register</h2>

      <form onSubmit={handleRegister} className="space-y-4">
        <Input
          type="email"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          type="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Input
          type="password"
          label="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        {error && <p className="error text-red-600">{error}</p>}
        {success && <p className="text-green-600">{success}</p>}

        <Button type="submit" disabled={loading}>
          {loading ? 'Please wait…' : 'Register'}
        </Button>
      </form>
    </div>
  );
}