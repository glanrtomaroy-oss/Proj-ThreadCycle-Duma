import { useState, useEffect } from 'react';

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

  // Sample data - replace with API calls
  useEffect(() => {
    // Mock data for demonstration
    setShops([
      {
        id: 1,
        name: "Green Threads Ukay",
        address: "123 Calle Street, Dumaguete City",
        latitude: "9:30:57",
        longitude: "123:36:55",
        hours: "9:00 AM - 6:00 PM",
        priceRange: "P50 - P100",
        itemTypes: ["clothing", "shoes"]
      },
      {
        id: 2,
        name: "Eco Fashion Hub",
        address: "456 Rizal Avenue, Dumaguete City",
        latitude: "9:30:62",
        longitude: "123:30:7",
        hours: "8:00 AM - 7:00 PM",
        priceRange: "P80 - P500",
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

  return (
    <div className="min-h-[calc(100vh-200px)] bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-5">
        <div className="text-center mb-8">
          <h1 className="text-gray-800 text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome, Administrator! Manage thrift shops, moderate comments, and oversee platform activities</p>
        </div>

        <div className="flex mb-8 border-b border-gray-200">
          <button
            className={`py-3 px-6 border-b-2 font-medium text-sm ${activeTab === 'shops' ? 'border-green-700 text-green-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('shops')}
          >
            Thrift Shops
          </button>
          <button
            className={`py-3 px-6 border-b-2 font-medium text-sm ${activeTab === 'comments' ? 'border-green-700 text-green-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('comments')}
          >
            Comment Moderation
          </button>
        </div>

        {/* Thrift Shops Management */}
        {activeTab === 'shops' && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Add New Thrift Shop</h2>
              <form onSubmit={editingShop ? handleUpdateShop : handleAddShop} className="space-y-6">
                <div>
                  <label className="block text-gray-800 font-medium mb-2">Shop Name*</label>
                  <input
                    type="text"
                    value={newShop.name}
                    onChange={(e) => setNewShop({ ...newShop, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter shop name"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-800 font-medium mb-2">Location*</label>
                    <div className="space-y-3">
                      <div>
                        <input
                          type="text"
                          value={newShop.latitude}
                          onChange={(e) => setNewShop({ ...newShop, latitude: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="e.g. 9:30:57"
                          required
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          value={newShop.longitude}
                          onChange={(e) => setNewShop({ ...newShop, longitude: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="e.g. 123:36:55"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-800 font-medium mb-2">Operating Hours</label>
                    <div className="space-y-3">
                      <div>
                        <input
                          type="text"
                          value={newShop.hours}
                          onChange={(e) => setNewShop({ ...newShop, hours: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="e.g. 9:00 AM - 6:00 PM"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-800 font-medium mb-2">Price Range</label>
                        <input
                          type="text"
                          value={newShop.priceRange}
                          onChange={(e) => setNewShop({ ...newShop, priceRange: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="e.g. P50 - P100"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-800 font-medium mb-3">Item Types</label>
                  <div className="flex flex-wrap gap-4">
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
                          className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    type="submit" 
                    className="px-8 py-3 bg-green-700 text-white font-medium rounded-md hover:bg-green-800 transition-colors"
                  >
                    {editingShop ? 'Update Shop' : 'Add Shop'}
                  </button>
                  {editingShop && (
                    <button
                      type="button"
                      className="ml-3 px-8 py-3 bg-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-300 transition-colors"
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
                </div>
              </form>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Manage Thrift Shops ({shops.length})</h2>
              <div className="space-y-6">
                {shops.map(shop => (
                  <div key={shop.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="space-y-3 flex-1">
                        <h3 className="text-lg font-semibold text-gray-800">{shop.name}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600"><span className="font-medium">Hours:</span> {shop.hours}</p>
                            <p className="text-gray-600"><span className="font-medium">Price Range:</span> {shop.priceRange}</p>
                          </div>
                          <div>
                            <p className="text-gray-600"><span className="font-medium">Items:</span> {shop.itemTypes.join(', ')}</p>
                            <p className="text-gray-600"><span className="font-medium">Location:</span> {shop.latitude}, {shop.longitude}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          className="px-4 py-2 bg-green-700 text-white text-sm font-medium rounded hover:bg-green-800 transition-colors"
                          onClick={() => handleEditShop(shop)}
                        >
                          Edit
                        </button>
                        <button
                          className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 transition-colors"
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
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Comment Moderation</h2>
            <div className="space-y-6">
              {comments.map(comment => (
                <div key={comment.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="space-y-3 flex-1">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-800">{comment.user}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${comment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                          {comment.status}
                        </span>
                      </div>
                      <p className="text-gray-600">{comment.content}</p>
                      <div className="flex gap-4 text-sm text-gray-500">
                        <span>Shop: {comment.shop}</span>
                        <span>Date: {comment.date}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      {comment.status === 'pending' && (
                        <button
                          className="px-4 py-2 bg-green-700 text-white text-sm font-medium rounded hover:bg-green-800 transition-colors"
                          onClick={() => handleApproveComment(comment.id)}
                        >
                          Approve
                        </button>
                      )}
                      <button
                        className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 transition-colors"
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
      </div>
    </div>
  );
}

export default AdminPage;
