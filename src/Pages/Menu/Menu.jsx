import { useState, useEffect } from 'react';
import { Plus, X, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const MenuManagement = () => {

    const { restaurantId } = useParams();
    console.log(restaurantId);

    

  const initialMenus = [
    {
      id: 1,
      restaurantId: 1,
      name: "Spaghetti Carbonara",
      description: "Classic Italian pasta with creamy egg sauce, pancetta, and parmesan.",
      price: 12.99,
      ingredients: ["Spaghetti", "Eggs", "Pancetta", "Parmesan", "Black Pepper"],
      portionSize: "Regular",
      category: "Main Course"
    },
    {
      id: 2,
      restaurantId: 1,
      name: "Margherita Pizza",
      description: "Traditional pizza with tomato sauce, fresh mozzarella, and basil.",
      price: 9.99,
      ingredients: ["Pizza Dough", "Tomato Sauce", "Mozzarella", "Basil"],
      portionSize: "Large",
      category: "Main Course"
    },
    {
      id: 3,
      restaurantId: 2,
      name: "Sushi Platter",
      description: "Assorted sushi including tuna, salmon, and California rolls.",
      price: 18.99,
      ingredients: ["Sushi Rice", "Tuna", "Salmon", "Avocado", "Cucumber"],
      portionSize: "Medium",
      category: "Main Course"
    }
  ];

  const [showForm, setShowForm] = useState(false);
  // const [menus, setMenus] = useState(initialMenus.filter(menu => menu.restaurantId === restaurantId));
  const [menus, setMenus] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    ingredients: '',
    portionSize: '',
    category: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const filteredMenus = initialMenus.filter(menu => menu.restaurantId === parseInt(restaurantId));
    setMenus(filteredMenus);
  }, [restaurantId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEdit = (menu) => {
    setFormData(menu);
    setEditingId(menu.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      setMenus(prev => prev.filter(menu => menu.id !== id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      // Update existing menu
      setMenus(prev => prev.map(menu => 
        menu.id === editingId ? { ...formData, id: editingId, restaurantId: parseInt(restaurantId) } : menu
      ));
      setEditingId(null);
    } else {
      // Create new menu
      const newMenu = {
        id: Date.now(),
        restaurantId: parseInt(restaurantId),
        ...formData
      };
      setMenus(prev => [newMenu, ...prev]);
    }

    // Reset form
    setFormData({
      name: '',
      description: '',
      price: '',
      ingredients: '',
      portionSize: '',
      category: ''
    });
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Menu Management</h1>
          <button
            onClick={() => {
              setEditingId(null);
              setFormData({
                name: '',
                description: '',
                price: '',
                ingredients: '',
                portionSize: '',
                category: ''
              });
              setShowForm(true);
            }}
            className="flex items-center space-x-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            <Plus size={20} />
            <span>Add Menu Item</span>
          </button>
        </div>

        {/* Menu Creation/Edit Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingId ? 'Edit Menu Item' : 'Add New Menu Item'}
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Menu Item Name
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
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="2"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ingredients
                    </label>
                    <textarea
                      name="ingredients"
                      value={formData.ingredients}
                      onChange={handleInputChange}
                      rows="2"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Portion Size
                    </label>
                    <input
                      type="text"
                      name="portionSize"
                      value={formData.portionSize}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
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
                    {editingId ? 'Update Menu Item' : 'Create Menu Item'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Menu List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menus.map(menu => (
            <div
              key={menu.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-800">{menu.name}</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(menu)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(menu.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              
              <p className="text-gray-600 mb-4">{menu.description}</p>
              
              <div className="space-y-2">
                <div className="flex items-center text-gray-600">
                  <span className="font-medium">Price:</span>
                  <span className="ml-2">${menu.price}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <span className="font-medium">Ingredients:</span>
                  <span className="ml-2">{menu.ingredients}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <span className="font-medium">Portion Size:</span>
                  <span className="ml-2">{menu.portionSize}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <span className="font-medium">Category:</span>
                  <span className="ml-2">{menu.category}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenuManagement;