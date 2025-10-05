import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { supabase } from "../util/supabase";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const ThriftMapPage = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [shops, setShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch thrift shop data from Supabase
  const fetchShops = async () => {
    try {
      const { data, error } = await supabase.from("thrift_shop").select("*");
      if (error) throw error;
      setShops(data);
    } catch (err) {
      console.error("Error fetching thrift shops:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShops();
  }, []);

  // Initialize Mapbox map
  useEffect(() => {
    if (map.current) return; // Prevent reinit
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [123.3065, 9.305], // Center near your shop coordinates
      zoom: 14,
    });
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");
  }, []);

  // Add dynamic markers for each thrift shop
  useEffect(() => {
    if (!map.current || shops.length === 0) return;

    // Remove previous markers
    document.querySelectorAll(".mapboxgl-marker").forEach((m) => m.remove());

    shops.forEach((shop) => {
      if (!shop.Latitude || !shop.Longitude) return;

      const marker = new mapboxgl.Marker({ color: "#22C55E" })
        .setLngLat([shop.Longitude, shop.Latitude])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <h3 style="margin:0;">${shop.Name}</h3>
            <p>${shop.Category || ""} - ₱${shop.PriceRange || ""}</p>
          `)
        )
        .addTo(map.current);

      marker.getElement().addEventListener("click", () => {
        setSelectedShop(shop);
        map.current.flyTo({
          center: [shop.Longitude, shop.Latitude],
          zoom: 15,
          speed: 1.2,
          curve: 1,
        });
      });
    });
  }, [shops]);

  return (
    <div className="thrift-map-page min-h-screen bg-gray-50">
      <header className="text-center py-6">
        <h1 className="text-2xl font-bold text-green-700">Discover Thrift Shops</h1>
        <p className="text-gray-500">Find hidden gems near you 🧥👟</p>
      </header>

      {/* 🗺 Map Section */}
      <div className="map-section w-full h-[500px] mb-8 rounded-xl overflow-hidden shadow">
        <div ref={mapContainer} className="w-full h-full" />
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading thrift shops...</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 px-6 pb-12">
          {shops.map((shop) => (
            <div
              key={shop.ShopID}
              className={`bg-white rounded-2xl shadow-md p-4 cursor-pointer hover:shadow-lg transition ${
                selectedShop?.ShopID === shop.ShopID ? "ring-2 ring-green-500" : ""
              }`}
              onClick={() => {
                setSelectedShop(shop);
                map.current.flyTo({
                  center: [shop.Longitude, shop.Latitude],
                  zoom: 15,
                });
              }}
            >
              <img
                src={shop.Image}
                alt={shop.Name}
                className="w-full h-48 object-cover rounded-xl mb-3"
              />
              <h3 className="font-semibold text-lg text-green-700">{shop.Name}</h3>
              <p className="text-sm text-gray-500">
                {shop.Category} • ₱{shop.PriceRange}
              </p>
              <p className="text-sm text-gray-600 mb-2">🕒 {shop.StoreHours}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThriftMapPage;
