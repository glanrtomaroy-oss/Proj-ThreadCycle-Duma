import { useState, useEffect } from 'react';
import { supabase } from '../util/supabase';

function AdminPage({ user }) {
  const [activeTab, setActiveTab] = useState('shops');
  const [shops, setShops] = useState([]);
  const [comments, setComments] = useState([]);
  const [users, setUsers] = useState([]);
  const [newShop, setNewShop] = useState({
    name: '',
    address: '',
    latitude: '',
    longitude: '',
    hours: '',
    priceRange: '',
    itemTypes: []
  });
  const [editingShop, setEditingShop] = useState(null);

  // Sample data - replace with API calls
  useEffect(() => {
    // Mock data for demonstration
    setShops([
      {
        id: 1,
        name: "Green Threads Ukay",
        address: "123 Calle Street, Dumaguete City",
        latitude: 9.3057,
        longitude: 123.3055,
        hours: "9:00 AM - 6:00 PM",
        priceRange: "₱50 - ₱300",
        itemTypes: ["clothing", "shoes"]
      },
      {
        id: 2,
        name: "Eco Fashion Hub",
        address: "456 Rizal Avenue, Dumaguete City",
        latitude: 9.3080,
        longitude: 123.3070,
        hours: "8:00 AM - 7:00 PM",
        priceRange: "₱80 - ₱500",
        itemTypes: ["clothing", "bags", "accessories"]
      }
    ]);

    setComments([
      {
        id: 1,
        user: "fashion_lover",
        content: "Great selection of vintage jeans!",
        shop: "Green Threads Ukay",
        date: "2024-01-15",
        status: "approved"
      },
      {
        id: 2,
        user: "eco_warrior",
        content: "Prices are reasonable and quality is good",
        shop: "Eco Fashion Hub",
        date: "2024-01-14",
        status: "pending"
      }
    ]);

    setUsers([
      { id: 1, username: "tailor_juan", email: "juan@email.com", role: "user" },
      { id: 2, username: "sew_smart", email: "maria@email.com", role: "user" }
    ]);
  }, []);

  // Thrift Shop Management
  const handleAddShop = (e) => {
    e.preventDefault();
    const shop = {
      id: shops.length + 1,
      ...newShop,
      itemTypes: newShop.itemTypes
    };
    setShops([...shops, shop]);
    setNewShop({
      name: '',
      address: '',
      latitude: '',
      longitude: '',
      hours: '',
      priceRange: '',
      itemTypes: []
    });
  };

  const handleEditShop = (shop) => {
    setEditingShop(shop);
    setNewShop(shop);
  };

  const handleUpdateShop = (e) => {
    e.preventDefault();
    setShops(shops.map(shop =>
      shop.id === editingShop.id ? { ...newShop, id: shop.id } : shop
    ));
    setEditingShop(null);
    setNewShop({
      name: '',
      address: '',
      latitude: '',
      longitude: '',
      hours: '',
      priceRange: '',
      itemTypes: []
    });
  };

  const handleDeleteShop = (shopId) => {
    setShops(shops.filter(shop => shop.id !== shopId));
  };

  // Comment Moderation
  const handleApproveComment = (commentId) => {
    setComments(comments.map(comment =>
      comment.id === commentId ? { ...comment, status: 'approved' } : comment
    ));
  };

  const handleDeleteComment = (commentId) => {
    setComments(comments.filter(comment => comment.id !== commentId));
  };

  // User Management
  const handleResetPassword = (userId) => {
    // In real implementation, this would call an API
    alert(`Password reset initiated for user ${userId}`);
  };

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Admin Dashboard</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Welcome, Administrator! Manage thrift shops, moderate comments, and oversee platform activities
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-12 border border-gray-200">
          <button
            className={`flex-1 py-4 px-6 rounded-md text-lg font-semibold transition-all ${
              activeTab === 'shops' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab('shops')}
          >
            Thrift Shops
          </button>
          <button
            className={`flex-1 py-4 px-6 rounded-md text-lg font-semibold transition-all ${
              activeTab === 'comments' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab('comments')}
          >
            Comment Moderation
          </button>
          <button
            className={`flex-1 py-4 px-6 rounded-md text-lg font-semibold transition-all ${
              activeTab === 'users' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab('users')}
          >
            User Management
          </button>
        </div>

        {/* Thrift Shops Management */}
        {activeTab === 'shops' && (
          <div className="space-y-12">
            {/* Add New Thrift Shop Section */}
            <div className="bg-white border border-gray-200 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Add New Thrift Shop</h2>
              <form onSubmit={editingShop ? handleUpdateShop : handleAddShop} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Shop Name *</label>
                    <input
                      type="text"
                      value={newShop.name}
                      onChange={(e) => setNewShop({ ...newShop, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter shop name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Address *</label>
                    <input
                      type="text"
                      value={newShop.address}
                      onChange={(e) => setNewShop({ ...newShop, address: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter shop address"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Latitude *</label>
                    <input
                      type="number"
                      step="any"
                      value={newShop.latitude}
                      onChange={(e) => setNewShop({ ...newShop, latitude: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="e.g., 9.3057"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Longitude *</label>
                    <input
                      type="number"
                      step="any"
                      value={newShop.longitude}
                      onChange={(e) => setNewShop({ ...newShop, longitude: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="e.g., 123.3055"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Operating Hours</label>
                    <input
                      type="text"
                      value={newShop.hours}
                      onChange={(e) => setNewShop({ ...newShop, hours: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="e.g., 9:00 AM - 6:00 PM"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Price Range</label>
                    <input
                      type="text"
                      value={newShop.priceRange}
                      onChange={(e) => setNewShop({ ...newShop, priceRange: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="e.g., ₱50 - ₱300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Item Types</label>
                  <div className="flex flex-wrap gap-6">
                    {['clothing', 'shoes', 'bags', 'accessories'].map(type => (
                      <label key={type} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newShop.itemTypes.includes(type)}
                          onChange={(e) => {
                            const types = e.target.checked
                              ? [...newShop.itemTypes, type]
                              : newShop.itemTypes.filter(t => t !== type);
                            setNewShop({ ...newShop, itemTypes: types });
                          }}
                          className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <span className="text-gray-700 font-medium">
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    type="submit" 
                    className="px-8 py-4 bg-green-700 text-white font-semibold rounded-lg hover:bg-green-800 transition-colors shadow-sm"
                  >
                    {editingShop ? 'Update Shop' : 'Add Shop'}
                  </button>
                  {editingShop && (
                    <button
                      type="button"
                      className="ml-4 px-8 py-4 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                      onClick={() => {
                        setEditingShop(null);
                        setNewShop({
                          name: '',
                          address: '',
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
                </div>
              </form>
            </div>

            {/* Manage Thrift Shops Section */}
            <div className="bg-white border border-gray-200 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Manage Thrift Shops ({shops.length})</h2>
              <div className="space-y-6">
                {shops.map(shop => (
                  <div key={shop.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">{shop.name}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="space-y-2">
                            <p className="text-gray-700">
                              <span className="font-semibold">Address:</span> {shop.address}
                            </p>
                            <p className="text-gray-700">
                              <span className="font-semibold">Hours:</span> {shop.hours}
                            </p>
                          </div>
                          <div className="space-y-2">
                            <p className="text-gray-700">
                              <span className="font-semibold">Price Range:</span> {shop.priceRange}
                            </p>
                            <p className="text-gray-700">
                              <span className="font-semibold">Items:</span> {shop.itemTypes.join(', ')}
                            </p>
                            <p className="text-gray-600 text-xs">
                              <span className="font-semibold">Location:</span> {shop.latitude}, {shop.longitude}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-3 ml-6">
                        <button
                          className="px-6 py-2 bg-green-700 text-white font-medium rounded-lg hover:bg-green-800 transition-colors text-sm"
                          onClick={() => handleEditShop(shop)}
                        >
                          Edit
                        </button>
                        <button
                          className="px-6 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors text-sm"
                          onClick={() => handleDeleteShop(shop.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Comment Moderation */}
        {activeTab === 'comments' && (
          <div className="bg-white border border-gray-200 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Comment Moderation</h2>
            <div className="space-y-6">
              {comments.map(comment => (
                <div key={comment.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <strong className="text-gray-900 font-semibold">{comment.user}</strong>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          comment.status === 'pending' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {comment.status}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-4">{comment.content}</p>
                      <div className="flex gap-6 text-sm text-gray-500">
                        <span>Shop: {comment.shop}</span>
                        <span>Date: {comment.date}</span>
                      </div>
                    </div>
                    <div className="flex gap-3 ml-6">
                      {comment.status === 'pending' && (
                        <button
                          className="px-6 py-2 bg-green-700 text-white font-medium rounded-lg hover:bg-green-800 transition-colors text-sm"
                          onClick={() => handleApproveComment(comment.id)}
                        >
                          Approve
                        </button>
                      )}
                      <button
                        className="px-6 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors text-sm"
                        onClick={() => handleDeleteComment(comment.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* User Management */}
        {activeTab === 'users' && (
          <div className="bg-white border border-gray-200 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">User Management</h2>
            <div className="space-y-6">
              {users.map(user => (
                <div key={user.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{user.username}</h3>
                      <div className="flex gap-6 text-sm text-gray-600">
                        <span>Email: {user.email}</span>
                        <span>Role: {user.role}</span>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        className="px-6 py-2 bg-yellow-600 text-white font-medium rounded-lg hover:bg-yellow-700 transition-colors text-sm"
                        onClick={() => handleResetPassword(user.id)}
                      >
                        Reset Password
                      </button>
                    </div>
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
