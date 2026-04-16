import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    
    // Find matching user
    const user = storedUsers.find(
      u => u.username === formData.username && u.password === formData.password
    );

    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      toast.success('Logged in successfully!');
      // Dispatch custom event to let Navbar automatically catch state change across the app without hitting refresh
      window.dispatchEvent(new Event('authChange'));
      navigate('/');
    } else {
      toast.error('Invalid username or password!');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">Welcome Back</h2>
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Username</label>
            <input 
              type="text" 
              name="username" 
              value={formData.username} 
              onChange={handleInputChange} 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
              required 
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input 
              type="password" 
              name="password" 
              value={formData.password} 
              onChange={handleInputChange} 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
              required 
            />
          </div>
          <button 
            type="submit" 
            className="w-full mt-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold py-3 px-4 rounded-lg hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
          >
            Log In
          </button>
        </form>
        <p className="mt-6 text-center text-gray-600">
          Don't have an account? <Link to="/signup" className="text-orange-500 hover:text-orange-600 font-semibold ml-1">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
