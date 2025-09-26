import { useState, useEffect } from 'react';


function AdminPage({ user }) {
  const [activeTab, setActiveTab] = useState('shops');
  const [shops, setShops] = useState([]);
  const [comments, setComments] = useState([]);
  const [users, setUsers] = useState([]);
  const [newShop, setNewShop] = useState({
    name: '',
    address: '',
    latitude: '',
    longitude: '',
    hours: '',
    priceRange: '',
    itemTypes: []
  });
  const [editingShop, setEditingShop] = useState(null);

  // Sample data - replace with API calls
  useEffect(() => {
    // Mock data for demonstration
    setShops([
      {
        id: 1,
        name: "Green Threads Ukay",
        address: "123 Calle Street, Dumaguete City",
        latitude: 9.3057,
        longitude: 123.3055,
        hours: "9:00 AM - 6:00 PM",
        priceRange: "₱50 - ₱300",
        itemTypes: ["clothing", "shoes"]
      },
      {
        id: 2,
        name: "Eco Fashion Hub",
        address: "456 Rizal Avenue, Dumaguete City",
        latitude: 9.3080,
        longitude: 123.3070,
        hours: "8:00 AM - 7:00 PM",
        priceRange: "₱80 - ₱500",
        itemTypes: ["clothing", "bags", "accessories"]
      }
    ]);

    setComments([
      {
        id: 1,
        user: "fashion_lover",
        content: "Great selection of vintage jeans!",
        shop: "Green Threads Ukay",
        date: "2024-01-15",
        status: "approved"
      },
      {
        id: 2,
        user: "eco_warrior",
        content: "Prices are reasonable and quality is good",
        shop: "Eco Fashion Hub",
        date: "2024-01-14",
        status: "pending"
      }
    ]);

    setUsers([
      { id: 1, username: "tailor_juan", email: "juan@email.com", role: "user" },
      { id: 2, username: "sew_smart", email: "maria@email.com", role: "user" }
    ]);
  }, []);

  // Thrift Shop Management
  const handleAddShop = (e) => {
    e.preventDefault();
    const shop = {
      id: shops.length + 1,
      ...newShop,
      itemTypes: newShop.itemTypes
    };
    setShops([...shops, shop]);
    setNewShop({
      name: '',
      address: '',
      latitude: '',
      longitude: '',
      hours: '',
      priceRange: '',
      itemTypes: []
    });
  };

  const handleEditShop = (shop) => {
    setEditingShop(shop);
    setNewShop(shop);
  };

  const handleUpdateShop = (e) => {
    e.preventDefault();
    setShops(shops.map(shop => 
      shop.id === editingShop.id ? { ...newShop, id: shop.id } : shop
    ));
    setEditingShop(null);
    setNewShop({
      name: '',
      address: '',
      latitude: '',
      longitude: '',
      hours: '',
      priceRange: '',
      itemTypes: []
    });
  };

  const handleDeleteShop = (shopId) => {
    setShops(shops.filter(shop => shop.id !== shopId));
  };

  // Comment Moderation
  const handleApproveComment = (commentId) => {
    setComments(comments.map(comment =>
      comment.id === commentId ? { ...comment, status: 'approved' } : comment
    ));
  };

  const handleDeleteComment = (commentId) => {
    setComments(comments.filter(comment => comment.id !== commentId));
  };

  // User Management
  const handleResetPassword = (userId) => {
    // In real implementation, this would call an API
    alert(`Password reset initiated for user ${userId}`);
  };

  return (
    <div className="admin-page">
      <div className="admin-container">
        <div className="admin-header">
          <h1>Admin Dashboard</h1>
          <p>Manage thrift shops, moderate comments, and oversee platform activities</p>
        </div>

        <div className="admin-tabs">
          <button 
            className={`tab-btn ${activeTab === 'shops' ? 'active' : ''}`}
            onClick={() => setActiveTab('shops')}
          >
            Thrift Shops
          </button>
          <button 
            className={`tab-btn ${activeTab === 'comments' ? 'active' : ''}`}
            onClick={() => setActiveTab('comments')}
          >
            Comment Moderation
          </button>
          <button 
            className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            User Management
          </button>
        </div>

        {/* Thrift Shops Management */}
        {activeTab === 'shops' && (
          <div className="tab-content">
            <div className="admin-section">
              <h2>Add New Thrift Shop</h2>
              <form onSubmit={editingShop ? handleUpdateShop : handleAddShop} className="shop-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Shop Name</label>
                    <input
                      type="text"
                      value={newShop.name}
                      onChange={(e) => setNewShop({...newShop, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Address</label>
                    <input
                      type="text"
                      value={newShop.address}
                      onChange={(e) => setNewShop({...newShop, address: e.target.value})}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Latitude</label>
                    <input
                      type="number"
                      step="any"
                      value={newShop.latitude}
                      onChange={(e) => setNewShop({...newShop, latitude: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Longitude</label>
                    <input
                      type="number"
                      step="any"
                      value={newShop.longitude}
                      onChange={(e) => setNewShop({...newShop, longitude: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Operating Hours</label>
                    <input
                      type="text"
                      value={newShop.hours}
                      onChange={(e) => setNewShop({...newShop, hours: e.target.value})}
                      placeholder="e.g., 9:00 AM - 6:00 PM"
                    />
                  </div>
                  <div className="form-group">
                    <label>Price Range</label>
                    <input
                      type="text"
                      value={newShop.priceRange}
                      onChange={(e) => setNewShop({...newShop, priceRange: e.target.value})}
                      placeholder="e.g., ₱50 - ₱300"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Item Types</label>
                  <div className="checkbox-group">
                    {['clothing', 'shoes', 'bags', 'accessories'].map(type => (
                      <label key={type} className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={newShop.itemTypes.includes(type)}
                          onChange={(e) => {
                            const types = e.target.checked
                              ? [...newShop.itemTypes, type]
                              : newShop.itemTypes.filter(t => t !== type);
                            setNewShop({...newShop, itemTypes: types});
                          }}
                        />
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </label>
                    ))}
                  </div>
                </div>

                <button type="submit" className="btn btn-primary">
                  {editingShop ? 'Update Shop' : 'Add Shop'}
                </button>
                {editingShop && (
                  <button 
                    type="button" 
                    className="btn btn-outline"
                    onClick={() => {
                      setEditingShop(null);
                      setNewShop({
                        name: '',
                        address: '',
                        latitude: '',
                        longitude: '',
                        hours: '',
                        priceRange: '',
                        itemTypes: []
                      });
                    }}
                  >
                    Cancel
                  </button>
                )}
              </form>
            </div>

            <div className="admin-section">
              <h2>Manage Thrift Shops</h2>
              <div className="shops-list">
                {shops.map(shop => (
                  <div key={shop.id} className="shop-card">
                    <div className="shop-info">
                      <h3>{shop.name}</h3>
                      <p><strong>Address:</strong> {shop.address}</p>
                      <p><strong>Hours:</strong> {shop.hours}</p>
                      <p><strong>Price Range:</strong> {shop.priceRange}</p>
                      <p><strong>Items:</strong> {shop.itemTypes.join(', ')}</p>
                    </div>
                    <div className="shop-actions">
                      <button 
                        className="btn btn-outline"
                        onClick={() => handleEditShop(shop)}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn btn-danger"
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

        {/* Comment Moderation */}
        {activeTab === 'comments' && (
          <div className="tab-content">
            <div className="admin-section">
              <h2>Comment Moderation</h2>
              <div className="comments-list">
                {comments.map(comment => (
                  <div key={comment.id} className="comment-card">
                    <div className="comment-content">
                      <div className="comment-header">
                        <strong>{comment.user}</strong>
                        <span className={`status-badge ${comment.status}`}>
                          {comment.status}
                        </span>
                      </div>
                      <p>{comment.content}</p>
                      <div className="comment-meta">
                        <span>Shop: {comment.shop}</span>
                        <span>Date: {comment.date}</span>
                      </div>
                    </div>
                    <div className="comment-actions">
                      {comment.status === 'pending' && (
                        <button 
                          className="btn btn-success"
                          onClick={() => handleApproveComment(comment.id)}
                        >
                          Approve
                        </button>
                      )}
                      <button 
                        className="btn btn-danger"
                        onClick={() => handleDeleteComment(comment.id)}
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

        {/* User Management */}
        {activeTab === 'users' && (
          <div className="tab-content">
            <div className="admin-section">
              <h2>User Management</h2>
              <div className="users-list">
                {users.map(user => (
                  <div key={user.id} className="user-card">
                    <div className="user-info">
                      <h3>{user.username}</h3>
                      <p>Email: {user.email}</p>
                      <p>Role: {user.role}</p>
                    </div>
                    <div className="user-actions">
                      <button 
                        className="btn btn-warning"
                        onClick={() => handleResetPassword(user.id)}
                      >
                        Reset Password
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPage;