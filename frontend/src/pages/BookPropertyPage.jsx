import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../utils/api";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

export default function BookPropertyPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get(`/properties/${id}`);
        if (!cancelled) setProperty(data);
      } catch (err) {
        if (!cancelled) setLoadError(err.response?.data?.error || "Failed to load listing");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (!(end > start)) {
      setError("End time must be after start time");
      return;
    }
    const duration = Math.round((end - start) / (1000 * 60 * 60));

    setSubmitting(true);
    try {
      await api.post("/reservations", {
        propertyId: Number(id),
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        duration,
      });
      navigate("/reservations");
    } catch (err) {
      const data = err.response?.data;
      setError(data?.errors?.[0]?.msg || data?.error || "Failed to create reservation");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 p-4">
        <Card>
          <p className="text-red-600 text-sm">{loadError}</p>
          <div className="mt-4">
            <Button onClick={() => navigate("/")}>Back to dashboard</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 p-4">
      <Card>
        <h1 className="text-xl font-bold mb-1 dark:text-white">Book this space</h1>
        {property && (
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            {property.name} &middot; {property.location} &middot; £{property.price}/night
          </p>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-80">
          <label className="text-sm dark:text-gray-200">
            Start
            <Input
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </label>
          <label className="text-sm dark:text-gray-200">
            End
            <Input
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </label>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <Button type="submit" disabled={submitting}>
            Request booking
          </Button>
        </form>
        <p className="mt-4 text-sm dark:text-gray-300">
          <Link to="/" className="text-primary-500">Back to dashboard</Link>
        </p>
      </Card>
    </div>
  );
}
