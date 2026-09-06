import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

export default function TwoFactorSetupPage() {
  const navigate = useNavigate();
  const [qrCode, setQrCode] = useState(null);
  const [secret, setSecret] = useState(null);
  const [totpCode, setTotpCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const startSetup = async () => {
    setError("");
    try {
      const { data } = await api.post("/auth/2fa/setup");
      setQrCode(data.qrCode);
      setSecret(data.secret);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to start 2FA setup");
    }
  };

  const confirmSetup = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/auth/2fa/verify", { totpCode });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid code");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 p-4">
      <Card>
        <h1 className="text-xl font-bold mb-4 dark:text-white">Enable two-factor authentication</h1>
        {success ? (
          <div className="flex flex-col gap-3 w-72">
            <p className="dark:text-gray-200">2FA is now enabled on your account.</p>
            <Button onClick={() => navigate("/")}>Back to dashboard</Button>
          </div>
        ) : !qrCode ? (
          <div className="flex flex-col gap-3 w-72">
            <p className="text-sm dark:text-gray-300">
              Scan a QR code with your authenticator app to get started.
            </p>
            <Button onClick={startSetup}>Start setup</Button>
          </div>
        ) : (
          <form onSubmit={confirmSetup} className="flex flex-col gap-3 w-72">
            <img src={qrCode} alt="2FA QR code" className="mx-auto" />
            <p className="text-xs break-all dark:text-gray-400">Manual entry key: {secret}</p>
            <Input
              type="text"
              placeholder="Enter the 6-digit code"
              value={totpCode}
              onChange={(e) => setTotpCode(e.target.value)}
              required
              autoFocus
            />
            <Button type="submit">Confirm</Button>
          </form>
        )}
        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      </Card>
    </div>
  );
}
