import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchItems } from "../features/ItemsSlice";
import type { RootState, AppDispatch } from "../../store";
import { fetchLists, createList, updateList, deleteList } from "../features/ListsSlice";

export default function ListsPage() {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") ?? "";
  const sort = params.get("sort") ?? "date_desc";
  const selectedListIdParam = params.get("list") ?? "";
  const catParam = params.get("cat") ?? "";

  const dispatch = useDispatch<AppDispatch>();
  const { items, status, error } = useSelector((s: RootState) => s.items);
  const listsState = useSelector((s: RootState) => s.lists);

  // currentUser from localStorage
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("currentUser") || "null");
    } catch {
      return null;
    }
  });
  const userId = currentUser?.id;
  const [profileImage, setProfileImage] = useState<string>(currentUser?.profileImage || '');

  // Fetch lists for the current user
  useEffect(() => {
    if (!userId) return;
    dispatch(fetchLists({ userId }));
  }, [dispatch, userId]);

  // Categories (developer-managed)
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [selectedCatId, setSelectedCatId] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:3001/categories")
      .then((r) => r.json())
      .then((data: { id: string; name: string }[]) => {
        setCategories(data);
        // If there is a cat param, select that category if found
        if (catParam) {
          const match = data.find((c) => c.name.toLowerCase() === catParam.toLowerCase());
          if (match) setSelectedCatId(match.id);
        } else if (data.length && !selectedCatId) {
          setSelectedCatId(data[0].id);
        }
      })
      .catch(() => setCategories([]));
  }, [catParam]);

  const filteredItems = useMemo(() => {
    // If a specific list is selected, show all its items regardless of category
    if (selectedListIdParam) return items;
    // Otherwise, filter by selected category
    if (!selectedCatId) return items;
    const name = categories.find((c) => c.id === selectedCatId)?.name;
    return name ? items.filter((i) => i.category === name) : items;
  }, [items, categories, selectedCatId, selectedListIdParam]);

  // Build a quick map of counts per listId for list cards
  const listCounts = useMemo<Record<string, number>>(() => {
    const m: Record<string, number> = {};
    for (const it of items) {
      const key = String(it.listId ?? '');
      if (!key) continue;
      m[key] = (m[key] || 0) + 1;
    }
    return m;
  }, [items]);

  // Fetch items filtered by listId/category and current params
  useEffect(() => {
    const listId = selectedListIdParam || undefined;
    // If viewing a specific list, don't filter by category - show all items in that list
    const selectedCategoryName = (() => {
      if (selectedListIdParam) return undefined; // No category filter when viewing a list
      if (selectedCatId) return categories.find((c) => c.id === selectedCatId)?.name;
      return catParam || undefined;
    })();
    dispatch(fetchItems({ q, sort, listId, category: selectedCategoryName }));
  }, [dispatch, q, sort, selectedListIdParam, selectedCatId, categories, catParam]);

  const onShareList = async () => {
    const id = selectedListIdParam;
    if (!id) return;
    const url = `${window.location.origin}/lists?list=${encodeURIComponent(String(id))}${catParam ? `&cat=${encodeURIComponent(catParam)}` : ''}${q ? `&q=${encodeURIComponent(q)}` : ''}${sort ? `&sort=${encodeURIComponent(sort)}` : ''}`;
    try {
      await navigator.clipboard.writeText(url);
      setShareMsg("Link copied to clipboard");
      setTimeout(() => setShareMsg(""), 1500);
    } catch {
      setShareMsg("Failed to copy link");
      setTimeout(() => setShareMsg(""), 1500);
    }
  };

  const toggleCompleted = (id: string | number) => {
    setCompletedIds((prev) => ({ ...prev, [String(id)]: !prev[String(id)] }));
  };

  const lastUpdatedText = useMemo(() => {
    const dates: number[] = [];
    filteredItems.forEach((it: any) => {
      if (it?.createdAt) dates.push(new Date(it.createdAt).getTime());
    });
    if (!dates.length) return '';
    const delta = Date.now() - Math.max(...dates);
    const mins = Math.max(1, Math.floor(delta / 60000));
    return `Last updated: ${mins} min ago`;
  }, [filteredItems]);

  // Developer-managed categories: no user CRUD here

  // Items CRUD state and handlers (per selected category)
  const [itemForm, setItemForm] = useState<{ name: string; quantity: string; notes: string; image?: string }>({ name: "", quantity: "1", notes: "", image: "" });
  const [itemEditingId, setItemEditingId] = useState<string | null>(null);
  const [completedIds, setCompletedIds] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<'list' | 'favorites'>('list');
  
  // State for per-list item forms
  const [addingToListId, setAddingToListId] = useState<string | number | null>(null);
  const [perListItemForm, setPerListItemForm] = useState<{ name: string; quantity: string; notes: string; image?: string }>({ name: "", quantity: "1", notes: "", image: "" });

  const addItem = async () => {
    const catName = categories.find((c) => c.id === selectedCatId)?.name;
    if (!catName) return;
    const name = itemForm.name.trim();
    const quantity = Number(itemForm.quantity);
    if (!name || isNaN(quantity)) return;
    const payload = {
      name,
      quantity,
      notes: itemForm.notes.trim(),
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
      setItemForm({ name: '', quantity: '1', notes: '', image: '' });
    }
  };

  const addItemToList = async (listId: string | number) => {
    // Use selected category or default to first available category
    const catName = categories.find((c) => c.id === selectedCatId)?.name || categories[0]?.name || 'Uncategorized';
    const name = perListItemForm.name.trim();
    const quantity = Number(perListItemForm.quantity);
    if (!name || isNaN(quantity)) return;
    const payload = {
      name,
      quantity,
      notes: perListItemForm.notes.trim(),
      category: catName,
      image: perListItemForm.image || 'https://via.placeholder.com/300x200?text=Image',
      createdAt: new Date().toISOString(),
      listId: String(listId),
    };
    const res = await fetch('http://localhost:3001/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      // Select this list to view the newly added items
      setParams((p) => {
        const next = new URLSearchParams(p);
        next.set('list', String(listId));
        next.set('q', q);
        next.set('sort', sort);
        return next;
      });
      setPerListItemForm({ name: '', quantity: '1', notes: '', image: '' });
      setAddingToListId(null);
    }
  };

  const startEditItem = (p: { id: string; name: string; quantity?: number; notes?: string; image?: string }) => {
    setItemEditingId(String(p.id));
    setItemForm({ name: p.name, quantity: String(p.quantity ?? 1), notes: p.notes || '', image: p.image || '' });
  };

  const saveItem = async () => {
    if (!itemEditingId) return;
    const name = itemForm.name.trim();
    const quantity = Number(itemForm.quantity);
    if (!name || isNaN(quantity)) return;
    const res = await fetch(`http://localhost:3001/items/${itemEditingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, quantity, notes: itemForm.notes.trim(), image: itemForm.image }),
    });
    if (res.ok) {
      setItemEditingId(null);
      setItemForm({ name: '', quantity: '1', notes: '', image: '' });
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
  const [shareMsg, setShareMsg] = useState("");
  const [isNavOpen, setIsNavOpen] = useState(false);

  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const imageData = ev.target?.result as string;
      setProfileImage(imageData);
      // Update user in localStorage
      const updatedUser = { ...currentUser, profileImage: imageData };
      setCurrentUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      // Also update in the database
      if (userId) {
        fetch(`http://localhost:3001/users/${userId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ profileImage: imageData }),
        });
      }
    };
    reader.readAsDataURL(file);
  };

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
      <aside className={`listsSidebar ${isNavOpen ? 'open' : 'collapsed'}`}>
        <button className="hamburger" aria-label="menu" aria-expanded={isNavOpen ? "true" : "false"} onClick={() => setIsNavOpen((v) => !v)}>≡</button>
        <nav className="listsNav">
          <Link className="listsNavItem active" to="/lists">Home</Link>
          <Link className="listsNavItem" to="/categories">Categories</Link>
          <Link className="listsNavItem" to="/cart">Cart</Link>
          <Link className="listsNavItem" to="/favourites">Favorites</Link>
          <Link className="listsNavItem" to="/settings">Settings</Link>
        </nav>
        <div className="categoriesManager">
          <h4 className="sidebarTitle">Your Shopping Lists</h4>
          <div className="row">
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
                    <input aria-label="List name" value={editingListName} onChange={(e) => setEditingListName(e.target.value)} />
                    <span className="ml6">
                      <button onClick={onSaveList}>Save</button>
                      <button onClick={() => { setEditingListId(null); setEditingListName(""); }}>Cancel</button>
                    </span>
                  </>
                ) : (
                  <>
                    <button className="link" onClick={() => selectList(l.id)}>{l.name}</button>
                    <span className="ml6">
                      <button onClick={() => onStartEditList(l.id, l.name)}>Edit</button>
                      <button onClick={() => onDeleteList(l.id)}>Delete</button>
                    </span>
                  </>
                )}
              </li>
            ))}
          </ul>

          <h4 className="sidebarTitle">Categories</h4>
          <ul className="list">
            {categories.map((c) => (
              <li key={c.id} className={selectedCatId === c.id ? "active" : ""}>
                <button
                  className="link"
                  onClick={() => {
                    setSelectedCatId(c.id);
                    const catNameSel = categories.find((x) => x.id === c.id)?.name;
                    setParams((p) => {
                      const next = new URLSearchParams(p);
                      if (catNameSel) next.set("cat", catNameSel);
                      next.set("q", q);
                      next.set("sort", sort);
                      return next;
                    });
                  }}
                >
                  {c.name}
                </button>
                
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
            <label className="avatarUpload" htmlFor="profileImageUpload" title="Click to upload profile picture">
              {profileImage ? (
                <img className="userAvatar" src={profileImage} alt="avatar" />
              ) : (
                <div className="defaultAvatar">
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="20" cy="20" r="20" fill="#e5e7eb"/>
                    <circle cx="20" cy="16" r="6" fill="#9ca3af"/>
                    <path d="M8 32c0-6.627 5.373-12 12-12s12 5.373 12 12" fill="#9ca3af"/>
                  </svg>
                </div>
              )}
              <span className="editPenIcon" title="Upload image">✏️</span>
              <input
                id="profileImageUpload"
                type="file"
                accept="image/*"
                onChange={handleProfileImageUpload}
              />
            </label>
          </div>
          {selectedListIdParam && (
            <div className="row justifyEnd">
              <button className="secondaryBtn" onClick={onShareList}>Share</button>
              {shareMsg && <span className="muted">{shareMsg}</span>}
            </div>
          )}
        </header>

        {/* User Lists as cards */}
        <section className="listsCardsSection">
          <h2 className="sectionTitle">Your Lists</h2>
          {listsState.status === 'loading' && <p>Loading your lists...</p>}
          {listsState.status === 'failed' && <p className="error">{listsState.error || 'Failed to load lists'}</p>}
          {listsState.items.length === 0 && listsState.status !== 'loading' && (
            <p className="muted">No lists yet. Create one from the sidebar.</p>
          )}
          {listsState.items.length > 0 && (
            <div className="listCardsGrid">
              {listsState.items.map((l) => (
                <div key={l.id} className={`listCard ${String(selectedListIdParam) === String(l.id) ? 'active' : ''}`}>
                  {l.image && (
                    <div className="listCardImageHeader">
                      <img src={l.image} alt={l.name} />
                      <div className="listCardOverlay">
                        <h3 className="listCardTitleOverlay">{l.name}</h3>
                        <span className="listCountChipOverlay">{listCounts[String(l.id)] || 0} items</span>
                      </div>
                    </div>
                  )}
                  {!l.image && (
                    <div className="listCardHeader">
                      <h3 className="listCardTitle">{l.name}</h3>
                      <span className="listCountChip">{listCounts[String(l.id)] || 0} items</span>
                    </div>
                  )}
                  <div className="listCardBody">
                    <div className="listCardMeta">
                      <small className="muted">{new Date(l.createdAt).toLocaleDateString()}</small>
                    </div>
                    
                    {addingToListId === l.id ? (
                    <div className="listCardItemForm">
                      <input 
                        className="textInput" 
                        placeholder="Item name" 
                        value={perListItemForm.name} 
                        onChange={(e) => setPerListItemForm((p) => ({ ...p, name: e.target.value }))} 
                      />
                      <input 
                        className="textInput" 
                        placeholder="Qty" 
                        type="number"
                        value={perListItemForm.quantity} 
                        onChange={(e) => setPerListItemForm((p) => ({ ...p, quantity: e.target.value }))} 
                      />
                      <input 
                        className="textInput" 
                        placeholder="Notes" 
                        value={perListItemForm.notes} 
                        onChange={(e) => setPerListItemForm((p) => ({ ...p, notes: e.target.value }))} 
                      />
                      <div className="listCardFormActions">
                        <button className="primaryBtn" onClick={() => addItemToList(l.id)}>Add</button>
                        <button className="secondaryBtn" onClick={() => { setAddingToListId(null); setPerListItemForm({ name: '', quantity: '1', notes: '', image: '' }); }}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div className="listCardActions">
                      <button className="primaryBtn" onClick={() => selectList(l.id)}>Open</button>
                      <button className="secondaryBtn" onClick={() => setAddingToListId(l.id)}>Add Item</button>
                      <button className="secondaryBtn" onClick={() => onStartEditList(l.id, l.name)}>Edit</button>
                      <button className="secondaryBtn" onClick={() => onDeleteList(l.id)}>Delete</button>
                    </div>
                  )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Item form (adds to selected category) */}
        <div className="row formRow">
          <input className="textInput" placeholder="Item name" value={itemForm.name} onChange={(e) => setItemForm((p) => ({ ...p, name: e.target.value }))} />
          <input className="textInput" placeholder="Quantity" value={itemForm.quantity} onChange={(e) => setItemForm((p) => ({ ...p, quantity: e.target.value }))} />
          <input className="textInput" placeholder="Image URL (optional)" value={itemForm.image} onChange={(e) => setItemForm((p) => ({ ...p, image: e.target.value }))} />
          <div className="row">
            <label htmlFor="itemImageFile">Item Image</label>
            <input
              id="itemImageFile"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                const reader = new FileReader();
                reader.onload = (ev) => setItemForm((p) => ({ ...p, image: (ev.target?.result as string) || p.image }));
                reader.readAsDataURL(f);
              }}
            />
          </div>
          <input className="textInput" placeholder="Notes (optional)" value={itemForm.notes} onChange={(e) => setItemForm((p) => ({ ...p, notes: e.target.value }))} />
          {itemEditingId ? (
            <>
              <button className="primaryBtn" onClick={saveItem} disabled={!selectedCatId}>Save</button>
              <button className="secondaryBtn" onClick={() => { setItemEditingId(null); setItemForm({ name: '', quantity: '1', notes: '', image: '' }); }}>Cancel</button>
            </>
          ) : (
            <button className="primaryBtn" onClick={addItem} disabled={!selectedCatId}>Add Item</button>
          )}

        </div>

        <div className="mobileTabs">
          <button className={`pill ${activeTab === 'list' ? 'active' : ''}`} onClick={() => setActiveTab('list')} aria-pressed={activeTab==='list' ? "true" : "false"}>Shopping List</button>
          <button className={`pill ${activeTab === 'favorites' ? 'active' : ''}`} onClick={() => setActiveTab('favorites')} aria-pressed={activeTab==='favorites' ? "true" : "false"}>Favorites</button>
          <button className="floatingAdd" aria-label="Add item" onClick={() => setItemEditingId(null)}>+</button>
        </div>

        <div className="itemsHeader">
          <h2 className="sectionTitle">Items {selectedListIdParam && `- ${listsState.items.find(l => String(l.id) === String(selectedListIdParam))?.name || 'List'}`}</h2>
          {selectedListIdParam && (
            <button className="secondaryBtn" onClick={() => {
              setParams((p) => {
                const next = new URLSearchParams(p);
                next.delete('list');
                next.set('q', q);
                next.set('sort', sort);
                return next;
              });
            }}>View All Items</button>
          )}
        </div>
        {status === 'loading' && <p>Loading...</p>}
        {status === 'failed' && <p className="error">{error || 'Failed to load items'}</p>}
        
        {/* Items as Cards */}
        {status !== 'loading' && filteredItems.length === 0 && (
          <p className="muted">No items yet. Add items to get started.</p>
        )}
        {status !== 'loading' && filteredItems.length > 0 && (
          <div className="itemCardsGrid">
            {filteredItems.map((item) => (
              <div key={item.id} className={`itemCard ${completedIds[String(item.id)] ? 'completed' : ''}`}>
                <div className="itemCardImage">
                  <img src={item.image || 'https://via.placeholder.com/300x200?text=Item'} alt={item.name} />
                  <button 
                    className={`itemCheckbox ${completedIds[String(item.id)] ? 'checked' : ''}`} 
                    onClick={() => toggleCompleted(item.id)}
                    aria-label={completedIds[String(item.id)] ? 'Mark as not done' : 'Mark as done'}
                  >
                    {completedIds[String(item.id)] ? '✓' : ''}
                  </button>
                </div>
                <div className="itemCardContent">
                  <h3 className="itemCardTitle">{item.name}</h3>
                  <div className="itemCardMeta">
                    <span className="itemCategory">{item.category}</span>
                    <span className="itemQuantity">Qty: {item.quantity || 1}</span>
                  </div>
                  {item.notes && <p className="itemNotes">{item.notes}</p>}
                  <div className="itemCardActions">
                    <button className="secondaryBtn" onClick={() => startEditItem(item as any)}>Edit</button>
                    <button className="dangerBtn" onClick={() => deleteItem(item.id)}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Mobile sticky share bar */}
        {selectedListIdParam && (
          <div className="mobileShareBar">
            <button className="dangerCircle" aria-label="Delete selected list" onClick={() => onDeleteList(selectedListIdParam)}>🗑️</button>
            <button className="sharePill" onClick={onShareList}>Share List</button>
            {lastUpdatedText && <small className="muted lastUpdated">{lastUpdatedText}</small>}
          </div>
        )}
      </section>

      {/* Right Tips (no ordering here) */}
      <aside className="listsWidgets">
        <div className="widget">
          <h3>Tips</h3>
          <ul className="list">
            <li>Use the search to quickly find items by name.</li>
            <li>Select a category to filter your items.</li>
            <li>Track multiple lists and switch between them.</li>
            <li>Use Share to copy a link to your current list.</li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
