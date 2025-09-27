import { supabase } from '../util/supabase';


function HomePage({ setActivePage }) {
  return (
    <>
      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="container">
          <h1>Promoting Sustainable Fashion in Dumaguete City</h1>
          <p>
            Track your fabric usage, learn upcycling techniques, and discover local thrift shops with ThreadCycle Duma
          </p>
        </div>
      </section>

      {/* Thrift Map Section - SIMPLIFIED VERSION */}
      <section className="thrift-map-section" id="thrift-map">
        <div className="container">
          <div className="section-title">
            <h2>Key Features</h2>
            <p>Discover how ThreadCycle Duma helps you embrace sustainable fashion practices</p>
          </div>

          {/* Map Container */}
          <div className="map-container">
            <div className="map-placeholder">
              <i className="fas fa-map-marked-alt"></i>
              <h3>Interactive Thrift Shop Map</h3>
              <p>Explore thrift shops in Dumaguete City</p>
              <p><small>Map integration with Google Maps API would be implemented here</small></p>
              <button className="btn btn-outline" onClick={() => alert('Full screen map view would open here')}>
                View Larger Map
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <div className="container">
          <div className="features-grid">
            {/* Scrap Estimator */}
            <div className="feature-card">
              <div 
                className="feature-img bg-[url('/fabric.jpg')]" 
              ></div>
              <div className="feature-content">
                <h3>Scrap Estimator</h3>
                <p>Calculate and track leftover fabric scraps from your projects to minimize waste.</p>
                <button 
                  className="btn btn-outline" 
                  onClick={() => setActivePage("scrap-estimator")}
                >
                  Learn More
                </button>
              </div>
            </div>

            {/* DIY Tutorials */}
            <div className="feature-card">
              <div 
                className="feature-img bg-[url('/tutorial.jpg')]" 
              ></div>
              <div className="feature-content">
                <h3>DIY Tutorial Hub</h3>
                <p>Access step-by-step guides for repairing and upcycling clothes at various difficulty levels.</p>
                <button 
                  className="btn btn-outline" 
                  onClick={() => setActivePage("tutorials")}
                >
                  Learn More
                </button>
              </div>
            </div>

            {/* Thrift Shop Map */}
            <div className="feature-card">
              <div 
                className="feature-img bg-[url('/thriftshop.webp')]" 
              ></div>
              <div className="feature-content">
                <h3>Thrift Shop Map</h3>
                <p>Discover local ukay-ukay stores with detailed information and user reviews.</p>
                <button 
                  className="btn btn-outline" 
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
