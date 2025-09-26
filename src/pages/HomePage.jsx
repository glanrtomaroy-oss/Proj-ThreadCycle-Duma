import thriftshop from '../assets/thriftshop.webp';
import fabric from '../assets/fabric.jpg';
import tutorial from '../assets/tutorial.jpg';
import { Link } from 'react-router-dom';

function HomePage({ user }) {
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
                className="feature-img"
                style={{ backgroundImage: `url(${fabric})` }}
              ></div>
              <div className="feature-content">
                <h3>Scrap Estimator</h3>
                <p>Calculate and track leftover fabric scraps from your projects to minimize waste.</p>
                <Link
                  className="btn btn-outline"
                  to="/scrap-estimator"
                >
                  Learn More
                </Link>
              </div>
            </div>

            {/* DIY Tutorials */}
            <div className="feature-card">
              <div
                className="feature-img"
                style={{ backgroundImage: `url(${tutorial})` }}
              ></div>
              <div className="feature-content">
                <h3>DIY Tutorial Hub</h3>
                <p>Access step-by-step guides for repairing and upcycling clothes at various difficulty levels.</p>
                <Link
                  className="btn btn-outline"
                  to="/tutorials"
                >
                  Learn More
                </Link>
              </div>
            </div>

            {/* Thrift Shop Map */}
            <div className="feature-card">
              <div
                className="feature-img"
                style={{ backgroundImage: `url(${thriftshop})` }}
              ></div>
              <div className="feature-content">
                <h3>Thrift Shop Map</h3>
                <p>Discover local ukay-ukay stores with detailed information and user reviews.</p>
                <Link
                  className="btn btn-outline"
                  to="/thrift-map"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default HomePage;
