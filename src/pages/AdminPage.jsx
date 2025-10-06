import { useState, useEffect } from 'react';
import { supabase } from "../util/supabase";
import { UserAuth } from "../context/AuthContext";

function AdminPage() {
  const { user } = UserAuth();
  const [activeTab, setActiveTab] = useState('shops');
  const [shops, setShops] = useState([]);
  const [comments, setComments] = useState([]);
  const [newShop, setNewShop] = useState({
    name: '',
    latitude: '',
    longitude: '',
    hours: '',
    priceRange: '',
    itemTypes: []
  });
  const [editingShop, setEditingShop] = useState(null);

  // Fetch Shops & Comments from Supabase
  useEffect(() => {
    fetchShops();
    fetchComments();
  }, []);

  // Fetch all thrift shops
  const fetchShops = async () => {
    const { data, error } = await supabase.from('shops').select('*');
    if (error) console.error('Error fetching shops:', error);
    else setShops(data);
  };

  // Fetch all comments
  const fetchComments = async () => {
    const { data, error } = await supabase.from('comments').select('*');
    if (error) console.error('Error fetching comments:', error);
    else setComments(data);
  };

  // Add new thrift shop
  const handleAddShop = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.from('shops').insert([newShop]);
    if (error) console.error('Error adding shop:', error);
    else {
      setShops([...shops, ...data]);
      setNewShop({
        name: '',
        latitude: '',
        longitude: '',
        hours: '',
        priceRange: '',
        itemTypes: []
      });
    }
  };

  // Edit thrift shop
  const handleEditShop = (shop) => {
    setEditingShop(shop);
    setNewShop(shop);
  };

  // Update thrift shop
  const handleUpdateShop = async (e) => {
    e.preventDefault();
    const { error } = await supabase
      .from('shops')
      .update(newShop)
      .eq('id', editingShop.id);

    if (error) console.error('Error updating shop:', error);
    else {
      await fetchShops();
      setEditingShop(null);
      setNewShop({
        name: '',
        latitude: '',
        longitude: '',
        hours: '',
        priceRange: '',
        itemTypes: []
      });
    }
  };

  // Delete thrift shop
  const handleDeleteShop = async (shopId) => {
    const { error } = await supabase.from('shops').delete().eq('id', shopId);
    if (error) console.error('Error deleting shop:', error);
    else fetchShops();
  };

  // Approve or Delete Comment
  const handleApproveComment = async (commentId) => {
    const { error } = await supabase
      .from('comments')
      .update({ status: 'approved' })
      .eq('id', commentId);

    if (error) console.error('Error approving comment:', error);
    else fetchComments();
  };

  const handleDeleteComment = async (commentId) => {
    const { error } = await supabase.from('comments').delete().eq('id', commentId);
    if (error) console.error('Error deleting comment:', error);
    else fetchComments();
  };

  return (
    <div className="min-h-[calc(100vh-200px)] bg-gray-100 py-10">
      <div className="max-w-6xl mx-auto px-5">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-gray-800 text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-600 text-lg">Manage thrift shops and moderate comments</p>
        </div>

        {/* Tabs */}
        <div className="flex bg-white rounded-lg p-2 mb-8 shadow-lg">
          <button
            onClick={() => setActiveTab('shops')}
            className={`flex-1 py-4 px-5 text-base font-medium rounded-md transition-all
              ${activeTab === 'shops'
                ? 'bg-white text-[#2C6E49] border border-[#2C6E49] shadow-sm'
                : 'bg-[#2C6E49] text-white hover:bg-[#25573A]'
              }`}
          >
            Thrift Shops
          </button>

          <button
            onClick={() => setActiveTab('comments')}
            className={`flex-1 py-4 px-5 text-base font-medium rounded-md transition-all
              ${activeTab === 'comments'
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
            {/* Add / Edit Shop */}
            <div className="mb-10">
              <h2 className="text-gray-800 mb-5 text-2xl font-bold border-b-2 border-gray-100 pb-2">
                {editingShop ? 'Edit Thrift Shop' : 'Add New Thrift Shop'}
              </h2>

              <form
                onSubmit={editingShop ? handleUpdateShop : handleAddShop}
                className="bg-gray-100 p-6 rounded-lg mb-8"
              >
                {/* Shop Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="block mb-2 text-gray-800 font-medium">Shop Name</label>
                    <input
                      type="text"
                      value={newShop.name}
                      onChange={(e) => setNewShop({ ...newShop, name: e.target.value })}
                      className="w-full px-3 py-3 border-2 border-gray-200 rounded-md focus:border-[#2C6E49]"
                      required
                      placeholder="Enter shop name"
                    />
                  </div>
                </div>

                {/* Lat & Long */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="block mb-2 text-gray-800 font-medium">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      value={newShop.latitude}
                      onChange={(e) => setNewShop({ ...newShop, latitude: e.target.value })}
                      className="w-full px-3 py-3 border-2 border-gray-200 rounded-md focus:border-[#2C6E49]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-gray-800 font-medium">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      value={newShop.longitude}
                      onChange={(e) => setNewShop({ ...newShop, longitude: e.target.value })}
                      className="w-full px-3 py-3 border-2 border-gray-200 rounded-md focus:border-[#2C6E49]"
                      required
                    />
                  </div>
                </div>

                {/* Hours & Price */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="block mb-2 text-gray-800 font-medium">Operating Hours</label>
                    <input
                      type="text"
                      value={newShop.hours}
                      onChange={(e) => setNewShop({ ...newShop, hours: e.target.value })}
                      className="w-full px-3 py-3 border-2 border-gray-200 rounded-md focus:border-[#2C6E49]"
                      placeholder="e.g., 9:00 AM - 6:00 PM"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-gray-800 font-medium">Price Range</label>
                    <input
                      type="text"
                      value={newShop.priceRange}
                      onChange={(e) => setNewShop({ ...newShop, priceRange: e.target.value })}
                      className="w-full px-3 py-3 border-2 border-gray-200 rounded-md focus:border-[#2C6E49]"
                      placeholder="e.g., ₱50 - ₱300"
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

                {/* Buttons */}
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
                        itemTypes: []
                      });
                    }}
                  >
                    Cancel
                  </button>
                )}
              </form>
            </div>

            {/* Display Shops */}
            <div>
              <h2 className="text-gray-800 mb-5 text-2xl font-bold border-b-2 border-gray-100 pb-2">
                Manage Thrift Shops ({shops.length})
              </h2>
              <div className="grid gap-5">
                {shops.map((shop) => (
                  <div
                    key={shop.id}
                    className="bg-gray-100 p-5 rounded-lg border-l-4 border-[#2C6E49] flex justify-between items-center"
                  >
                    <div className="flex-1">
                      <h3 className="text-gray-800 mb-2">{shop.name}</h3>
                      <p className="my-1 text-gray-600"><strong>Hours:</strong> {shop.hours}</p>
                      <p className="my-1 text-gray-600"><strong>Price Range:</strong> {shop.priceRange}</p>
                      <p className="my-1 text-gray-600"><strong>Items:</strong> {shop.itemTypes?.join(', ')}</p>
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
                        onClick={() => handleDeleteShop(shop.id)}
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

                  <div className="flex gap-2">
                    <button
                      className="bg-[#2C6E49] hover:bg-[#25573A] text-white px-4 py-2 rounded-md text-sm font-medium"
                      onClick={() => handleApproveComment(comment.id)}
                    >
                      Approve
                    </button>
                    <button
                      className="bg-[#E63946] hover:bg-[#C92D39] text-white px-4 py-2 rounded-md text-sm font-medium"
                      onClick={() => handleDeleteComment(comment.id)}
                    >
                      Delete
                    </button>
                  </div>
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
