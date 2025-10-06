import { useState, useEffect } from 'react';
import { supabase } from '../util/supabase'; // Adjust import path as needed

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

  // Fetch thrift shops
  const fetchShops = async () => {
    try {
      const { data, error } = await supabase.from("THRIFT SHOP").select("*");
      if (error) throw error;
      setShops(data || []);
    } catch (err) {
      console.error("Error fetching thrift shops:", err.message);
    }
  };

  // Fetch all comments for moderation
  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from("COMMENT")
        .select(`
          *,
          THRIFT SHOP (ShopName),
          CUSTOMER (Username)
        `);
     
      if (error) throw error;
      setComments(data || []);
    } catch (err) {
      console.error("Error fetching comments:", err.message);
    }
  };

  // Add new thrift shop
  const handleAddShop = async (e) => {
    e.preventDefault();
  
    try {
      if (!newShop.Image) {
        alert("Please upload an image");
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
  
      fetchShops();
    } catch (err) {
      console.error("Error adding shop:", err.message);
      alert("Error adding shop: " + err.message);
    }
  };
  // Update existing shop
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
          Image: imageUrl, // ✅ always use the final URL (either old or new)
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
  
      fetchShops(); // Refresh list
    } catch (err) {
      console.error("Error updating shop:", err.message);
      alert("Error updating shop: " + err.message);
    }
  };


  // Delete shop
  const handleDeleteShop = async (shopId) => {
    if (!window.confirm("Are you sure you want to delete this shop?")) return;
   
    try {
      const { error } = await supabase
        .from("THRIFT SHOP")
        .delete()
        .eq('ShopID', shopId);

      if (error) throw error;
     
      fetchShops(); // Refresh the list
    } catch (err) {
      console.error("Error deleting shop:", err.message);
      alert("Error deleting shop: " + err.message);
    }
  };

  // Comment moderation - delete comment
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
   
    try {
      const { error } = await supabase
        .from("COMMENT")
        .delete()
        .eq('CommentID', commentId);

      if (error) throw error;
     
      fetchComments(); // Refresh the list
    } catch (err) {
      console.error("Error deleting comment:", err.message);
      alert("Error deleting comment: " + err.message);
    }
  };

  // Comment moderation - update comment status
  const handleUpdateCommentStatus = async (commentId, status) => {
    try {
      const { error } = await supabase
        .from("COMMENT")
        .update({ Status: status })
        .eq('CommentID', commentId);

      if (error) throw error;
     
      fetchComments(); // Refresh the list
    } catch (err) {
      console.error("Error updating comment status:", err.message);
      alert("Error updating comment status: " + err.message);
    }
  };

  // Set editing shop
  const handleEditShop = (shop) => {
    setEditingShop(shop);
    setNewShop({
      name: shop.ShopName || '',
      latitude: shop.Latitude?.toString() || '',
      longitude: shop.Longitude?.toString() || '',
      hours: shop.OperatingHours || '',
      priceRange: shop.PriceRange || '',
      itemTypes: shop.itemTypes || [],
      Image: shop.Image || '',
    });
  };

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

                  {/* Image URL */}
                  <div>
                    <label className="block mb-2 text-gray-800 font-medium">Image</label>
                    <input
                      type="text"
                      required
                      value={newShop.Image}
                      onChange={(e) => setNewShop({ ...newShop, Image: e.target.value })}
                      className="w-full px-3 py-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#2C6E49]"
                      placeholder="Paste Image link (e.g., https://example.com/shop.jpg)"
                    />
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
                  {editingShop ? 'Update Shop' : 'Add Shop'}
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
                      <p className="my-1 text-gray-600"><strong>Hours:</strong> {shop.OperatingHours}</p>
                      <p className="my-1 text-gray-600"><strong>Price Range:</strong> {shop.PriceRange}</p>
                      <p className="my-1 text-gray-600"><strong>Items:</strong> {shop.itemTypes?.join(', ') || 'None'}</p>
                      <p className="my-1 text-gray-600 text-sm">
                        <strong>Location:</strong> {shop.Latitude}, {shop.Longitude}
                      </p>
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
                  key={comment.CommentID}
                  className="bg-gray-100 p-5 rounded-lg border-l-4 border-[#2C6E49]"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">
                        @{comment.CUSTOMER?.Username || 'Unknown User'}
                      </p>
                      <p className="text-gray-700 mt-1 italic">"{comment.Content}"</p>
                      <div className="text-sm text-gray-600 mt-2">
                        <span className="font-semibold">Shop:</span> {comment['THRIFT SHOP']?.ShopName || 'Unknown Shop'} &nbsp;
                        <span className="font-semibold">Date:</span> {new Date(comment.CreationDate).toLocaleDateString()} &nbsp;
                        <span className="font-semibold">Status:</span>
                        <span className={`ml-1 px-2 py-1 rounded text-xs ${
                          comment.Status === 'visible'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {comment.Status}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                      {comment.Status !== 'visible' && (
                        <button
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                          onClick={() => handleUpdateCommentStatus(comment.CommentID, 'visible')}
                        >
                          Approve
                        </button>
                      )}
                      {comment.Status !== 'hidden' && (
                        <button
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                          onClick={() => handleUpdateCommentStatus(comment.CommentID, 'hidden')}
                        >
                          Hide
                        </button>
                      )}
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                        onClick={() => handleDeleteComment(comment.CommentID)}
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
    </div>
  );
}

export default AdminPage;
