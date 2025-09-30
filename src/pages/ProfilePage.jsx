import React, { useState, useEffect } from 'react';

const ProfilePage = ({ user, setUser }) => {
  const [localUser, setLocalUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [tempDisplayName, setTempDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Initialize with user data from props
  useEffect(() => {
    if (user) {
      setLocalUser(user);
      setTempDisplayName(user.displayName || user.username);
    }
  }, [user]);

  const handleEditClick = () => {
    setTempDisplayName(localUser.displayName || localUser.username);
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
      
      // Properly update the parent user state - this is crucial!
      if (setUser) {
        setUser(prevUser => ({
          ...prevUser,
          displayName: tempDisplayName.trim()
        }));
      }

      setIsEditing(false);
    } catch (error) {
      alert('Failed to update display name. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelClick = () => {
    setTempDisplayName(localUser.displayName || localUser.username);
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
          <h1>Profile Settings</h1>
          <p>Manage your account information</p>
        </div>

        <div className="profile-content">
          {/* Profile Information - Only display name and basic info */}
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
                      <span>{localUser.displayName || localUser.username}</span>
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

              {/* Read-only fields - Only username and email remain */}
              <div className="info-item">
                <label>Username</label>
                <div className="info-value">
                  <span>{localUser.username}</span>
                  <span className="read-only-badge">Read Only</span>
                </div>
              </div>

              <div className="info-item">
                <label>Email Address</label>
                <div className="info-value">
                  <span>{localUser.email}</span>
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
