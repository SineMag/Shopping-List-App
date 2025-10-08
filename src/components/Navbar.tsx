import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const navigate = useNavigate();
  const [isAuthed, setIsAuthed] = useState<boolean>(localStorage.getItem('auth') === 'true');

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'auth') setIsAuthed(localStorage.getItem('auth') === 'true');
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('auth');
    localStorage.removeItem('currentUser');
    setIsAuthed(false);
    navigate('/login', { replace: true });
  };

  return (
    <div className='navbar'>
      <h1 className="brandLogo">
        <Link to={isAuthed ? "/home" : "/"} aria-label={isAuthed ? "Go to Home" : "Go to Landing"}>Listify</Link>
      </h1>
      <nav>
        {isAuthed ? (
          <>
            <Link to="/categories" aria-label="Go to Categories">Categories</Link>
            <Link to="/lists" aria-label="Go to Lists">Shopping Lists</Link>
            <button type="button" onClick={handleLogout} aria-label="Log out" className="logoutBtn">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/" aria-label="Go to Landing">Home</Link>
            <Link to="/login" aria-label="Go to Login">Login</Link>
            <Link to="/register" aria-label="Go to Register" style={{ marginLeft: 12 }}>Register</Link>
          </>
        )}
      </nav>
    </div>
  )
}
