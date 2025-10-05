import { useState, useEffect } from 'react';
import { supabase } from '../util/supabase';

function ThriftMapPage({ user }) {
  const [shops, setShops] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activePrice, setActivePrice] = useState('all');
  const [comments, setComments] = useState({});
  const [newComments, setNewComments] = useState({});
  const [loading, setLoading] = useState(true);

  // 🟢 Fetch thrift shop data from Supabase
  useEffect(() => {
    const fetchThriftShops = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('THRIFT SHOP').select('*');
      if (error) {
        console.error('Error fetching shops:', error);
      } else {
        setShops(data);
      }
      setLoading(false);
    };

    fetchThriftShops();
  }, []);

  // 🟡 Filters
  const filteredShops = shops.filter(shop => {
    const categoryMatch = activeCategory === 'all' || shop.category === activeCategory;
    const priceMatch = activePrice === 'all' || shop.price === activePrice;
    return categoryMatch && priceMatch;
  });

  // 🟠 Comments (local only for now)
  const handleCommentChange = (shopId, comment) => {
    if (!user) return;
    setNewComments(prev => ({ ...prev, [shopId]: comment }));
  };

  const handleCommentSubmit = (shopId) => {
    const comment = newComments[shopId]?.trim();
    if (!comment) return alert('Please type something first.');
    if (!user) return alert('Please log in to comment.');

    const newComment = {
      id: Date.now(),
      text: comment,
      timestamp: new Date().toLocaleString(),
      user: user.username || 'Anonymous'
    };

    setComments(prev => ({
      ...prev,
      [shopId]: [...(prev[shopId] || []), newComment]
    }));

    setNewComments(prev => ({ ...prev, [shopId]: '' }));
  };

  const handleKeyPress = (e, shopId) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleCommentSubmit(shopId);
    }
  };

  return (
    <>
      {/* 🟢 Hero Section */}
      <section className="relative bg-[url('https://images.unsplash.com/photo-1558769132-cb1aea458c5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80')] bg-cover bg-center bg-no-repeat">
        <div className="absolute inset-0 bg-gradient-to-r from-[#7a8450]/70 to-[rgba(38,70,83,0.8)]"></div>
        <div className="relative w-full max-w-6xl mx-auto px-4 text-white py-20 text-center">
          <h1 className="text-4xl font-bold mb-5">Thrift Shop Map</h1>
          <p className="text-xl max-w-3xl mx-auto mb-8">
            Discover local ukay-ukay stores in Dumaguete City with interactive maps, details, price ranges, and user reviews
          </p>
          {!user && (
            <div className="bg-blue-100 border border-blue-300 text-blue-800 px-4 py-3 rounded-lg flex items-center gap-2 max-w-md mx-auto">
              <i className="fas fa-info-circle"></i>
              <span>Log in to view and post comments on thrift shops</span>
            </div>
          )}
        </div>
      </section>

      {/* 🟣 Thrift Map Section (Placeholder) */}
      <section className="py-10 pb-20 bg-[#f9fafb]">
        <div className="w-full max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Find Thrift Shops Near You</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">Browse through our curated list of second-hand stores in Dumaguete City</p>
          </div>

          {/* 🗺️ Placeholder Map Box */}
          <div className="bg-white rounded-lg overflow-hidden shadow-lg mb-10 h-[400px] flex flex-col items-center justify-center">
            <div className="text-center">
              <i className="fas fa-map-marked-alt text-5xl text-[#7a8450] mb-4"></i>
              <h3 className="text-lg font-semibold text-gray-700">Map View Coming Soon</h3>
              <p className="text-gray-500">We’re currently fixing the map integration. You can still explore the thrift shops below!</p>
            </div>
          </div>

          {/* 🧭 Filters */}
          <div className="bg-white rounded-lg p-5 mb-8 shadow-lg">
            <div className="mb-4">
              <h3 className="mb-2 text-lg font-medium text-gray-800">Filter by Category</h3>
              <div className="flex flex-wrap gap-2">
                {['all', 'clothing', 'shoes', 'accessories'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-full border transition-all duration-300 
                      ${activeCategory === cat
                        ? 'bg-[#7a8450] border-[#7a8450] text-white'
                        : 'border-gray-300 text-gray-700 hover:bg-[#7a8450] hover:text-white hover:border-[#7a8450]'}`}
                  >
                    {cat === 'all' ? 'All Shops' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-2 text-lg font-medium text-gray-800">Price Range</h3>
              <div className="flex flex-wrap gap-2">
                {['all', 'low', 'medium', 'high'].map(price => (
                  <button
                    key={price}
                    onClick={() => setActivePrice(price)}
                    className={`px-4 py-2 rounded-full border transition-all duration-300 
                      ${activePrice === price
                        ? 'bg-[#7a8450] border-[#7a8450] text-white'
                        : 'border-gray-300 text-gray-700 hover:bg-[#7a8450] hover:text-white hover:border-[#7a8450]'}`}
                  >
                    {price === 'all'
                      ? 'Any Price'
                      : price === 'low'
                      ? '₱50 - ₱200'
                      : price === 'medium'
                      ? '₱200 - ₱500'
                      : '₱500+'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 🏪 Shop List */}
          {loading ? (
            <div className="text-center py-10">
              <i className="fas fa-spinner fa-spin text-3xl text-[#7a8450]"></i>
              <p className="text-gray-600 mt-2">Loading thrift shops...</p>
            </div>
          ) : filteredShops.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <i className="fas fa-search text-3xl mb-2"></i>
              <p>No thrift shops found for the selected filters.</p>
            </div>
          ) : (
            filteredShops.map(shop => (
              <div
                key={shop.id}
                className="bg-white rounded-lg overflow-hidden shadow-lg mb-7 flex hover:-translate-y-1 transition-transform duration-300"
              >
                <div
                  className="w-[250px] bg-cover bg-center"
                  style={{ backgroundImage: `url(${shop.image || 'https://via.placeholder.com/250'})` }}
                ></div>
                <div className="p-5 flex flex-col flex-1">
                  <h4 className="mb-2 text-gray-800 text-xl font-semibold">{shop.name}</h4>
                  <div className="flex gap-2 mb-2">
                    <span className="bg-[#f3f4f6] px-2 py-1 rounded text-sm text-gray-600">
                      {shop.category || 'General'}
                    </span>
                    <span className="bg-[#f3f4f6] px-2 py-1 rounded text-sm text-gray-600">
                      {shop.price_range || '₱50 - ₱200'}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-1">{shop.address}</p>
                  <p className="text-gray-600 text-sm">{shop.hours}</p>

                  {/* Comments */}
                  <div className="mt-5 border-t pt-3">
                    <h4 className="text-gray-800 text-sm font-semibold mb-2">
                      Comments ({comments[shop.id]?.length || 0})
                    </h4>

                    <div className="max-h-[150px] overflow-y-auto mb-3">
                      {user ? (
                        comments[shop.id]?.map(c => (
                          <div key={c.id} className="bg-gray-100 p-2 rounded mb-1">
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>{c.user}</span>
                              <span>{c.timestamp}</span>
                            </div>
                            <p className="text-gray-700 text-sm">{c.text}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm italic">Login to view comments.</p>
                      )}
                    </div>

                    {user && (
                      <div className="flex gap-2 items-end">
                        <textarea
                          className="w-full border border-gray-300 rounded p-2 text-sm resize-none"
                          placeholder="Write a comment..."
                          value={newComments[shop.id] || ''}
                          onChange={(e) => handleCommentChange(shop.id, e.target.value)}
                          onKeyPress={(e) => handleKeyPress(e, shop.id)}
                          rows="2"
                        />
                        <button
                          className="bg-[#7a8450] text-white rounded-full p-3 hover:bg-[#5c6637] transition"
                          onClick={() => handleCommentSubmit(shop.id)}
                        >
                          <i className="fas fa-paper-plane"></i>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </>
  );
}

export default ThriftMapPage;
