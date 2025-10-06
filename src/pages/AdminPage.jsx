import { useState, useEffect } from 'react';
import supabase from '../supabase'; // ✅ make sure this path is correct

function AdminPage({ user }) {
  const [activeTab, setActiveTab] = useState('shops');
  const [shops, setShops] = useState([]);
  const [Content, setContent] = useState([]);
  const [newShop, setNewShop] = useState({
    Name: '',
    Latitude: '',
    Longitude: '',
    StoreHours: '',
    PriceRange: '',
    Category: [],
    Image: '',
  });
  const [editingShop, setEditingShop] = useState(null);

  // ✅ Fetch thrift shops from Supabase
  const fetchShops = async () => {
    try {
      const { data, error } = await supabase.from('THRIFT SHOP').select('*');
      if (error) throw error;
      setShops(data || []);
    } catch (err) {
      console.error('Error fetching thrift shops:', err.message);
    }
  };

  // ✅ Fetch Content (example: from "Content" table if exists)
  const fetchContent = async () => {
    try {
      const { data, error } = await supabase.from('COMMENT').select('*');
      if (error) throw error;
      setContent(data || []);
    } catch (err) {
      console.error('Error fetching Content:', err.message);
    }
  };

  useEffect(() => {
    fetchShops();
    fetchContent();
  }, []);

  // ✅ Add new shop
  const handleAddShop = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('THRIFT SHOP').insert([
        {
          Name: newShop.Name,
          Latitude: parseFloat(newShop.Latitude),
          Longitude: parseFloat(newShop.Longitude),
          StoreHours: newShop.StoreHours,
          PriceRange: newShop.PriceRange,
          Category: newShop.Category,
          Image: newShop.Image,
          AdminID: user?.id || null,
        },
      ]);
      if (error) throw error;
      await fetchShops();
      setNewShop({
        Name: '',
        Latitude: '',
        Longitude: '',
        StoreHours: '',
        PriceRange: '',
        Category: [],
        Image: '',
      });
    } catch (err) {
      console.error('Error adding shop:', err.message);
    }
  };

  // ✅ Edit shop (prefill)
  const handleEditShop = (shop) => {
    setEditingShop(shop);
    setNewShop(shop);
  };

  // ✅ Update existing shop
  const handleUpdateShop = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('THRIFT SHOP')
        .update({
          Name: newShop.Name,
          Latitude: parseFloat(newShop.Latitude),
          Longitude: parseFloat(newShop.Longitude),
          StoreHours: newShop.StoreHours,
          PriceRange: newShop.PriceRange,
          Category: newShop.Category,
          Image: newShop.Image,
        })
        .eq('ShopID', editingShop.ShopID);
      if (error) throw error;
      await fetchShops();
      setEditingShop(null);
      setNewShop({
        Name: '',
        Latitude: '',
        Longitude: '',
        StoreHours: '',
        PriceRange: '',
        Category: [],
        Image: '',
      });
    } catch (err) {
      console.error('Error updating shop:', err.message);
    }
  };

  // ✅ Delete a shop
  const handleDeleteShop = async (ShopID) => {
    try {
      const { error } = await supabase.from('THRIFT SHOP').delete().eq('ShopID', ShopID);
      if (error) throw error;
      await fetchShops();
    } catch (err) {
      console.error('Error deleting shop:', err.message);
    }
  };

  // ✅ Delete a comment
  const handleDeleteComment = async (commentId) => {
    try {
      const { error } = await supabase.from('COMMENT').delete().eq('id', ComID);
      if (error) throw error;
      await fetchContent();
    } catch (err) {
      console.error('Error deleting comment:', err.message);
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] bg-gray-100 py-10">
      <div className="max-w-6xl mx-auto px-5">
        <div className="text-center mb-10">
          <h1 className="text-gray-800 text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-600 text-lg">Manage thrift shops and moderate Content</p>
        </div>

        {/* Tabs */}
        <div className="flex bg-white rounded-lg p-2 mb-8 shadow-lg">
          <button
            onClick={() => setActiveTab('shops')}
            className={`flex-1 py-4 px-5 cursor-pointer text-base font-medium rounded-md transition-all
              ${activeTab === 'shops'
                ? 'bg-white text-[#2C6E49] border border-[#2C6E49] shadow-sm'
                : 'bg-[#2C6E49] text-white hover:bg-[#25573A]'}`}
          >
            Thrift Shops
          </button>

          <button
            onClick={() => setActiveTab('Content')}
            className={`flex-1 py-4 px-5 cursor-pointer text-base font-medium rounded-md transition-all
              ${activeTab === 'Content'
                ? 'bg-white text-[#2C6E49] border border-[#2C6E49] shadow-sm'
                : 'bg-[#2C6E49] text-white hover:bg-[#25573A]'}`}
          >
            Comment Moderation
          </button>
        </div>

        {/* Thrift Shops Management */}
        {activeTab === 'shops' && (
          <div className="bg-white rounded-lg p-8 shadow-lg">
            <div className="mb-10">
              <h2 className="text-gray-800 mb-5 text-2xl font-bold border-b-2 border-gray-100 pb-2">
                {editingShop ? 'Edit Thrift Shop' : 'Add New Thrift Shop'}
              </h2>
              <form
                onSubmit={editingShop ? handleUpdateShop : handleAddShop}
                className="bg-gray-100 p-6 rounded-lg mb-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  {/* Name */}
                  <div>
                    <label className="block mb-2 text-gray-800 font-medium">Shop Name</label>
                    <input
                      type="text"
                      value={newShop.Name}
                      onChange={(e) => setNewShop({ ...newShop, Name: e.target.value })}
                      required
                      className="w-full px-3 py-3 border-2 border-gray-200 rounded-md"
                      placeholder="Enter shop name"
                    />
                  </div>

                  {/* Image */}
                  <div>
                    <label className="block mb-2 text-gray-800 font-medium">Image URL</label>
                    <input
                      type="text"
                      value={newShop.Image}
                      onChange={(e) => setNewShop({ ...newShop, Image: e.target.value })}
                      className="w-full px-3 py-3 border-2 border-gray-200 rounded-md"
                      placeholder="Paste image link"
                    />
                  </div>

                  {/* Latitude */}
                  <div>
                    <label className="block mb-2 text-gray-800 font-medium">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      value={newShop.Latitude}
                      onChange={(e) => setNewShop({ ...newShop, Latitude: e.target.value })}
                      required
                      className="w-full px-3 py-3 border-2 border-gray-200 rounded-md"
                    />
                  </div>

                  {/* Longitude */}
                  <div>
                    <label className="block mb-2 text-gray-800 font-medium">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      value={newShop.Longitude}
                      onChange={(e) => setNewShop({ ...newShop, Longitude: e.target.value })}
                      required
                      className="w-full px-3 py-3 border-2 border-gray-200 rounded-md"
                    />
                  </div>

                  {/* StoreHours */}
                  <div>
                    <label className="block mb-2 text-gray-800 font-medium">Store Hours</label>
                    <input
                      type="text"
                      value={newShop.StoreHours}
                      onChange={(e) => setNewShop({ ...newShop, StoreHours: e.target.value })}
                      required
                      className="w-full px-3 py-3 border-2 border-gray-200 rounded-md"
                    />
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="block mb-2 text-gray-800 font-medium">Price Range</label>
                    <input
                      type="text"
                      value={newShop.PriceRange}
                      onChange={(e) => setNewShop({ ...newShop, PriceRange: e.target.value })}
                      required
                      className="w-full px-3 py-3 border-2 border-gray-200 rounded-md"
                    />
                  </div>
                </div>

                <div className="mb-5">
                  <label className="block mb-2 text-gray-800 font-medium">Category</label>
                  <div className="flex gap-5 flex-wrap">
                    {['clothing', 'shoes', 'bags', 'accessories'].map((type) => (
                      <label key={type} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newShop.Category?.includes(type)}
                          onChange={(e) => {
                            const updated = e.target.checked
                              ? [...(newShop.Category || []), type]
                              : newShop.Category.filter((t) => t !== type);
                            setNewShop({ ...newShop, Category: updated });
                          }}
                        />
                        {type}
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-md text-sm font-medium transition-all bg-[#2C6E49] text-white hover:bg-[#25573A]"
                >
                  {editingShop ? 'Update Shop' : 'Add Shop'}
                </button>
                {editingShop && (
                  <button
                    type="button"
                    className="ml-3 px-6 py-3 border-2 border-[#2C6E49] text-[#2C6E49] rounded-md hover:bg-[#2C6E49] hover:text-white transition-all"
                    onClick={() => {
                      setEditingShop(null);
                      setNewShop({
                        Name: '',
                        Latitude: '',
                        Longitude: '',
                        StoreHours: '',
                        PriceRange: '',
                        Category: [],
                        Image: '',
                      });
                    }}
                  >
                    Cancel
                  </button>
                )}
              </form>
            </div>

            <div>
              <h2 className="text-gray-800 mb-5 text-2xl font-bold border-b-2 border-gray-100 pb-2">
                Manage Thrift Shops
              </h2>
              <div className="grid gap-5">
                {shops.map((shop) => (
                  <div
                    key={shop.ShopID}
                    className="bg-gray-100 p-5 rounded-lg border-l-4 border-[#2C6E49] flex justify-between items-center"
                  >
                    <div className="flex-1">
                      <h3 className="text-gray-800 mb-2">{shop.Name}</h3>
                      <p className="text-gray-600"><strong>Hours:</strong> {shop.StoreHours}</p>
                      <p className="text-gray-600"><strong>Price Range:</strong> {shop.PriceRange}</p>
                      <p className="text-gray-600"><strong>Category:</strong> {shop.Category?.join(', ')}</p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <button
                        className="px-6 py-2 border-2 border-[#2C6E49] text-[#2C6E49] bg-white rounded-md hover:bg-[#2C6E49] hover:text-white transition-all"
                        onClick={() => handleEditShop(shop)}
                      >
                        Edit
                      </button>
                      <button
                        className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-all"
                        onClick={() => handleDeleteShop(shop.ShopID)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Comment Moderation */}
        {activeTab === 'Content' && (
          <div className="bg-white rounded-lg p-8 shadow-lg">
            <h2 className="text-gray-800 mb-5 text-2xl font-bold border-b-2 border-gray-100 pb-2">
              Comment Moderation ({Content.length} total)
            </h2>
            <div className="grid gap-5">
              {Content.map((comment) => (
                <div
                  key={comment.id}
                  className="bg-gray-100 p-5 rounded-lg border-l-4 border-[#2C6E49] flex justify-between items-center"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">@{comment.user}</p>
                    <p className="text-gray-700 mt-1 italic">"{comment.content}"</p>
                    <div className="text-sm text-gray-600 mt-2">
                      <span className="font-semibold">Shop:</span> {comment.shop} &nbsp;
                      <span className="font-semibold">Date:</span> {comment.date}
                    </div>
                  </div>
                  <button
                    className="bg-[#E63946] hover:bg-[#C92D39] text-white px-4 py-2 rounded-md text-sm font-medium"
                    onClick={() => handleDeleteComment(comment.id)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPage;
