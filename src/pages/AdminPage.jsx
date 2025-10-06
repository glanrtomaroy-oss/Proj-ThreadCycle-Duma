import { useState, useEffect } from "react";
import { supabase } from "../util/supabase"; // ✅ Adjust path as needed

function AdminPage() {
  const [activeTab, setActiveTab] = useState("shops");
  const [shops, setShops] = useState([]);
  const [comments, setComments] = useState([]);
  const [newShop, setNewShop] = useState({
    name: "",
    latitude: "",
    category: "",
    hours: "",
    priceRange: "",
    image: "",
  });
  const [editingShop, setEditingShop] = useState(null);

  // ✅ Fetch thrift shops
  const fetchShops = async () => {
    try {
      const { data, error } = await supabase.from("THRIFTSHOP").select("*");
      if (error) throw error;
      setShops(data || []);
    } catch (err) {
      console.error("Error fetching thrift shops:", err.message);
    }
  };

  // ✅ Fetch all comments (with relationships)
  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from("COMMENT")
        .select(`
          *,
          THRIFTSHOP(Name),
          CUSTOMER(Username)
        `);
      if (error) throw error;
      setComments(data || []);
    } catch (err) {
      console.error("Error fetching comments:", err.message);
    }
  };

  // ✅ Add new thrift shop
  const handleAddShop = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from("THRIFTSHOP").insert([
        {
          Name: newShop.name,
          Latitude: parseFloat(newShop.latitude),
          Category: newShop.category,
          StoreHours: newShop.hours,
          PriceRange: newShop.priceRange,
          Image: newShop.image || null,
        },
      ]);

      if (error) throw error;
      setNewShop({
        name: "",
        latitude: "",
        category: "",
        hours: "",
        priceRange: "",
        image: "",
      });
      fetchShops();
    } catch (err) {
      console.error("Error adding shop:", err.message);
      alert("Error adding shop: " + err.message);
    }
  };

  // ✅ Update existing shop
  const handleUpdateShop = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from("THRIFTSHOP")
        .update({
          Name: newShop.name,
          Latitude: parseFloat(newShop.latitude),
          Category: newShop.category,
          StoreHours: newShop.hours,
          PriceRange: newShop.priceRange,
          Image: newShop.image || null,
        })
        .eq("ShopID", editingShop.ShopID);

      if (error) throw error;

      setEditingShop(null);
      setNewShop({
        name: "",
        latitude: "",
        category: "",
        hours: "",
        priceRange: "",
        image: "",
      });
      fetchShops();
    } catch (err) {
      console.error("Error updating shop:", err.message);
      alert("Error updating shop: " + err.message);
    }
  };

  // ✅ Delete thrift shop
  const handleDeleteShop = async (shopId) => {
    if (!window.confirm("Are you sure you want to delete this shop?")) return;
    try {
      const { error } = await supabase
        .from("THRIFTSHOP")
        .delete()
        .eq("ShopID", shopId);
      if (error) throw error;
      fetchShops();
    } catch (err) {
      console.error("Error deleting shop:", err.message);
      alert("Error deleting shop: " + err.message);
    }
  };

  // ✅ Delete comment
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    try {
      const { error } = await supabase
        .from("COMMENT")
        .delete()
        .eq("ComID", commentId);
      if (error) throw error;
      fetchComments();
    } catch (err) {
      console.error("Error deleting comment:", err.message);
      alert("Error deleting comment: " + err.message);
    }
  };

  // ✅ Set edit mode
  const handleEditShop = (shop) => {
    setEditingShop(shop);
    setNewShop({
      name: shop.Name || "",
      latitude: shop.Latitude?.toString() || "",
      category: shop.Category || "",
      hours: shop.StoreHours || "",
      priceRange: shop.PriceRange || "",
      image: shop.Image || "",
    });
  };

  useEffect(() => {
    fetchShops();
    fetchComments();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-6xl mx-auto px-5">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600 text-lg">
            Manage thrift shops and moderate comments
          </p>
        </div>

        {/* Tabs */}
        <div className="flex bg-white rounded-lg p-2 mb-8 shadow-lg gap-2">
          <button
            onClick={() => setActiveTab("shops")}
            className={`flex-1 py-4 px-5 rounded-md font-medium transition-all ${
              activeTab === "shops"
                ? "bg-white text-[#2C6E49] border border-[#2C6E49]"
                : "bg-[#2C6E49] text-white hover:bg-[#25573A]"
            }`}
          >
            Thrift Shops
          </button>
          <button
            onClick={() => setActiveTab("comments")}
            className={`flex-1 py-4 px-5 rounded-md font-medium transition-all ${
              activeTab === "comments"
                ? "bg-white text-[#2C6E49] border border-[#2C6E49]"
                : "bg-[#2C6E49] text-white hover:bg-[#25573A]"
            }`}
          >
            Comments
          </button>
        </div>

        {/* Thrift Shop Management */}
        {activeTab === "shops" && (
          <div className="bg-white rounded-lg p-8 shadow-lg">
            <h2 className="text-2xl font-bold mb-5 text-gray-800">
              {editingShop ? "Edit Thrift Shop" : "Add New Thrift Shop"}
            </h2>

            <form
              onSubmit={editingShop ? handleUpdateShop : handleAddShop}
              className="bg-gray-100 p-6 rounded-lg mb-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block mb-2 font-medium text-gray-800">
                    Shop Name
                  </label>
                  <input
                    type="text"
                    value={newShop.name}
                    onChange={(e) =>
                      setNewShop({ ...newShop, name: e.target.value })
                    }
                    className="w-full px-3 py-3 border-2 border-gray-200 rounded-md focus:border-[#2C6E49]"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium text-gray-800">
                    Image URL
                  </label>
                  <input
                    type="text"
                    value={newShop.image}
                    onChange={(e) =>
                      setNewShop({ ...newShop, image: e.target.value })
                    }
                    className="w-full px-3 py-3 border-2 border-gray-200 rounded-md focus:border-[#2C6E49]"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium text-gray-800">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={newShop.latitude}
                    onChange={(e) =>
                      setNewShop({ ...newShop, latitude: e.target.value })
                    }
                    className="w-full px-3 py-3 border-2 border-gray-200 rounded-md focus:border-[#2C6E49]"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium text-gray-800">
                    Category
                  </label>
                  <input
                    type="text"
                    value={newShop.category}
                    onChange={(e) =>
                      setNewShop({ ...newShop, category: e.target.value })
                    }
                    className="w-full px-3 py-3 border-2 border-gray-200 rounded-md focus:border-[#2C6E49]"
                    placeholder="e.g., Clothing, Bags, Shoes"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium text-gray-800">
                    Store Hours
                  </label>
                  <input
                    type="text"
                    value={newShop.hours}
                    onChange={(e) =>
                      setNewShop({ ...newShop, hours: e.target.value })
                    }
                    className="w-full px-3 py-3 border-2 border-gray-200 rounded-md focus:border-[#2C6E49]"
                    placeholder="e.g., 9AM - 6PM"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium text-gray-800">
                    Price Range
                  </label>
                  <input
                    type="text"
                    value={newShop.priceRange}
                    onChange={(e) =>
                      setNewShop({ ...newShop, priceRange: e.target.value })
                    }
                    className="w-full px-3 py-3 border-2 border-gray-200 rounded-md focus:border-[#2C6E49]"
                    placeholder="e.g., ₱100 - ₱500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="mt-6 px-6 py-3 bg-[#2C6E49] text-white rounded-md hover:bg-[#25573A]"
              >
                {editingShop ? "Update Shop" : "Add Shop"}
              </button>

              {editingShop && (
                <button
                  type="button"
                  className="ml-3 px-6 py-3 border-2 border-[#2C6E49] text-[#2C6E49] rounded-md hover:bg-[#2C6E49] hover:text-white"
                  onClick={() => {
                    setEditingShop(null);
                    setNewShop({
                      name: "",
                      latitude: "",
                      category: "",
                      hours: "",
                      priceRange: "",
                      image: "",
                    });
                  }}
                >
                  Cancel
                </button>
              )}
            </form>

            {/* Display shops */}
            <div>
              <h2 className="text-2xl font-bold mb-5 text-gray-800">
                Manage Thrift Shops ({shops.length})
              </h2>
              <div className="grid gap-5">
                {shops.map((shop) => (
                  <div
                    key={shop.ShopID}
                    className="bg-gray-100 p-5 rounded-lg border-l-4 border-[#2C6E49] flex justify-between items-center"
                  >
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {shop.Name}
                      </h3>
                      <p className="text-gray-600">Hours: {shop.StoreHours}</p>
                      <p className="text-gray-600">
                        Category: {shop.Category || "N/A"}
                      </p>
                      <p className="text-gray-600">
                        Price Range: {shop.PriceRange}
                      </p>
                      <p className="text-sm text-gray-500">
                        Location: {shop.Latitude}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleEditShop(shop)}
                        className="px-5 py-2 border-2 border-[#2C6E49] text-[#2C6E49] rounded-md hover:bg-[#2C6E49] hover:text-white"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteShop(shop.ShopID)}
                        className="px-5 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ✅ Comment Moderation */}
        {activeTab === "comments" && (
          <div className="bg-white rounded-lg p-8 shadow-lg">
            <h2 className="text-2xl font-bold mb-5 text-gray-800">
              Comments ({comments.length})
            </h2>
            <div className="grid gap-5">
              {comments.map((comment) => (
                <div
                  key={comment.ComID}
                  className="bg-gray-100 p-5 rounded-lg border-l-4 border-[#2C6E49]"
                >
                  <p className="font-semibold text-gray-800">
                    @{comment.CUSTOMER?.Username || "Unknown User"}
                  </p>
                  <p className="italic text-gray-700 mt-1">
                    "{comment.Content}"
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    <strong>Shop:</strong>{" "}
                    {comment.THRIFTSHOP?.Name || "Unknown"} <br />
                    <strong>Date:</strong>{" "}
                    {new Date(comment.CreationDate).toLocaleDateString()}
                  </p>

                  <button
                    className="mt-3 px-5 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    onClick={() => handleDeleteComment(comment.ComID)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPage;
