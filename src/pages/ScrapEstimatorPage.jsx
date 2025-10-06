import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { supabase } from '../util/supabase'
import { UserAuth } from '../context/AuthContext'

function ScrapEstimatorPage() {
  const [fabricType, setFabricType] = useState("");
  const [originalLength, setOriginalLength] = useState("");
  const [usedLength, setUsedLength] = useState("");
  const [calculations, setCalculations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadings, setLoadings] = useState(false);
  const { session, loading } = UserAuth();

  const calculateSavings = async (e) => {
    e.preventDefault();

    if (!fabricType || !originalLength || !usedLength) {
      alert("Please fill in all fields");
      return;
    }

    const original = parseFloat(originalLength);
    const used = parseFloat(usedLength);

    if (used > original) {
      toast.error("Used length cannot be greater than original length");
      return;
    }

    const saved = original - used;

    await insertProject(saved);
    await fetchProject();

    toast.success(`You saved ${saved.toFixed(2)} meters of ${fabricType} fabric!`);

    // // Reset form
    // setFabricType("");
    // setOriginalLength("");
    // setUsedLength("");
  };

  const insertProject = async (fabricSaved) => {
    try {
      setLoadings(true);

      const custId = await fetchCustomerId();
      if (!custId) return [];

      const { data, error } = await supabase
        .from('PROJECT')
        .insert([{
          FabricType: fabricType,
          OriginalLength: originalLength,
          UsedLength: usedLength,
          FabricSaved: fabricSaved, // match column name
          CO2Reduction: 5,
          CustID: custId,
        }])
        .select(); // return the inserted row

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Failed to insert into supabase", error.message);
      return null;
    } finally {
      setLoadings(false);
    }
  };

  const fetchProject = async () => {
    try {
      setLoadings(true);

      const custId = await fetchCustomerId();
      if (!custId) {
        setCalculations([]);
        return;
      }

      const { data, error } = await supabase
        .from("PROJECT")
        .select("*")
        .eq("CustID", custId);

      if (error) throw error;
      setCalculations(data || []);
      return data || [];
    } catch (error) {
      console.error("Failed to fetch from supabase", error.message);
      setCalculations([]);
      return [];
    } finally {
      setLoadings(false);
    }
  };

  useEffect(() => {
    if (loading) return;
    if (!session?.user) return;

    fetchProject();
  }, [loading, session]);

  const fetchCustomerId = async () => {
    if (!session?.user?.id) return null;
    const { data, error } = await supabase
      .from('CUSTOMER')
      .select('CustID')
      .eq('Customer_uid', session.user.id) // assuming column is Customer_uid
      .single(); // since each user should have exactly one customer row

    if (error) {
      console.error("Error fetching customer id:", error.message);
      return null;
    }

    return data?.CustID || null;
  };


  // Delete calculation
  const deleteCalculation = async (projId) => {
    if (!projId) return;
  
    if (!window.confirm("Are you sure you want to delete this calculation?")) return;
  
    try {
      setLoadings(true);
  
      // Delete from Supabase
      const { error } = await supabase
        .from('PROJECT')
        .delete()
        .eq('ProjID', projId); // use the correct primary key
  
      if (error) throw error;
  
      // Update local state
      setCalculations(calculations.filter(calc => calc.ProjID !== projId));
      toast.success("Calculation deleted successfully!");
    } catch (error) {
      console.error("Failed to delete calculation:", error.message);
      toast.error("Failed to delete calculation.");
    } finally {
      setLoadings(false);
    }
  };

  // Filter calculations based on search term
  const filteredCalculations = calculations.filter((calc) =>
    (calc?.FabricType || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalSaved = calculations.reduce(
    (total, calc) => total + Number(calc?.FabricSaved || 0),
    0
  );

  const handleFabricType = (e) => {
    const value = e.target.value;

    const lettersOnlyRegex = /^[A-Za-z]+$/;

    if (lettersOnlyRegex.test(value) || value === "") {
      setFabricType(value);
    }
  }

  const handleOriginalLength = (e) => {
    const value = e.target.value;

    const numbersWithDecimalRegex = /^\d*\.?\d*$/;

    if (numbersWithDecimalRegex.test(value) || value === "") {
      setOriginalLength(value);
    }
  }

  const handleUsedLength = (e) => {
    const value = e.target.value;

    const numbersWithDecimalRegex = /^\d*\.?\d*$/;

    if (numbersWithDecimalRegex.test(value) || value === "") {
      setUsedLength(value);
    }
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-[url('https://images.unsplash.com/photo-1558769132-cb1aea458c5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80')] bg-cover bg-center bg-no-repeat" id="scrap-estimator">

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#7a8450]/70 to-[rgba(38,70,83,0.8)]"></div>

        <div className="relative w-full max-w-6xl mx-auto px-4 text-white py-20 text-center">
          <h1 className="text-4xl font-bold mb-5">Scrap Estimator Dashboard</h1>
          <p className="text-xl max-w-3xl mx-auto mb-8">Track your fabric usage and calculate material savings</p>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="bg-[#FEFEE3] py-10 min-h-[80vh]">
        <div className="w-full max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">

            {/* Dashboard Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:col-span-2">
              <div className="bg-white rounded-lg p-5 shadow-lg flex items-center gap-4">
                <div className="w-12 h-12 bg-[#4C956C] rounded-full flex items-center justify-center text-white text-xl">
                  <i className="fas fa-ruler-combined"></i>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-1">{calculations.length}</h3>
                  <p className="text-gray-600 m-0">Projects Tracked</p>
                </div>
              </div>
              <div className="bg-white rounded-lg p-5 shadow-lg flex items-center gap-4">
                <div className="w-12 h-12 bg-[#4C956C] rounded-full flex items-center justify-center text-white text-xl">
                  <i className="fas fa-leaf"></i>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-1">{totalSaved.toFixed(2)}m</h3>
                  <p className="text-gray-600 m-0">Total Fabric Saved</p>
                </div>
              </div>
              <div className="bg-white rounded-lg p-5 shadow-lg flex items-center gap-4">
                <div className="w-12 h-12 bg-[#4C956C] rounded-full flex items-center justify-center text-white text-xl">
                  <i className="fas fa-co2"></i>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-1">{(totalSaved * 0.5).toFixed(1)}kg</h3>
                  <p className="text-gray-600 m-0">CO₂ Reduction*</p>
                </div>
              </div>
            </div>

            {/* Calculator Form */}
            <div className="bg-white rounded-lg p-8 shadow-lg">
              <div>
                <h2 className="text-gray-800 mb-5 text-center text-xl font-bold">Calculate Fabric Savings</h2>
                <form onSubmit={calculateSavings}>
                  <div className="mb-5">
                    <label htmlFor="fabric-type" className="block mb-2 text-gray-800 font-medium">Fabric Type</label>
                    <input
                      type="text"
                      id="fabric-type"
                      className="w-full px-4 py-3 border border-gray-300 rounded text-base"
                      placeholder="e.g., Cotton, Denim, Silk"
                      value={fabricType}
                      onChange={handleFabricType}
                    />
                  </div>
                  <div className="mb-5">
                    <label htmlFor="original-length" className="block mb-2 text-gray-800 font-medium">Original Length (meters)</label>
                    <input
                      type="number"
                      id="original-length"
                      className="w-full px-4 py-3 border border-gray-300 rounded text-base"
                      placeholder="Enter original fabric length"
                      step="0.1"
                      value={originalLength}
                      onChange={handleOriginalLength}
                    />
                  </div>
                  <div className="mb-5">
                    <label htmlFor="used-length" className="block mb-2 text-gray-800 font-medium">Used Length (meters)</label>
                    <input
                      type="number"
                      id="used-length"
                      className="w-full px-4 py-3 border border-gray-300 rounded text-base"
                      placeholder="Enter used fabric length"
                      step="0.1"
                      value={usedLength}
                      onChange={handleUsedLength}
                    />
                  </div>
                  <button type="submit" className="px-6 py-3 border-none rounded cursor-pointer font-medium transition-all bg-[#4C956C] text-white hover:bg-[#3B7D57] w-full">Calculate Savings</button>
                </form>
              </div>
            </div>

            {/* Recent Calculations */}
            <div className="bg-white rounded-lg p-8 shadow-lg max-h-116 flex flex-col">
              <div className="flex justify-between items-center mb-5 flex-shrink-0 flex-wrap gap-4">
                <h2 className="text-gray-800 text-xl font-bold">Recent Calculations ({filteredCalculations.length})</h2>

                {/* Search Bar */}
                <div className="flex items-center">
                  <div className="relative flex items-center bg-white border border-gray-300 rounded-full px-4 py-2 min-w-[250px] transition-colors focus-within:border-[#4c5f0d]">
                    <i className="fas fa-search text-gray-600 mr-2"></i>
                    <input
                      type="text"
                      placeholder="Search by fabric type..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="border-none outline-none flex-1 text-sm bg-transparent"
                    />
                    {searchTerm && (
                      <button
                        className="bg-none border-none text-gray-600 cursor-pointer p-1 rounded-full transition-all hover:bg-gray-100 hover:text-gray-800"
                        onClick={() => setSearchTerm("")}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {filteredCalculations.length === 0 ? (
                <div className="text-center py-10 px-5 text-gray-600 flex-1 flex flex-col items-center justify-center">
                  <i className="fas fa-calculator text-5xl mb-4 text-gray-300"></i>
                  <p className="mb-4">
                    {searchTerm ?
                      `No calculations found for "${searchTerm}"` :
                      "No calculations yet."
                    }
                  </p>
                  {searchTerm && (
                    <button
                      className="px-4 py-2 bg-transparent border border-[#4c5f0d] text-[#4c5f0d] rounded hover:bg-[#4c5f0d] hover:text-white transition-colors"
                      onClick={() => setSearchTerm("")}
                    >
                      Clear Search
                    </button>
                  )}
                </div>
              ) : (
                <div className="max-h-[400px] overflow-y-auto border border-gray-300 rounded-lg bg-white flex-1">
                  <div className="flex flex-col gap-4 p-4">
                    {filteredCalculations.map((calc) => (
                      <div key={calc.ProjID || `${calc.CustID}-${calc.OriginalLength}-${calc.UsedLength}`} className="flex justify-between items-center p-4 border border-gray-300 rounded-md transition-all hover:border-[#4c5f0d] hover:-translate-y-0.5">
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="text-gray-800 font-medium">{calc.FabricType}</h4>
                            <span className="text-xs text-gray-600">{ }</span>
                          </div>
                          <div className="grid grid-cols-3 gap-4 mt-2">
                            <div className="flex flex-col">
                              <span className="text-xs text-gray-600 mb-1 font-medium">Original:</span>
                              <span className="font-semibold text-gray-800 text-sm">{calc.OriginalLength}m</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs text-gray-600 mb-1 font-medium">Used:</span>
                              <span className="font-semibold text-gray-800 text-sm">{calc.UsedLength}m</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs text-gray-600 mb-1 font-medium">Saved:</span>
                              <span className="font-semibold text-green-600 text-sm">{Number(calc.FabricSaved || 0).toFixed(2)}m</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className="bg-green-600 text-white px-2 py-1 rounded-full font-medium text-sm">+{Number(calc.CO2Reduction || 0).toFixed(2)}m</span>
                          <div className="flex gap-1">
                            <button
                              className="bg-none text-red-500 border border-red-500 px-3 py-1 rounded-md cursor-pointer text-sm font-medium transition-all hover:bg-red-500 hover:text-white hover:-translate-y-0.5 mt-2 ml-1"
                              onClick={() => deleteCalculation(calc.ProjID)}
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
