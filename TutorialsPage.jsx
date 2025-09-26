import { useState } from 'react';

function TutorialsPage({ user }) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeDifficulty, setActiveDifficulty] = useState("all");
  const [comments, setComments] = useState({});
  const [newComments, setNewComments] = useState({});

  const tutorials = [
    {
      id: 1,
      category: "repair",
      difficulty: "beginner",
      youtubeId: "vvDdzD5pF3M", // How to Fix a Torn Seam
      title: "How to Repair a Hole in a T-Shirt",
      description: "Learn the basic technique to repair a hole on any shirt with this simple tutorial.",
      duration: "5 min"
    },
    {
      id: 2,
      category: "upcycle",
      difficulty: "beginner",
      youtubeId: "rDIea-ldrJU", // T-Shirt to Tote Bag
      title: "T-Shirt to Tote Bag Transformation",
      description: "Turn an old t-shirt into a stylish and reusable tote bag with no sewing required.",
      duration: "6 min"
    },
    {
      id: 3,
      category: "customization",
      difficulty: "intermediate",
      youtubeId: "TSDuJ4OuMuk", // Embroidery on Denim
      title: "Adding Embroidery to Denim Jackets",
      description: "Learn how to add beautiful embroidery to denim jackets to give them a personalized touch.",
      duration: "7 min"
    },
    {
      id: 4,
      category: "repair",
      difficulty: "intermediate",
      youtubeId: "Gw0wD9HmQvc", // Fixing Zippers
      title: "Fixing Zippers on Pants",
      description: "Step-by-step guide to replacing and repairing broken zippers on pants.",
      duration: "3 min"
    },
    {
      id: 5,
      category: "accessories",
      difficulty: "beginner",
      youtubeId: "4nxXbX1rJT8", // Fabric Scrap Hair Accessories
      title: "Creating Fabric Scrap Hair Accessories",
      description: "Use leftover fabric scraps to create beautiful hair clips and scrunchies.",
      duration: "7 min"
    },
    {
      id: 6,
      category: "upcycle",
      difficulty: "advanced",
      youtubeId: "fCpsWhgNa1M", // Jeans to Denim Skirt
      title: "Turning Jeans into a Denim Skirt",
      description: "Advanced tutorial on transforming old jeans into a fashionable denim skirt.",
      duration: "5 min"
    }
  ];

  const filteredTutorials = tutorials.filter(tutorial => {
    const categoryMatch = activeFilter === "all" || tutorial.category === activeFilter;
    const difficultyMatch = activeDifficulty === "all" || tutorial.difficulty === activeDifficulty;
    return categoryMatch && difficultyMatch;
  });

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
  };

  const handleDifficultyClick = (difficulty) => {
    setActiveDifficulty(difficulty);
  };

  const handleCommentChange = (tutorialId, comment) => {
    // FIX: Only allow comment changes if user is logged in
    if (!user) return;
    
    setNewComments(prev => ({
      ...prev,
      [tutorialId]: comment
    }));
  };

  const handleCommentSubmit = (tutorialId) => {
    // Check if user is logged in
    if (!user) {
      alert("Please log in to post comments.");
      return;
    }

    const comment = newComments[tutorialId]?.trim();
    
    if (!comment) {
      alert("Please enter a comment before sending.");
      return;
    }

    const newComment = {
      id: Date.now(),
      text: comment,
      timestamp: new Date().toLocaleString(),
      user: user.username || "Anonymous"
    };

    setComments(prev => ({
      ...prev,
      [tutorialId]: [...(prev[tutorialId] || []), newComment]
    }));

    setNewComments(prev => ({
      ...prev,
      [tutorialId]: ""
    }));
  };

  const handleKeyPress = (e, tutorialId) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleCommentSubmit(tutorialId);
    }
  };

  return (
    <>
      {/* Hero Section for Tutorials */}
      <section className="hero tutorials-hero" id="tutorials">
        <div className="container">
          <h1>DIY Tutorials & Guides</h1>
          <p>
            Learn how to repair, repurpose, and upcycle your clothing with our step-by-step tutorials
          </p>
          {!user && (
            <div className="login-required-banner">
              <i className="fas fa-info-circle"></i>
              <span>Log in to ask questions and join tutorial discussions</span>
            </div>
          )}
        </div>
      </section>

      {/* Tutorials Section */}
      <section className="tutorials-section">
        <div className="container">
          <div className="section-title">
            <h2>Browse Our Tutorial Collection</h2>
            <p>Filter by category or difficulty level to find the perfect tutorial for your skill level and project needs</p>
          </div>

          {/* Filters */}
          <div className="filters">
            <div className="filter-group">
              <h3>Category</h3>
              <div className="filter-options">
                <button 
                  className={`filter-btn ${activeFilter === "all" ? "active" : ""}`}
                  onClick={() => handleFilterClick("all")}
                >
                  All Categories
                </button>
                <button 
                  className={`filter-btn ${activeFilter === "repair" ? "active" : ""}`}
                  onClick={() => handleFilterClick("repair")}
                >
                  Repair
                </button>
                <button 
                  className={`filter-btn ${activeFilter === "upcycle" ? "active" : ""}`}
                  onClick={() => handleFilterClick("upcycle")}
                >
                  Upcycling
                </button>
                <button 
                  className={`filter-btn ${activeFilter === "customization" ? "active" : ""}`}
                  onClick={() => handleFilterClick("customization")}
                >
                  Customization
                </button>
                <button 
                  className={`filter-btn ${activeFilter === "accessories" ? "active" : ""}`}
                  onClick={() => handleFilterClick("accessories")}
                >
                  Accessories
                </button>
              </div>
            </div>
            <div className="filter-group">
              <h3>Difficulty Level</h3>
              <div className="filter-options">
                <button 
                  className={`filter-btn ${activeDifficulty === "all" ? "active" : ""}`}
                  onClick={() => handleDifficultyClick("all")}
                >
                  All Levels
                </button>
                <button 
                  className={`filter-btn ${activeDifficulty === "beginner" ? "active" : ""}`}
                  onClick={() => handleDifficultyClick("beginner")}
                >
                  Beginner
                </button>
                <button 
                  className={`filter-btn ${activeDifficulty === "intermediate" ? "active" : ""}`}
                  onClick={() => handleDifficultyClick("intermediate")}
                >
                  Intermediate
                </button>
                <button 
                  className={`filter-btn ${activeDifficulty === "advanced" ? "active" : ""}`}
                  onClick={() => handleDifficultyClick("advanced")}
                >
                  Advanced
                </button>
              </div>
            </div>
          </div>

          {/* Tutorials Grid */}
          <div className="tutorials-grid">
            {filteredTutorials.map(tutorial => (
              <div 
                key={tutorial.id} 
                className="tutorial-card" 
                data-category={tutorial.category} 
                data-difficulty={tutorial.difficulty}
              >
                <div className="tutorial-video">
                  <div className="video-container">
                    <iframe
                      width="100%"
                      height="200"
                      src={`https://www.youtube.com/embed/${tutorial.youtubeId}`}
                      title={tutorial.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <span className={`difficulty-badge difficulty-${tutorial.difficulty}`}>
                    {tutorial.difficulty.charAt(0).toUpperCase() + tutorial.difficulty.slice(1)}
                  </span>
                </div>
                
                <div className="tutorial-content">
                  <div className="tutorial-meta">
                    <span className="tutorial-category">
                      {tutorial.category.charAt(0).toUpperCase() + tutorial.category.slice(1)}
                    </span>
                    <span><i className="far fa-clock"></i> {tutorial.duration}</span>
                  </div>
                  <h3>{tutorial.title}</h3>
                  <p>{tutorial.description}</p>
                  
                  {/* Comments Section - Protected */}
                  <div className="comments-section">
                    <h4>
                      Comments ({comments[tutorial.id]?.length || 0})
                      {!user && <span className="login-required-tag"> - Login Required</span>}
                    </h4>
                    
                    {/* Comments List - Protected */}
                    <div className="comments-list">
                      {user ? (
                        comments[tutorial.id]?.map(comment => (
                          <div key={comment.id} className="comment">
                            <div className="comment-header">
                              <strong>{comment.user}</strong>
                              <span className="comment-time">{comment.timestamp}</span>
                            </div>
                            <p className="comment-text">{comment.text}</p>
                          </div>
                        ))
                      ) : (
                        <div className="no-comments-message">
                          <i className="fas fa-lock"></i>
                          <p>Please log in to view comments</p>
                        </div>
                      )}
                      
                      {user && comments[tutorial.id]?.length === 0 && (
                        <div className="no-comments-message">
                          <p>No comments yet. Be the first to comment!</p>
                        </div>
                      )}
                    </div>

                    {/* Comment Input - Protected */}
                    {user ? (
                      <div className="comment-input-container">
                        <textarea
                          className="comment-input"
                          placeholder="Share your thoughts or ask a question..."
                          value={newComments[tutorial.id] || ""}
                          onChange={(e) => handleCommentChange(tutorial.id, e.target.value)}
                          onKeyPress={(e) => handleKeyPress(e, tutorial.id)}
                          rows="2"
                        />
                        <button 
                          className="comment-send-btn"
                          onClick={() => handleCommentSubmit(tutorial.id)}
                          title="Send comment"
                        >
                          <i className="fas fa-paper-plane"></i>
                        </button>
                      </div>
                    ) : (
                      <div className="login-prompt">
                        <div className="login-prompt-content">
                          <i className="fas fa-user-lock"></i>
                          <div>
                            <p><strong>Want to join the discussion?</strong></p>
                            <p>Log in to ask questions and share your experiences</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredTutorials.length === 0 && (
            <div className="no-results">
              <i className="fas fa-search"></i>
              <h3>No tutorials found</h3>
              <p>Try adjusting your filters to see more results</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default TutorialsPage;