import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Clock, Phone, MapPin, Mail, Plus, X, Edit, Trash2 } from 'lucide-react';
import "../Restaurant.css"

const RestaurantManagement = () => {
  const initialRestaurants = [
    {
      id: 1,
      name: "Italian Delight",
      contactPerson: "Marco Rossi",
      phone: "+1 (555) 123-4567",
      email: "info@italiandelight.com",
      address: "123 Pasta Street, Italian Quarter, NY 10001",
      openTime: "11:00",
      closeTime: "22:00",
      cuisine: "Italian",
      description: "Authentic Italian cuisine featuring homemade pasta and wood-fired pizzas."
    },
    {
      id: 2,
      name: "Sushi Master",
      contactPerson: "Yuki Tanaka",
      phone: "+1 (555) 234-5678",
      email: "contact@sushimaster.com",
      address: "456 Ocean Avenue, Japanese District, NY 10002",
      openTime: "12:00",
      closeTime: "23:00",
      cuisine: "Japanese",
      description: "Premium sushi and sashimi prepared by master chefs using fresh ingredients."
    },
    {
      id: 3,
      name: "Spice Paradise",
      contactPerson: "Raj Patel",
      phone: "+1 (555) 345-6789",
      email: "info@spiceparadise.com",
      address: "789 Curry Lane, Spice Market, NY 10003",
      openTime: "10:30",
      closeTime: "22:30",
      cuisine: "Indian",
      description: "Aromatic Indian dishes with authentic spices and traditional recipes."
    }
  ];

  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [restaurants, setRestaurants] = useState(initialRestaurants);
  const [restaurentId, setRestaurantId] = useState('')
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    openTime: '',
    closeTime: '',
    cuisine: '',
    description: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEdit = (restaurant) => {
    setFormData(restaurant);
    setEditingId(restaurant.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this restaurant?')) {
      setRestaurants(prev => prev.filter(restaurant => restaurant.id !== id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      // Update existing restaurant
      setRestaurants(prev => prev.map(restaurant => 
        restaurant.id === editingId ? { ...formData, id: editingId } : restaurant
      ));
      setEditingId(null);
    } else {
      // Create new restaurant
      const newRestaurant = {
        id: Date.now(),
        ...formData
      };
      setRestaurants(prev => [newRestaurant, ...prev]);
    }

    // Reset form
    setFormData({
      name: '',
      contactPerson: '',
      phone: '',
      email: '',
      address: '',
      openTime: '',
      closeTime: '',
      cuisine: '',
      description: ''
    });
    setShowForm(false);
  };

  const handleRestaurantClick = (restaurantId) => {
    setRestaurantId(restaurantId);
    navigate('/menu/' + restaurantId);
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Restaurant Management</h1>
          <button
            onClick={() => {
              setEditingId(null);
              setFormData({
                name: '',
                contactPerson: '',
                phone: '',
                email: '',
                address: '',
                openTime: '',
                closeTime: '',
                cuisine: '',
                description: ''
              });
              setShowForm(true);
            }}
            className="flex items-center space-x-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            <Plus size={20} />
            <span>Add Restaurant</span>
          </button>
        </div>

        {/* Restaurant Creation/Edit Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingId ? 'Edit Restaurant' : 'Add New Restaurant'}
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Form fields remain the same */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Restaurant Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Person
                    </label>
                    <input
                      type="text"
                      name="contactPerson"
                      value={formData.contactPerson}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Opening Time
                    </label>
                    <input
                      type="time"
                      name="openTime"
                      value={formData.openTime}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Closing Time
                    </label>
                    <input
                      type="time"
                      name="closeTime"
                      value={formData.closeTime}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cuisine Type
                    </label>
                    <input
                      type="text"
                      name="cuisine"
                      value={formData.cuisine}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows="2"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                  >
                    {editingId ? 'Update Restaurant' : 'Create Restaurant'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Restaurant List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map(restaurant => (
            <div
              key={restaurant.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              onClick={() => handleRestaurantClick(restaurant.id)}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-800">{restaurant.name}</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleRestaurantClick(restaurant.id)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); 
                      handleEdit(restaurant);
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(restaurant.id);
                    }}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              
              <p className="text-gray-600 mb-4">{restaurant.description}</p>
              
              <div className="space-y-2">
                <div className="flex items-center text-gray-600">
                  <Clock size={18} className="mr-2" />
                  <span>{restaurant.openTime} - {restaurant.closeTime}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone size={18} className="mr-2" />
                  <span>{restaurant.phone}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Mail size={18} className="mr-2" />
                  <span>{restaurant.email}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin size={18} className="mr-2" />
                  <span>{restaurant.address}</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <span className="inline-block bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
                  {restaurant.cuisine}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RestaurantManagement;