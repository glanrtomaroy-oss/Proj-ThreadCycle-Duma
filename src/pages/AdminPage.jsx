import { useState, useEffect } from 'react';

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
  const [message, setMessage] = useState('');

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
      },
      {
        id: 3,
        user: "thrift_queen",
        content: "Found amazing dresses here! Highly recommended!",
        shop: "Green Threads Ukay",
        date: "2024-01-16",
        status: "pending"
      }
    ]);

    setUsers([
      { id: 1, username: "tailor_juan", email: "juan@email.com", role: "user", joinDate: "2024-01-10" },
      { id: 2, username: "sew_smart", email: "maria@email.com", role: "user", joinDate: "2024-01-12" },
      { id: 3, username: "fashion_lover", email: "lisa@email.com", role: "user", joinDate: "2024-01-14" }
    ]);
  }, []);

  // Thrift Shop Management
  const handleAddShop = (e) => {
    e.preventDefault();
    const shop = {
      id: Date.now(),
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
    setMessage('Thrift shop added successfully!');
    setTimeout(() => setMessage(''), 3000);
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
    setMessage('Thrift shop updated successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleDeleteShop = (shopId) => {
    if (window.confirm('Are you sure you want to delete this thrift shop?')) {
      setShops(shops.filter(shop => shop.id !== shopId));
      setMessage('Thrift shop deleted successfully!');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  // Comment Moderation
  const handleApproveComment = (commentId) => {
    setComments(comments.map(comment =>
      comment.id === commentId ? { ...comment, status: 'approved' } : comment
    ));
    setMessage('Comment approved!');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleDeleteComment = (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      setComments(comments.filter(comment => comment.id !== commentId));
      setMessage('Comment deleted!');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  // User Management
  const handleResetPassword = (userId) => {
    alert(`Password reset initiated for user ${userId}`);
  };

  return (
    <div className="min-h-[calc(100vh-200px)] bg-gray-100 py-10">
      <div className="max-w-6xl mx-auto px-5">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-gray-800 text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-600 text-lg">
            Welcome, {user?.displayName}! Manage thrift shops, moderate comments, and oversee platform activities
          </p>
          {message && (
            <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              {message}
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-white rounded-lg p-2 mb-8 shadow-lg">
          <button
            className={`flex-1 py-4 px-5 border-none bg-transparent cursor-pointer text-base font-medium rounded-md transition-all ${
              activeTab === 'shops' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('shops')}
          >
            Thrift Shops
          </button>
          <button
            className={`flex-1 py-4 px-5 border-none bg-transparent cursor-pointer text-base font-medium rounded-md transition-all ${
              activeTab === 'comments' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('comments')}
          >
            Comment Moderation
          </button>
          <button
            className={`flex-1 py-4 px-5 border-none bg-transparent cursor-pointer text-base font-medium rounded-md transition-all ${
              activeTab === 'users' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('users')}
          >
            User Management
          </button>
        </div>

        {/* Thrift Shops Management */}
        {activeTab === 'shops' && (
          <div className="bg-white rounded-lg p-8 shadow-lg">
            {/* Add/Edit Shop Form */}
            <div className="mb-10">
              <h2 className="text-gray-800 mb-5 text-2xl font-bold border-b-2 border-gray-100 pb-2">
                {editingShop ? 'Edit Thrift Shop' : 'Add New Thrift Shop'}
              </h2>
              <form onSubmit={editingShop ? handleUpdateShop : handleAddShop} className="bg-gray-100 p-6 rounded-lg mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <div className="mb-5">
                    <label className="block mb-2 text-gray-800 font-medium">Shop Name *</label>
                    <input
                      type="text"
                      value={newShop.name}
                      onChange={(e) => setNewShop({ ...newShop, name: e.target.value })}
                      className="w-full px-3 py-3 border-2 border-gray-200 rounded-md text-sm transition-colors focus:outline-none focus:border-blue-500"
                      required
                      placeholder="Enter shop name"
                    />
                  </div>
                  <div className="mb-5">
                    <label className="block mb-2 text-gray-800 font-medium">Address *</label>
                    <input
                      type="text"
                      value={newShop.address}
                      onChange={(e) => setNewShop({ ...newShop, address: e.target.value })}
                      className="w-full px-3 py-3 border-2 border-gray-200 rounded-md text-sm transition-colors focus:outline-none focus:border-blue-500"
                      required
                      placeholder="Enter full address"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <div className="mb-5">
                    <label className="block mb-2 text-gray-800 font-medium">Latitude *</label>
                    <input
                      type="number"
                      step="any"
                      value={newShop.latitude}
                      onChange={(e) => setNewShop({ ...newShop, latitude: e.target.value })}
                      className="w-full px-3 py-3 border-2 border-gray-200 rounded-md text-sm transition-colors focus:outline-none focus:border-blue-500"
                      required
                      placeholder="e.g., 9.3057"
                    />
                  </div>
                  <div className="mb-5">
                    <label className="block mb-2 text-gray-800 font-medium">Longitude *</label>
                    <input
                      type="number"
                      step="any"
                      value={newShop.longitude}
                      onChange={(e) => setNewShop({ ...newShop, longitude: e.target.value })}
                      className="w-full px-3 py-3 border-2 border-gray-200 rounded-md text-sm transition-colors focus:outline-none focus:border-blue-500"
                      required
                      placeholder="e.g., 123.3055"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <div className="mb-5">
                    <label className="block mb-2 text-gray-800 font-medium">Operating Hours</label>
                    <input
                      type="text"
                      value={newShop.hours}
                      onChange={(e) => setNewShop({ ...newShop, hours: e.target.value })}
                      className="w-full px-3 py-3 border-2 border-gray-200 rounded-md text-sm transition-colors focus:outline-none focus:border-blue-500"
                      placeholder="e.g., 9:00 AM - 6:00 PM"
                    />
                  </div>
                  <div className="mb-5">
                    <label className="block mb-2 text-gray-800 font-medium">Price Range</label>
                    <input
                      type="text"
                      value={newShop.priceRange}
                      onChange={(e) => setNewShop({ ...newShop, priceRange: e.target.value })}
                      className="w-full px-3 py-3 border-2 border-gray-200 rounded-md text-sm transition-colors focus:outline-none focus:border-blue-500"
                      placeholder="e.g., ₱50 - ₱100"
                    />
                  </div>
                </div>

                <div className="mb-5">
                  <label className="block mb-2 text-gray-800 font-medium">Item Types</label>
                  <div className="flex gap-5 flex-wrap">
                    {['clothing', 'shoes', 'bags', 'accessories'].map(type => (
                      <label key={type} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newShop.itemTypes.includes(type)}
                          onChange={(e) => {
                            const types = e.target.checked
                              ? [...newShop.itemTypes, type]
                              : newShop.itemTypes.filter(t => t !== type);
                            setNewShop({ ...newShop, itemTypes: types });
                          }}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="px-6 py-3 border-none rounded-md cursor-pointer text-sm font-medium transition-all bg-[#4c5f0d] text-white hover:bg-[#3a4a0a]"
                  >
                    {editingShop ? 'Update Shop' : 'Add Shop'}
                  </button>
                  {editingShop && (
                    <button
                      type="button"
                      className="px-6 py-3 bg-transparent border-2 border-[#4c5f0d] text-[#4c5f0d] rounded-md cursor-pointer text-sm font-medium transition-all hover:bg-[#4c5f0d] hover:text-white"
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

            {/* Shop List */}
            <div className="mb-10">
              <h2 className="text-gray-800 mb-5 text-2xl font-bold border-b-2 border-gray-100 pb-2">
                Manage Thrift Shops ({shops.length})
              </h2>
              <div className="grid gap-5">
                {shops.map(shop => (
                  <div key={shop.id} className="bg-gray-100 p-5 rounded-lg border-l-4 border-blue-500 flex justify-between items-center">
                    <div className="flex-1">
                      <h3 className="text-gray-800 mb-2 text-xl font-semibold">{shop.name}</h3>
                      <p className="my-1 text-gray-600"><strong>Address:</strong> {shop.address}</p>
                      <p className="my-1 text-gray-600"><strong>Hours:</strong> {shop.hours}</p>
                      <p className="my-1 text-gray-600"><strong>Price Range:</strong> {shop.priceRange}</p>
                      <p className="my-1 text-gray-600"><strong>Items:</strong> {shop.itemTypes.join(', ')}</p>
                      <p className="my-1 text-gray-600"><strong>Location:</strong> {shop.latitude}, {shop.longitude}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="px-6 py-3 bg-transparent border-2 border-[#4c5f0d] text-[#4c5f0d] rounded-md cursor-pointer text-sm font-medium transition-all hover:bg-[#4c5f0d] hover:text-white"
                        onClick={() => handleEditShop(shop)}
                      >
                        Edit
                      </button>
                      <button
                        className="px-6 py-3 bg-red-500 text-white border-none rounded-md cursor-pointer text-sm font-medium transition-all hover:bg-red-600"
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
            <div className="mb-10">
              <h2 className="text-gray-800 mb-5 text-2xl font-bold border-b-2 border-gray-100 pb-2">
                Comment Moderation ({comments.length} total)
              </h2>
              
              {/* Comment Stats */}
              <div className="flex gap-4 mb-6">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  Approved: {comments.filter(c => c.status === 'approved').length}
                </span>
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                  Pending: {comments.filter(c => c.status === 'pending').length}
                </span>
              </div>

              <div className="grid gap-5">
                {comments.map(comment => (
                  <div key={comment.id} className="bg-gray-100 p-5 rounded-lg border-l-4 border-blue-500 flex justify-between items-center">
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-2">
                        <strong className="text-gray-800">@{comment.user}</strong>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          comment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {comment.status}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2">"{comment.content}"</p>
                      <div className="flex gap-4 text-sm text-gray-500">
                        <span><strong>Shop:</strong> {comment.shop}</span>
                        <span><strong>Date:</strong> {comment.date}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {comment.status === 'pending' && (
                        <button
                          className="px-6 py-3 bg-green-500 text-white border-none rounded-md cursor-pointer text-sm font-medium transition-all hover:bg-green-600"
                          onClick={() => handleApproveComment(comment.id)}
                        >
                          Approve
                        </button>
                      )}
                      <button
                        className="px-6 py-3 bg-red-500 text-white border-none rounded-md cursor-pointer text-sm font-medium transition-all hover:bg-red-600"
                        onClick={() => handleDeleteComment(comment.id)}
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

        {/* User Management */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-lg p-8 shadow-lg">
            <div className="mb-10">
              <h2 className="text-gray-800 mb-5 text-2xl font-bold border-b-2 border-gray-100 pb-2">
                User Management ({users.length})
              </h2>
              <div className="grid gap-5">
                {users.map(user => (
                  <div key={user.id} className="bg-gray-100 p-5 rounded-lg border-l-4 border-blue-500 flex justify-between items-center">
                    <div className="flex-1">
                      <h3 className="text-gray-800 mb-2 text-xl font-semibold">{user.username}</h3>
                      <p className="my-1 text-gray-600"><strong>Email:</strong> {user.email}</p>
                      <p className="my-1 text-gray-600"><strong>Role:</strong> {user.role}</p>
                      <p className="my-1 text-gray-600"><strong>Join Date:</strong> {user.joinDate}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="px-6 py-3 bg-yellow-500 text-white border-none rounded-md cursor-pointer text-sm font-medium transition-all hover:bg-yellow-600"
                        onClick={() => handleResetPassword(user.id)}
                      >
                        Reset Password
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPage;
