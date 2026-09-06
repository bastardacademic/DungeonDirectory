import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../utils/api";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import ColorSchemeToggle from "../components/ui/ColorSchemeToggle";

export default function DashboardPage() {
  const { user, logout, upgradeToHost } = useAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [upgradeError, setUpgradeError] = useState("");

  const isHost = user?.roles?.includes("HOST");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get("/properties");
        if (!cancelled) setProperties(data);
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.error || "Failed to load listings");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleUpgrade = async () => {
    setUpgradeError("");
    try {
      await upgradeToHost();
    } catch (err) {
      const data = err.response?.data;
      if (data?.requires2FA) {
        navigate("/2fa/setup");
      } else {
        setUpgradeError(data?.message || "Failed to upgrade");
      }
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold dark:text-white">Dungeon Directory</h1>
        <div className="flex items-center gap-2">
          <ColorSchemeToggle />
          {!isHost && (
            <Button variant="ghost" onClick={handleUpgrade}>
              Become a host
            </Button>
          )}
          {isHost && (
            <Link to="/properties/new">
              <Button variant="primary">New listing</Button>
            </Link>
          )}
          <Link to="/reservations">
            <Button variant="ghost">My reservations</Button>
          </Link>
          <Button variant="ghost" onClick={logout}>
            Log out
          </Button>
        </div>
      </div>

      {upgradeError && <p className="text-red-600 text-sm mb-4">{upgradeError}</p>}
      {loading && <p className="dark:text-gray-300">Loading listings...</p>}
      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {properties.map((property) => (
          <Card key={property.id}>
            <h2 className="font-semibold text-lg dark:text-white">{property.name}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">{property.location}</p>
            <p className="mt-2 dark:text-gray-200">{property.description}</p>
            <p className="mt-2 font-medium dark:text-white">£{property.price}/night</p>
            {property.ownerId !== user?.id && (
              <Link to={`/properties/${property.id}/book`} className="inline-block mt-3">
                <Button variant="primary">Book</Button>
              </Link>
            )}
          </Card>
        ))}
        {!loading && properties.length === 0 && (
          <p className="dark:text-gray-300">No listings yet.</p>
        )}
      </div>
    </div>
  );
}
