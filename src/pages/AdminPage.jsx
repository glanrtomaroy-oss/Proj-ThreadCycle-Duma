import { useState, useEffect } from 'react';
import supabase from '../supabase'; // ✅ make sure path matches your project

function AdminPage({ user }) {
  const [activeTab, setActiveTab] = useState('shops');
  const [shops, setShops] = useState([]);
  const [comments, setComments] = useState([]);
  const [newShop, setNewShop] = useState({
    name: '',
    latitude: '',
    longitude: '',
    hours: '',
    priceRange: '',
    itemTypes: [],
    image: '',
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

  // ✅ Fetch comments (Status = visible)
  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('COMMENT')
        .select('*')
        .eq('Status', 'visible');
      if (error) throw error;
      setComments(data || []);
    } catch (err) {
      console.error('Error fetching comments:', err.message);
    }
  };

  useEffect(() => {
    fetchShops();
    fetchComments();
  }, []);

  // ✅ Delete shop (also remove from Supabase)
  const handleDeleteShop = async (shopId) => {
    try {
      const { error } = await supabase.from('THRIFT SHOP').delete().eq('ShopID', shopId);
      if (error) throw error;
      setShops((prev) => prev.filter((s) => s.ShopID !== shopId));
    } catch (err) {
      console.error('Error deleting shop:', err.message);
    }
  };

  // ✅ Add new shop
  const handleAddShop = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('THRIFT SHOP').insert([
        {
          Name: newShop.name,
          Latitude: parseFloat(newShop.latitude),
          Longitude: parseFloat(newShop.longitude),
          StoreHours: newShop.hours,
          PriceRange: newShop.priceRange,
          Category: newShop.itemTypes.join(', '),
          Image: newShop.image,
          AdminID: user?.id || null,
        },
      ]);
      if (error) throw error;
      setNewShop({
        name: '',
        latitude: '',
        longitude: '',
        hours: '',
        priceRange: '',
        itemTypes: [],
        image: '',
      });
      fetchShops();
    } catch (err) {
      console.error('Error adding shop:', err.message);
    }
  };

  // ✅ Edit/update shop
  const handleEditShop = (shop) => {
    setEditingShop(shop);
    setNewShop({
      name: shop.Name,
      latitude: shop.Latitude,
      longitude: shop.Longitude,
      hours: shop.StoreHours,
      priceRange: shop.PriceRange,
      itemTypes: shop.Category ? shop.Category.split(', ') : [],
      image: shop.Image,
    });
  };

  const handleUpdateShop = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('THRIFT SHOP')
        .update({
          Name: newShop.name,
          Latitude: parseFloat(newShop.latitude),
          Longitude: parseFloat(newShop.longitude),
          StoreHours: newShop.hours,
          PriceRange: newShop.priceRange,
          Category: newShop.itemTypes.join(', '),
          Image: newShop.image,
        })
        .eq('ShopID', editingShop.ShopID);

      if (error) throw error;

      setEditingShop(null);
      setNewShop({
        name: '',
        latitude: '',
        longitude: '',
        hours: '',
        priceRange: '',
        itemTypes: [],
        image: '',
      });
      fetchShops();
    } catch (err) {
      console.error('Error updating shop:', err.message);
    }
  };

  // ✅ Delete comment
  const handleDeleteComment = async (commentId) => {
    try {
      const { error } = await supabase.from('COMMENT').delete().eq('CommentID', commentId);
      if (error) throw error;
      setComments((prev) => prev.filter((c) => c.CommentID !== commentId));
    } catch (err) {
      console.error('Error deleting comment:', err.message);
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] bg-gray-100 py-10">
      <div className="max-w-6xl mx-auto px-5">
        <div className="text-center mb-10">
          <h1 className="text-gray-800 text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-600 text-lg">Manage thrift shops and moderate comments</p>
        </div>

        {/* Tabs */}
        <div className="flex bg-white rounded-lg p-2 mb-8 shadow-lg">
          <button
            onClick={() => setActiveTab('shops')}
            className={`flex-1 py-4 px-5 text-base font-medium rounded-md transition-all ${
              activeTab === 'shops'
                ? 'bg-white text-[#2C6E49] border border-[#2C6E49] shadow-sm'
                : 'bg-[#2C6E49] text-white hover:bg-[#25573A]'
            }`}
          >
            Thrift Shops
          </button>
          <button
            onClick={() => setActiveTab('comments')}
            className={`flex-1 py-4 px-5 text-base font-medium rounded-md transition-all ${
              activeTab === 'comments'
                ? 'bg-white text-[#2C6E49] border border-[#2C6E49] shadow-sm'
                : 'bg-[#2C6E49] text-white hover:bg-[#25573A]'
            }`}
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
                  {/* Shop Name */}
                  <div>
                    <label className="block mb-2 text-gray-800 font-medium">Shop Name</label>
                    <input
                      type="text"
                      value={newShop.name}
                      onChange={(e) => setNewShop({ ...newShop, name: e.target.value })}
                      className="w-full px-3 py-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#2C6E49]"
                      required
                    />
                  </div>

                  {/* Image URL */}
                  <div>
                    <label className="block mb-2 text-gray-800 font-medium">Image URL</label>
                    <input
                      type="text"
                      value={newShop.image}
                      onChange={(e) => setNewShop({ ...newShop, image: e.target.value })}
                      className="w-full px-3 py-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#2C6E49]"
                    />
                  </div>

                  {/* Latitude */}
                  <div>
                    <label className="block mb-2 text-gray-800 font-medium">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      value={newShop.latitude}
                      onChange={(e) => setNewShop({ ...newShop, latitude: e.target.value })}
                      className="w-full px-3 py-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#2C6E49]"
                      required
                    />
                  </div>

                  {/* Longitude */}
                  <div>
                    <label className="block mb-2 text-gray-800 font-medium">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      value={newShop.longitude}
                      onChange={(e) => setNewShop({ ...newShop, longitude: e.target.value })}
                      className="w-full px-3 py-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#2C6E49]"
                      required
                    />
                  </div>

                  {/* Hours */}
                  <div>
                    <label className="block mb-2 text-gray-800 font-medium">Operating Hours</label>
                    <input
                      type="text"
                      value={newShop.hours}
                      onChange={(e) => setNewShop({ ...newShop, hours: e.target.value })}
                      className="w-full px-3 py-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#2C6E49]"
                      required
                    />
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="block mb-2 text-gray-800 font-medium">Price Range</label>
                    <input
                      type="text"
                      value={newShop.priceRange}
                      onChange={(e) => setNewShop({ ...newShop, priceRange: e.target.value })}
                      className="w-full px-3 py-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#2C6E49]"
                      required
                    />
                  </div>
                </div>

                {/* Item Types */}
                <div className="mb-5">
                  <label className="block mb-2 text-gray-800 font-medium">Item Types</label>
                  <div className="flex gap-5 flex-wrap">
                    {['clothing', 'shoes', 'bags', 'accessories'].map((type) => (
                      <label key={type} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newShop.itemTypes.includes(type)}
                          onChange={(e) => {
                            const types = e.target.checked
                              ? [...newShop.itemTypes, type]
                              : newShop.itemTypes.filter((t) => t !== type);
                            setNewShop({ ...newShop, itemTypes: types });
                          }}
                        />
                        {type.charAt(0).toUpperCase() + type.slice(1)}
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
                        name: '',
                        latitude: '',
                        longitude: '',
                        hours: '',
                        priceRange: '',
                        itemTypes: [],
                        image: '',
                      });
                    }}
                  >
                    Cancel
                  </button>
                )}
              </form>
            </div>

            {/* Display shops from Supabase */}
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
                      <p className="my-1 text-gray-600">
                        <strong>Hours:</strong> {shop.StoreHours}
                      </p>
                      <p className="my-1 text-gray-600">
                        <strong>Price Range:</strong> {shop.PriceRange}
                      </p>
                      <p className="my-1 text-gray-600">
                        <strong>Items:</strong> {shop.Category}
                      </p>
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
        {activeTab === 'comments' && (
          <div className="bg-white rounded-lg p-8 shadow-lg">
            <h2 className="text-gray-800 mb-5 text-2xl font-bold border-b-2 border-gray-100 pb-2">
              Comment Moderation ({comments.length} total)
            </h2>
            <div className="grid gap-5">
              {comments.map((comment) => (
                <div
                  key={comment.CommentID}
                  className="bg-gray-100 p-5 rounded-lg border-l-4 border-[#2C6E49] flex justify-between items-center"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">Comment ID: {comment.CommentID}</p>
                    <p className="text-gray-700 mt-1 italic">"{comment.Content}"</p>
                    <div className="text-sm text-gray-600 mt-2">
                      <span className="font-semibold">Shop ID:</span> {comment.ShopID} &nbsp;
                      <span className="font-semibold">Date:</span> {comment.CreationDate}
                    </div>
                  </div>
                  <button
                    className="bg-[#E63946] hover:bg-[#C92D39] text-white px-4 py-2 rounded-md text-sm font-medium"
                    onClick={() => handleDeleteComment(comment.CommentID)}
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
