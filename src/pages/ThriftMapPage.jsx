import { useState, useEffect, useRef } from 'react';
import { supabase } from '../util/supabase'

function ThriftMapPage({ user }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [activePrice, setActivePrice] = useState("all");
  const [comments, setComments] = useState({});
  const [newComments, setNewComments] = useState({});
  const [selectedShop, setSelectedShop] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const googleScriptRef = useRef(null);

  // Thrift shops data with coordinates for Dumaguete City
  const thriftShops = [
    {
      id: 1,
      name: "Jabe Enterprises",
      category: "clothing",
      price: "low",
      priceRange: "₱50 - ₱200",
      address: "60 San Jose Ext, Dumaguete City, 6200 Negros Oriental",
      hours: "Open: 9AM - 8PM",
      image: "thriftshop1.png",
      lat: 9.3057,
      lng: 123.3060
    },
    {
      id: 2,
      name: "Shela Ukay Ukay",
      category: "clothing",
      price: "medium",
      priceRange: "₱100 - ₱250 ",
      address: "Dumaguete City, Negros Oriental",
      hours: "Open: 6AM - 10:30PM",
      image: "thriftshop2.png",
      lat: 9.3080,
      lng: 123.3085
    },
    {
      id: 3,
      name: "Vintage Finds",
      category: "shoes",
      price: "low",
      priceRange: "₱50 - ₱200",
      address: "789 Perdices Street, Dumaguete City",
      hours: "Open: 8AM - 5PM (Open Everyday)",
      image: "thriftshop1.png",
      lat: 9.3100,
      lng: 123.3020
    },
    {
      id: 4,
      name: "Page Turner's Paradise",
      category: "accesories",
      price: "low",
      priceRange: "₱20 - ₱100",
      address: "321 Hibbard Avenue, Dumaguete City",
      hours: "Open: 9AM - 6PM (Closed Tuesdays)",
      image: "thriftshop1.png",
      lat: 9.3030,
      lng: 123.3045
    }
  ];

  // Initialize Google Maps - FIXED VERSION
  useEffect(() => {
    let isMounted = true;

    const initializeMap = () => {
      if (!isMounted || !mapRef.current || !window.google) return;

      try {
        // Clear existing map instance
        if (mapInstanceRef.current) {
          mapInstanceRef.current = null;
        }

        // Default center: Dumaguete City
        const dumagueteCenter = { lat: 9.3057, lng: 123.3055 };

        mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
          zoom: 14,
          center: dumagueteCenter,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "on" }]
            }
          ]
        });

        // Add markers for thrift shops
        addMarkersToMap();

        // Get user's location if permitted
        getUserLocation();

        setMapLoaded(true);
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };

    const addMarkersToMap = () => {
      if (!mapInstanceRef.current) return;

      // Clear existing markers
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];

      thriftShops.forEach(shop => {
        const marker = new window.google.maps.Marker({
          position: { lat: shop.lat, lng: shop.lng },
          map: mapInstanceRef.current,
          title: shop.name,
          icon: {
            url: 'data:image/svg+xml;base64,' + btoa(`
              <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="15" fill="#e74c3c" stroke="#fff" stroke-width="2"/>
                <text x="16" y="21" text-anchor="middle" fill="white" font-size="12">🛍️</text>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(32, 32)
          }
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div class="map-info-window">
              <h3>${shop.name}</h3>
              <p><strong>Category:</strong> ${shop.category}</p>
              <p><strong>Price Range:</strong> ${shop.priceRange}</p>
              <p><strong>Address:</strong> ${shop.address}</p>
              <p><strong>Hours:</strong> ${shop.hours}</p>
              <button onclick="window.selectShopFromMap && window.selectShopFromMap(${shop.id})" 
                style="background: #3498db; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">
                View Details
              </button>
            </div>
          `
        });

        marker.addListener('click', () => {
          infoWindow.open(mapInstanceRef.current, marker);
          setSelectedShop(shop);
        });

        markersRef.current.push(marker);
      });
    };

    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            if (!isMounted) return;

            const userLoc = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            setUserLocation(userLoc);

            // Add user location marker
            if (mapInstanceRef.current) {
              const userMarker = new window.google.maps.Marker({
                position: userLoc,
                map: mapInstanceRef.current,
                title: "Your Location",
                icon: {
                  url: 'data:image/svg+xml;base64,' + btoa(`
                    <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" fill="#3498db" stroke="#fff" stroke-width="2"/>
                      <circle cx="12" cy="12" r="4" fill="#fff"/>
                    </svg>
                  `),
                  scaledSize: new window.google.maps.Size(24, 24)
                }
              });
              markersRef.current.push(userMarker);
            }
          },
          (error) => {
            console.log('Geolocation error:', error);
          }
        );
      }
    };

    // Make function available globally for info window buttons
    window.selectShopFromMap = (shopId) => {
      const shop = thriftShops.find(s => s.id === shopId);
      setSelectedShop(shop);
      // Scroll to the shop card
      document.getElementById(`shop-${shopId}`)?.scrollIntoView({ behavior: 'smooth' });
    };

    const loadGoogleMaps = () => {
      if (window.google) {
        // Google Maps already loaded, just initialize
        initializeMap();
        return;
      }

      // Remove existing script if any
      if (googleScriptRef.current) {
        document.head.removeChild(googleScriptRef.current);
      }

      // Load Google Maps script
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyA2AzoFntvCoC3dMdW9HSw3kgfuNOYENyI&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (isMounted) {
          initializeMap();
        }
      };
      script.onerror = () => {
        console.error('Failed to load Google Maps script');
        if (isMounted) {
          setMapLoaded(false);
        }
      };

      document.head.appendChild(script);
      googleScriptRef.current = script;
    };

    // Only initialize if mapRef is available
    if (mapRef.current) {
      loadGoogleMaps();
    }

    // Cleanup function - FIXED
    return () => {
      isMounted = false;

      // Clean up markers
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];

      // Clean up global function
      if (window.selectShopFromMap) {
        delete window.selectShopFromMap;
      }

      // Reset map state
      mapInstanceRef.current = null;
      setMapLoaded(false);
    };
  }, []); // Empty dependency array - only run once

  // Filter shops based on active filters
  const filteredShops = thriftShops.filter(shop => {
    const categoryMatch = activeCategory === "all" || shop.category === activeCategory;
    const priceMatch = activePrice === "all" || shop.price === activePrice;
    return categoryMatch && priceMatch;
  });

  // Update map markers when filters change - FIXED
  useEffect(() => {
    if (!mapInstanceRef.current || !window.google || !mapLoaded) return;

    markersRef.current.forEach(marker => {
      const shop = thriftShops.find(s =>
        s.lat === marker.position.lat() && s.lng === marker.position.lng()
      );

      if (shop) {
        const shouldShow = filteredShops.some(filteredShop => filteredShop.id === shop.id);
        marker.setMap(shouldShow ? mapInstanceRef.current : null);
      }
    });
  }, [filteredShops, mapLoaded]);

  const handleCategoryFilter = (category) => {
    setActiveCategory(category);
  };

  const handlePriceFilter = (price) => {
    setActivePrice(price);
  };

  const handleCommentChange = (shopId, comment) => {
    // FIX: Only allow comment changes if user is logged in
    if (!user) return;

    setNewComments(prev => ({
      ...prev,
      [shopId]: comment
    }));
  };

  const handleCommentSubmit = (shopId) => {
    const comment = newComments[shopId]?.trim();

    if (!comment) {
      alert("Please enter a comment before sending.");
      return;
    }

    if (!user) {
      alert("Please log in to post comments.");
      return;
    }

    const newComment = {
      id: Date.now(),
      text: comment,
      timestamp: new Date().toLocaleString(),
      user: user.username || "Anonymous"
    };

    setComments(prev => ({
      ...prev,
      [shopId]: [...(prev[shopId] || []), newComment]
    }));

    setNewComments(prev => ({
      ...prev,
      [shopId]: ""
    }));
  };

  const handleKeyPress = (e, shopId) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleCommentSubmit(shopId);
    }
  };

  const handleDirections = (shop) => {
    if (userLocation && shop.lat && shop.lng) {
      const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${shop.lat},${shop.lng}&travelmode=driving`;
      window.open(url, '_blank');
    } else {
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shop.address)}`;
      window.open(url, '_blank');
    }
  };

  const centerMapOnShop = (shop) => {
    if (mapInstanceRef.current && shop.lat && shop.lng) {
      mapInstanceRef.current.setCenter({ lat: shop.lat, lng: shop.lng });
      mapInstanceRef.current.setZoom(16);
    }
  };

  return (
    <>
      {/* Hero Section for Thrift Map */}
      <section className="relative bg-[url('https://images.unsplash.com/photo-1558769132-cb1aea458c5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80')] bg-cover bg-center bg-no-repeat">

      {/* Gradient overlay */}
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

      {/* Thrift Map Section */}
      <section className="py-10 pb-20">
        <div className="w-full max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Find Thrift Shops Near You</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">Browse through our curated list of second-hand stores in Dumaguete City</p>
          </div>

          {/* Interactive Map Container */}
          <div className="bg-white rounded-lg overflow-hidden shadow-lg mb-10 h-[400px] flex items-center justify-center relative">
            <div
              ref={mapRef}
              className={`
                h-[400px] w-full rounded-lg border-2 border-[#e1e5e9] shadow-md
                flex items-center justify-center text-[#6c757d]
                ${mapLoaded ? 'bg-transparent' : 'bg-[#f8f9fa]'}
              `}
            >
              {!mapLoaded && (
                <div className="flex items-center gap-2">
                  <i className="fas fa-spinner fa-spin text-[24px]"></i>
                  <span>Loading Map...</span>
                </div>
              )}
            </div>
            <div className="flex gap-2.5 mt-[10px] justify-center">
              <button
                className="px-4 py-2 rounded font-medium cursor-pointer transition-all duration-300 bg-transparent border border-[var(--primary)] border-2 text-[var(--primary)] mr-2.5"
                onClick={() => {
                  if (userLocation && mapInstanceRef.current) {
                    mapInstanceRef.current.setCenter(userLocation);
                    mapInstanceRef.current.setZoom(14);
                  }
                }}
                disabled={!userLocation || !mapLoaded}
              >
                <i className="fas fa-location-arrow"></i> Center on My Location
              </button>
              <button
                className="px-4 py-2 rounded font-medium cursor-pointer transition-all duration-300 bg-transparent border border-[var(--primary)] border-2 text-[var(--primary)] mr-2.5"
                onClick={() => {
                  if (mapInstanceRef.current) {
                    mapInstanceRef.current.setCenter({ lat: 9.3057, lng: 123.3055 });
                    mapInstanceRef.current.setZoom(14);
                  }
                }}
                disabled={!mapLoaded}
              >
                <i className="fas fa-globe-asia"></i> Center on Dumaguete
              </button>
            </div>
          </div>

          {/* Map Filters */}
          <div className="bg-white rounded-lg p-5 mb-8 shadow-lg">
            <div className="mb-4">
              <h3 className="mb-2 text-lg font-medium text-gray-800">Filter by Category</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  className={`px-4 py-2 bg-[var(--light)] border border-[var(--light-gray)] rounded-full cursor-pointer transition-all ${activeCategory === "all" ? "bg-[var(--primary)] text-white border-[var(--primary)]" : "hover:bg-[var(--primary)] hover:text-white hover:border-[var(--primary)]"
                    }`}
                  onClick={() => handleCategoryFilter("all")}
                >
                  All Shops
                </button>
                <button
                  className={`px-4 py-2 bg-[var(--light)] border border-[var(--light-gray)] rounded-full cursor-pointer transition-all ${activeCategory === "clothing" ? "bg-[var(--primary)] text-white border-[var(--primary)]" : "hover:bg-[var(--primary)] hover:text-white hover:border-[var(--primary)]"
                    }`}
                  onClick={() => handleCategoryFilter("clothing")}
                >
                  Clothing
                </button>
                <button
                  className={`px-4 py-2 bg-[var(--light)] border border-[var(--light-gray)] rounded-full cursor-pointer transition-all ${activeCategory === "shoes" ? "bg-[var(--primary)] text-white border-[var(--primary)]" : "hover:bg-[var(--primary)] hover:text-white hover:border-[var(--primary)]"
                    }`}
                  onClick={() => handleCategoryFilter("shoes")}
                >
                  Shoes
                </button>
                <button
                  className={`px-4 py-2 bg-[var(--light)] border border-[var(--light-gray)] rounded-full cursor-pointer transition-all ${activeCategory === "accessories" ? "bg-[var(--primary)] text-white border-[var(--primary)]" : "hover:bg-[var(--primary)] hover:text-white hover:border-[var(--primary)]"
                    }`}
                  onClick={() => handleCategoryFilter("accessories")}
                >
                  Accessories
                </button>
              </div>
            </div>
            <div>
              <h3 className="mb-2 text-lg font-medium text-gray-800">Price Range</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  className={`px-4 py-2 bg-[var(--light)] border border-[var(--light-gray)] rounded-full cursor-pointer transition-all ${activePrice === "all" ? "bg-[var(--primary)] text-white border-[var(--primary)]" : "hover:bg-[var(--primary)] hover:text-white hover:border-[var(--primary)]"
                    }`}
                  onClick={() => handlePriceFilter("all")}
                >
                  Any Price
                </button>
                <button
                  className={`px-4 py-2 bg-[var(--light)] border border-[var(--light-gray)] rounded-full cursor-pointer transition-all ${activePrice === "low" ? "bg-[var(--primary)] text-white border-[var(--primary)]" : "hover:bg-[var(--primary)] hover:text-white hover:border-[var(--primary)]"
                    }`}
                  onClick={() => handlePriceFilter("low")}
                >
                  ₱50 - ₱200
                </button>
                <button
                  className={`px-4 py-2 bg-[var(--light)] border border-[var(--light-gray)] rounded-full cursor-pointer transition-all ${activePrice === "medium" ? "bg-[var(--primary)] text-white border-[var(--primary)]" : "hover:bg-[var(--primary)] hover:text-white hover:border-[var(--primary)]"
                    }`}
                  onClick={() => handlePriceFilter("medium")}
                >
                  ₱200 - ₱500
                </button>
                <button
                  className={`px-4 py-2 bg-[var(--light)] border border-[var(--light-gray)] rounded-full cursor-pointer transition-all ${activePrice === "high" ? "bg-[var(--primary)] text-white border-[var(--primary)]" : "hover:bg-[var(--primary)] hover:text-white hover:border-[var(--primary)]"
                    }`}
                  onClick={() => handlePriceFilter("high")}
                >
                  ₱500+
                </button>
              </div>
            </div>
          </div>

          {/* Thrift Shops List */}
          <div>
            <h3 className="mb-5 text-[var(--dark)] text-2xl">Thrift Shops in Dumaguete ({filteredShops.length})</h3>

            {filteredShops.map(shop => (
              <div key={shop.id} id={`shop-${shop.id}`} className="bg-white rounded-lg overflow-hidden shadow-[0_5px_15px_rgba(0,0,0,0.1)] mb-7.5 flex transition-transform duration-300 hover:-translate-y-[5px]"
              data-category={shop.category} data-price={shop.price}>
                <div className="w-[250px] bg-cover bg-center" style={{ backgroundImage: `url('${shop.image}')` }}></div>
                <div className="p-5 flex flex-col flex-1">
                  <h4 className="mb-2.5 ext-[var(--dark)] text-xl">{shop.name}</h4>
                  <div className="flex gap-[15px] mb-2.5">
                    <span className="bg-[var(--light)] px-2 py-[3px] rounded text-[0.9rem]">
                      {shop.category.charAt(0).toUpperCase() + shop.category.slice(1)}
                    </span>
                    <span className="bg-[var(--light)] px-2 py-[3px] rounded text-[0.9rem]">{shop.priceRange}</span>
                  </div>
                  <p className="mb-2 text-[var(--gray)] text-[.95rem]">
                    <i className=" mr-2 text-[var(--primary)]"></i> {shop.address}
                  </p>
                  <p className="mb-2 text-[var(--gray)] text-[.95rem]">
                    <i className="mr-2 text-[var(--primary)]"></i> {shop.hours}
                  </p>

                  <div className="mt-5 border-t border-[#ecf0f1] pt-[15px]">
                    <h4 className="text-[#2c3e50] mb-[15px] text-[1.1rem]"
                    >
                      Comments ({comments[shop.id]?.length || 0})
                      {!user && <span className=""> - Login Required</span>}
                    </h4>

                    {/* Comments List - Protected */}
                    <div className="mx-h-[150px] overflow-y-auto mb-[15px] grid gap-5">
                      {user ? (
                        comments[shop.id]?.map(comment => (
                          <div key={comment.id} className="bg-[#f8f9fa] p-2.5 rounded-lg mb-2.5">
                            <div className="flex justify-btween items-center mb-[5px]">
                              <strong className="text-[#2c3e50] text-[0.9rem]"
                              >{comment.user}</strong>
                              <span className="text-[#7f8c8d] text-[.8rem]">{comment.timestamp}</span>
                            </div>
                            <p className="text-[#34495e] text-[.9rem] leading-[1.4] m-0">{comment.text}</p>
                          </div>
                        ))
                      ) : (
                        <div className="?">
                          <i className="fas fa-lock"></i>
                          <p>Please log in to view comments</p>
                        </div>
                      )}

                      {user && comments[shop.id]?.length === 0 && (
                        <div className="?">
                          <p>No comments yet. Be the first to comment!</p>
                        </div>
                      )}
                    </div>

                    {/* Comment Input - Protected */}
                    {user ? (
                      <div className="flex gap-2.5 items-end">
                        <textarea
                          className="comment-input"
                          placeholder="Share your experience or ask a question..."
                          value={newComments[shop.id] || ""}
                          onChange={(e) => handleCommentChange(shop.id, e.target.value)}
                          onKeyPress={(e) => handleKeyPress(e, shop.id)}
                          rows="2"
                        />
                        <button
                          className="bg-[#4c5f0d] border-none rounded-full w-10 h-10 flex items-center justify-center cursor-pointer text-white transition-all duration-300 ease-in-out hover:bg-[#2c3e50] hover:scale-105 active:scale-95"
                          onClick={() => handleCommentSubmit(shop.id)}
                          title="Send comment"
                        >
                          <i className="fas fa-paper-plane"></i>
                        </button>
                      </div>
                    ) : (
                      <div className="login-prompt?">
                        <div className="login-prompt-content">
                          <i className="fas fa-user-lock"></i>
                          <div>
                            <p><strong>Want to join the conversation?</strong></p>
                            <p>Log in to view comments and share your experiences</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="p-5 flex flex-col justify-center gap-2.5 min-w-[150px]">
                  <button
                    className="px-4 py-2 rounded font-medium cursor-pointer transition-all duration-300 bg-transparent border border-[var(--primary)] border-2 text-[var(--primary)] mr-2.5 hover:bg-[var(--primary)] hover:text-white"
                    onClick={() => centerMapOnShop(shop)}
                    disabled={!mapLoaded}
                  >
                    <i className="fas fa-map-pin"></i> Show on Map
                  </button>
                  <button
                    className="px-4 py-2 rounded font-medium cursor-pointer transition-all duration-300 mr-2.5 border-none bg-[var(--primary)] text-white hover:bg-[#23867b]"
                    onClick={() => handleDirections(shop)}
                  >
                    <i className="fas fa-directions"></i> Get Directions
                  </button>
                </div>
              </div>
            ))}

            {filteredShops.length === 0 && (
              <div className="no-results">
                <i className="fas fa-search"></i>
                <h3>No thrift shops found</h3>
                <p>Try adjusting your filters to see more results</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default ThriftMapPage;