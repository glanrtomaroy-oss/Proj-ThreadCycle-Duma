import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

function AdminPage({ user }) {
  const [activeTab, setActiveTab] = useState('shops');
  const [shops, setShops] = useState([]);
  const [comments, setComments] = useState({});

  // Fetch thrift shops
  const fetchShops = async () => {
    try {
      const { data, error } = await supabase.from("THRIFT_SHOP").select("*");
      if (error) throw error;
      setShops(data || []);
    } catch (err) {
      console.error("Error fetching thrift shops:", err.message);
    }
  };

  // Fetch approved comments
  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from("COMMENT")
        .select("*")
        .eq("Status", "visible");
      if (error) throw error;

      const grouped = {};
      data.forEach((c) => {
        if (!grouped[c.ShopID]) grouped[c.ShopID] = [];
        grouped[c.ShopID].push(c);
      });
      setComments(grouped);
    } catch (err) {
      console.error("Error fetching comments:", err.message);
    }
  };

  useEffect(() => {
    fetchShops();
    fetchComments();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Admin Dashboard</h1>

        <div className="flex justify-center mb-6">
          <button
            onClick={() => setActiveTab('shops')}
            className={`px-6 py-3 rounded-md font-medium mx-2 ${
              activeTab === 'shops' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-800'
            }`}
          >
            Thrift Shops
          </button>
          <button
            onClick={() => setActiveTab('comments')}
            className={`px-6 py-3 rounded-md font-medium mx-2 ${
              activeTab === 'comments' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-800'
            }`}
          >
            Comments
          </button>
        </div>

        {activeTab === 'shops' && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Manage Thrift Shops</h2>
            <div className="grid gap-4">
              {shops.length > 0 ? (
                shops.map((shop) => (
                  <div
                    key={shop.ShopID}
                    className="p-4 bg-gray-50 border-l-4 border-green-600 rounded-md"
                  >
                    <h3 className="font-bold text-lg text-gray-800">{shop.Name}</h3>
                    <p><strong>Category:</strong> {shop.Category}</p>
                    <p><strong>Store Hours:</strong> {shop.StoreHours}</p>
                    <p><strong>Price Range:</strong> {shop.PriceRange}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">No thrift shops found.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'comments' && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Approved Comments</h2>
            {Object.keys(comments).length > 0 ? (
              Object.entries(comments).map(([shopId, shopComments]) => (
                <div key={shopId} className="mb-6">
                  <h3 className="text-lg font-bold text-gray-700 mb-2">Shop ID: {shopId}</h3>
                  {shopComments.map((c) => (
                    <div
                      key={c.CommentID}
                      className="bg-gray-50 border-l-4 border-green-600 p-4 rounded-md mb-2"
                    >
                      <p className="text-gray-800">{c.Content}</p>
                      <p className="text-sm text-gray-500 mt-1">{c.CreationDate}</p>
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <p className="text-gray-600">No approved comments available.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPage;
