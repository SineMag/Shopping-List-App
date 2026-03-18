import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../lib/api";

export default function CategoriesPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(apiUrl("/categories"))
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load categories");
        return r.json();
      })
      .then((data) => setCategories(data))
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const openInLists = (name: string) => {
    navigate(`/lists?cat=${encodeURIComponent(name)}`);
  };

  return (
    <div className="categoriesPage pageSection">
      <div className="categoriesHeader">
        <h2 className="sectionTitle">Browse Categories</h2>
        <p className="categoriesSubtitle">Select a category to explore items</p>
      </div>
      
      {loading && <p className="loading">Loading categories...</p>}
      {error && <p className="error">{error}</p>}

      <div className="categoriesGrid">
        {categories.map((c) => (
          <div 
            key={c.id} 
            className="categoryCard"
            onClick={() => openInLists(c.name)}
            role="button"
            tabIndex={0}
            aria-label={`Browse ${c.name} items`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openInLists(c.name);
              }
            }}
          >
            <div className="categoryCardIcon">
              {c.name.charAt(0).toUpperCase()}
            </div>
            <h3 className="categoryCardTitle">{c.name}</h3>
            <p className="categoryCardSubtext">View items →</p>
          </div>
        ))}
      </div>
    </div>
  );
}
