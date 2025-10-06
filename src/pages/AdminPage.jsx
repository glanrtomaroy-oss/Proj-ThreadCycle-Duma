import { useState, useEffect } from 'react';
import supabase from '../supabase'; // ✅ adjust import path if needed

function AdminPage({ user }) {
  const [activeTab, setActiveTab] = useState('shops');
  const [shops, setShops] = useState([]);
  const [comments, setComments] = useState([]);
  const [newShop, setNewShop] = useState({
    Name: '',
    Category: [],
    StoreHours: '',
    PriceRange: '',
    Image: '',
    AdminID: user?.id || null
  });
  const [editingShop, setEditingShop] = useState(null);

  // ✅ Fetch from Supabase
  useEffect(() => {
    fetchShops();
    fetchComments();
  }, []);

  // ✅ Fetch all shops
  const fetchShops = async () => {
    const { data, error } = await supabase.from('Shops').select('*');
    if (error) console.error('Error fetching shops:', error);
    else setShops(data);
  };

  // ✅ Fetch comments (assuming you have a table called 'comments')
  const fetchComments = async () => {
    const { data, error } = await supabase.from('comments').select('*');
    if (error) console.error('Error fetching comments:', error);
    else setComments(data);
  };

  // ✅ Add new shop
  const handleAddShop = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.from('Shops').insert([newShop]).select();
    if (error) {
      console.error('Error adding shop:', error);
    } else {
      setShops([...shops, ...data]);
      setNewShop({
        Name: '',
        Category: [],
        StoreHours: '',
        PriceRange: '',
        Image: '',
        AdminID: user?.id || null
      });
    }
  };

  // ✅ Edit shop
  const handleEditShop = (shop) => {
    setEditingShop(shop);
    setNewShop(shop);
  };

  // ✅ Update shop
  const handleUpdateShop = async (e) => {
    e.preventDefault();
    const { error } = await supabase
      .from('Shops')
      .update({
        Name: newShop.Name,
        Category: newShop.Category,
        StoreHours: newShop.StoreHours,
        PriceRange: newShop.PriceRange,
        Image: newShop.Image
      })
      .eq('ShopID', editingShop.ShopID);

    if (error) {
      console.error('Error updating shop:', error);
    } else {
      fetchShops();
      setEditingShop(null);
      setNewShop({
        Name: '',
        Category: [],
        StoreHours: '',
        PriceRange: '',
        Image: '',
        AdminID: user?.id || null
      });
    }
  };

  // ✅ Delete shop
  const handleDeleteShop = async (shopId) => {
    const { error } = await supabase.from('Shops').delete().eq('ShopID', shopId);
    if (error) console.error('Error deleting shop:', error);
    else setShops(shops.filter((shop) => shop.ShopID !== shopId));
  };

  // ✅ Approve comment
  const handleApproveComment = async (commentId) => {
    const { error } = await supabase.from('comments').update({ approved: true }).eq('id', commentId);
    if (error) console.error('Error approving comment:', error);
    else setComments(comments.filter((comment) => comment.id !== commentId));
  };

  // ✅ Delete comment
  const handleDeleteComment = async (commentId) => {
    const { error } = await supabase.from('comments').delete().eq('id', commentId);
    if (error) console.error('Error deleting comment:', error);
    else setComments(comments.filter((comment) => comment.id !== commentId));
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
            className={`flex-1 py-4 px-5 cursor-pointer text-base font-medium rounded-md transition-all
              ${
                activeTab === 'shops'
                  ? 'bg-white text-[#2C6E49] border border-[#2C6E49] shadow-sm'
                  : 'bg-[#2C6E49] text-white hover:bg-[#25573A]'
              }`}
          >
            Thrift Shops
          </button>

          <button
            onClick={() => setActiveTab('comments')}
            className={`flex-1 py-4 px-5 cursor-pointer text-base font-medium rounded-md transition-all
              ${
                activeTab === 'comments'
                  ? 'bg-white text-[#2C6E49] border border-[#2C6E49] shadow-sm'
                  : 'bg-[#2C6E49] text-white hover:bg-[#25573A]'
              }`}
          >
            Comment Moderation
          </button>
        </div>

        {/* ✅ Shops Section */}
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
                  <div>
                    <label className="block mb-2 text-gray-800 font-medium">Shop Name</label>
                    <input
                      type="text"
                      value={newShop.Name}
                      onChange={(e) => setNewShop({ ...newShop, Name: e.target.value })}
                      className="w-full px-3 py-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#2C6E49]"
                      required
                      placeholder="Enter shop name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="block mb-2 text-gray-800 font-medium">Store Hours</label>
                    <input
                      type="text"
                      value={newShop.StoreHours}
                      onChange={(e) => setNewShop({ ...newShop, StoreHours: e.target.value })}
                      className="w-full px-3 py-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#2C6E49]"
                      placeholder="e.g., 9:00 AM - 6:00 PM"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-gray-800 font-medium">Price Range</label>
                    <input
                      type="text"
                      value={newShop.PriceRange}
                      onChange={(e) => setNewShop({ ...newShop, PriceRange: e.target.value })}
                      className="w-full px-3 py-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#2C6E49]"
                      placeholder="e.g., ₱50 - ₱300"
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
                          checked={newShop.Category.includes(type)}
                          onChange={(e) => {
                            const updated = e.target.checked
                              ? [...newShop.Category, type]
                              : newShop.Category.filter((t) => t !== type);
                            setNewShop({ ...newShop, Category: updated });
                          }}
                        />
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mb-5">
                  <label className="block mb-2 text-gray-800 font-medium">Image URL</label>
                  <input
                    type="text"
                    value={newShop.Image}
                    onChange={(e) => setNewShop({ ...newShop, Image: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-3 py-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#2C6E49]"
                  />
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
                        Category: [],
                        StoreHours: '',
                        PriceRange: '',
                        Image: '',
                        AdminID: user?.id || null
                      });
                    }}
                  >
                    Cancel
                  </button>
                )}
              </form>
            </div>

            {/* ✅ Display Shops */}
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
                      <p className="my-1 text-gray-600"><strong>Hours:</strong> {shop.StoreHours}</p>
                      <p className="my-1 text-gray-600"><strong>Price Range:</strong> {shop.PriceRange}</p>
                      <p className="my-1 text-gray-600"><strong>Category:</strong> {Array.isArray(shop.Category) ? shop.Category.join(', ') : shop.Category}</p>
                      {shop.Image && <img src={shop.Image} alt={shop.Name} className="w-32 h-32 object-cover mt-2 rounded-md" />}
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

        {/* ✅ Comments Section */}
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
