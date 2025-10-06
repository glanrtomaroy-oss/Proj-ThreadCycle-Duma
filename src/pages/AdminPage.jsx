import { useState, useEffect } from "react";
import { supabase } from "../util/supabase";
import { UserAuth } from "../context/AuthContext";

function AdminPage() {
  const { user } = UserAuth();
  const [activeTab, setActiveTab] = useState("shops");
  const [shops, setShops] = useState([]);
  const [comments, setComments] = useState([]);
  const [newShop, setNewShop] = useState({
    name: "",
    latitude: "",
    longitude: "",
    hours: "",
    priceRange: "",
    itemTypes: [],
  });
  const [editingShop, setEditingShop] = useState(null);

  // 🟢 Fetch data from Supabase
  useEffect(() => {
    fetchShops();
    fetchComments();
  }, []);

  const fetchShops = async () => {
    const { data, error } = await supabase.from("thrift_shops").select("*");
    if (error) console.error("Error fetching shops:", error);
    else setShops(data || []);
  };

  const fetchComments = async () => {
    const { data, error } = await supabase.from("comments").select("*");
    if (error) console.error("Error fetching comments:", error);
    else setComments(data || []);
  };

  // 🟢 Add or Update Shop
  const handleSubmitShop = async (e) => {
    e.preventDefault();

    if (editingShop) {
      // 🟡 Update shop
      const { error } = await supabase
        .from("thrift_shops")
        .update({
          name: newShop.name,
          latitude: newShop.latitude,
          longitude: newShop.longitude,
          hours: newShop.hours,
          priceRange: newShop.priceRange,
          itemTypes: newShop.itemTypes,
        })
        .eq("id", editingShop.id);

      if (error) console.error("Error updating shop:", error);
      else {
        setEditingShop(null);
        await fetchShops();
      }
    } else {
      // 🟢 Add new shop
      const { error } = await supabase.from("thrift_shops").insert([
        {
          name: newShop.name,
          latitude: parseFloat(newShop.latitude),
          longitude: parseFloat(newShop.longitude),
          hours: newShop.hours,
          priceRange: newShop.priceRange,
          itemTypes: newShop.itemTypes,
        },
      ]);

      if (error) {
        console.error("Error adding shop:", error);
      } else {
        await fetchShops();
      }
    }

    // Reset form
    setNewShop({
      name: "",
      latitude: "",
      longitude: "",
      hours: "",
      priceRange: "",
      itemTypes: [],
    });
  };

  // 🟢 Delete Shop
  const handleDeleteShop = async (id) => {
    const { error } = await supabase.from("thrift_shops").delete().eq("id", id);
    if (error) console.error("Error deleting shop:", error);
    else fetchShops();
  };

  // 🟢 Comment Moderation
  const handleApproveComment = async (id) => {
    const { error } = await supabase
      .from("comments")
      .update({ approved: true })
      .eq("id", id);
    if (error) console.error("Error approving comment:", error);
    else fetchComments();
  };

  const handleDeleteComment = async (id) => {
    const { error } = await supabase.from("comments").delete().eq("id", id);
    if (error) console.error("Error deleting comment:", error);
    else fetchComments();
  };

  return (
    <div className="min-h-[calc(100vh-200px)] bg-gray-100 py-10">
      <div className="max-w-6xl mx-auto px-5">
        <div className="text-center mb-10">
          <h1 className="text-gray-800 text-4xl font-bold mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 text-lg">
            Manage thrift shops and moderate comments
          </p>
        </div>

        {/* Tabs */}
        <div className="flex bg-white rounded-lg p-2 mb-8 shadow-lg">
          <button
            onClick={() => setActiveTab("shops")}
            className={`flex-1 py-4 px-5 cursor-pointer text-base font-medium rounded-md transition-all ${
              activeTab === "shops"
                ? "bg-white text-[#2C6E49] border border-[#2C6E49] shadow-sm"
                : "bg-[#2C6E49] text-white hover:bg-[#25573A]"
            }`}
          >
            Thrift Shops
          </button>
          <button
            onClick={() => setActiveTab("comments")}
            className={`flex-1 py-4 px-5 cursor-pointer text-base font-medium rounded-md transition-all ${
              activeTab === "comments"
                ? "bg-white text-[#2C6E49] border border-[#2C6E49] shadow-sm"
                : "bg-[#2C6E49] text-white hover:bg-[#25573A]"
            }`}
          >
            Comment Moderation
          </button>
        </div>

        {/* 🏪 Thrift Shops */}
        {activeTab === "shops" && (
          <div className="bg-white rounded-lg p-8 shadow-lg">
            <div className="mb-10">
              <h2 className="text-gray-800 mb-5 text-2xl font-bold border-b-2 border-gray-100 pb-2">
                {editingShop ? "Edit Thrift Shop" : "Add New Thrift Shop"}
              </h2>
              <form
                onSubmit={handleSubmitShop}
                className="bg-gray-100 p-6 rounded-lg mb-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="block mb-2 text-gray-800 font-medium">
                      Shop Name
                    </label>
                    <input
                      type="text"
                      value={newShop.name}
                      onChange={(e) =>
                        setNewShop({ ...newShop, name: e.target.value })
                      }
                      className="w-full px-3 py-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#2C6E49]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-gray-800 font-medium">
                      Latitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={newShop.latitude}
                      onChange={(e) =>
                        setNewShop({ ...newShop, latitude: e.target.value })
                      }
                      className="w-full px-3 py-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#2C6E49]"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="block mb-2 text-gray-800 font-medium">
                      Longitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={newShop.longitude}
                      onChange={(e) =>
                        setNewShop({ ...newShop, longitude: e.target.value })
                      }
                      className="w-full px-3 py-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#2C6E49]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-gray-800 font-medium">
                      Operating Hours
                    </label>
                    <input
                      type="text"
                      value={newShop.hours}
                      onChange={(e) =>
                        setNewShop({ ...newShop, hours: e.target.value })
                      }
                      className="w-full px-3 py-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#2C6E49]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="block mb-2 text-gray-800 font-medium">
                      Price Range
                    </label>
                    <input
                      type="text"
                      value={newShop.priceRange}
                      onChange={(e) =>
                        setNewShop({
                          ...newShop,
                          priceRange: e.target.value,
                        })
                      }
                      className="w-full px-3 py-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#2C6E49]"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-gray-800 font-medium">
                      Item Types
                    </label>
                    <div className="flex gap-3 flex-wrap">
                      {["clothing", "shoes", "bags", "accessories"].map(
                        (type) => (
                          <label key={type} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={newShop.itemTypes.includes(type)}
                              onChange={(e) => {
                                const updated = e.target.checked
                                  ? [...newShop.itemTypes, type]
                                  : newShop.itemTypes.filter((t) => t !== type);
                                setNewShop({ ...newShop, itemTypes: updated });
                              }}
                            />
                            {type}
                          </label>
                        )
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-md text-sm font-medium transition-all bg-[#2C6E49] text-white hover:bg-[#25573A]"
                >
                  {editingShop ? "Update Shop" : "Add Shop"}
                </button>
                {editingShop && (
                  <button
                    type="button"
                    className="ml-3 px-6 py-3 border-2 border-[#2C6E49] text-[#2C6E49] rounded-md hover:bg-[#2C6E49] hover:text-white transition-all"
                    onClick={() => {
                      setEditingShop(null);
                      setNewShop({
                        name: "",
                        latitude: "",
                        longitude: "",
                        hours: "",
                        priceRange: "",
                        itemTypes: [],
                      });
                    }}
                  >
                    Cancel
                  </button>
                )}
              </form>
            </div>

            {/* Shop List */}
            <div>
              <h2 className="text-gray-800 mb-5 text-2xl font-bold border-b-2 border-gray-100 pb-2">
                Manage Thrift Shops
              </h2>
              <div className="grid gap-5">
                {shops.map((shop) => (
                  <div
                    key={shop.id}
                    className="bg-gray-100 p-5 rounded-lg border-l-4 border-[#2C6E49] flex justify-between items-center"
                  >
                    <div>
                      <h3 className="text-gray-800 mb-2">{shop.name}</h3>
                      <p className="text-gray-600">
                        <strong>Hours:</strong> {shop.hours}
                      </p>
                      <p className="text-gray-600">
                        <strong>Price Range:</strong> {shop.priceRange}
                      </p>
                      <p className="text-gray-600">
                        <strong>Items:</strong>{" "}
                        {Array.isArray(shop.itemTypes)
                          ? shop.itemTypes.join(", ")
                          : shop.itemTypes}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        className="px-6 py-2 border-2 border-[#2C6E49] text-[#2C6E49] bg-white rounded-md hover:bg-[#2C6E49] hover:text-white transition-all"
                        onClick={() => {
                          setEditingShop(shop);
                          setNewShop(shop);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-all"
                        onClick={() => handleDeleteShop(shop.id)}
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

        {/* 💬 Comments */}
        {activeTab === "comments" && (
          <div className="bg-white rounded-lg p-8 shadow-lg">
            <h2 className="text-gray-800 mb-5 text-2xl font-bold border-b-2 border-gray-100 pb-2">
              Comment Moderation ({comments.length})
            </h2>
            <div className="grid gap-5">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="bg-gray-100 p-5 rounded-lg border-l-4 border-[#2C6E49] flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold text-gray-800">
                      @{comment.username}
                    </p>
                    <p className="text-gray-700 mt-1 italic">
                      "{comment.content}"
                    </p>
                    <div className="text-sm text-gray-600 mt-2">
                      <span className="font-semibold">Shop:</span>{" "}
                      {comment.shop_name}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="bg-[#2C6E49] hover:bg-[#25573A] text-white px-4 py-2 rounded-md text-sm font-medium"
                      onClick={() => handleApproveComment(comment.id)}
                    >
                      Approve
                    </button>
                    <button
                      className="bg-[#E63946] hover:bg-[#C92D39] text-white px-4 py-2 rounded-md text-sm font-medium"
                      onClick={() => handleDeleteComment(comment.id)}
                    >
                      Delete
                    </button>
                  </div>
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
