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
  const [confirmDelete, setConfirmDelete] = useState({ show: false, projId: null });
  const { session, loading } = UserAuth();
  const isLoggedIn = !!session?.user;

  // --- existing constants and helpers unchanged ---
  const EMISSION_FACTOR_KG_PER_M_DEFAULT = 0.5;
  const FABRIC_EMISSION_FACTORS_KG_PER_M = {
    cotton: 7.5, polyester: 6, wool: 15, mixed: 6, denim: 10, silk: 20, linen: 10, leather: 30,
  };
  const getEmissionFactor = (type) => FABRIC_EMISSION_FACTORS_KG_PER_M[String(type || '').toLowerCase()] ?? EMISSION_FACTOR_KG_PER_M_DEFAULT;

  // --- unchanged calculateSavings, insertProject, fetchProject, etc. ---

  const fetchCustomerId = async () => {
    if (!session?.user?.id) return null;
    const { data, error } = await supabase
      .from('CUSTOMER')
      .select('CustID')
      .eq('Customer_uid', session.user.id)
      .single();
    if (error) {
      toast.error("Error fetching user.", error.message);
      return null;
    }
    return data?.CustID || null;
  };

  // ✅ UPDATED DELETE with theme modal
  const deleteCalculation = async (projId) => {
    setConfirmDelete({ show: true, projId });
  };

  const confirmDeleteAction = async () => {
    const projId = confirmDelete.projId;
    if (!projId) return;

    try {
      setLoadings(true);
      const { error } = await supabase.from('PROJECT').delete().eq('ProjID', projId);
      if (error) throw error;

      setCalculations(calculations.filter(c => c.ProjID !== projId));
      toast.success("Calculation deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete calculation.");
    } finally {
      setLoadings(false);
      setConfirmDelete({ show: false, projId: null });
    }
  };

  const cancelDelete = () => setConfirmDelete({ show: false, projId: null });

  useEffect(() => {
    if (!loading && session?.user) fetchProject();
  }, [loading, session]);

  const fetchProject = async () => {
    try {
      setLoadings(true);
      const custId = await fetchCustomerId();
      if (!custId) {
        setCalculations([]);
        return;
      }
      const { data, error } = await supabase.from("PROJECT").select("*").eq("CustID", custId);
      if (error) throw error;
      setCalculations(data || []);
    } catch {
      toast.error("Failed to fetch projects.");
      setCalculations([]);
    } finally {
      setLoadings(false);
    }
  };

  const filteredCalculations = calculations.filter((calc) =>
    (calc?.FabricType || "").toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalSaved = calculations.reduce((t, c) => t + Number(c?.FabricSaved || 0), 0);

  return (
    <>
      {/* existing sections above unchanged */}

      {/* Delete Confirmation Modal */}
      {confirmDelete.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-[90%] max-w-sm text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Delete Calculation?</h3>
            <p className="text-gray-600 mb-6">This action cannot be undone.</p>
            <div className="flex justify-center gap-3">
              <button
                onClick={confirmDeleteAction}
                className="px-5 py-2 bg-[#4C956C] text-white rounded-lg hover:bg-[#3B7D57] transition-all"
              >
                Yes, Delete
              </button>
              <button
                onClick={cancelDelete}
                className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* rest of your page unchanged */}
      {/* (from the “Recent Calculations” and everything below stays exactly same) */}
    </>
  );
}

export default ScrapEstimatorPage;
