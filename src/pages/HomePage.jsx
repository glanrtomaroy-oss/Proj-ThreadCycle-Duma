import { supabase } from '../util/supabase';


function HomePage({ setActivePage }) {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#7a8450] to-[rgba(38,70,83,0.8)] bg-cover bg-center text-white py-20 text-center bg-[url('https://images.unsplash.com/photo-1558769132-cb1aea458c5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80')]" id="home">
        <div className="w-full max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-5">Promoting Sustainable Fashion in Dumaguete City</h1>
          <p className="text-xl max-w-3xl mx-auto mb-8">
            Track your fabric usage, learn upcycling techniques, and discover local thrift shops with ThreadCycle Duma
          </p>
        </div>
      </section>

      {/* Thrift Map Section - SIMPLIFIED VERSION */}
      <section className="py-10 pb-20" id="thrift-map">
        <div className="w-full max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Key Features</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">Discover how ThreadCycle Duma helps you embrace sustainable fashion practices</p>
          </div>

          {/* Map Container */}
          <div className="bg-white rounded-lg overflow-hidden shadow-lg mb-10 h-96 flex items-center justify-center relative">
            <div className="text-center text-gray-600">
              <i className="fas fa-map-marked-alt text-5xl mb-4 text-[#4c5f0d]"></i>
              <h3 className="mb-2 text-gray-800">Interactive Thrift Shop Map</h3>
              <p>Explore thrift shops in Dumaguete City</p>
              <p className="text-sm"><small>Map integration with Google Maps API would be implemented here</small></p>
              <button className="mt-4 px-4 py-2 bg-transparent border border-[#4c5f0d] text-[#4c5f0d] rounded hover:bg-[#4c5f0d] hover:text-white transition-colors" onClick={() => alert('Full screen map view would open here')}>
                View Larger Map
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20" id="features">
        <div className="w-full max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Scrap Estimator */}
            <div className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform hover:-translate-y-1">
              <div className="h-48 bg-cover bg-center bg-[url('/fabric.jpg')]"></div>
              <div className="p-5">
                <h3 className="mb-2 text-gray-800">Scrap Estimator</h3>
                <p className="text-gray-600 mb-4">Calculate and track leftover fabric scraps from your projects to minimize waste.</p>
                <button
                  className="px-4 py-2 bg-transparent border border-[#4c5f0d] text-[#4c5f0d] rounded hover:bg-[#4c5f0d] hover:text-white transition-colors"
                  onClick={() => setActivePage("scrap-estimator")}
                >
                  Learn More
                </button>
              </div>
            </div>

            {/* DIY Tutorials */}
            <div className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform hover:-translate-y-1">
              <div className="h-48 bg-cover bg-center bg-[url('/tutorial.jpg')]"></div>
              <div className="p-5">
                <h3 className="mb-2 text-gray-800">DIY Tutorial Hub</h3>
                <p className="text-gray-600 mb-4">Access step-by-step guides for repairing and upcycling clothes at various difficulty levels.</p>
                <button
                  className="px-4 py-2 bg-transparent border border-[#4c5f0d] text-[#4c5f0d] rounded hover:bg-[#4c5f0d] hover:text-white transition-colors"
                  onClick={() => setActivePage("tutorials")}
                >
                  Learn More
                </button>
              </div>
            </div>

            {/* Thrift Shop Map */}
            <div className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform hover:-translate-y-1">
              <div className="h-48 bg-cover bg-center bg-[url('/thriftshop.webp')]"></div>
              <div className="p-5">
                <h3 className="mb-2 text-gray-800">Thrift Shop Map</h3>
                <p className="text-gray-600 mb-4">Discover local ukay-ukay stores with detailed information and user reviews.</p>
                <button
                  className="px-4 py-2 bg-transparent border border-[#4c5f0d] text-[#4c5f0d] rounded hover:bg-[#4c5f0d] hover:text-white transition-colors"
                  onClick={() => setActivePage("thrift-map")}
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
