import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../utils/api";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

const formatDate = (iso) =>
  new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });

export default function ReservationsPage() {
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [properties, setProperties] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [resReservations, resProperties] = await Promise.all([
        api.get("/reservations"),
        api.get("/properties"),
      ]);
      setReservations(resReservations.data);
      setProperties(Object.fromEntries(resProperties.data.map((p) => [p.id, p])));
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load reservations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCancel = async (id) => {
    setCancellingId(id);
    try {
      await api.delete(`/reservations/${id}`);
      setReservations((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      setError(err.response?.data?.error || "Failed to cancel reservation");
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold dark:text-white">My reservations</h1>
        <Link to="/">
          <Button variant="ghost">Back to dashboard</Button>
        </Link>
      </div>

      {loading && <p className="dark:text-gray-300">Loading...</p>}
      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reservations.map((reservation) => {
          const property = properties[reservation.propertyId];
          const isMine = reservation.guestId === user?.id;
          return (
            <Card key={reservation.id}>
              <span className="text-xs font-semibold uppercase tracking-wide text-primary-500">
                {isMine ? "Your booking" : "Booking on your listing"}
              </span>
              <h2 className="font-semibold text-lg mt-1 dark:text-white">
                {property?.name || `Listing #${reservation.propertyId}`}
              </h2>
              {property && (
                <p className="text-sm text-gray-600 dark:text-gray-300">{property.location}</p>
              )}
              <p className="mt-2 text-sm dark:text-gray-200">
                {formatDate(reservation.startDate)} &rarr; {formatDate(reservation.endDate)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {reservation.duration}h
              </p>
              <div className="mt-3">
                <Button
                  variant="ghost"
                  onClick={() => handleCancel(reservation.id)}
                  disabled={cancellingId === reservation.id}
                >
                  Cancel
                </Button>
              </div>
            </Card>
          );
        })}
        {!loading && reservations.length === 0 && (
          <p className="dark:text-gray-300">No reservations yet.</p>
        )}
      </div>
    </div>
  );
}
