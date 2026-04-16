import { Building2, Search, Bell, User, LogOut } from 'lucide-react'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const checkUser = () => {
    const loggedInUser = localStorage.getItem('currentUser');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    checkUser();
    window.addEventListener('authChange', checkUser);
    return () => window.removeEventListener('authChange', checkUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    window.dispatchEvent(new Event('authChange'));
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <nav className="fixed w-full z-50 glass top-0 left-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer group"
            onClick={() => navigate('/')}
          >
            <span className="text-3xl font-extrabold gradient-text tracking-tight group-hover:scale-105 transition-transform duration-300">
              FoodieHub
            </span>
          </div>

          {/* Navigation Items (Middle) */}
          <div className="hidden md:flex flex-1 justify-center space-x-8">
            <button onClick={() => navigate('/')} className="text-gray-600 font-medium hover:text-orange-500 transition-colors">Home</button>
            <button onClick={() => toast.info('Categories coming soon!')} className="text-gray-600 font-medium hover:text-orange-500 transition-colors">Categories</button>
            <button onClick={() => toast.info('Offers coming soon!')} className="text-gray-600 font-medium hover:text-orange-500 transition-colors">Offers</button>
            <button onClick={() => toast.info('Contact details coming soon!')} className="text-gray-600 font-medium hover:text-orange-500 transition-colors">Contact</button>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4 lg:space-x-6">
            <button onClick={() => toast.info('Search functionality coming soon!')} className="text-gray-400 hover:text-gray-700 transition">
              <Search size={22} />
            </button>
            <button onClick={() => toast.info('No new notifications')} className="text-gray-400 hover:text-gray-700 transition relative">
              <Bell size={22} />
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>
            <button 
              onClick={() => navigate('/restaurant')}
              className="hidden sm:flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-5 py-2.5 rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300 font-semibold"
            >
              <Building2 size={18} />
              <span>Restaurants</span>
            </button>
            {user ? (
              <div className="flex items-center space-x-3">
                <span className="font-semibold text-gray-700 hidden sm:block">Hi, {user.username}</span>
                <button 
                  onClick={handleLogout} 
                  className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 hover:bg-red-200 transition"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => navigate('/login')} 
                className="flex items-center space-x-2 bg-gray-100 text-gray-800 px-4 py-2.5 rounded-full hover:bg-gray-200 transition font-semibold"
              >
                <User size={18} />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
