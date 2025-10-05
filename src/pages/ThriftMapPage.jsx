import { useEffect, useState } from "react";
import { supabase } from "../util/supabase";

function ThriftMapPage({ user }) {
  const [shops, setShops] = useState([]);
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const [user, setUser] = useState(null);

  // Fetch user session
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user || null);
    });
  }, []);

  // Fetch thrift shop data
  useEffect(() => {
    const fetchShops = async () => {
      const { data, error } = await supabase.from("THRIFT SHOP").select("*");
      if (error) console.error("Error fetching shops:", error);
      else setShops(data || []);
    };
    fetchShops();
  }, []);

  // Fetch comments for all shops
  useEffect(() => {
    const fetchComments = async () => {
      const { data, error } = await supabase.from("COMMENT").select("*");
      if (error) console.error("Error fetching comments:", error);
      else {
        const grouped = {};
        data.forEach((c) => {
          if (!grouped[c.ShopID]) grouped[c.ShopID] = [];
          grouped[c.ShopID].push(c);
        });
        setComments(grouped);
      }
    };
    fetchComments();
  }, []);

  // Add new comment
  const handleAddComment = async (shopId) => {
    if (!user) {
      alert("You must be logged in to comment.");
      return;
    }

    const content = newComment[shopId];
    if (!content?.trim()) return;

    const { error } = await supabase.from("COMMENT").insert([
      {
        Content: content,
        CreationDate: new Date().toISOString(),
        CustID: user.id,
        ShopID: shopId,
        Status: "active",
      },
    ]);

    if (error) {
      console.error("Error adding comment:", error);
      return;
    }

    // Refresh comments
    const { data } = await supabase
      .from("COMMENT")
      .select("*")
      .eq("ShopID", shopId);

    setComments((prev) => ({ ...prev, [shopId]: data }));
    setNewComment((prev) => ({ ...prev, [shopId]: "" }));
  };

  return (
    <div className="bg-[#f8f8e8] min-h-screen text-gray-800">
      {/* Hero Section */}
      <section className="bg-green-900 text-center py-20 text-white">
        <h1 className="text-4xl font-bold mb-2">ThreadCycle Duma</h1>
        <p className="text-lg opacity-80">
          Discover sustainable thrift shops around Dumaguete City
        </p>
      </section>

      {/* Map Section */}
      <section className="py-10 flex flex-col items-center">
        <h2 className="text-xl font-bold mb-4">Location Map</h2>
        <div className="w-[90%] h-[400px] bg-[url('/Map.png')] bg-cover bg-center rounded-lg shadow-md"></div>
      </section>

      {/* Filter Section (Static UI for now) */}
      <section className="w-[90%] mx-auto bg-white shadow-md p-6 rounded-lg mb-8">
        <div className="flex flex-col gap-4">
          <div>
            <h3 className="font-semibold">Category</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {["All Shops", "Clothing", "Shoes", "Accessories"].map((cat) => (
                <button
                  key={cat}
                  className="px-3 py-1 bg-gray-200 rounded-full text-sm hover:bg-green-300"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold">Price Range:</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {["Any Price", "₱50 - ₱100", "₱100 - ₱250", "₱250+"].map(
                (price) => (
                  <button
                    key={price}
                    className="px-3 py-1 bg-gray-200 rounded-full text-sm hover:bg-green-300"
                  >
                    {price}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Thrift Shop Cards */}
      <section className="w-[90%] mx-auto mb-20">
        <h2 className="text-center font-bold text-lg mb-6">
          Discover Thrift Shops
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {shops.map((shop) => (
            <div
              key={shop.ShopID}
              className="bg-white shadow-md rounded-xl overflow-hidden flex flex-col"
            >
              <img
                src={shop.Image}
                alt={shop.Name}
                className="h-48 w-full object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-bold">{shop.Name}</h3>
                <div className="flex gap-2 mt-1">
                  <span className="px-3 py-1 bg-gray-200 rounded-full text-sm">
                    {shop.Category}
                  </span>
                  <span className="px-3 py-1 bg-gray-200 rounded-full text-sm">
                    ₱{shop.PriceRange}
                  </span>
                </div>
                <p className="mt-2 text-sm">{shop.StoreHours}</p>
                <button className="mt-3 bg-green-700 text-white px-4 py-1 rounded hover:bg-green-800">
                  Directions
                </button>

                {/* Comments Section */}
                <hr className="my-3" />
                <p className="text-sm font-semibold">
                  Comments ({comments[shop.ShopID]?.length || 0})
                </p>

                <div className="space-y-2 mt-2">
                  {comments[shop.ShopID]?.map((c) => (
                    <div key={c.ComID} className="text-sm border-b pb-1">
                      <p className="font-semibold">User {c.CustID}</p>
                      <p>{c.Content}</p>
                    </div>
                  ))}
                </div>

                {/* Add Comment */}
                <div className="flex mt-3 gap-2">
                  <input
                    type="text"
                    placeholder={
                      user ? "Add a comment..." : "Login to comment"
                    }
                    disabled={!user}
                    value={newComment[shop.ShopID] || ""}
                    onChange={(e) =>
                      setNewComment((prev) => ({
                        ...prev,
                        [shop.ShopID]: e.target.value,
                      }))
                    }
                    className="flex-grow border border-gray-300 rounded px-3 py-1 text-sm focus:outline-green-700"
                  />
                  <button
                    onClick={() => handleAddComment(shop.ShopID)}
                    className="bg-green-700 text-white px-4 rounded disabled:opacity-50"
                    disabled={!user}
                  >
                    ➤
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

export default ThriftMapPage;
