import React, { useState, useEffect } from 'react';

const ProfilePage = ({ user, setUser }) => {
  const [localUser, setLocalUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [tempDisplayName, setTempDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Initialize with user data from props
  useEffect(() => {
    if (user) {
      const initUser = {
        displayName: user.displayName || user.username || 'User',
        email: user.email || 'user@example.com',
        joinDate: user.joinDate || new Date().toISOString().split('T')[0],
        role: user.role || 'Member',
        username: user.username || 'user'
      };
      setLocalUser(initUser);
      setTempDisplayName(initUser.displayName);
    }
  }, [user]);

  const handleEditClick = () => {
    setTempDisplayName(localUser.displayName);
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    if (!tempDisplayName.trim()) {
      alert('Display name cannot be empty');
      return;
    }

    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const updatedUser = {
        ...localUser,
        displayName: tempDisplayName.trim()
      };

      setLocalUser(updatedUser);
      if (setUser) setUser(updatedUser);

      setIsEditing(false);
    } catch (error) {
      alert('Failed to update display name. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelClick = () => {
    setTempDisplayName(localUser.displayName);
    setIsEditing(false);
  };

  const handleInputChange = (e) => setTempDisplayName(e.target.value);
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSaveClick();
    else if (e.key === 'Escape') handleCancelClick();
  };

  if (!localUser) {
    return (
      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-header">
            <h1>Profile</h1>
            <p>No user data available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <h1>Profile Overview</h1>
          <p>View and update profile information.</p>
        </div>

        <div className="profile-content">

          {/* Profile Information */}
          <div className="profile-info">
            <div className="info-section">
              <h3>Account Information</h3>

              {/* Editable Display Name - ONLY EDITABLE FIELD */}
              <div className="info-item">
                <label>Display Name</label>
                <div className="info-value">
                  {isEditing ? (
                    <div className="edit-container">
                      <input
                        type="text"
                        value={tempDisplayName}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyPress}
                        className="name-input"
                        placeholder="Enter display name"
                        autoFocus
                        disabled={isLoading}
                      />
                      <div className="edit-actions">
                        <button 
                          onClick={handleSaveClick} 
                          className="save-btn" 
                          disabled={!tempDisplayName.trim() || isLoading}
                        >
                          {isLoading ? 'Saving...' : 'Save'}
                        </button>
                        <button 
                          onClick={handleCancelClick} 
                          className="cancel-btn"
                          disabled={isLoading}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="display-container">
                      <span>{localUser.displayName}</span>
                      <button 
                        onClick={handleEditClick} 
                        className="edit-btn"
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Read-only fields */}
              <div className="info-item">
                <label>Email Address</label>
                <div className="info-value">
                  <span>{localUser.email}</span>
                  <span className="read-only-badge">Read Only</span>
                </div>
              </div>

              <div className="info-item">
                <label>Username</label>
                <div className="info-value">
                  <span>{localUser.username}</span>
                  <span className="read-only-badge">Read Only</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;