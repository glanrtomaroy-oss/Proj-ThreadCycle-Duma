import { useState, useEffect, useRef } from 'react';
import { supabase } from '../util/supabase'; // Adjust import path as needed
import toast from 'react-hot-toast'

// Admin dashboard: manage shops and moderate comments
function AdminPage() {
  const [activeTab, setActiveTab] = useState('shops');
  const [shops, setShops] = useState([]);
  const [comments, setComments] = useState([]);
  const [newShop, setNewShop] = useState({
    name: '',
    latitude: '',
    longitude: '',
    hours: '',
    priceRange: '',
    itemTypes: [],
    Image: '',
  });
  const [editingShop, setEditingShop] = useState(null);
  const fileInputRef = useRef(null);

  // Fetch thrift shops (ordered by ShopID)
  const fetchShops = async () => {
    try {
      const { data, error } = await supabase
        .from("THRIFT SHOP")
        .select("*")
        .order("ShopID", { ascending: true });
      if (error) throw error;
      setShops(data || []);
    } catch (err) {
      toast.error("Error fetching thrift shops:", err.message);
    }
  };

  // Fetch all comments for moderation (joined with shop and user)
  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from("COMMENT")
        .select(`
          *,
          "THRIFT SHOP" (Name),
          CUSTOMER (Username)
        `);
     
      if (error) throw error;
      setComments(data || []);
    } catch (err) {
      toast.error("Error fetching comments:", err.message);
    }
  };

  // Add new thrift shop: upload image to storage, insert row to THRIFT SHOP
  const handleAddShop = async (e) => {
    e.preventDefault();
  
    try {
      if (!newShop.Image) {
        toast.error("Please upload an image", err.message);
        return;
      }
  
      const file = newShop.Image;
      const fileName = `${Date.now()}_${file.name}`;
      const filePath = `thrift-shops/${fileName}`;
  
      const { error: uploadError } = await supabase.storage
        .from("thrift-shop-images")
        .upload(filePath, file);
  
      if (uploadError) throw uploadError;
  
      const { data: publicData } = supabase.storage
        .from("thrift-shop-images")
        .getPublicUrl(filePath);
  
      const imageUrl = publicData.publicUrl;
  
      const { error: insertError } = await supabase
        .from("THRIFT SHOP")
        .insert([{
          Name: newShop.name,
          Latitude: newShop.latitude.toString(),
          Longitude: newShop.longitude.toString(),
          StoreHours: newShop.hours,
          PriceRange: newShop.priceRange,
          Category: newShop.itemTypes.join(','),
          Image: imageUrl,
          AdminID: 1 // adjust as needed
        }]);
  
      if (insertError) throw insertError;
  
      // Reset form
      setNewShop({
        name: '',
        latitude: '',
        longitude: '',
        hours: '',
        priceRange: '',
        itemTypes: [],
        Image: '',
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      toast.success("Successfully Added Shop!");
      fetchShops();
    } catch (err) {
      toast.error("Error adding shop. Ensure all fields are filled." + err.message);
    }
  };
  // Update existing shop: optionally upload new image, then update row
  const handleUpdateShop = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = editingShop.Image; // keep existing image as default
  
      if (newShop.Image instanceof File) {
        const fileName = `${Date.now()}_${newShop.Image.name}`;
        const filePath = `thrift-shops/${fileName}`;
  
        const { error: uploadError } = await supabase.storage
          .from("thrift-shop-images")
          .upload(filePath, newShop.Image, { upsert: true });
  
        if (uploadError) throw uploadError;
  
        const { data } = supabase.storage
          .from("thrift-shop-images")
          .getPublicUrl(filePath);
        imageUrl = data.publicUrl;
      }
  
      const { error } = await supabase
        .from("THRIFT SHOP")
        .update({
          Name: newShop.name,
          Latitude: newShop.latitude.toString(),
          Longitude: newShop.longitude.toString(),
          StoreHours: newShop.hours,
          PriceRange: newShop.priceRange,
          Category: newShop.itemTypes.join(','),
          Image: imageUrl, // always use the final URL (either old or new)
        })
        .eq("ShopID", editingShop.ShopID);
  
      if (error) throw error;
  
      // Step 3: Reset UI
      setEditingShop(null);
      setNewShop({
        name: "",
        latitude: "",
        longitude: "",
        hours: "",
        priceRange: "",
        itemTypes: [],
        Image: "",
      });
      toast.success("Successfully Updated Shop!");
      fetchShops(); // Refresh list
    } catch (err) {
      toast.error("Error updating shop:", err.message);
      alert("Error updating shop: " + err.message);
    }
  };


  // State for modal confirmation
const [pendingDeleteShop, setPendingDeleteShop] = useState(null);
const [pendingDeleteComment, setPendingDeleteComment] = useState(null);

// --- SHOP DELETION ---
const handleDeleteShop = (shopId) => {
  setPendingDeleteShop(shopId); // 🔹 triggers the modal
};

const confirmDeleteShop = async () => {
  try {
    const { error } = await supabase
      .from("THRIFT SHOP")
      .delete()
      .eq("ShopID", pendingDeleteShop);

    if (error) throw error;
    toast.success("Successfully Deleted Shop!");
    fetchShops();
  } catch (err) {
    toast.error("Error deleting shop: " + err.message);
  } finally {
    setPendingDeleteShop(null);
  }
};

const cancelDeleteShop = () => setPendingDeleteShop(null);

// --- COMMENT DELETION ---
const handleDeleteComment = (commentId) => {
  setPendingDeleteComment(commentId); // 🔹 triggers the modal
};

const confirmDeleteComment = async () => {
  try {
    const { error } = await supabase
      .from("COMMENT")
      .delete()
      .eq("ComID", pendingDeleteComment);

    if (error) throw error;
    toast.success("Successfully Deleted Comment!");
    fetchComments();
  } catch (err) {
    toast.error("Error deleting comment: " + err.message);
  } finally {
    setPendingDeleteComment(null);
  }
};

const cancelDeleteComment = () => setPendingDeleteComment(null);

  // Set editing shop: prefill form with selected shop fields
  const handleEditShop = (shop) => {
    setEditingShop(shop);
    setNewShop({
      name: shop.Name || '',
      latitude: shop.Latitude?.toString() || '',
      longitude: shop.Longitude?.toString() || '',
      hours: shop.StoreHours || '',
      priceRange: shop.PriceRange || '',
      itemTypes: shop.Category ? shop.Category.split(',') : [],
      Image: shop.Image || '',
    });
  
    // clear previous file input
    if (fileInputRef.current) fileInputRef.current.value = '';

    window.scrollTo({ top: 200, behavior: 'smooth' });
  };


  // On mount, load shops and comments
  useEffect(() => {
    fetchShops();
    fetchComments();
  }, []);

  return (
    <div className="min-h-[calc(100vh-200px)] bg-gray-100 py-10">
      <div className="max-w-6xl mx-auto px-5">
        <div className="text-center mb-10">
          <h1 className="text-gray-800 text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-600 text-lg">Manage thrift shops and moderate comments</p>
        </div>

        {/* Tabs */}
        <div className="flex bg-white rounded-lg p-2 mb-8 shadow-lg gap-2">
          <button
            onClick={() => setActiveTab('shops')}
            className={`flex-1 py-4 px-5 cursor-pointer text-base font-medium rounded-md transition-all
              ${
                activeTab === 'shops'
                  ? 'bg-[#2C6E49] text-white border border-[#2C6E49] shadow-sm'
                  : 'bg-white text-[#2C6E49] hover:bg-[#25573A]'
              }`}
          >
            Thrift Shops
          </button>

          <button
            onClick={() => setActiveTab('comments')}
            className={`flex-1 py-4 px-5 cursor-pointer text-base font-medium rounded-md transition-all
              ${
                activeTab === 'comments'
                  ? 'bg-[#2C6E49] text-white border border-[#2C6E49] shadow-sm'
                  : 'bg-white text-[#2C6E49] hover:bg-[#25573A]'
              }`}
          >
            Comment Moderation
          </button>
        </div>

        {/* Thrift Shops Management */}
        {activeTab === 'shops' && (
          <div className="bg-white rounded-lg p-8 shadow-lg">
            <div className="mb-10">
              <h2 className="text-gray-800 mb-5 text-2xl font-bold border-b-2 border-gray-100 pb-2">
                {editingShop ? 'Edit Thrift Shop' : 'Add New Thrift Shop'}
              </h2>
              <form
                onSubmit={editingShop ? handleUpdateShop : handleAddShop}
                className="bg-gray-100 p-6 rounded-lg mb-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  {/* Shop Name */}
                  <div>
                    <label className="block mb-2 text-gray-800 font-medium">Shop Name</label>
                    <input
                      type="text"
                      value={newShop.name}
                      onChange={(e) => setNewShop({ ...newShop, name: e.target.value })}
                      className="w-full px-3 py-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#2C6E49]"
                      required
                      placeholder="Enter shop name"
                    />
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="block mb-2 text-gray-800 font-medium">Upload Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={(e) => setNewShop({ ...newShop, Image: e.target.files[0] })}
                      className="w-full px-3 py-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#2C6E49]"
                    />
                  {editingShop && editingShop.Image && (
                    <div className="mt-3">
                      <img
                        src={editingShop.Image}
                        alt="Current Shop"
                        className="w-32 h-32 object-cover rounded-md border"
                      />
                    </div>
                  )}
                    {editingShop && !newShop.Image instanceof File && editingShop.Image && (
                      <div className="mt-2 text-sm text-gray-600">
                        <strong>Current image:</strong> {editingShop.Image.split('/').pop()}
                      </div>
                    )}
                  </div>

                  {/* Latitude */}
                  <div>
                    <label className="block mb-2 text-gray-800 font-medium">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      value={newShop.latitude}
                      onChange={(e) => setNewShop({ ...newShop, latitude: e.target.value })}
                      className="w-full px-3 py-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#2C6E49]"
                      required
                      placeholder="e.g., 9.3057"
                    />
                  </div>

                  {/* Longitude */}
                  <div>
                    <label className="block mb-2 text-gray-800 font-medium">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      value={newShop.longitude}
                      onChange={(e) => setNewShop({ ...newShop, longitude: e.target.value })}
                      className="w-full px-3 py-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#2C6E49]"
                      required
                      placeholder="e.g., 123.3055"
                    />
                  </div>

                  {/* Operating Hours */}
                  <div>
                    <label className="block mb-2 text-gray-800 font-medium">Operating Hours</label>
                    <input
                      type="text"
                      value={newShop.hours}
                      onChange={(e) => setNewShop({ ...newShop, hours: e.target.value })}
                      className="w-full px-3 py-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#2C6E49]"
                      required
                      placeholder="e.g., 9:00 AM - 6:00 PM"
                    />
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="block mb-2 text-gray-800 font-medium">Price Range</label>
                    <input
                      type="text"
                      value={newShop.priceRange}
                      onChange={(e) => setNewShop({ ...newShop, priceRange: e.target.value })}
                      className="w-full px-3 py-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#2C6E49]"
                      required
                      placeholder="e.g., ₱100 - ₱500"
                    />
                  </div>
                </div>

                <div className="mb-5">
                  <label className="block mb-2 text-gray-800 font-medium">Item Types</label>
                  <div className="flex gap-5 flex-wrap">
                    {['clothing', 'shoes', 'bags', 'accessories'].map((type) => (
                      <label key={type} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newShop.itemTypes.includes(type)}
                          onChange={(e) => {
                            const types = e.target.checked
                              ? [...newShop.itemTypes, type]
                              : newShop.itemTypes.filter((t) => t !== type);
                            setNewShop({ ...newShop, itemTypes: types });
                          }}
                        />
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-md text-sm font-medium transition-all bg-[#2C6E49] text-white hover:bg-[#25573A]"
                >
                  {editingShop ? 'Save Changes' : 'Add Shop'}
                </button>
                {editingShop && (
                  <button
                    type="button"
                    className="ml-3 px-6 py-3 border-2 border-[#2C6E49] text-[#2C6E49] rounded-md hover:bg-[#2C6E49] hover:text-white transition-all"
                    onClick={() => {
                      setEditingShop(null);
                      setNewShop({
                        name: '',
                        latitude: '',
                        longitude: '',
                        hours: '',
                        priceRange: '',
                        itemTypes: [],
                        Image: ''
                      });
                    }}
                  >
                    Cancel
                  </button>
                )}
              </form>
            </div>

            <div>
              <h2 className="text-gray-800 mb-5 text-2xl font-bold border-b-2 border-gray-100 pb-2">
                Manage Thrift Shops ({shops.length} total)
              </h2>
              <div className="grid gap-5">
                {shops.map((shop) => (
                  <div
                    key={shop.ShopID}
                    className="bg-gray-100 p-5 rounded-lg border-l-4 border-[#2C6E49] flex justify-between items-center"
                  >
                    <div className="flex-1">
                      <h3 className="text-gray-800 mb-2">{shop.ShopName}</h3>
                      <h3 className="my-1 text-gray-600"><strong>Shop Name:</strong> {shop.Name}</h3>
                      <p className="my-1 text-gray-600"><strong>Hours:</strong> {shop.StoreHours}</p>
                      <p className="my-1 text-gray-600"><strong>Price Range:</strong> {shop.PriceRange}</p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <button
                        className="px-6 py-2 border-2 border-[#2C6E49] text-[#2C6E49] bg-white rounded-md hover:bg-[#2C6E49] hover:text-white transition-all"
                        onClick={() => handleEditShop(shop)}
                      >
                        Edit
                      </button>
                      <button
                        className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-all"
                        onClick={() => handleDeleteShop(shop.ShopID)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
                {shops.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No thrift shops found. Add your first shop above.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Comment Moderation */}
        {activeTab === 'comments' && (
          <div className="bg-white rounded-lg p-8 shadow-lg">
            <h2 className="text-gray-800 mb-5 text-2xl font-bold border-b-2 border-gray-100 pb-2">
              Comment Moderation ({comments.length} total)
            </h2>
            <div className="grid gap-5">
              {comments.map((comment) => (
                <div
                  key={comment.ComID}
                  className="bg-gray-100 p-5 rounded-lg border-l-4 border-[#2C6E49]"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">
                        @{comment.CUSTOMER?.Username || 'Unknown User'}
                      </p>
                      <p className="text-gray-700 mt-1 italic">"{comment.Content}"</p>
                      <div className="text-sm text-gray-600 mt-2">
                        <span className="font-semibold">Shop:</span> {comment['THRIFT SHOP']?.Name || 'Unknown Shop'} &nbsp;
                        <span className="font-semibold">Date:</span> {new Date(comment.CreationDate).toLocaleDateString()} &nbsp;
                      </div>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                        onClick={() => handleDeleteComment(comment.ComID)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {comments.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No comments found.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

{/* SHOP DELETE CONFIRMATION */}
{pendingDeleteShop && (
  <div className="fixed inset-0 flex items-center justify-center z-50">
    <div className="bg-white border border-gray-300 rounded-xl shadow-2xl w-full max-w-md p-8 text-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Confirm Deletion</h2>
      <p className="text-gray-600 mb-6">
        Are you sure you want to delete this thrift shop? This action cannot be undone.
      </p>
      <div className="flex justify-center gap-4">
        <button
          onClick={confirmDeleteShop}
          className="px-6 py-3 bg-[#2C6E49] text-white rounded-md hover:bg-[#25573A] transition-all"
        >
          Yes, Delete
        </button>
        <button
          onClick={cancelDeleteShop}
          className="px-6 py-3 border-2 border-[#2C6E49] text-[#2C6E49] rounded-md hover:bg-[#2C6E49] hover:text-white transition-all"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

{/* COMMENT DELETE CONFIRMATION */}
{pendingDeleteComment && (
  <div className="fixed inset-0 flex items-center justify-center z-50">
    <div className="bg-white border border-gray-300 rounded-xl shadow-2xl w-full max-w-md p-8 text-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Confirm Deletion</h2>
      <p className="text-gray-600 mb-6">
        Are you sure you want to delete this comment? This cannot be undone.
      </p>
      <div className="flex justify-center gap-4">
        <button
          onClick={confirmDeleteComment}
          className="px-6 py-3 bg-[#2C6E49] text-white rounded-md hover:bg-[#25573A] transition-all"
        >
          Yes, Delete
        </button>
        <button
          onClick={cancelDeleteComment}
          className="px-6 py-3 border-2 border-[#2C6E49] text-[#2C6E49] rounded-md hover:bg-[#2C6E49] hover:text-white transition-all"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}


    </div>
  );
}

export default AdminPage;
