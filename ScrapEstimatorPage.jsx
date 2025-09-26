import { useState } from 'react';

function ScrapEstimatorPage() {
  const [fabricType, setFabricType] = useState("");
  const [originalLength, setOriginalLength] = useState("");
  const [usedLength, setUsedLength] = useState("");
  const [calculations, setCalculations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const calculateSavings = (e) => {
    e.preventDefault();
    
    if (!fabricType || !originalLength || !usedLength) {
      alert("Please fill in all fields");
      return;
    }

    const original = parseFloat(originalLength);
    const used = parseFloat(usedLength);

    if (used > original) {
      alert("Used length cannot be greater than original length");
      return;
    }

    const saved = original - used;
    const newCalculation = {
      id: Date.now(),
      fabricType,
      originalLength: original,
      usedLength: used,
      saved: saved,
      date: new Date().toISOString().split('T')[0]
    };

    setCalculations([newCalculation, ...calculations]);
    
    alert(`You saved ${saved.toFixed(2)} meters of ${fabricType} fabric!`);
    
    // Reset form
    setFabricType("");
    setOriginalLength("");
    setUsedLength("");
  };

  // Delete calculation
  const deleteCalculation = (calculationId) => {
    if (window.confirm("Are you sure you want to delete this calculation?")) {
      setCalculations(calculations.filter(calc => calc.id !== calculationId));
      alert("Calculation deleted successfully!");
    }
  };

  // Filter calculations based on search term
  const filteredCalculations = calculations.filter(calc =>
    calc.fabricType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalSaved = calculations.reduce((total, calc) => total + calc.saved, 0);

  return (
    <>
      {/* Hero Section */}
      <section className="hero scrap-estimator-hero" id="scrap-estimator">
        <div className="container">
          <h1>Scrap Estimator Dashboard</h1>
          <p>Track your fabric usage and calculate material savings</p>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="scrap-estimator-page">
        <div className="container">
          <div className="dashboard-grid">
            
            {/* Dashboard Stats */}
            <div className="dashboard-stats">
              <div className="stat-card">
                <div className="stat-icon"><i className="fas fa-ruler-combined"></i></div>
                <div className="stat-info">
                  <h3>{calculations.length}</h3>
                  <p>Projects Tracked</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon"><i className="fas fa-leaf"></i></div>
                <div className="stat-info">
                  <h3>{totalSaved.toFixed(2)}m</h3>
                  <p>Total Fabric Saved</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon"><i className="fas fa-co2"></i></div>
                <div className="stat-info">
                  <h3>{(totalSaved * 0.5).toFixed(1)}kg</h3>
                  <p>CO₂ Reduction*</p>
                </div>
              </div>
            </div>

            {/* Calculator Form */}
            <div className="calculator-form">
              <div className="form-container">
                <h2>Calculate Fabric Savings</h2>
                <form onSubmit={calculateSavings}>
                  <div className="form-group">
                    <label htmlFor="fabric-type">Fabric Type</label>
                    <input 
                      type="text" 
                      id="fabric-type"
                      className="form-control" 
                      placeholder="e.g., Cotton, Denim, Silk"
                      value={fabricType}
                      onChange={(e) => setFabricType(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="original-length">Original Length (meters)</label>
                    <input 
                      type="number" 
                      id="original-length"
                      className="form-control" 
                      placeholder="Enter original fabric length"
                      step="0.1"
                      value={originalLength}
                      onChange={(e) => setOriginalLength(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="used-length">Used Length (meters)</label>
                    <input 
                      type="number" 
                      id="used-length"
                      className="form-control" 
                      placeholder="Enter used fabric length"
                      step="0.1"
                      value={usedLength}
                      onChange={(e) => setUsedLength(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">Calculate Savings</button>
                </form>
              </div>
            </div>

            {/* Recent Calculations */}
            <div className="recent-calculations">
              <div className="calculations-header">
                <h2>Recent Calculations ({filteredCalculations.length})</h2>

                {/* Search Bar */}
                <div className="search-container">
                  <div className="search-box">
                    <i className="fas fa-search"></i>
                    <input 
                      type="text"
                      placeholder="Search by fabric type..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="search-input"
                    />
                    {searchTerm && (
                      <button 
                        className="clear-search"
                        onClick={() => setSearchTerm("")}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {filteredCalculations.length === 0 ? (
                <div className="empty-state">
                  <i className="fas fa-calculator"></i>
                  <p>
                    {searchTerm ? 
                      `No calculations found for "${searchTerm}"` : 
                      "No calculations yet."
                    }
                  </p>
                  {searchTerm && (
                    <button 
                      className="btn btn-outline"
                      onClick={() => setSearchTerm("")}
                    >
                      Clear Search
                    </button>
                  )}
                </div>
              ) : (
                <div className="calculations-list-container">
                  <div className="calculations-list">
                    {filteredCalculations.map((calc) => (
                      <div key={calc.id} className="calculation-item">
                        <div className="calc-info">
                          <div className="calc-header">
                            <h4>{calc.fabricType}</h4>
                            <span className="calc-date">{calc.date}</span>
                          </div>
                          <div className="calc-details">
                            <div className="detail-item">
                              <span className="detail-label">Original:</span>
                              <span className="detail-value">{calc.originalLength}m</span>
                            </div>
                            <div className="detail-item">
                              <span className="detail-label">Used:</span>
                              <span className="detail-value">{calc.usedLength}m</span>
                            </div>
                            <div className="detail-item">
                              <span className="detail-label">Saved:</span>
                              <span className="detail-value savings">{calc.saved.toFixed(2)}m</span>
                            </div>
                          </div>
                        </div>
                        <div className="calc-actions">
                          <span className="savings-badge">+{calc.saved.toFixed(2)}m</span>
                          <div className="action-buttons">
                            <button 
                                className="btn-delete"
                                onClick={() => deleteCalculation(calc.id)}
                                title="Delete calculation"
                            >
                            Delete
                          </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default ScrapEstimatorPage;
