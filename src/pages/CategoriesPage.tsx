import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function CategoriesPage() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentUser = useMemo(() => {
    try { return JSON.parse(localStorage.getItem("currentUser") || "null"); } catch { return null; }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:3001/categories")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load categories");
        return r.json();
      })
      .then((data) => setCategories(data))
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const createCategory = async () => {
    const n = name.trim();
    if (!n) return;
    if (categories.some((c) => c.name.toLowerCase() === n.toLowerCase())) return;
    const res = await fetch("http://localhost:3001/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: n })
    });
    if (!res.ok) return;
    const created = await res.json();
    setCategories((prev) => [created, ...prev]);
    setName("");
  };

  const startEdit = (c: { id: string; name: string }) => {
    setEditingId(c.id);
    setEditingName(c.name);
  };

  const saveEdit = async () => {
    if (!editingId) return;
    const n = editingName.trim();
    if (!n) return;
    const res = await fetch(`http://localhost:3001/categories/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editingId, name: n })
    });
    if (!res.ok) return;
    setCategories((prev) => prev.map((c) => (c.id === editingId ? { ...c, name: n } : c)));
    setEditingId(null);
    setEditingName("");
  };

  const removeCategory = async (id: string) => {
    await fetch(`http://localhost:3001/categories/${id}`, { method: "DELETE" });
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const openInLists = (name: string) => {
    navigate(`/lists?cat=${encodeURIComponent(name)}`);
  };

  return (
    <div className="categoriesPage pageSection">
      <h2 className="sectionTitle">Categories</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      <div className="card padded" style={{ marginBottom: 12 }}>
        <div className="row" style={{ gap: 8 }}>
          <input
            placeholder="New category"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-label="New category name"
          />
          <button className="btn primary" onClick={createCategory} disabled={!name.trim()}>Add</button>
        </div>
      </div>

      <ul className="list card padded">
        {categories.map((c) => (
          <li key={c.id} className="row" style={{ alignItems: 'center', gap: 8, margin: '8px 0' }}>
            {editingId === c.id ? (
              <>
                <input
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  placeholder="Edit category"
                  aria-label="Edit category name"
                />
                <button className="btn primary" onClick={saveEdit}>Save</button>
                <button className="btn" onClick={() => { setEditingId(null); setEditingName(""); }}>Cancel</button>
              </>
            ) : (
              <>
                <button className="link" onClick={() => openInLists(c.name)} aria-label={`Open ${c.name} in lists`}>
                  {c.name}
                </button>
                <button className="btn" onClick={() => startEdit(c)}>Edit</button>
                <button className="btn" onClick={() => removeCategory(c.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
