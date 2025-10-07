import React, { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { LiaShoppingCartSolid } from "react-icons/lia";
import { useDispatch, useSelector } from "react-redux";
import { fetchItems } from "../features/ItemsSlice";
import type { RootState, AppDispatch } from "../../store";

export default function ListsPage() {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") ?? "";
  const sort = params.get("sort") ?? "date_desc";

  const dispatch = useDispatch<AppDispatch>();
  const { items, status, error } = useSelector((s: RootState) => s.items);

  useEffect(() => {
    dispatch(fetchItems({ q, sort }));
  }, [dispatch, q, sort]);

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
        <button className="floatingAdd" title="Add new list">+</button>
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
            <span className="userName">Nicolus</span>
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

        <h2 className="sectionTitle">Featured Products</h2>
        {status === 'loading' && <p>Loading...</p>}
        {status === 'failed' && <p className="error">{error || 'Failed to load items'}</p>}
        {status !== 'loading' && (
          <div className="cardsGrid">
            {items.map((p) => (
              <div className="productCard" key={p.id}>
                <img src={p.image || 'https://via.placeholder.com/300x200?text=Image'} alt={p.name} />
                <div className="productInfo">
                  <h4>{p.name}</h4>
                  <p className="price">${(p.price ?? 0).toFixed(2)}</p>
                </div>
                <button className="addBtn" aria-label={`Add ${p.name}`}>+</button>
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
