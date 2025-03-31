import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Building2, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Clock } from 'lucide-react';
import "../Restaurant.css"

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const handleRestaurentClick = () => {
    navigate("/restaurant")
  }

  // Rest of the component remains the same
  const foodItems = [
    { id: 1, name: 'Pizza Margherita', price: '$12.99', image: '/api/placeholder/200/200' },
    { id: 2, name: 'Burger Deluxe', price: '$9.99', image: '/api/placeholder/200/200' },
    { id: 3, name: 'Sushi Platter', price: '$24.99', image: '/api/placeholder/200/200' },
    { id: 4, name: 'Pasta Carbonara', price: '$14.99', image: '/api/placeholder/200/200' },
    { id: 5, name: 'Fresh Salad', price: '$8.99', image: '/api/placeholder/200/200' }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % (foodItems.length - 2));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + (foodItems.length - 2)) % (foodItems.length - 2));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center">
              <span className="text-2xl font-bold text-orange-500">FoodieHub</span>
            </div>

            {/* Restaurant Button */}
            <button className="flex items-center space-x-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors" onClick={handleRestaurentClick}>
              <Building2 size={20} />
              <span>Restaurants</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">Trending Food</h1>
          
          {/* Food Slider */}
          <div className="relative">
            <div className="flex items-center">
              <button 
                onClick={prevSlide}
                className="p-2 rounded-full bg-white shadow-lg hover:bg-gray-100"
              >
                <ChevronLeft size={24} />
              </button>

              <div className="overflow-hidden mx-4">
                <div className="flex transition-transform duration-300 ease-in-out"
                     style={{ transform: `translateX(-${currentSlide * 280}px)` }}>
                  {foodItems.map((item) => (
                    <div key={item.id} className="flex-none w-64 mr-4">
                      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                          <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                          <p className="text-orange-500 font-bold mt-2">{item.price}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button 
                onClick={nextSlide}
                className="p-2 rounded-full bg-white shadow-lg hover:bg-gray-100"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* About Section */}
            <div>
              <h3 className="text-xl font-bold mb-4">About FoodieHub</h3>
              <p className="text-gray-300">
                Delivering happiness to your doorstep with the best selection of restaurants and cuisines in your area.
              </p>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-xl font-bold mb-4">Contact Us</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Phone size={18} className="mr-2" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center">
                  <Mail size={18} className="mr-2" />
                  <span>support@foodiehub.com</span>
                </div>
                <div className="flex items-center">
                  <MapPin size={18} className="mr-2" />
                  <span>123 Food Street, NY 10001</span>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div>
              <h3 className="text-xl font-bold mb-4">Hours</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Clock size={18} className="mr-2" />
                  <span>Mon-Fri: 9:00 AM - 10:00 PM</span>
                </div>
                <div className="flex items-center">
                  <Clock size={18} className="mr-2" />
                  <span>Sat-Sun: 10:00 AM - 11:00 PM</span>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h3 className="text-xl font-bold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-orange-500 transition-colors">
                  <Facebook size={24} />
                </a>
                <a href="#" className="hover:text-orange-500 transition-colors">
                  <Twitter size={24} />
                </a>
                <a href="#" className="hover:text-orange-500 transition-colors">
                  <Instagram size={24} />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2025 FoodieHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;