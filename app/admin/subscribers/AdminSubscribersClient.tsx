"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminNav } from "@/components/admin/AdminNav";

interface Subscriber {
  id: string;
  email: string;
  source: string;
  pageUrl?: string;
  synced: boolean;
  createdAt: string;
  updatedAt: string;
}

export function AdminSubscribersClient() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "synced">("all");
  const [isLoading, setIsLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const router = useRouter();

  const fetchSubscribers = async () => {
    try {
      const response = await fetch("/api/admin/subscribers", { credentials: "same-origin" });
      if (response.status === 401) {
        router.push("/admin");
        return;
      }
      const data = await response.json();
      setSubscribers(data.subscribers || []);
    } catch (error) {
      console.error("Failed to fetch subscribers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, [router]);

  const filtered = useMemo(() => {
    if (filter === "pending") return subscribers.filter((s) => !s.synced);
    if (filter === "synced") return subscribers.filter((s) => s.synced);
    return subscribers;
  }, [subscribers, filter]);

  const pendingCount = subscribers.filter((s) => !s.synced).length;

  const handleToggleSynced = async (subscriber: Subscriber) => {
    setBusyId(subscriber.id);
    try {
      const response = await fetch(`/api/admin/subscribers?id=${subscriber.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ synced: !subscriber.synced }),
      });
      if (response.ok) {
        const data = await response.json();
        setSubscribers((current) =>
          current.map((s) => (s.id === subscriber.id ? data.subscriber : s))
        );
      }
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this captured email?")) return;
    setBusyId(id);
    try {
      const response = await fetch(`/api/admin/subscribers?id=${id}`, {
        method: "DELETE",
        credentials: "same-origin",
      });
      if (response.ok) {
        setSubscribers((current) => current.filter((s) => s.id !== id));
      }
    } finally {
      setBusyId(null);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
    router.refresh();
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdminNav />

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200 px-6 py-4 flex flex-wrap gap-4 justify-between items-center">
            <div>
              <h1 className="text-2xl font-serif font-bold text-gray-900">Subscribers</h1>
              <p className="text-sm text-gray-600 mt-1">
                Emails captured from newsletter forms. Synced means successfully sent to Kit.
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Logout
            </button>
          </div>

          <div className="p-6 space-y-4">
            <div className="flex flex-wrap gap-3 items-center">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as "all" | "pending" | "synced")}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">All ({subscribers.length})</option>
                <option value="pending">Pending Kit ({pendingCount})</option>
                <option value="synced">Synced to Kit</option>
              </select>
              {pendingCount > 0 && (
                <span className="text-sm text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-lg">
                  {pendingCount} pending manual add
                </span>
              )}
            </div>

            {isLoading ? (
              <div className="text-center py-12 text-gray-500">Loading subscribers…</div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg">
                No captured emails yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 text-left text-gray-600">
                      <th className="py-3 pr-4 font-medium">Email</th>
                      <th className="py-3 pr-4 font-medium">Source</th>
                      <th className="py-3 pr-4 font-medium">Captured</th>
                      <th className="py-3 pr-4 font-medium">Status</th>
                      <th className="py-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((subscriber) => (
                      <tr key={subscriber.id} className="border-b border-gray-100">
                        <td className="py-3 pr-4 font-medium text-gray-900">{subscriber.email}</td>
                        <td className="py-3 pr-4 text-gray-600">{subscriber.source}</td>
                        <td className="py-3 pr-4 whitespace-nowrap text-gray-500">
                          {formatDate(subscriber.updatedAt)}
                        </td>
                        <td className="py-3 pr-4">
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              subscriber.synced
                                ? "bg-green-100 text-green-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {subscriber.synced ? "Synced" : "Pending"}
                          </span>
                        </td>
                        <td className="py-3 whitespace-nowrap space-x-2">
                          <button
                            type="button"
                            disabled={busyId === subscriber.id}
                            onClick={() => handleToggleSynced(subscriber)}
                            className="text-blue-600 hover:text-blue-800 disabled:opacity-50"
                          >
                            {subscriber.synced ? "Mark pending" : "Mark synced"}
                          </button>
                          <button
                            type="button"
                            disabled={busyId === subscriber.id}
                            onClick={() => handleDelete(subscriber.id)}
                            className="text-red-600 hover:text-red-800 disabled:opacity-50"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
