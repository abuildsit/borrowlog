import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { signOut, user } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-600 text-white py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold">BorrowLog</Link>
          <div className="flex items-center space-x-2">
            <span className="text-sm">{user?.email}</span>
            <button
              onClick={handleSignOut}
              className="text-sm bg-blue-700 px-3 py-1 rounded hover:bg-blue-800"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-6">
        <Outlet />
      </main>

      <footer className="bg-gray-100 py-3 border-t">
        <nav className="container mx-auto px-4">
          <ul className="flex justify-around">
            <li>
              <Link
                to="/"
                className={`flex flex-col items-center p-2 ${
                  isActive('/') ? 'text-blue-600 font-medium' : 'text-gray-600'
                }`}
              >
                <span className="material-icons">home</span>
                <span className="text-xs mt-1">Home</span>
              </Link>
            </li>
            <li>
              <Link
                to="/loans/create"
                className={`flex flex-col items-center p-2 ${
                  isActive('/loans/create') ? 'text-blue-600 font-medium' : 'text-gray-600'
                }`}
              >
                <span className="material-icons">add_circle</span>
                <span className="text-xs mt-1">Add Loan</span>
              </Link>
            </li>
            <li>
              <Link
                to="/contacts"
                className={`flex flex-col items-center p-2 ${
                  isActive('/contacts') ? 'text-blue-600 font-medium' : 'text-gray-600'
                }`}
              >
                <span className="material-icons">people</span>
                <span className="text-xs mt-1">Contacts</span>
              </Link>
            </li>
            <li>
              <Link
                to="/notifications"
                className={`flex flex-col items-center p-2 ${
                  isActive('/notifications') ? 'text-blue-600 font-medium' : 'text-gray-600'
                }`}
              >
                <span className="material-icons">notifications</span>
                <span className="text-xs mt-1">Notifications</span>
              </Link>
            </li>
            <li>
              <Link
                to="/profile"
                className={`flex flex-col items-center p-2 ${
                  isActive('/profile') ? 'text-blue-600 font-medium' : 'text-gray-600'
                }`}
              >
                <span className="material-icons">person</span>
                <span className="text-xs mt-1">Profile</span>
              </Link>
            </li>
          </ul>
        </nav>
      </footer>
    </div>
  );
};

export default Layout; 