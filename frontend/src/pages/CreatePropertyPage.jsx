import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../utils/api";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

const initialForm = { name: "", description: "", location: "", price: "", availability: true };

export default function CreatePropertyPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isHost = user?.roles?.includes("HOST");

  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isHost) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 p-4">
        <Card>
          <p className="dark:text-gray-200">You need to become a host before creating a listing.</p>
          <div className="mt-4">
            <Button onClick={() => navigate("/")}>Back to dashboard</Button>
          </div>
        </Card>
      </div>
    );
  }

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await api.post("/properties", { ...form, price: parseFloat(form.price) });
      navigate("/");
    } catch (err) {
      const data = err.response?.data;
      setError(data?.errors?.[0]?.msg || data?.error || "Failed to create listing");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 p-4">
      <Card>
        <h1 className="text-xl font-bold mb-4 dark:text-white">New listing</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-80">
          <Input placeholder="Name" value={form.name} onChange={update("name")} required />
          <Input placeholder="Description" value={form.description} onChange={update("description")} required />
          <Input placeholder="Location" value={form.location} onChange={update("location")} required />
          <Input
            type="number"
            placeholder="Price per night"
            value={form.price}
            onChange={update("price")}
            required
            min="0"
            step="0.01"
          />
          <label className="flex items-center gap-2 text-sm dark:text-gray-200">
            <input
              type="checkbox"
              checked={form.availability}
              onChange={(e) => setForm((f) => ({ ...f, availability: e.target.checked }))}
            />
            Available for booking
          </label>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <Button type="submit" disabled={submitting}>
            Create listing
          </Button>
        </form>
      </Card>
    </div>
  );
}
