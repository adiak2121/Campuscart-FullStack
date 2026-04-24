import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNavigate } from "react-router-dom";

const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
  `rounded-full px-4 py-2 font-semibold transition ${isActive ? 'bg-ssn-50 text-ssn-700' : 'text-ssn-700 hover:bg-ssn-50'}`;

export default function Navbar() {
  const { user, logout } = useAuth();
  const { totals } = useCart();
  const isAdmin = user?.role === 'ADMIN';
  const navigate = useNavigate();
  

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto grid min-h-[78px] w-[min(1180px,calc(100%-28px))] grid-cols-1 items-center gap-4 py-3 lg:grid-cols-[auto_1fr_auto]">
        <Link to="/" className="flex items-center gap-4">
          <img src="/assets/ssn-logo.png" alt="SSN Logo" className="w-24 object-contain" />
          <div>
            <strong className="block text-2xl text-ssn-700">SSN CampusCart</strong>
            <small className="text-slate-500">Student marketplace</small>
          </div>
        </Link>

        <nav className="flex flex-wrap items-center justify-start gap-2 lg:justify-center">
          <NavLink to="/" className={navLinkClasses}>Home</NavLink>
          <NavLink to="/marketplace" className={navLinkClasses}>Marketplace</NavLink>
          <NavLink to="/sell" className={navLinkClasses}>Sell</NavLink>
          <NavLink to="/orders" className={navLinkClasses}>Orders</NavLink>
          <NavLink to="/cart" className={navLinkClasses}>Cart ({totals.itemCount})</NavLink>
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `rounded-full px-4 py-2 font-semibold transition flex items-center gap-1.5 ${
                isActive
                  ? 'bg-ssn-700 text-white shadow-md'
                  : 'border border-ssn-300 bg-ssn-50 text-ssn-700 hover:bg-ssn-100'
              }`
            }
          >
            <span>🛡️</span>
            <span>Admin</span>
          </NavLink>
        </nav>

        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <strong className="block text-xl text-slate-800">{user?.name || 'Student'}</strong>
              {isAdmin && (
                <span className="rounded-full bg-ssn-700 px-2 py-0.5 text-xs font-bold text-white">
                  ADMIN
                </span>
              )}
            </div>
            <small className="text-slate-500">{user?.email || ''}</small>
          </div>
          <button
            className="rounded-2xl border border-slate-200 bg-white px-5 py-3 font-semibold text-ssn-700 transition hover:bg-ssn-50"
            onClick={logout}
          >
            Logout
          </button>
          <button
            onClick={() => navigate("/wishlist")}
            className="px-3 py-1 bg-pink-500 text-white rounded"
          >
            Wishlist ❤️
          </button>
        </div>
      </div>
    </header>
  );
}
