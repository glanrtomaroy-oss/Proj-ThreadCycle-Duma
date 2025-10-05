import { useEffect, useRef, useState } from 'react';
// import mapboxgl from 'mapbox-gl';
// import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from '../util/supabase';
import { UserAuth } from '../context/AuthContext';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || '';

function ThriftMapPage() {
  const { session } = UserAuth();
  const currentUser = session?.user ?? null;

  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeCategory, setActiveCategory] = useState('all');
  const [activePrice, setActivePrice] = useState('all');

  const [selectedShop, setSelectedShop] = useState(null);
  const [commentsByShopId, setCommentsByShopId] = useState({});
  const [draftCommentsByShopId, setDraftCommentsByShopId] = useState({});

  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  const DEFAULT_CENTER = [123.3065, 9.305];

  const getPriceBucket = (priceRangeText) => {
    if (!priceRangeText) return 'all';
    const text = String(priceRangeText).replace(/\s|₱/g, '');
    if (/250\+/.test(text) || /\b>?250\b/.test(text)) return '250+';
    if (/^50-?100|50-?\d{3}$/.test(text) || /50-100/.test(text)) return '50-100';
    if (/100-?250/.test(text)) return '100-250';
    return 'all';
  };

  const isShopInActiveFilters = (shop) => {
    const category = (shop.Category || '').toString().toLowerCase();
    const priceBucket = getPriceBucket(shop.PriceRange);

    const categoryMatch = activeCategory === 'all' || category === activeCategory;
    const priceMatch =
      activePrice === 'all' ||
      (activePrice === '50-100' && priceBucket === '50-100') ||
      (activePrice === '100-250' && priceBucket === '100-250') ||
      (activePrice === '250+' && priceBucket === '250+');

    return categoryMatch && priceMatch;
  };

  const fetchShops = async () => {
    try {
      const { data, error } = await supabase.from('thrift_shop').select('*');
      if (error) throw error;
      setShops(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching thrift shops:', err.message);
      setShops([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShops();
  }, []);

  // Initialize Mapbox
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapRef.current) return;
    try {
      if (!mapboxgl.accessToken) {
        console.warn('Mapbox token missing. Provide VITE_MAPBOX_ACCESS_TOKEN.');
      }
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: DEFAULT_CENTER,
        zoom: 13.5,
      });
      mapRef.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    } catch (e) {
      console.error('Failed to initialize Mapbox:', e);
    }
  }, []);

  // Create markers based on filters
  useEffect(() => {
    if (!mapRef.current) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    shops
      .filter((s) => Number(s.Latitude) && Number(s.Longitude))
      .filter((s) => isShopInActiveFilters(s))
      .forEach((shop) => {
        const marker = new mapboxgl.Marker({ color: '#2C6E49' })
          .setLngLat([Number(shop.Longitude), Number(shop.Latitude)])
          .setPopup(
            new mapboxgl.Popup({ offset: 12 }).setHTML(
              `<div style="max-width:220px">
                <h3 style="margin:0 0 2px 0;color:#2C6E49;font-weight:600">${shop.Name || ''}</h3>
                <div style="font-size:12px;color:#475569">${shop.Category || ''} • ${shop.PriceRange || ''}</div>
              </div>`
            )
          )
          .addTo(mapRef.current);

        marker.getElement().addEventListener('click', () => {
          setSelectedShop(shop);
          mapRef.current.flyTo({
            center: [Number(shop.Longitude), Number(shop.Latitude)],
            zoom: 15,
            speed: 1.2,
            curve: 1,
          });
        });

        markersRef.current.push(marker);
      });
  }, [shops, activeCategory, activePrice]);

  const centerOnShop = (shop) => {
    if (!mapRef.current || !shop?.Longitude || !shop?.Latitude) return;
    mapRef.current.flyTo({
      center: [Number(shop.Longitude), Number(shop.Latitude)],
      zoom: 15,
    });
  };

  const handleDirections = (shop) => {
    const dest = `${shop?.Latitude},${shop?.Longitude}`;
    if (!dest) return;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const origin = `${pos.coords.latitude},${pos.coords.longitude}`;
          const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${dest}&travelmode=driving`;
          window.open(url, '_blank');
        },
        () => {
          const url = `https://www.google.com/maps/dir/?api=1&destination=${dest}`;
          window.open(url, '_blank');
        }
      );
    } else {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${dest}`;
      window.open(url, '_blank');
    }
  };

  const onSubmitComment = (shopId) => {
    if (!currentUser) return;
    const text = (draftCommentsByShopId[shopId] || '').trim();
    if (!text) return;
    const newItem = {
      id: Date.now(),
      text,
      user: currentUser.email || 'User',
      timestamp: new Date().toLocaleString(),
    };
    setCommentsByShopId((prev) => ({
      ...prev,
      [shopId]: [...(prev[shopId] || []), newItem],
    }));
    setDraftCommentsByShopId((prev) => ({ ...prev, [shopId]: '' }));
  };

  return (
    <section className="bg-[#FEFEE3] py-10 pb-20">
      <div className="w-full max-w-6xl mx-auto px-4">
        <h2 className="text-center text-2xl font-bold text-[#2C6E49] mb-6">Location Map</h2>

        <div className="bg-white rounded-xl overflow-hidden shadow-lg mb-8 h-[420px]">
          <div ref={mapContainerRef} className="w-full h-full" />
        </div>

        <div className="bg-white rounded-xl p-6 shadow mb-10">
          <div className="mb-4">
            <h3 className="font-medium text-gray-800 mb-2">Category</h3>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setActiveCategory('all')} className={`px-4 py-2 rounded-full border ${activeCategory==='all'?'bg-[var(--primary)] text-white border-[var(--primary)]':'bg-[var(--light)] border-[var(--light-gray)] hover:bg-[var(--primary)] hover:text-white'}`}>All Shops</button>
              <button onClick={() => setActiveCategory('clothing')} className={`px-4 py-2 rounded-full border ${activeCategory==='clothing'?'bg-[var(--primary)] text-white border-[var(--primary)]':'bg-[var(--light)] border-[var(--light-gray)] hover:bg-[var(--primary)] hover:text-white'}`}>Clothing</button>
              <button onClick={() => setActiveCategory('shoes')} className={`px-4 py-2 rounded-full border ${activeCategory==='shoes'?'bg-[var(--primary)] text-white border-[var(--primary)]':'bg-[var(--light)] border-[var(--light-gray)] hover:bg-[var(--primary)] hover:text-white'}`}>Shoes</button>
              <button onClick={() => setActiveCategory('accessories')} className={`px-4 py-2 rounded-full border ${activeCategory==='accessories'?'bg-[var(--primary)] text-white border-[var(--primary)]':'bg-[var(--light)] border-[var(--light-gray)] hover:bg-[var(--primary)] hover:text-white'}`}>Accessories</button>
            </div>
          </div>
          <div>
            <h3 className="font-medium text-gray-800 mb-2">Price Range</h3>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setActivePrice('all')} className={`px-4 py-2 rounded-full border ${activePrice==='all'?'bg-[var(--primary)] text-white border-[var(--primary)]':'bg-[var(--light)] border-[var(--light-gray)] hover:bg-[var(--primary)] hover:text-white'}`}>Any Price</button>
              <button onClick={() => setActivePrice('50-100')} className={`px-4 py-2 rounded-full border ${activePrice==='50-100'?'bg-[var(--primary)] text-white border-[var(--primary)]':'bg-[var(--light)] border-[var(--light-gray)] hover:bg-[var(--primary)] hover:text-white'}`}>₱50 - ₱100</button>
              <button onClick={() => setActivePrice('100-250')} className={`px-4 py-2 rounded-full border ${activePrice==='100-250'?'bg-[var(--primary)] text-white border-[var(--primary)]':'bg-[var(--light)] border-[var(--light-gray)] hover:bg-[var(--primary)] hover:text-white'}`}>₱100 - ₱250</button>
              <button onClick={() => setActivePrice('250+')} className={`px-4 py-2 rounded-full border ${activePrice==='250+'?'bg-[var(--primary)] text-white border-[var(--primary)]':'bg-[var(--light)] border-[var(--light-gray)] hover:bg-[var(--primary)] hover:text-white'}`}>₱250+</button>
            </div>
          </div>
        </div>

        <h3 className="text-center text-gray-800 font-medium mb-6">Discover Thrift Shops</h3>

        {loading ? (
          <p className="text-center text-gray-500">Loading thrift shops...</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {shops.filter(isShopInActiveFilters).map((shop) => (
              <div key={shop.ShopID} id={`shop-${shop.ShopID}`} className="bg-white rounded-xl shadow hover:shadow-md transition overflow-hidden">
                <div className="grid grid-cols-[1fr_auto]">
                  <div className="p-5">
                    <div className="flex items-center gap-4">
                      <div className="w-28 h-28 rounded bg-gray-100 overflow-hidden flex-shrink-0">
                        <img className="w-full h-full object-cover" src={shop.Image || '/thriftshop.webp'} alt={shop.Name || 'Shop'} />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-[#2C6E49]">{shop.Name}</h4>
                        <div className="flex gap-2 mt-1 mb-1.5">
                          <span className="bg-[var(--light)] px-2 py-[3px] rounded text-[0.9rem]">{shop.Category || 'N/A'}</span>
                          <span className="bg-[var(--light)] px-2 py-[3px] rounded text-[0.9rem]">{shop.PriceRange || '—'}</span>
                        </div>
                        <p className="text-sm text-gray-600">{shop.StoreHours || ''}</p>
                      </div>
                    </div>

                    <div className="mt-4 border-t pt-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-800">Comments ({commentsByShopId[shop.ShopID]?.length || 0})</span>
                      </div>
                      {currentUser ? (
                        <div className="mt-2 flex items-end gap-2">
                          <input
                            className="flex-1 border rounded px-3 py-2 text-sm"
                            placeholder="Add Comment"
                            value={draftCommentsByShopId[shop.ShopID] || ''}
                            onChange={(e) => setDraftCommentsByShopId((p) => ({ ...p, [shop.ShopID]: e.target.value }))}
                            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSubmitComment(shop.ShopID); } }}
                          />
                          <button className="w-9 h-9 rounded bg-[var(--primary)] text-white" onClick={() => onSubmitComment(shop.ShopID)}>
                            <i className="fas fa-paper-plane" />
                          </button>
                        </div>
                      ) : (
                        <p className="text-xs text-gray-500 mt-2">Login to add a comment</p>
                      )}
                    </div>
                  </div>
                  <div className="p-5 flex flex-col gap-2 justify-center min-w-[160px]">
                    <button className="px-4 py-2 rounded bg-[var(--primary)] text-white hover:opacity-90" onClick={() => handleDirections(shop)}>
                      Directions
                    </button>
                    <button className="px-4 py-2 rounded border-2 border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white" onClick={() => centerOnShop(shop)}>
                      Show on Map
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default ThriftMapPage;