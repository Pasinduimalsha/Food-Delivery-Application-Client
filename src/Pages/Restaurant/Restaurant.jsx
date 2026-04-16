import { useState, useEffect } from 'react';
import { Clock, Phone, MapPin, Mail, Plus, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import RestaurantService from '../../services/RestaurantService';
import { toast } from 'react-toastify';

const Restaurant = () => {
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [restaurantToDelete, setRestaurantToDelete] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const data = await RestaurantService.getAll();
      setRestaurants(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch restaurants. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    contact_number: '',
    open_hours: '',
    status: 'Open'
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

  const handleDeleteClick = (restaurant) => {
    setRestaurantToDelete(restaurant);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (restaurantToDelete) {
      try {
        await RestaurantService.delete(restaurantToDelete.id);
        setRestaurants(prev => 
          prev.filter(restaurant => restaurant.id !== restaurantToDelete.id)
        );
        toast.success("Restaurant deleted safely!");
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete restaurant.");
      } finally {
        setShowDeleteModal(false);
        setRestaurantToDelete(null);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const updated = await RestaurantService.update(editingId, formData);
        setRestaurants(prev => prev.map(restaurant => 
          restaurant.id === editingId ? updated : restaurant
        ));
        setEditingId(null);
        toast.success("Restaurant updated successfully!");
      } else {
        const newRestaurant = await RestaurantService.create(formData);
        setRestaurants(prev => [newRestaurant, ...prev]);
        toast.success("New Restaurant Created!");
      }

      setFormData({
        name: '',
        description: '',
        location: '',
        contact_number: '',
        open_hours: '',
        status: 'Open'
      });
      setShowForm(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to save restaurant details.");
    }
  };

  const DeleteConfirmationModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Confirm Delete</h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete `${restaurantToDelete?.name}`? 
          This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => {
              setShowDeleteModal(false);
              setRestaurantToDelete(null);
            }}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={confirmDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Delete Restaurant
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full h-full p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Restaurant Management</h1>
          <button
            onClick={() => {
              setEditingId(null);
              setFormData({
                name: '',
                description: '',
                location: '',
                contact_number: '',
                open_hours: '',
                status: 'Open'
              });
              setShowForm(true);
            }}
            className="flex items-center space-x-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            <Plus size={20} />
            <span>Add Restaurant</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map(restaurant => (
            <div
              key={restaurant.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-800">{restaurant.name}</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(restaurant)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(restaurant)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={18} />
                  </button>
                  <button
                onClick={() => navigate(`/restaurant/${restaurant.id}/menu`)}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
              >
                M
              </button>
                </div>
              </div>
              
              <p className="text-gray-600 mb-4">{restaurant.description}</p>
              
              <div className="space-y-2">
                <div className="flex items-center text-gray-600">
                  <Clock size={18} className="mr-2" />
                  <span>{restaurant.open_hours}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone size={18} className="mr-2" />
                  <span>{restaurant.contact_number}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin size={18} className="mr-2" />
                  <span>{restaurant.location}</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <span className={`inline-block px-3 py-1 rounded-full text-sm ${restaurant.status === 'Open' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {restaurant.status || 'Closed'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-xl font-bold text-gray-900 mb-4">{editingId ? 'Edit Restaurant' : 'Add Restaurant'}</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Contact Number</label>
                  <input
                    type="text"
                    name="contact_number"
                    value={formData.contact_number}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Open Hours</label>
                  <input
                    type="text"
                    name="open_hours"
                    value={formData.open_hours}
                    onChange={handleInputChange}
                    placeholder="e.g. 08:00-22:00"
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="Open">Open</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                 
                  <button
                    type="submit"
                    className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                  >
                    {editingId ? 'Update Restaurant' : 'Add Restaurant'}
                  </button>
                  
                </div>
              </form>
            </div>
          </div>
        )}

        {showDeleteModal && <DeleteConfirmationModal />}
      </div>
    </div>
  );
};

export default Restaurant;