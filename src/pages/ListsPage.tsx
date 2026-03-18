import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FaHeart, FaPlus, FaRegTrashCan } from "react-icons/fa6";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { FiSearch } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "../components/Toast";
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
  const { show } = useToast();
  const { items, status, error } = useSelector((s: RootState) => s.items);
  const listsState = useSelector((s: RootState) => s.lists);

  const currentUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("currentUser") || "null");
    } catch {
      return null;
    }
  }, []);
  const userId = currentUser?.id;

  useEffect(() => {
    if (!userId) return;
    dispatch(fetchLists({ userId }));
  }, [dispatch, userId]);

  useEffect(() => {
    if (selectedListIdParam || listsState.items.length === 0) return;
    selectList(listsState.items[0].id);
  }, [selectedListIdParam, listsState.items]);

  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [selectedCatId, setSelectedCatId] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:3001/categories")
      .then((r) => r.json())
      .then((data: { id: string; name: string }[]) => {
        setCategories(data);
        if (catParam) {
          const match = data.find((c) => c.name.toLowerCase() === catParam.toLowerCase());
          if (match) setSelectedCatId(match.id);
        } else if (data.length && !selectedCatId) {
          setSelectedCatId(data[0].id);
        }
      })
      .catch(() => setCategories([]));
  }, [catParam, selectedCatId]);

  const filteredItems = useMemo(() => {
    if (!selectedCatId) return items;
    const name = categories.find((c) => c.id === selectedCatId)?.name;
    return name ? items.filter((i) => i.category === name) : items;
  }, [items, categories, selectedCatId]);

  const listCounts = useMemo<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    for (const item of items) {
      const key = String(item.listId ?? "");
      if (!key) continue;
      map[key] = (map[key] || 0) + 1;
    }
    return map;
  }, [items]);

  useEffect(() => {
    const listId = selectedListIdParam || undefined;
    const selectedCategoryName = (() => {
      if (selectedCatId) return categories.find((c) => c.id === selectedCatId)?.name;
      return catParam || undefined;
    })();
    dispatch(fetchItems({ q, sort, listId, category: selectedCategoryName }));
  }, [dispatch, q, sort, selectedListIdParam, selectedCatId, categories, catParam]);

  const [itemForm, setItemForm] = useState<{ name: string; quantity: string; notes: string; image?: string }>({
    name: "",
    quantity: "",
    notes: "",
    image: "",
  });
  const [itemCategoryId, setItemCategoryId] = useState<string>("");
  const [itemEditingId, setItemEditingId] = useState<string | null>(null);
  const [completedIds, setCompletedIds] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<"list" | "favorites">("list");
  const [newListName, setNewListName] = useState("");
  const [editingListId, setEditingListId] = useState<string | number | null>(null);
  const [editingListName, setEditingListName] = useState("");
  const [shareMsg, setShareMsg] = useState("");
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [pendingDeleteList, setPendingDeleteList] = useState<{ id: string | number; name: string } | null>(null);

  useEffect(() => {
    if (itemCategoryId || categories.length === 0) return;
    const fallback = catParam
      ? categories.find((c) => c.name.toLowerCase() === catParam.toLowerCase())?.id
      : selectedCatId || categories[0].id;
    if (fallback) setItemCategoryId(fallback);
  }, [categories, catParam, selectedCatId, itemCategoryId]);

  const onShareList = async () => {
    const id = selectedListIdParam;
    if (!id) return;
    const url = `${window.location.origin}/lists?list=${encodeURIComponent(String(id))}${catParam ? `&cat=${encodeURIComponent(catParam)}` : ""}${q ? `&q=${encodeURIComponent(q)}` : ""}${sort ? `&sort=${encodeURIComponent(sort)}` : ""}`;
    try {
      await navigator.clipboard.writeText(url);
      setShareMsg("Link copied to clipboard");
      show("Share link copied", "success");
      setTimeout(() => setShareMsg(""), 1500);
    } catch {
      setShareMsg("Failed to copy link");
      show("Failed to copy link", "error");
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
    if (!dates.length) return "";
    const delta = Date.now() - Math.max(...dates);
    const mins = Math.max(1, Math.floor(delta / 60000));
    return `Last updated: ${mins} min ago`;
  }, [filteredItems]);

  const refreshVisibleItems = (nextListId?: string | number) => {
    const selectedCategoryName = (() => {
      if (selectedCatId) return categories.find((c) => c.id === selectedCatId)?.name;
      return catParam || undefined;
    })();

    dispatch(
      fetchItems({
        q,
        sort,
        listId: typeof nextListId !== "undefined" ? nextListId : selectedListIdParam || undefined,
        category: selectedCategoryName,
      })
    );
  };

  const addItem = async () => {
    const catName =
      categories.find((c) => c.id === itemCategoryId)?.name ||
      categories.find((c) => c.id === selectedCatId)?.name;
    if (!selectedListIdParam) {
      show("Select a shopping list first", "info");
      return;
    }
    if (!catName) {
      show("Select a category first", "info");
      return;
    }
    const name = itemForm.name.trim();
    const quantity = itemForm.quantity.trim() ? Number(itemForm.quantity) : 1;
    if (!name || Number.isNaN(quantity)) {
      show("Enter a valid item name", "error");
      return;
    }

    const payload = {
      name,
      quantity,
      notes: itemForm.notes.trim(),
      category: catName,
      image: itemForm.image || "https://via.placeholder.com/300x200?text=Image",
      createdAt: new Date().toISOString(),
      listId: selectedListIdParam || undefined,
    };

    const res = await fetch("http://localhost:3001/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      await res.json();
      refreshVisibleItems();
      setItemForm({ name: "", quantity: "", notes: "", image: "" });
      setItemCategoryId(selectedCatId || itemCategoryId);
      show("Item added to the list", "success");
    } else {
      show("Failed to add item", "error");
    }
  };

  const startEditItem = (p: { id: string; name: string; quantity?: number; notes?: string; image?: string; category?: string }) => {
    setItemEditingId(String(p.id));
    setItemForm({
      name: p.name,
      quantity: String(p.quantity ?? 1),
      notes: p.notes || "",
      image: p.image || "",
    });
    const matchedCategory = categories.find((c) => c.name === p.category);
    if (matchedCategory) setItemCategoryId(matchedCategory.id);
  };

  const saveItem = async () => {
    if (!itemEditingId) return;
    const name = itemForm.name.trim();
    const quantity = itemForm.quantity.trim() ? Number(itemForm.quantity) : 1;
    if (!name || Number.isNaN(quantity)) {
      show("Enter a valid item name", "error");
      return;
    }

    const res = await fetch(`http://localhost:3001/items/${itemEditingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        quantity,
        notes: itemForm.notes.trim(),
        image: itemForm.image,
        category:
          categories.find((c) => c.id === itemCategoryId)?.name ||
          categories.find((c) => c.id === selectedCatId)?.name,
      }),
    });

    if (res.ok) {
      setItemEditingId(null);
      setItemForm({ name: "", quantity: "", notes: "", image: "" });
      setItemCategoryId(selectedCatId || itemCategoryId);
      refreshVisibleItems();
      show("Item updated", "success");
    } else {
      show("Failed to update item", "error");
    }
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
    if (!name) {
      show("Enter a list name", "info");
      return;
    }
    try {
      const created = await dispatch(createList({ userId, name })).unwrap();
      setNewListName("");
      selectList(created.id);
      refreshVisibleItems(created.id);
      show("New shopping list created", "success");
    } catch {
      show("Failed to create list", "error");
    }
  };

  const onStartEditList = (id: string | number, name: string) => {
    setEditingListId(id);
    setEditingListName(name);
  };

  const onSaveList = async () => {
    if (!editingListId || !userId) return;
    const name = editingListName.trim();
    if (!name) {
      show("Enter a list name", "info");
      return;
    }
    try {
      await dispatch(updateList({ id: editingListId, name, userId })).unwrap();
      setEditingListId(null);
      setEditingListName("");
      show("List updated", "success");
    } catch {
      show("Failed to update list", "error");
    }
  };

  const onRequestDeleteList = (id: string | number, name: string) => {
    setPendingDeleteList({ id, name });
  };

  const onDeleteList = async () => {
    if (!pendingDeleteList) return;
    try {
      await dispatch(deleteList({ id: pendingDeleteList.id })).unwrap();
      if (String(selectedListIdParam) === String(pendingDeleteList.id)) {
        setParams((p) => {
          const next = new URLSearchParams(p);
          next.delete("list");
          next.set("q", q);
          next.set("sort", sort);
          return next;
        });
        refreshVisibleItems("");
      }
      show("List deleted", "success");
    } catch {
      show("Failed to delete list", "error");
    } finally {
      setPendingDeleteList(null);
    }
  };

  return (
    <div className="listsLayout">
      <aside className={`listsSidebar ${isNavOpen ? "open" : "collapsed"}`}>
        <button className="hamburger" aria-label="menu" aria-expanded={isNavOpen ? "true" : "false"} onClick={() => setIsNavOpen((v) => !v)}>
          <HiOutlineMenuAlt3 />
        </button>
        <nav className="listsNav">
          <Link className="listsNavItem active" to="/home">Home</Link>
          <Link className="listsNavItem" to="/categories">Categories</Link>
          <Link className="listsNavItem" to="/favorites">Favorites</Link>
          <Link className="listsNavItem" to="/settings">Settings</Link>
        </nav>

        <div className="categoriesManager">
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

      <section className="listsContent">
        <header className="listsHeader">
          <div className="searchBox">
            <span className="searchIcon" aria-hidden="true">
              <FiSearch />
            </span>
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
            <option value="name_asc">Name A-Z</option>
            <option value="name_desc">Name Z-A</option>
            <option value="category">Category</option>
          </select>
          <div className="userChip">
            <span className="userName">{currentUser?.fullName || "User"}</span>
            <img className="userAvatar" src={currentUser?.avatar || "https://via.placeholder.com/80x80?text=U"} alt="avatar" />
          </div>
          {selectedListIdParam && (
            <div className="row justifyEnd">
              <button className="secondaryBtn" onClick={onShareList}>Share</button>
              {shareMsg && <span className="muted">{shareMsg}</span>}
            </div>
          )}
        </header>

        <section className="listsCardsSection">
          <h2 className="sectionTitle">Your Lists</h2>
          {listsState.status === "loading" && <p>Loading your lists...</p>}
          {listsState.status === "failed" && <p className="error">{listsState.error || "Failed to load lists"}</p>}
          {listsState.items.length === 0 && listsState.status !== "loading" && (
            <p className="muted">No lists yet. Create one from the side panel.</p>
          )}
          {listsState.items.length > 0 && (
            <div className="listCardsGrid">
              {listsState.items.map((l) => (
                <div key={l.id} className={`listCard ${String(selectedListIdParam) === String(l.id) ? "active" : ""}`}>
                  <div className="listCardHeader">
                    <h3 className="listCardTitle">{l.name}</h3>
                    <span className="listCountChip">{listCounts[String(l.id)] || 0} items</span>
                  </div>
                  <div className="listCardMeta">
                    <small className="muted">{new Date(l.createdAt).toLocaleDateString()}</small>
                  </div>
                  <div className="listCardActions">
                    <button className="primaryBtn" onClick={() => selectList(l.id)}>Open</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="row formRow">
          <input className="textInput" placeholder="Item name" value={itemForm.name} onChange={(e) => setItemForm((p) => ({ ...p, name: e.target.value }))} />
          <input className="textInput" placeholder="Quantity" value={itemForm.quantity} onChange={(e) => setItemForm((p) => ({ ...p, quantity: e.target.value }))} />
          <input className="textInput" placeholder="Image URL (optional)" value={itemForm.image} onChange={(e) => setItemForm((p) => ({ ...p, image: e.target.value }))} />
          <div className="row fileInputRow">
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
          <select
            className="textInput"
            aria-label="Item category"
            value={itemCategoryId}
            onChange={(e) => setItemCategoryId(e.target.value)}
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <input className="textInput" placeholder="Notes (optional)" value={itemForm.notes} onChange={(e) => setItemForm((p) => ({ ...p, notes: e.target.value }))} />
          {itemEditingId ? (
            <>
              <button className="primaryBtn" onClick={saveItem} disabled={!selectedCatId}>Save</button>
              <button className="secondaryBtn" onClick={() => { setItemEditingId(null); setItemForm({ name: "", quantity: "", notes: "", image: "" }); }}>Cancel</button>
            </>
          ) : (
            <button className="primaryBtn" onClick={addItem} disabled={!selectedCatId || !selectedListIdParam}>Add Item</button>
          )}
        </div>

        <div className="mobileTabs">
          <button className={`pill ${activeTab === "list" ? "active" : ""}`} onClick={() => setActiveTab("list")} aria-pressed={activeTab === "list" ? "true" : "false"}>
            Shopping List
          </button>
          <button className={`pill ${activeTab === "favorites" ? "active" : ""}`} onClick={() => setActiveTab("favorites")} aria-pressed={activeTab === "favorites" ? "true" : "false"}>
            <FaHeart />
            <span>Favorites</span>
          </button>
          <button className="floatingAdd" aria-label="Add item" onClick={() => setItemEditingId(null)}>
            <FaPlus />
          </button>
        </div>

        <h2 className="sectionTitle">Items</h2>
        {status === "loading" && <p>Loading...</p>}
        {status === "failed" && <p className="error">{error || "Failed to load items"}</p>}
        {status !== "loading" && (
          <div className="itemsGridDesktop">
            {(activeTab === "favorites" ? filteredItems.filter((p) => completedIds[String(p.id)]) : filteredItems).map((p) => (
              <article key={p.id} className="itemCardDesktop">
                <div className={`itemCardDesktopImageWrap ${p.image ? "hasImage" : "empty"}`}>
                  {p.image ? <img src={p.image} alt={p.name} className="itemCardDesktopImage" /> : <div className="itemCardDesktopImagePlaceholder" aria-hidden="true" />}
                </div>
                <div className="itemCardDesktopHeader">
                  <button
                    className={`statusDot ${completedIds[String(p.id)] ? "done" : ""}`}
                    onClick={() => toggleCompleted(p.id)}
                    aria-label={completedIds[String(p.id)] ? "Mark as not done" : "Mark as done"}
                  />
                  <button className={`itemName ${completedIds[String(p.id)] ? "line" : ""}`} onClick={() => startEditItem(p as any)}>
                    {p.name}
                  </button>
                </div>
                <div className="itemCardDesktopMeta">
                  <span>{p.category}</span>
                  {Number(p.quantity ?? 1) > 1 && <span className="qtyBadge">{p.quantity}</span>}
                </div>
                {p.notes && <p className="muted">{p.notes}</p>}
              </article>
            ))}
          </div>
        )}
        {status !== "loading" && (
          <ul className="mobileList">
            {(activeTab === "favorites" ? filteredItems.filter((p) => completedIds[String(p.id)]) : filteredItems).map((p) => (
              <li key={p.id} className="mobileListItem">
                <button className={`statusDot ${completedIds[String(p.id)] ? "done" : ""}`} onClick={() => toggleCompleted(p.id)} aria-label={completedIds[String(p.id)] ? "Mark as not done" : "Mark as done"} />
                <button className={`itemName ${completedIds[String(p.id)] ? "line" : ""}`} onClick={() => startEditItem(p as any)}>{p.name}</button>
                {Number(p.quantity ?? 1) > 1 && <span className="qtyBadge">{p.quantity}</span>}
              </li>
            ))}
          </ul>
        )}

        {selectedListIdParam && (
          <div className="mobileShareBar">
            <button
              className="dangerCircle"
              aria-label="Delete selected list"
              onClick={() => {
                const selected = listsState.items.find((l) => String(l.id) === String(selectedListIdParam));
                if (selected) onRequestDeleteList(selected.id, selected.name);
              }}
            >
              <FaRegTrashCan />
            </button>
            <button className="sharePill" onClick={onShareList}>Share List</button>
            {lastUpdatedText && <small className="muted lastUpdated">{lastUpdatedText}</small>}
          </div>
        )}
      </section>

      <aside className="listsWidgets">
        <div className="widget">
          <div className="listsWidgetHeader">
            <div>
              <h3>Create New List</h3>
              <p className="muted">Start a fresh shopping list without leaving this page.</p>
            </div>
            <button
              className="iconCreateButton"
              onClick={onCreateList}
              disabled={!newListName.trim() || !userId}
              aria-label="Create new shopping list"
            >
              <FaPlus />
            </button>
          </div>
          <div className="createListBar widgetCreateListBar">
            <input
              placeholder="New list name"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
            />
          </div>
          <div className="listManagerPanel">
            <h4 className="listManagerTitle">Manage Lists</h4>
            {listsState.items.length === 0 ? (
              <p className="muted">No lists yet. Create one above.</p>
            ) : (
              <ul className="managedLists">
                {listsState.items.map((l) => (
                  <li key={l.id} className={`managedListItem ${String(selectedListIdParam) === String(l.id) ? "active" : ""}`}>
                    {editingListId === l.id ? (
                      <>
                        <input
                          className="managedListInput"
                          aria-label="List name"
                          value={editingListName}
                          onChange={(e) => setEditingListName(e.target.value)}
                        />
                        <div className="managedListActions">
                          <button className="secondaryBtn compactBtn" onClick={onSaveList}>Save</button>
                          <button className="secondaryBtn compactBtn" onClick={() => { setEditingListId(null); setEditingListName(""); }}>Cancel</button>
                        </div>
                      </>
                    ) : (
                      <>
                        <button className="managedListLink" onClick={() => selectList(l.id)}>{l.name}</button>
                        <div className="managedListActions">
                          <button className="secondaryBtn compactBtn" onClick={() => onStartEditList(l.id, l.name)}>Edit</button>
                          <button className="secondaryBtn compactBtn" onClick={() => onRequestDeleteList(l.id, l.name)}>Delete</button>
                        </div>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
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

      {pendingDeleteList && (
        <div className="confirmModalOverlay" role="presentation" onClick={() => setPendingDeleteList(null)}>
          <div
            className="confirmModal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-list-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="delete-list-title">Delete this list?</h3>
            <p className="muted">
              "{pendingDeleteList.name}" will be removed from your shopping lists.
            </p>
            <div className="confirmModalActions">
              <button className="secondaryBtn compactBtn" onClick={() => setPendingDeleteList(null)}>
                Cancel
              </button>
              <button className="primaryBtn compactBtn dangerBtn" onClick={onDeleteList}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
