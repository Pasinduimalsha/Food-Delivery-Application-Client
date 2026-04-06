import { useState } from 'react';
import { ChevronLeft, ChevronRight, } from 'lucide-react';
// import Navbar from '../../components/Navbar';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Rest of the component remains the same
  const foodItems = [
    { id: 1, name: 'Pizza Margherit', price: '$12.99', image: '/api/placeholder/200/200' },
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
      {/* Navbar
    //  <Navbar/> */}

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
      
    </div>
  );
};

export default Home;