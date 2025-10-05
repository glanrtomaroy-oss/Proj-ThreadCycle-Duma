import { useState, useEffect } from 'react';
import { supabase } from '../util/supabase';

function ThriftMapPage({ user }) {
  const [shops, setShops] = useState([]);
  const [comments, setComments] = useState({});
  const [newComments, setNewComments] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activePrice, setActivePrice] = useState('all');

  //  Load Thrift Shops
  useEffect(() => {
    const fetchShops = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('THRIFT SHOP').select('*');
      if (error) console.error('Error fetching shops:', error);
      else setShops(data);
      setLoading(false);
    };
    fetchShops();
  }, []);

  // Load Comments for all shops
  useEffect(() => {
    const fetchComments = async () => {
      const { data, error } = await supabase.from('COMMENT').select('*').order('CreationDate', { ascending: false });
      if (error) {
        console.error('Error loading comments:', error);
      } else {
        // Group comments by ShopID
        const grouped = data.reduce((acc, c) => {
          if (!acc[c.ShopID]) acc[c.ShopID] = [];
          acc[c.ShopID].push(c);
          return acc;
        }, {});
        setComments(grouped);
      }
    };
    fetchComments();
  }, []);

  // Handle posting a comment
  const handleCommentSubmit = async (shopId) => {
    const content = newComments[shopId]?.trim();
    if (!content) return alert('Please write something first.');
    if (!user) return alert('You must log in to comment.');

    const newComment = {
      Content: content,
      CreationDate: new Date().toISOString(),
      CustID: user.id,
      ShopID: shopId,
      Status: 'active',
    };

    const { data, error } = await supabase.from('COMMENT').insert([newComment]).select();
    if (error) {
      console.error('Error adding comment:', error);
      alert('Error adding comment. Try again.');
    } else {
      const added = data[0];
      setComments((prev) => ({
        ...prev,
        [shopId]: [added, ...(prev[shopId] || [])],
      }));
      setNewComments((prev) => ({ ...prev, [shopId]: '' }));
    }
  };

  const handleKeyPress = (e, shopId) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleCommentSubmit(shopId);
    }
  };

  // Filter shops
  const filteredShops = shops.filter((s) => {
    const categoryMatch = activeCategory === 'all' || s.category === activeCategory;
    const priceMatch = activePrice === 'all' || s.price === activePrice;
    return categoryMatch && priceMatch;
  });

  return (
    <>
      {/* HERO */}
      <section className="relative bg-[url('https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1500&q=80')] bg-cover bg-center bg-no-repeat">
        <div className="absolute inset-0 bg-gradient-to-r from-[#7a8450]/70 to-[rgba(38,70,83,0.8)]"></div>
        <div className="relative w-full max-w-6xl mx-auto px-4 text-white py-20 text-center">
          <h1 className="text-4xl font-bold mb-5">Thrift Shop Map</h1>
          <p className="text-xl max-w-3xl mx-auto mb-8">
            Discover local ukay-ukay stores in Dumaguete City with interactive maps, details, price ranges, and user reviews.
          </p>
          {!user && (
            <div className="bg-blue-100 border border-blue-300 text-blue-800 px-4 py-3 rounded-lg flex items-center gap-2 max-w-md mx-auto">
              <i className="fas fa-info-circle"></i>
              <span>Log in to view and post comments on thrift shops</span>
            </div>
          )}
        </div>
      </section>

      {/* MAIN SECTION */}
      <section className="py-10 pb-20 bg-[#f9fafb]">
        <div className="w-full max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Find Thrift Shops Near You</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">Browse through our curated list of second-hand stores in Dumaguete City</p>
          </div>

          {/* Map Placeholder */}
          <div className="bg-white rounded-lg overflow-hidden shadow-lg mb-10 h-[400px] flex flex-col items-center justify-center">
            <div className="text-center">
              <i className="fas fa-map-marked-alt text-5xl text-[#7a8450] mb-4"></i>
              <h3 className="text-lg font-semibold text-gray-700">Map View Coming Soon</h3>
              <p className="text-gray-500">We’re currently fixing the map integration. You can still explore the thrift shops below!</p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg p-5 mb-8 shadow-lg">
            <div className="mb-4">
              <h3 className="mb-2 text-lg font-medium text-gray-800">Filter by Category</h3>
              <div className="flex flex-wrap gap-2">
                {['all', 'clothing', 'shoes', 'accessories'].map((cat) => (
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
                {['all', 'low', 'medium', 'high'].map((price) => (
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

          {/* SHOP LIST */}
          {loading ? (
            <div className="text-center py-10">
              <i className="fas fa-spinner fa-spin text-3xl text-[#7a8450]"></i>
              <p className="text-gray-600 mt-2">Loading thrift shops...</p>
            </div>
          ) : (
            filteredShops.map((shop) => (
              <div key={shop.id} className="bg-white rounded-lg overflow-hidden shadow-lg mb-7 flex hover:-translate-y-1 transition-transform duration-300">
                <div
                  className="w-[250px] bg-cover bg-center"
                  style={{ backgroundImage: `url(${shop.image || 'https://via.placeholder.com/250'})` }}
                ></div>
                <div className="p-5 flex flex-col flex-1">
                  <h4 className="mb-2 text-gray-800 text-xl font-semibold">{shop.name}</h4>
                  <p className="text-gray-600 text-sm mb-1">{shop.address}</p>

                  <div className="mt-5 border-t pt-3">
                    <h4 className="text-gray-800 text-sm font-semibold mb-2">
                      Comments ({comments[shop.id]?.length || 0})
                    </h4>

                    <div className="max-h-[150px] overflow-y-auto mb-3">
                      {comments[shop.id]?.map((c) => (
                        <div key={c.ComID} className="bg-gray-100 p-2 rounded mb-1">
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>User {c.CustID}</span>
                            <span>{new Date(c.CreationDate).toLocaleString()}</span>
                          </div>
                          <p className="text-gray-700 text-sm">{c.Content}</p>
                        </div>
                      ))}
                      {!user && <p className="text-gray-500 text-sm italic">Login to view and post comments.</p>}
                    </div>

                    {user && (
                      <div className="flex gap-2 items-end">
                        <textarea
                          className="w-full border border-gray-300 rounded p-2 text-sm resize-none"
                          placeholder="Write a comment..."
                          value={newComments[shop.id] || ''}
                          onChange={(e) => setNewComments((prev) => ({ ...prev, [shop.id]: e.target.value }))}
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
