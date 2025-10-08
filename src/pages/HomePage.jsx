import { useEffect, useRef, useState } from 'react';
import { supabase } from '../util/supabase';
import { useNavigate } from 'react-router-dom';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import toast from 'react-hot-toast';


const HomePage = () => {
  const navigate = useNavigate();

  // Map + data state
  const [shops, setShops] = useState([]);
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef({}); // ShopID -> marker
  const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;

  const fetchShops = async () => {
    try {
      const { data, error } = await supabase.from('THRIFT SHOP').select('*');
      if (error) throw error;
      setShops(data || []);
    } catch (err) {
      toast.error(`Unable to load store details. ${err?.message ?? ''}`);
    }
  };

  useEffect(() => {
    fetchShops();
  }, []);

  // Initialize Mapbox map once (when container is visible)
  useEffect(() => {
    const containerEl = mapContainerRef.current;
    if (!containerEl) return;
    if (mapRef.current) return;

    const initMap = () => {
      if (!mapboxToken) {
        toast.error('Missing Mapbox token. Check your .env or Vercel settings.');
        return;
      }
      mapboxgl.accessToken = mapboxToken;
      const initialCenter = [123.3, 9.307];
      mapRef.current = new mapboxgl.Map({
        container: containerEl,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: initialCenter,
        zoom: 12,
      });
      mapRef.current.addControl(new mapboxgl.NavigationControl({ showCompass: false }));
      mapRef.current.on('load', () => mapRef.current?.resize());
      mapRef.current.on('error', (e) => {
        console.error('Mapbox error', e?.error || e);
        toast.error('Map failed to load. Please refresh.');
      });
    };

    // Defer until element is on screen to avoid layout issues
    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && !mapRef.current) {
        initMap();
        observer.disconnect();
      }
    }, { root: null, threshold: 0.01 });

    observer.observe(containerEl);

    return () => {
      observer.disconnect();
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [mapboxToken]);

  // Render markers when shops change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    const validShops = (shops || []).filter((s) =>
      isFinite(Number(s.Latitude)) && isFinite(Number(s.Longitude))
    );

    validShops.forEach((shop) => {
      const lat = Number(shop.Latitude);
      const lng = Number(shop.Longitude);

      const popupHtml = `
        <div style="min-width:200px">
          <div style="font-weight:600;color:#2C6E49;margin-bottom:4px">${shop.Name ?? 'Thrift Shop'}</div>
          <div style="font-size:12px;color:#555;margin-bottom:6px">${(shop.Category ?? '').toString()} • ${(shop.PriceRange ?? '').toString()}</div>
        </div>`;

      const popup = new mapboxgl.Popup({ offset: 16 }).setHTML(popupHtml);
      const marker = new mapboxgl.Marker({ color: '#2C6E49' })
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(map);
      markersRef.current[shop.ShopID] = marker;
    });

    if (validShops.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      Object.values(markersRef.current).forEach((m) => bounds.extend(m.getLngLat()));
      map.fitBounds(bounds, { padding: 40, maxZoom: 15 });
    }
  }, [shops]);

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-[url('https://images.unsplash.com/photo-1558769132-cb1aea458c5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80')] bg-cover bg-center bg-no-repeat" id="home">

      <div className="absolute inset-0 bg-gradient-to-r from-[#7a8450]/70 to-[rgba(38,70,83,0.8)]"></div>

        <div className="relative w-full max-w-6xl mx-auto px-4 text-white py-20 text-center">
          <h1 className="text-4xl font-bold mb-5">Promoting Sustainable Fashion in Dumaguete City</h1>
          <p className="text-xl max-w-3xl mx-auto mb-8">
            Track your fabric usage, learn upcycling techniques, and discover local thrift shops with ThreadCycle Duma
          </p>
        </div>
      </section>

      {/* Thrift Map Section - SIMPLIFIED VERSION */}
      <section className="bg-[#FEFEE3] py-10 pb-20" id="thrift-map">
        <div className="w-full max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Key Features</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">Discover how ThreadCycle Duma helps you embrace sustainable fashion practices</p>
          </div>

          {/* Map Container */}
          <div className="bg-white rounded-lg overflow-hidden shadow-lg mb-10 h-96 relative">
            <div ref={mapContainerRef} className="absolute inset-0" />
            <div className="absolute bottom-3 right-3 z-10">
              <button
                className="px-4 py-2 bg-transparent border border-[#4c5f0d] text-[#4c5f0d] rounded hover:bg-[#4c5f0d] hover:text-white transition-colors"
                onClick={() => navigate('/thrift-map')}
              >
                View Larger Map
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-[#FEFEE3] py-20" id="features">
        <div className="w-full max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

            {/* Scrap Estimator */}
            <div className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform duration-300 ease-in-out hover:-translate-y-1 h-100 flex flex-col">
              <div className="h-48 bg-cover bg-center bg-[url('/fabric.jpg')]"></div>

              <div className="p-5 flex flex-col flex-grow">
                <h3 className="mb-2 text-gray-800">Scrap Estimator</h3>
                <p className="text-gray-600 mb-4">Calculate and track leftover fabric scraps from your projects to minimize waste.</p>
                <button
                  className="mt-auto w-auto px-4 py-2 bg-transparent border border-[#2C6E49] text-[#2C6E49] rounded hover:bg-[#2C6E49] hover:text-white transition-colors"
                  onClick={() => navigate("/scrap-estimator")}
                >
                  Learn More
                </button>
              </div>
            </div>

            {/* DIY Tutorials */}
            <div className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform duration-300 ease-in-out hover:-translate-y-1 h-100 flex  flex-col">
              <div className="h-48 bg-cover bg-center bg-[url('/tutorial.jpg')]"></div>
              
              <div className="p-5 flex flex-col flex-grow">
                <h3 className="mb-2 text-gray-800">DIY Tutorial Hub</h3>
                <p className="text-gray-600 mb-4">
                  Access step-by-step guides for repairing and upcycling clothes at various difficulty levels.
                </p>

                <button
                  className="mt-auto w-auto px-4 py-2 bg-transparent border border-[#2C6E49] text-[#2C6E49] rounded hover:bg-[#2C6E49] hover:text-white transition-colors"
                  onClick={() => navigate("/tutorials")}
                >
                  Learn More
                </button>
              </div>
            </div>


            {/* Thrift Shop Map */}
            <div className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform duration-300 ease-in-out hover:-translate-y-1 h-100 flex flex-col">
              <div className="h-48 bg-cover bg-center bg-[url('/thriftshop.webp')]"></div>

              <div className="p-5 flex flex-col flex-grow">
                <h3 className="mb-2 text-gray-800">Thrift Shop Map</h3>
                <p className="text-gray-600 mb-4">
                  Discover local ukay-ukay stores with detailed information and user reviews.
                </p>

                <button
                  className="mt-auto px-4 py-2 bg-transparent border border-[#4c5f0d] text-[#4c5f0d] rounded hover:bg-[#2C6E49] hover:text-white transition-colors"
                  onClick={() => navigate("/thrift-map")}
                >
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default HomePage;
