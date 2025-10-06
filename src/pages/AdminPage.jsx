import { useState, useEffect } from 'react';
import supabase from '../supabase'; // ✅ adjust the path if needed

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
    itemTypes: []
  });
  const [editingShop, setEditingShop] = useState(null);

  // ✅ Fetch data from Supabase on mount
  useEffect(() => {
    fetchShops();
    fetchComments();
  }, []);

  // ✅ Fetch thrift shops
  const fetchShops = async () => {
    const { data, error } = await supabase.from('thrift_shops').select('*');
    if (error) console.error('Error fetching shops:', error);
    else setShops(data);
  };

  // ✅ Fetch comments
  const fetchComments = async () => {
    const { data, error } = await supabase.from('comments').select('*');
    if (error) console.error('Error fetching comments:', error);
    else setComments(data);
  };

  // ✅ Add new thrift shop
  const handleAddShop = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.from('thrift_shops').insert([newShop]).select();
    if (error) {
      console.error('Error adding shop:', error);
    } else {
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

  // ✅ Edit thrift shop
  const handleEditShop = (shop) => {
    setEditingShop(shop);
    setNewShop(shop);
  };

  // ✅ Update thrift shop
  const handleUpdateShop = async (e) => {
    e.preventDefault();
    const { error } = await supabase
      .from('thrift_shops')
      .update({
        name: newShop.name,
        latitude: newShop.latitude,
        longitude: newShop.longitude,
        hours: newShop.hours,
        priceRange: newShop.priceRange,
        itemTypes: newShop.itemTypes
      })
      .eq('id', editingShop.id);

    if (error) {
      console.error('Error updating shop:', error);
    } else {
      fetchShops();
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

  // ✅ Delete thrift shop
  const handleDeleteShop = async (shopId) => {
    const { error } = await supabase.from('thrift_shops').delete().eq('id', shopId);
    if (error) console.error('Error deleting shop:', error);
    else setShops(shops.filter((shop) => shop.id !== shopId));
  };

  // ✅ Approve comment (example logic)
  const handleApproveComment = async (commentId) => {
    const { error } = await supabase
      .from('comments')
      .update({ approved: true })
      .eq('id', commentId);

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

        {/* ✅ Existing JSX remains unchanged (design preserved) */}
        {activeTab === 'shops' && (
          <div className="bg-white rounded-lg p-8 shadow-lg">
            {/* Your Add + Manage Thrift Shops code stays the same */}
          </div>
        )}

        {activeTab === 'comments' && (
          <div className="bg-white rounded-lg p-8 shadow-lg">
            {/* Your Comment Moderation section stays the same */}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPage;
