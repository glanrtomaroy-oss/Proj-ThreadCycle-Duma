import { useState, useEffect } from "react";
import supabase from "../supabase"; // ✅ make sure your supabase.js file is correct

function AdminPage({ user }) {
  const [activeTab, setActiveTab] = useState("shops");
  const [shops, setShops] = useState([]);
  const [comments, setComments] = useState([]);

  // Fetch thrift shops from Supabase
  const fetchShops = async () => {
    try {
      const { data, error } = await supabase.from("THRIFT SHOP").select("*");
      if (error) throw error;
      setShops(data || []);
    } catch (err) {
      console.error("Error fetching thrift shops:", err.message);
    }
  };

  // Fetch comments from Supabase
  const fetchComments = async () => {
    try {
      const { data, error } = await supabase.from("COMMENT").select("*");
      if (error) throw error;
      setComments(data || []);
    } catch (err) {
      console.error("Error fetching comments:", err.message);
    }
  };

  // ✅ Delete comment using correct ComID
  const handleDeleteComment = async (ComID) => {
    try {
      const { error } = await supabase
        .from("COMMENT")
        .delete()
        .eq("ComID", ComID);

      if (error) throw error;

      // Refresh list after deletion
      await fetchComments();
    } catch (err) {
      console.error("Error deleting comment:", err.message);
    }
  };

  // Fetch all data once
  useEffect(() => {
    fetchShops();
    fetchComments();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Admin Dashboard
        </h1>
        <div className="space-x-4">
          <button
            className={`px-4 py-2 rounded-md font-medium ${
              activeTab === "shops"
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setActiveTab("shops")}
          >
            Shops
          </button>
          <button
            className={`px-4 py-2 rounded-md font-medium ${
              activeTab === "comments"
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setActiveTab("comments")}
          >
            Comments
          </button>
        </div>
      </div>

      {/* SHOPS TAB */}
      {activeTab === "shops" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shops.length === 0 ? (
            <p className="text-gray-600">No shops found.</p>
          ) : (
            shops.map((shop) => (
              <div
                key={shop.ShopID}
                className="bg-white shadow-md rounded-lg p-4"
              >
                {shop.Image && (
                  <img
                    src={shop.Image}
                    alt={shop.Name}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                )}
                <h2 className="text-xl font-semibold mb-2">{shop.Name}</h2>
                <p className="text-gray-700">
                  <strong>Category:</strong> {shop.Category}
                </p>
                <p className="text-gray-700">
                  <strong>Store Hours:</strong> {shop.StoreHours}
                </p>
                <p className="text-gray-700">
                  <strong>Price Range:</strong> {shop.PriceRange}
                </p>
                <p className="text-gray-700">
                  <strong>Admin ID:</strong> {shop.AdminID}
                </p>
              </div>
            ))
          )}
        </div>
      )}

      {/* COMMENTS TAB */}
      {activeTab === "comments" && (
        <div>
          {comments.length === 0 ? (
            <p className="text-gray-600">No comments available.</p>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div
                  key={comment.ComID}
                  className="bg-white shadow-md rounded-lg p-4 flex justify-between items-start"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">
                      @{comment.Username}
                    </p>
                    <p className="text-gray-700 mt-1 italic">
                      Comment ID: {comment.ComID}
                    </p>
                    <div className="text-sm text-gray-600 mt-2">
                      <span className="font-semibold">Shop ID:</span>{" "}
                      {comment.ShopID}{" "}
                      <span className="ml-4 font-semibold">Date:</span>{" "}
                      {new Date(comment.CreationDate).toLocaleString()}
                    </div>
                    <p className="text-gray-500 text-sm mt-1">
                      Status: {comment.Status}
                    </p>
                  </div>
                  <button
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                    onClick={() => handleDeleteComment(comment.ComID)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminPage;
