import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [needsTotp, setNeedsTotp] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password, needsTotp ? totpCode : undefined);
      navigate("/");
    } catch (err) {
      const data = err.response?.data;
      if (data?.totpRequired) {
        setNeedsTotp(true);
        setError(data.message);
      } else {
        setError(data?.message || "Login failed");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 p-4">
      <Card>
        <h1 className="text-xl font-bold mb-4 dark:text-white">Log in</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-72">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={needsTotp}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={needsTotp}
          />
          {needsTotp && (
            <Input
              type="text"
              placeholder="6-digit authenticator code"
              value={totpCode}
              onChange={(e) => setTotpCode(e.target.value)}
              required
              autoFocus
            />
          )}
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <Button type="submit" disabled={submitting}>
            {needsTotp ? "Verify" : "Log in"}
          </Button>
        </form>
        <p className="mt-4 text-sm dark:text-gray-300">
          No account? <Link to="/register" className="text-primary-500">Register</Link>
        </p>
      </Card>
    </div>
  );
}
