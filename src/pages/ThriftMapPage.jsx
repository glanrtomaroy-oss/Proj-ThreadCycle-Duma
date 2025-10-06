import { useState, useEffect } from "react";
import supabase from "../supabase"; // ✅ make sure your supabase.js file is correct

function AdminPage({ user }) {
  const [activeTab, setActiveTab] = useState("shops");
  const [shops, setShops] = useState([]);
  const [comments, setComments] = useState({});
  const [newShop, setNewShop] = useState({
    name: "",
    latitude: "",
    longitude: "",
    hours: "",
    priceRange: "",
    itemTypes: [],
    image: "",
  });
  const [editingShop, setEditingShop] = useState(null);

  // ✅ Fetch thrift shops from Supabase
  const fetchShops = async () => {
    try {
      const { data, error } = await supabase.from("THRIFT SHOP").select("*");
      if (error) throw error;
      setShops(data || []);
    } catch (err) {
      console.error("Error fetching thrift shops:", err.message);
    }
  };

  // ✅ Fetch approved comments (Status = "visible")
  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from("COMMENT")
        .select("*")
        .eq("Status", "visible");
      if (error) throw error;

      const grouped = {};
      data.forEach((c) => {
        if (!grouped[c.ShopID]) grouped[c.ShopID] = [];
        grouped[c.ShopID].push(c);
      });

      setComments(grouped);
    } catch (err) {
      console.error("Error fetching comments:", err.message);
    }
  };

  // ✅ Initial data load
  useEffect(() => {
    fetchShops();
    fetchComments();
  }, []);

  // 🔹 Handle Delete Shop
  const handleDeleteShop = async (shopId) => {
    try {
      const { error } = await supabase
        .from("THRIFT SHOP")
        .delete()
        .eq("ShopID", shopId);
      if (error) throw error;
      fetchShops();
    } catch (err) {
      console.error("Error deleting shop:", err.message);
    }
  };

  // 🔹 Handle Delete Comment
  const handleDeleteComment = async (commentId) => {
    try {
      const { error } = await supabase
        .from("COMMENT")
        .delete()
        .eq("ComID", commentId);
      if (error) throw error;
      fetchComments();
    } catch (err) {
      console.error("Error deleting comment:", err.message);
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] bg-gray-100 py-10">
      <div className="max-w-6xl mx-auto px-5">
        <div className="text-center mb-10">
          <h1 className="text-gray-800 text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-600 text-lg">
            Manage thrift shops and moderate comments
          </p>
        </div>

        {/* Tabs */}
        <div className="flex bg-white rounded-lg p-2 mb-8 shadow-lg">
          <button
            onClick={() => setActiveTab("shops")}
            className={`flex-1 py-4 px-5 cursor-pointer text-base font-medium rounded-md transition-all
              ${
                activeTab === "shops"
                  ? "bg-white text-[#2C6E49] border border-[#2C6E49] shadow-sm"
                  : "bg-[#2C6E49] text-white hover:bg-[#25573A]"
              }`}
          >
            Thrift Shops
          </button>

          <button
            onClick={() => setActiveTab("comments")}
            className={`flex-1 py-4 px-5 cursor-pointer text-base font-medium rounded-md transition-all
              ${
                activeTab === "comments"
                  ? "bg-white text-[#2C6E49] border border-[#2C6E49] shadow-sm"
                  : "bg-[#2C6E49] text-white hover:bg-[#25573A]"
              }`}
          >
            Comment Moderation
          </button>
        </div>

        {/* 🏪 Thrift Shop Management */}
        {activeTab === "shops" && (
          <div className="bg-white rounded-lg p-8 shadow-lg">
            <h2 className="text-gray-800 mb-5 text-2xl font-bold border-b-2 border-gray-100 pb-2">
              Manage Thrift Shops
            </h2>

            <div className="grid gap-5">
              {shops.length === 0 ? (
                <p className="text-gray-500">No thrift shops found.</p>
              ) : (
                shops.map((shop) => (
                  <div
                    key={shop.ShopID}
                    className="bg-gray-100 p-5 rounded-lg border-l-4 border-[#2C6E49] flex justify-between items-center"
                  >
                    <div className="flex-1">
                      <h3 className="text-gray-800 mb-2 font-semibold">
                        {shop.Name}
                      </h3>
                      <p className="my-1 text-gray-600">
                        <strong>Hours:</strong> {shop.StoreHours}
                      </p>
                      <p className="my-1 text-gray-600">
                        <strong>Price Range:</strong> {shop.PriceRange}
                      </p>
                      <p className="my-1 text-gray-600">
                        <strong>Category:</strong> {shop.Category}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <button
                        className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-all"
                        onClick={() => handleDeleteShop(shop.ShopID)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* 💬 Comment Moderation */}
        {activeTab === "comments" && (
          <div className="bg-white rounded-lg p-8 shadow-lg">
            <h2 className="text-gray-800 mb-5 text-2xl font-bold border-b-2 border-gray-100 pb-2">
              Comment Moderation
            </h2>

            {Object.keys(comments).length === 0 ? (
              <p className="text-gray-500">No visible comments yet.</p>
            ) : (
              Object.entries(comments).map(([shopId, shopComments]) => (
                <div key={shopId} className="mb-8">
                  <h3 className="text-xl font-semibold text-[#2C6E49] mb-3">
                    Shop ID: {shopId}
                  </h3>

                  <div className="grid gap-5">
                    {shopComments.map((comment) => (
                      <div
                        key={comment.ComID}
                        className="bg-gray-100 p-5 rounded-lg border-l-4 border-[#2C6E49] flex justify-between items-center"
                      >
                        <div className="flex-1">
                          <p className="text-gray-800 mb-1">
                            <strong>Content:</strong> {comment.Content}
                          </p>
                          <p className="text-gray-600 text-sm">
                            <strong>Date:</strong>{" "}
                            {new Date(comment.CreationDate).toLocaleDateString()}
                          </p>
                        </div>

                        <button
                          className="bg-[#E63946] hover:bg-[#C92D39] text-white px-4 py-2 rounded-md text-sm font-medium"
                          onClick={() => handleDeleteComment(comment.ComID)}
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPage;
