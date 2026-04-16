import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Star, Clock } from 'lucide-react';
import { toast } from 'react-toastify';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const foodItems = [
    { id: 1, name: 'Margherita Pizza', price: '$12.99', rating: '4.8', delivery: '20-30 min', image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?q=80&w=600&auto=format&fit=crop' },
    { id: 2, name: 'Burger Deluxe', price: '$9.99', rating: '4.9', delivery: '15-25 min', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=600&auto=format&fit=crop' },
    { id: 3, name: 'Sushi Platter', price: '$24.99', rating: '4.7', delivery: '30-40 min', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=600&auto=format&fit=crop' },
    { id: 4, name: 'Pasta Carbonara', price: '$14.99', rating: '4.8', delivery: '20-30 min', image: 'https://images.unsplash.com/photo-1612874742237-652622158872?q=80&w=600&auto=format&fit=crop' },
    { id: 5, name: 'Fresh Salad', price: '$8.99', rating: '4.6', delivery: '10-20 min', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=600&auto=format&fit=crop' },
    { id: 6, name: 'Steak Ribeye', price: '$29.99', rating: '4.9', delivery: '35-45 min', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600&auto=format&fit=crop' }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => Math.min(prev + 1, foodItems.length - 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div className="font-sans pb-12">
      {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-3xl overflow-hidden shadow-2xl relative flex flex-col md:flex-row items-center">
            <div className="absolute inset-0 bg-black opacity-20 pointer-events-none"></div>
            <div className="w-full md:w-1/2 p-10 md:p-16 z-10 text-white flex flex-col justify-center">
              <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-sm font-semibold mb-6 border border-white/30 w-max">
                🚀 Super Fast Delivery
              </span>
              <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
                Satisfy Your <br />Cravings <span className="text-yellow-300">Instantly.</span>
              </h1>
              <p className="text-lg text-white/90 mb-8 max-w-md line-clamp-3">
                Discover the best food and drinks in your city. From heartwarming comfort food to exotic delicacies, delivered hot to your door within minutes.
              </p>
              <button 
                onClick={() => toast.info('Loading full menu... Coming soon!')}
                className="flex items-center space-x-2 bg-white text-orange-600 px-8 py-4 rounded-full font-bold hover:bg-gray-100 hover:scale-105 transition-all shadow-xl w-max"
              >
                <span>Explore Menu</span>
                <ArrowRight size={20} />
              </button>
            </div>
            <div className="w-full md:w-1/2 h-64 md:h-[500px] z-10 flex border-l-0 md:border-l border-white/20 relative">
               <img 
                 src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop" 
                 alt="Delicious Food Spread" 
                 className="w-full h-full object-cover rounded-b-3xl md:rounded-bl-none md:rounded-r-3xl"
               />
               <div className="absolute inset-0 bg-gradient-to-l from-transparent to-orange-500/50 md:to-pink-500/50 pointer-events-none mix-blend-multiply"></div>
            </div>
          </div>
        </div>

        {/* Trending Food Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Trending <span className="gradient-text">Food</span></h2>
              <p className="text-gray-500 mt-2">People's favorite choices right now</p>
            </div>
            <div className="hidden sm:flex space-x-3">
              <button 
                onClick={prevSlide}
                disabled={currentSlide === 0}
                className={`p-3 rounded-full flex items-center justify-center transition-all ${currentSlide === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white shadow-md text-gray-800 hover:bg-orange-50'}`}
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={nextSlide}
                disabled={currentSlide >= foodItems.length - 3}
                className={`p-3 rounded-full flex items-center justify-center transition-all ${currentSlide >= foodItems.length - 3 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white shadow-md text-gray-800 hover:bg-orange-50'}`}
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
          
          {/* Food Slider */}
          <div className="relative overflow-hidden w-full px-2 py-4">
            <div 
              className="flex transition-transform duration-500 ease-in-out gap-6"
              style={{ transform: `translateX(calc(-${currentSlide * (100/3)}% - ${currentSlide * 0.5}rem))` }}
            >
              {foodItems.map((item) => (
                <div key={item.id} className="min-w-[85vw] sm:min-w-[300px] md:min-w-[32%] flex-none group">
                  <div className="bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full transform hover:-translate-y-2">
                    <div className="relative h-56 overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                      />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center space-x-1 shadow-sm">
                        <Star className="text-yellow-400 fill-current" size={14} />
                        <span className="text-sm font-bold text-gray-800">{item.rating}</span>
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">{item.name}</h3>
                        <span className="text-lg font-black text-orange-500 bg-orange-50 px-2 py-1 rounded-md">{item.price}</span>
                      </div>
                      <div className="flex items-center text-gray-500 text-sm mt-auto pt-4">
                         <Clock size={16} className="mr-2 text-gray-400" />
                         <span>{item.delivery} delivery</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
    </div>
  );
};

export default Home;