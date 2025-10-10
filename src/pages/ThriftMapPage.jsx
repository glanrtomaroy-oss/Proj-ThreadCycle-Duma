import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "../util/supabase";
import { UserAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

function ThriftMapPage() {
  const { session } = UserAuth();
  const currentUser = session?.user ?? null;

  const [shops, setShops] = useState([]);
  const [comments, setComments] = useState({});
  const [draftComments, setDraftComments] = useState({});
  const [activeCategory, setActiveCategory] = useState("all");
  const [activePrice, setActivePrice] = useState("all");

  // Mapbox setup
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  // Track markers by ShopID for quick focus
  const markersRef = useRef({});
  const addressCacheRef = useRef({});
  const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;

  const getPriceBucket = (priceText) => {
    if (!priceText) return "all";
    const text = priceText.replace(/\s|₱/g, "");
    if (/250\+/.test(text)) return "250+";
    if (/50-100/.test(text)) return "50-100";
    if (/100-250/.test(text)) return "100-250";
    return "all";
  };

  const isShopInActiveFilters = (shop) => {
    const categoryMatch =
      activeCategory === "all" ||
      (shop.Category || "").toLowerCase() === activeCategory;
    const priceMatch =
      activePrice === "all" || getPriceBucket(shop.PriceRange) === activePrice;
    return categoryMatch && priceMatch;
  };

  // Fetch thrift shops
  // Fetch thrift shops to render list and map markers
  const fetchShops = async () => {
    try {
      const { data, error } = await supabase
        .from("THRIFT SHOP")
        .select("*")
        .order("ShopID", { ascending: true });
      if (error) throw error;
      setShops(data || []);
    } catch (err) {
      toast.error(`Unable to load store details. ${err?.message ?? ""}`);
    }
  };

  // Fetch comments with Username (joined from CUSTOMER) and CreationDate
  // Fetch comments for all shops, grouped by ShopID
  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from("COMMENT")
        .select(`
          ComID,
          Content,
          CreationDate,
          ShopID,
          CustID,
          CUSTOMER ( Username )
        `)
        .order("CreationDate", { ascending: false });

      if (error) throw error;

      // Group by shop id
      const grouped = {};
      data.forEach((c) => {
        if (!grouped[c.ShopID]) grouped[c.ShopID] = [];
        grouped[c.ShopID].push({
          ...c,
          Username: c.CUSTOMER?.Username || "Anonymous",
        });
      });
      setComments(grouped);
    } catch (err) {
      toast.error(`Comment could not be posted. Please try again later. ${err?.message ?? ""}`);
    }
  };


  // Submit a comment
  const submitComment = async (shopId) => {
    if (!currentUser) return;
    const text = draftComments[shopId]?.trim();
    if (!text) return;

    try {
      const { data: customer } = await supabase
        .from("CUSTOMER")
        .select("CustID")
        .eq("Customer_uid", currentUser.id)
        .maybeSingle();

      if (!customer) {
        alert("Customer record not found.");
        return;
      }

      const { error } = await supabase.from("COMMENT").insert({
        Content: text,
        ShopID: shopId,
        CustID: customer.CustID,
        Username: customer.Username,
        CreationDate: new Date().toISOString(),
      });

      if (error) throw error;

      setDraftComments((prev) => ({ ...prev, [shopId]: "" }));
      fetchComments();
    } catch (err) {
      toast.error(`Comment could not be posted. Please try again later. ${err?.message ?? ""}`);
    }
  };

  useEffect(() => {
    fetchShops();
    fetchComments();
  }, []);

  // Initialize Mapbox map once
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapRef.current) return; 

    if (!mapboxToken) {
      toast.error("Mapbox token missing.");
      return;
    }

    mapboxgl.accessToken = mapboxToken;

    // Center on Dumaguete City
    const initialCenter = [123.3, 9.307];
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: initialCenter,
      zoom: 12,
    });

    mapRef.current.addControl(new mapboxgl.NavigationControl({ showCompass: false }));
    mapRef.current.on("load", () => {
      mapRef.current?.resize();
    });
    mapRef.current.on("error", (e) => {
      console.error("Mapbox error", e?.error || e);
      toast.error("Map failed to load. Please refresh.");
    });
  }, [mapboxToken]);

  // Filtered shops for both UI and map markers
  const filteredShops = useMemo(
    () => shops.filter(isShopInActiveFilters),
    [shops, activeCategory, activePrice]
  );

  // Add/refresh markers whenever filtered shops change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Remove existing markers
    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    filteredShops.forEach((shop) => {
      const lat = Number(shop.Latitude);
      const lng = Number(shop.Longitude);
      if (!isFinite(lat) || !isFinite(lng)) return;

      const initialAddress = addressCacheRef.current[shop.ShopID] || '';
      const makePopupHtml = (address) => `
        <div style="min-width:220px; max-width:260px; background:#fff; border-radius:10px; box-shadow:0 6px 20px rgba(0,0,0,0.12); overflow:hidden;">
          <div style="padding:10px 12px 8px 12px;">
            <div style="font-weight:700; color:#2C6E49; font-size:14px; margin-bottom:4px">${shop.Name ?? 'Thrift Shop'}</div>
            <div style="font-size:12px; color:#555; margin-bottom:6px">${(shop.Category ?? '').toString()} • ${(shop.PriceRange ?? '').toString()}</div>
            <div style="font-size:12px; color:#333;">${address || 'Resolving address...'}</div>
          </div>
        </div>`;

      const popup = new mapboxgl.Popup({ offset: 16, closeButton: true, closeOnClick: true })
        .setHTML(makePopupHtml(initialAddress));
      const marker = new mapboxgl.Marker({ color: "#2C6E49" })
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(map);
      markersRef.current[shop.ShopID] = marker;

      if (!initialAddress) {
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${encodeURIComponent(mapboxToken)}&types=address,poi,place&limit=1`;
        fetch(url)
          .then((r) => (r.ok ? r.json() : null))
          .then((data) => {
            const addr = data?.features?.[0]?.place_name || '';
            if (addr) addressCacheRef.current[shop.ShopID] = addr;
            const m = markersRef.current[shop.ShopID];
            if (m && m.getPopup()) m.getPopup().setHTML(makePopupHtml(addr));
          })
          .catch(() => {});
      }
    });

    const markerList = Object.values(markersRef.current);
    if (markerList.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      markerList.forEach((m) => bounds.extend(m.getLngLat()));
      map.fitBounds(bounds, { padding: 40, maxZoom: 15 });
    }
  }, [filteredShops]);

  // Focus map on a shop and open its popup inline
  const focusShopOnMap = (shop) => {
    const map = mapRef.current;
    if (!map) return;
    const lat = Number(shop.Latitude);
    const lng = Number(shop.Longitude);
    if (!isFinite(lat) || !isFinite(lng)) {
      toast.error("Location unavailable for this shop");
      return;
    }
    map.flyTo({ center: [lng, lat], zoom: 15, essential: true });
    const marker = markersRef.current[shop.ShopID];
    if (marker) {
      const popup = marker.getPopup?.();
      // Open popup shortly after 
      setTimeout(() => {
        if (popup && !popup.isOpen()) {
          try {
            marker.togglePopup();
          } catch {}
        }
      }, 300);
    }
  };

  return (
    <div className="bg-[#FEFEE3] min-h-screen pb-20">
      {/* Hero Section */}
      <section className="relative bg-[url('https://images.unsplash.com/photo-1558769132-cb1aea458c5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80')] bg-cover bg-center bg-no-repeat">
        <div className="absolute inset-0 bg-gradient-to-r from-[#7a8450]/70 to-[rgba(38,70,83,0.8)]"></div>

        <div className="relative w-full max-w-6xl mx-auto px-4 text-white py-20 text-center">
          <h1 className="text-4xl font-bold mb-5">Thrift Shop Map</h1>
          <p className="text-xl max-w-3xl mx-auto mb-8">
            Discover local ukay-ukay stores in Dumaguete City with interactive maps, details, price ranges, and user reviews
          </p>
        </div>
      </section>

      {/* Map */}
      <section className="max-w-6xl mx-auto mt-10 px-4">
        <div className="bg-white shadow-lg rounded-xl h-[400px] overflow-hidden">
          <div ref={mapContainerRef} className="w-full h-full" />
        </div>
      </section>

      {/* Filters */}
      <section className="max-w-6xl mx-auto mt-10 px-4">
        <div className="bg-white rounded-xl shadow p-6">
          <div className="mb-6">
            <h3 className="font-medium text-gray-800 mb-2">Category</h3>
            <div className="flex flex-wrap gap-3">
              {["all", "clothing", "shoes", "accessories"].map((c) => (
                <button
                  key={c}
                  onClick={() => setActiveCategory(c)}
                  className={`px-4 py-2 rounded-full border ${
                    activeCategory === c
                      ? "bg-[#2C6E49] text-white border-[#2C6E49]"
                      : "bg-gray-100 border-gray-200 hover:bg-[#2C6E49] hover:text-white"
                  }`}
                >
                  {c === "all"
                    ? "All Shops"
                    : c.charAt(0).toUpperCase() + c.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-800 mb-2">Price Range</h3>
            <div className="flex flex-wrap gap-3">
              {["all", "50-100", "100-250", "250+"].map((p) => (
                <button
                  key={p}
                  onClick={() => setActivePrice(p)}
                  className={`px-4 py-2 rounded-full border ${
                    activePrice === p
                      ? "bg-[#2C6E49] text-white border-[#2C6E49]"
                      : "bg-gray-100 border-gray-200 hover:bg-[#2C6E49] hover:text-white"
                  }`}
                >
                  {p === "all" ? "Any Price" : `₱${p}`}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Shop Cards */}
      <section className="max-w-6xl mx-auto mt-12 px-4">
        <h3 className="text-center text-gray-800 font-semibold text-2xl mb-8">
          Thrift Shop Listings
        </h3>

        <div className="grid md:grid-cols-2 gap-6">
          {shops.filter(isShopInActiveFilters).map((shop) => (
            <div
              key={shop.ShopID}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
            >
              <div className="grid grid-cols-[1fr_auto]">
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-28 h-28 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                        <img
                          src={shop.Image || "/thriftshop.webp"}
                          alt={shop.Name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="text-xl font-semibold text-[#2C6E49]">
                          {shop.Name}
                        </h4>
                        <div className="flex gap-2 mt-1 mb-1.5 text-sm">
                          <span className="bg-gray-100 px-2 py-[2px] rounded">
                            {shop.Category}
                          </span>
                          <span className="bg-gray-100 px-2 py-[2px] rounded">
                            {shop.PriceRange}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {shop.StoreHours || ""}
                        </p>
                      </div>
                    </div>

                    {/* Directions Button - focus map inline (no new tab) */}
                    <button
                      type="button"
                      onClick={() => focusShopOnMap(shop)}
                      className="text-sm bg-[#2C6E49] text-white px-4 py-2 rounded hover:bg-[#265a3e] transition"
                    >
                      Directions
                    </button>
                  </div>

                  {/* Comments */}
                  <div className="mt-4 border-t pt-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-800">
                        Comments ({comments[shop.ShopID]?.length || 0})
                      </span>
                    </div>

                  {comments[shop.ShopID]?.length > 0 ? (
                    <div className="space-y-2 max-h-[120px] overflow-y-auto pr-1">
                      {comments[shop.ShopID].map((c) => (
                        <div
                          key={c.ComID}
                          className="text-sm bg-gray-50 rounded px-3 py-2"
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium text-[#2C6E49]">
                              {c.Username}
                            </span>
                            <span className="text-xs text-gray-400">
                              {new Date(c.CreationDate).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-gray-700">{c.Content}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500">No comments yet</p>
                  )}

                    {currentUser ? (
                      <div className="mt-3 flex items-end gap-2">
                        <input
                          className="flex-1 border rounded px-3 py-2 text-sm"
                          placeholder="Add a comment..."
                          value={draftComments[shop.ShopID] || ""}
                          onChange={(e) =>
                            setDraftComments((p) => ({
                              ...p,
                              [shop.ShopID]: e.target.value,
                            }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              submitComment(shop.ShopID);
                            }
                          }}
                        />
                        <button
                          className="bg-[#2C6E49] text-white px-4 py-2 rounded hover:opacity-90"
                          onClick={() => submitComment(shop.ShopID)}
                        >
                          Post
                        </button>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500 mt-2">
                        Login to add a comment
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {shops.filter(isShopInActiveFilters).length === 0 && (
          <div className="flex flex-col items-center justify-center text-center py-12 px-6 bg-white rounded-lg shadow mt-8">
            <div className="w-12 h-12 rounded-full bg-[#2C6E49]/10 flex items-center justify-center mb-3">
              <i className="fas fa-store text-[#2C6E49]"></i>
            </div>
            <h4 className="text-base font-semibold text-gray-800">No stores found for this filter.</h4>
            <p className="text-sm text-gray-600 mt-1">Try a different category or price range.</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default ThriftMapPage;