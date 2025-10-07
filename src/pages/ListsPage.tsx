import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { LiaShoppingCartSolid } from "react-icons/lia";
import { useDispatch, useSelector } from "react-redux";
import { fetchItems } from "../features/ItemsSlice";
import type { RootState, AppDispatch } from "../../store";
import { fetchLists, createList, updateList, deleteList } from "../features/ListsSlice";

export default function ListsPage() {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") ?? "";
  const sort = params.get("sort") ?? "date_desc";
  const selectedListIdParam = params.get("list") ?? "";

  const dispatch = useDispatch<AppDispatch>();
  const { items, status, error } = useSelector((s: RootState) => s.items);
  const listsState = useSelector((s: RootState) => s.lists);

  // currentUser from localStorage
  const currentUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("currentUser") || "null");
    } catch {
      return null;
    }
  }, []);
  const userId = currentUser?.id;

  // Fetch lists for the current user
  useEffect(() => {
    if (!userId) return;
    dispatch(fetchLists({ userId }));
  }, [dispatch, userId]);

  // Fetch items filtered by listId and current params
  useEffect(() => {
    const listId = selectedListIdParam || undefined;
    dispatch(fetchItems({ q, sort, listId }));
  }, [dispatch, q, sort, selectedListIdParam]);

  // Categories state and CRUD (optional taxonomy separate from lists)
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [selectedCatId, setSelectedCatId] = useState<string | null>(null);
  const [catName, setCatName] = useState("");
  const [editingCatId, setEditingCatId] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:3001/categories")
      .then((r) => r.json())
      .then((data: { id: string; name: string }[]) => {
        setCategories(data);
        if (data.length && !selectedCatId) setSelectedCatId(data[0].id);
      })
      .catch(() => setCategories([]));
  }, []);

  const filteredItems = useMemo(() => {
    if (!selectedCatId) return items;
    const name = categories.find((c) => c.id === selectedCatId)?.name;
    return name ? items.filter((i) => i.category === name) : items;
  }, [items, categories, selectedCatId]);

  const addCategory = async () => {
    const name = catName.trim();
    if (!name) return;
    if (categories.some((c) => c.name.toLowerCase() === name.toLowerCase())) return;
    const res = await fetch("http://localhost:3001/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (res.ok) {
      const created = (await res.json()) as { id: string; name: string };
      setCategories((prev) => [created, ...prev]);
      setCatName("");
      setSelectedCatId(created.id);
    }
  };

  const startEditCategory = (c: { id: string; name: string }) => {
    setEditingCatId(c.id);
    setCatName(c.name);
  };

  const saveCategory = async () => {
    if (!editingCatId) return;
    const name = catName.trim();
    if (!name) return;
    const res = await fetch(`http://localhost:3001/categories/${editingCatId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editingCatId, name }),
    });
    if (res.ok) {
      setCategories((prev) => prev.map((c) => (c.id === editingCatId ? { ...c, name } : c)));
      setEditingCatId(null);
      setCatName("");
    }
  };

  const deleteCategory = async (id: string) => {
    await fetch(`http://localhost:3001/categories/${id}`, { method: "DELETE" });
    setCategories((prev) => prev.filter((c) => c.id !== id));
    if (selectedCatId === id) setSelectedCatId(null);
  };

  // Items CRUD state and handlers (per selected category)
  const [itemForm, setItemForm] = useState<{ name: string; price: string; image?: string }>({ name: "", price: "", image: "" });
  const [itemEditingId, setItemEditingId] = useState<string | null>(null);

  const addItem = async () => {
    const catName = categories.find((c) => c.id === selectedCatId)?.name;
    if (!catName) return;
    const name = itemForm.name.trim();
    const price = Number(itemForm.price);
    if (!name || isNaN(price)) return;
    const payload = {
      name,
      price,
      category: catName,
      image: itemForm.image || 'https://via.placeholder.com/300x200?text=Image',
      createdAt: new Date().toISOString(),
      listId: selectedListIdParam || undefined,
    };
    const res = await fetch('http://localhost:3001/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const created = await res.json();
      // No dispatch available here; just optimistic update
      // Items slice will refresh when search/sort changes, but we update UI immediately
      // Because items live in Redux, we cannot directly set them; rely on current view using filteredItems only
      // Simpler: trigger a refetch by nudging search params
      setParams((p) => {
        const next = new URLSearchParams(p);
        next.set('q', q);
        next.set('sort', sort);
        return next;
      });
      setItemForm({ name: '', price: '', image: '' });
    }
  };

  const startEditItem = (p: { id: string; name: string; price: number; image?: string }) => {
    setItemEditingId(String(p.id));
    setItemForm({ name: p.name, price: String(p.price ?? 0), image: p.image || '' });
  };

  const saveItem = async () => {
    if (!itemEditingId) return;
    const name = itemForm.name.trim();
    const price = Number(itemForm.price);
    if (!name || isNaN(price)) return;
    const res = await fetch(`http://localhost:3001/items/${itemEditingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, price, image: itemForm.image }),
    });
    if (res.ok) {
      setItemEditingId(null);
      setItemForm({ name: '', price: '', image: '' });
      // trigger refetch
      setParams((p) => {
        const next = new URLSearchParams(p);
        next.set('q', q);
        next.set('sort', sort);
        return next;
      });
    }
  };

  const deleteItem = async (id: string | number) => {
    await fetch(`http://localhost:3001/items/${id}`, { method: 'DELETE' });
    // trigger refetch
    setParams((p) => {
      const next = new URLSearchParams(p);
      next.set('q', q);
      next.set('sort', sort);
      return next;
    });
  };

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setParams((p) => {
      const next = new URLSearchParams(p);
      next.set("q", val);
      next.set("sort", sort);
      return next;
    });
  };

  const onSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setParams((p) => {
      const next = new URLSearchParams(p);
      next.set("q", q);
      next.set("sort", val);
      return next;
    });
  };

  // Local state for list creation/editing
  const [newListName, setNewListName] = useState("");
  const [editingListId, setEditingListId] = useState<string | number | null>(null);
  const [editingListName, setEditingListName] = useState("");

  const selectList = (id: string | number) => {
    setParams((p) => {
      const next = new URLSearchParams(p);
      next.set("list", String(id));
      next.set("q", q);
      next.set("sort", sort);
      return next;
    });
  };

  const onCreateList = async () => {
    if (!userId) return;
    const name = newListName.trim();
    if (!name) return;
    await dispatch(createList({ userId, name }));
    setNewListName("");
  };

  const onStartEditList = (id: string | number, name: string) => {
    setEditingListId(id);
    setEditingListName(name);
  };

  const onSaveList = async () => {
    if (!editingListId || !userId) return;
    const name = editingListName.trim();
    if (!name) return;
    await dispatch(updateList({ id: editingListId, name, userId }));
    setEditingListId(null);
    setEditingListName("");
  };

  const onDeleteList = async (id: string | number) => {
    await dispatch(deleteList({ id }));
    // If the deleted list was selected, clear selection
    if (String(selectedListIdParam) === String(id)) {
      setParams((p) => {
        const next = new URLSearchParams(p);
        next.delete("list");
        next.set("q", q);
        next.set("sort", sort);
        return next;
      });
    }
  };

  return (
    <div className="listsLayout">
      {/* Left Sidebar */}
      <aside className="listsSidebar">
        <button className="hamburger" aria-label="menu">≡</button>
        <nav className="listsNav">
          <Link className="listsNavItem active" to="/lists">Home</Link>
          <Link className="listsNavItem" to="/categories">Categories</Link>
          <Link className="listsNavItem" to="/cart">Cart</Link>
          <Link className="listsNavItem" to="/favourites">Favorites</Link>
          <Link className="listsNavItem" to="/settings">Settings</Link>
        </nav>
        <div className="categoriesManager">
          <h4 style={{ marginTop: 12 }}>Your Shopping Lists</h4>
          <div className="row" style={{ gap: 6 }}>
            <input
              placeholder="New list name"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
            />
            <button onClick={onCreateList} disabled={!newListName.trim() || !userId}>Create</button>
          </div>
          <ul className="list">
            {listsState.items.map((l) => (
              <li key={l.id} className={String(selectedListIdParam) === String(l.id) ? "active" : ""}>
                {editingListId === l.id ? (
                  <>
                    <input value={editingListName} onChange={(e) => setEditingListName(e.target.value)} />
                    <span style={{ marginLeft: 6 }}>
                      <button onClick={onSaveList}>Save</button>
                      <button onClick={() => { setEditingListId(null); setEditingListName(""); }}>Cancel</button>
                    </span>
                  </>
                ) : (
                  <>
                    <button className="link" onClick={() => selectList(l.id)}>{l.name}</button>
                    <span style={{ marginLeft: 6 }}>
                      <button onClick={() => onStartEditList(l.id, l.name)}>Edit</button>
                      <button onClick={() => onDeleteList(l.id)}>Delete</button>
                    </span>
                  </>
                )}
              </li>
            ))}
          </ul>

          <h4 style={{ marginTop: 16 }}>Categories</h4>
          <div className="row" style={{ gap: 6 }}>
            <input
              placeholder={editingCatId ? "Edit category" : "New category"}
              value={catName}
              onChange={(e) => setCatName(e.target.value)}
            />
            {editingCatId ? (
              <>
                <button onClick={saveCategory}>Save</button>
                <button onClick={() => { setEditingCatId(null); setCatName(""); }}>Cancel</button>
              </>
            ) : (
              <button onClick={addCategory}>Add</button>
            )}
          </div>
          <ul className="list">
            {categories.map((c) => (
              <li key={c.id} className={selectedCatId === c.id ? "active" : ""}>
                <button className="link" onClick={() => setSelectedCatId(c.id)}>{c.name}</button>
                <span style={{ marginLeft: 6 }}>
                  <button onClick={() => startEditCategory(c)}>Edit</button>
                  <button onClick={() => deleteCategory(c.id)}>Delete</button>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Main Content */}
      <section className="listsContent">
        <header className="listsHeader">
          <div className="searchBox">
            <span className="searchIcon">🔍</span>
            <input
              type="search"
              placeholder="Search"
              value={q}
              onChange={onSearch}
              aria-label="Search products"
            />
          </div>
          <select className="sortSelect" value={sort} onChange={onSort} aria-label="Sort">
            <option value="date_desc">Date Descending</option>
            <option value="name_asc">Name A–Z</option>
            <option value="name_desc">Name Z–A</option>
            <option value="category">Category</option>
          </select>
          <div className="userChip">
            <span className="userNotif">🔔</span>
            <span className="userNotif">✉️</span>
            <span className="userName">{currentUser?.fullName || "User"}</span>
            <img className="userAvatar" src="https://i.pravatar.cc/40" alt="avatar" />
          </div>
        </header>

        <div className="bannerCard">
          <div className="bannerLeft">
            <LiaShoppingCartSolid size={62} />
            <div>
              <h3>Coffee at home</h3>
              <p>Discover your favorite flavors.</p>
            </div>
          </div>
          <img className="bannerImg" src="https://via.placeholder.com/420x140?text=Banner" alt="banner" />
        </div>

        {/* Item form (adds to selected category) */}
        <div className="row" style={{ gap: 8, margin: '12px 0' }}>
          <input placeholder="Item name" value={itemForm.name} onChange={(e) => setItemForm((p) => ({ ...p, name: e.target.value }))} />
          <input placeholder="Price" value={itemForm.price} onChange={(e) => setItemForm((p) => ({ ...p, price: e.target.value }))} />
          <input placeholder="Image URL (optional)" value={itemForm.image} onChange={(e) => setItemForm((p) => ({ ...p, image: e.target.value }))} />
          {itemEditingId ? (
            <>
              <button onClick={saveItem} disabled={!selectedCatId}>Save</button>
              <button onClick={() => { setItemEditingId(null); setItemForm({ name: '', price: '', image: '' }); }}>Cancel</button>
            </>
          ) : (
            <button onClick={addItem} disabled={!selectedCatId || !selectedListIdParam}>Add Item</button>
          )}
        </div>

        <h2 className="sectionTitle">Featured Products</h2>
        {status === 'loading' && <p>Loading...</p>}
        {status === 'failed' && <p className="error">{error || 'Failed to load items'}</p>}
        {status !== 'loading' && (
          <div className="cardsGrid">
            {filteredItems.map((p) => (
              <div className="productCard" key={p.id}>
                <img src={p.image || 'https://via.placeholder.com/300x200?text=Image'} alt={p.name} />
                <div className="productInfo">
                  <h4>{p.name}</h4>
                  <p className="price">${(p.price ?? 0).toFixed(2)}</p>
                </div>
                <div className="row" style={{ gap: 6 }}>
                  <button className="addBtn" onClick={() => startEditItem(p as any)}>Edit</button>
                  <button className="addBtn" onClick={() => deleteItem(p.id as any)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Right Widgets */}
      <aside className="listsWidgets">
        <div className="widget">
          <h3>Past Orders</h3>
          {[1,2].map((i) => (
            <div className="orderRow" key={i}>
              <img src="https://via.placeholder.com/44" alt="order" />
              <div className="orderMeta">
                <strong>Starbuck Coffee</strong>
                <span>$20.00</span>
                <small>12 Jun, 2019</small>
              </div>
            </div>
          ))}
        </div>
        <div className="widget">
          <h3>Latest Release</h3>
          <img className="latestImg" src="https://via.placeholder.com/280x140?text=Latte" alt="latest" />
          <div className="latestMeta">
            <strong>Starbuck Coffee</strong>
            <p>Pure Ghana based coco coffee with roasting</p>
            <div className="latestFooter">
              <span>$20.00</span>
              <button className="addBtn">+</button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
