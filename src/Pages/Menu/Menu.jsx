import { useState, useEffect } from 'react';
import { Plus, X, Edit, Trash2 } from 'lucide-react';
import { useParams } from 'react-router-dom';
import MenuService from '../../services/MenuService';
import { toast } from 'react-toastify';

const MenuManagement = () => {
  const { restaurantId } = useParams();

  const [showForm, setShowForm] = useState(false);
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

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMenus();
  }, [restaurantId]);

  const fetchMenus = async () => {
    try {
      const data = await MenuService.getAll(restaurantId);
      setMenus(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load menus for this restaurant.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEdit = (menu) => {
    setFormData(menu);
    setEditingId(menu.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      try {
        await MenuService.delete(restaurantId, id);
        setMenus(prev => prev.filter(menu => menu.id !== id));
        toast.success("Menu item deleted safely!");
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete menu item.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const updated = await MenuService.update(restaurantId, editingId, formData);
        setMenus(prev => prev.map(menu => menu.id === editingId ? updated : menu));
        setEditingId(null);
        toast.success("Menu item updated!");
      } else {
        const newMenu = await MenuService.create(restaurantId, formData);
        setMenus(prev => [newMenu, ...prev]);
        toast.success("New menu item created!");
      }
      setFormData({ name: '', description: '', price: '', ingredients: '', portionSize: '', category: '' });
      setShowForm(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to save menu details.");
    }
  };

  return (
    <div className="w-full h-full p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Menu Management</h1>
          <button onClick={() => { setEditingId(null); setShowForm(true); }} className="flex items-center space-x-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600">
            <Plus size={20} /> <span>Add Menu Item</span>
          </button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">{editingId ? 'Edit Menu Item' : 'Add New Menu Item'}</h2>
                <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700"><X size={24} /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                {['name', 'description', 'price', 'ingredients', 'portionSize', 'category'].map(field => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700">{field.replace(/([A-Z])/g, ' $1')}</label>
                    <input type="text" name={field} value={formData[field]} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md" required />
                  </div>
                ))}
                <div className="flex justify-end space-x-4">
                  <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-700 border rounded-md">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600">{editingId ? 'Update' : 'Create'}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menus.map(menu => (
            <div key={menu.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-800">{menu.name}</h3>
                <div className="flex space-x-2">
                  <button onClick={() => handleEdit(menu)} className="text-blue-600 hover:text-blue-800"><Edit size={18} /></button>
                  <button onClick={() => handleDelete(menu.id)} className="text-red-600 hover:text-red-800"><Trash2 size={18} /></button>
                </div>
              </div>
              <p className="text-gray-600 mb-4">{menu.description}</p>
              <div className="space-y-2">
                <p><span className="font-medium">Price:</span> ${menu.price}</p>
                <p><span className="font-medium">Ingredients:</span> {menu.ingredients}</p>
                <p><span className="font-medium">Portion Size:</span> {menu.portionSize}</p>
                <p><span className="font-medium">Category:</span> {menu.category}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenuManagement;
