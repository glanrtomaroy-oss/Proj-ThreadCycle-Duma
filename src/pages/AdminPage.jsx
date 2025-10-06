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
    itemTypes: [],
    image: '',
  });
  const [editingShop, setEditingShop] = useState(null);

  // Sample data (address removed)
  useEffect(() => {
    setShops([
      {
        id: 1,
        name: "Green Threads Ukay",
        latitude: 9.3057,
        longitude: 123.3055,
        hours: "9:00 AM - 6:00 PM",
        priceRange: "₱50 - ₱300",
        itemTypes: ["clothing", "shoes"]
      },
      {
        id: 2,
        name: "Eco Fashion Hub",
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
        user: "thrift_queen",
        content: "Found amazing dresses here! Highly recommended!",
        shop: "Green Threads Ukay",
        date: "2024-01-16"
      },
      {
        id: 2,
        user: "fashion_lover",
        content: "Great selection of vintage jeans!",
        shop: "Green Threads Ukay",
        date: "2024-01-15"
      },
      {
        id: 3,
        user: "eco_warrior",
        content: "Prices are reasonable and quality is good",
        shop: "Eco Fashion Hub",
        date: "2024-01-14"
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
  const handleDeleteComment = (commentId) => {
    setComments(comments.filter(comment => comment.id !== commentId));
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

        {/* Thrift Shops Management */}
        {activeTab === 'shops' && (
          <div className="bg-white rounded-lg p-8 shadow-lg">
            <div className="mb-10">
              <h2 className="text-gray-800 mb-5 text-2xl font-bold border-b-2 border-gray-100 pb-2">
                Add New Thrift Shop
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
      placeholder="Enter shop name"
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
      placeholder="Paste image link (e.g., https://example.com/shop.jpg)"
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
      placeholder="e.g., 9.3057"
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
      placeholder="e.g., 123.3055"
    />
  </div>

  {/* Operating Hours */}
  <div>
    <label className="block mb-2 text-gray-800 font-medium">Operating Hours</label>
    <input
      type="text"
      value={newShop.hours}
      onChange={(e) => setNewShop({ ...newShop, hours: e.target.value })}
      className="w-full px-3 py-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#2C6E49]"
      required
      placeholder="e.g., 9:00 AM - 6:00 PM"
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
      placeholder="e.g., ₱100 - ₱500"
    />
  </div>
</div>


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
                        itemTypes: []
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
                    key={shop.id}
                    className="bg-gray-100 p-5 rounded-lg border-l-4 border-[#2C6E49] flex justify-between items-center"
                  >
                    <div className="flex-1">
                      <h3 className="text-gray-800 mb-2">{shop.name}</h3>
                      <p className="my-1 text-gray-600"><strong>Hours:</strong> {shop.hours}</p>
                      <p className="my-1 text-gray-600"><strong>Price Range:</strong> {shop.priceRange}</p>
                      <p className="my-1 text-gray-600"><strong>Items:</strong> {shop.itemTypes.join(', ')}</p>
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

        {/* Comment Moderation (Updated Section) */}
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
