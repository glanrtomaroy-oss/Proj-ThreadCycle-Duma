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

  const filteredTutorials = tutorials.filter(tutorial => 
  {
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


  const difficultyColors = {
    beginner: 'bg-[#27ae60]',
    intermediate: 'bg-[#f39c12]',
    advanced: 'bg-[#e74c3c]',
  };

  return (
    <>
      {/* Hero Section for Tutorials */}
      <section
        id="tutorials"
        className="relative bg-[url('https://images.unsplash.com/photo-1558769132-cb1aea458c5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80')] bg-cover bg-center bg-no-repeat"
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#7a8450]/70 to-[rgba(38,70,83,0.8)]"></div>

        {/* Content */}
        <div className="relative w-full max-w-6xl mx-auto px-4 text-white py-20 text-center">
          <h1 className="text-4xl font-bold mb-5">DIY Tutorials & Guides</h1>
          <p className="text-xl max-w-3xl mx-auto mb-8">
            Learn how to repair, repurpose, and upcycle your clothing with our step-by-step tutorials
          </p>
        </div>
      </section>


      {/* Tutorials Section */}
      <section className="bg-[#FEFEE3] py-10 pb-20">
        <div className="w-full max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Browse Our Tutorial Collection</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">Filter by category or difficulty level to find the perfect tutorial for your skill level and project needs</p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg p-5 mb-8 shadow-lg">
            <div className="mb-4">
              <h3 className="mb-2 text-lg font-medium text-gray-800">Category</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  className={`px-4 py-2 border rounded-full cursor-pointer transition-all ${activeFilter === "all" ? "bg-[#4C956C] text-white border-[#4C956C]" : "bg-[var(--light)] border-[var(--light-gray)] hover:bg-[#3B7D57] hover:text-white hover:border-[#3B7D57]"
                    }`}
                  onClick={() => handleFilterClick("all")}
                >
                  All Categories
                </button>
                <button
                  className={`px-4 py-2 border rounded-full cursor-pointer transition-all ${activeFilter === "repair" ? "bg-[#4C956C] text-white border-[#4C956C]" : "bg-[var(--light)] border-[var(--light-gray)] hover:bg-[#3B7D57] hover:text-white hover:border-[#3B7D57]"
                    }`}
                  onClick={() => handleFilterClick("repair")}
                >
                  Repair
                </button>
                <button
                  className={`px-4 py-2 border rounded-full cursor-pointer transition-all ${activeFilter === "upcycle" ? "bg-[#4C956C] text-white border-[#4C956C]" : "bg-[var(--light)] border-[var(--light-gray)] hover:bg-[#3B7D57] hover:text-white hover:border-[#3B7D57]"
                    }`}
                  onClick={() => handleFilterClick("upcycle")}
                >
                  Upcycling
                </button>
                <button
                  className={`px-4 py-2 border rounded-full cursor-pointer transition-all ${activeFilter === "customization" ? "bg-[#4C956C] text-white border-[#4C956C]" : "bg-[var(--light)] border-[var(--light-gray)] hover:bg-[#3B7D57] hover:text-white hover:border-[#3B7D57]"
                    }`}
                  onClick={() => handleFilterClick("customization")}
                >
                  Customization
                </button>
                <button
                  className={`px-4 py-2 border rounded-full cursor-pointer transition-all ${activeFilter === "accessories" ? "bg-[#4C956C] text-white border-[#4C956C]" : "bg-[var(--light)] border-[var(--light-gray)] hover:bg-[#3B7D57] hover:text-white hover:border-[#3B7D57]"
                    }`}
                  onClick={() => handleFilterClick("accessories")}
                >
                  Accessories
                </button>
              </div>
            </div>
            <div>
              <h3 className="mb-2 text-lg font-medium text-gray-800">Difficulty Level</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  className={`px-4 py-2 border rounded-full cursor-pointer transition-all ${activeDifficulty === "all" ? "bg-[#4C956C] text-white border-[#4C956C]" : "bg-[var(--light)] border-[var(--light-gray)] hover:bg-[#3B7D57] hover:text-white hover:border-[#3B7D57]"
                    }`}
                  onClick={() => handleDifficultyClick("all")}
                >
                  All Levels
                </button>
                <button
                  className={`px-4 py-2 border rounded-full cursor-pointer transition-all ${activeDifficulty === "beginner" ? "bg-[#4C956C] text-white border-[#4C956C]" : "bg-[var(--light)] border-[var(--light-gray)] hover:bg-[#3B7D57] hover:text-white hover:border-[#3B7D57]"
                    }`}
                  onClick={() => handleDifficultyClick("beginner")}
                >
                  Beginner
                </button>
                <button
                  className={`px-4 py-2 border border-[var(--light-gray)] rounded-full cursor-pointer transition-all ${activeDifficulty === "intermediate" ? "bg-[#4C956C] text-white border-[#4C956C]" : "bg-[var(--light)] border-[var(--light-gray)] hover:bg-[#3B7D57] hover:text-white hover:border-[#3B7D57]"
                    }`}
                  onClick={() => handleDifficultyClick("intermediate")}
                >
                  Intermediate
                </button>
                <button
                  className={`px-4 py-2 border rounded-full cursor-pointer transition-all ${activeDifficulty === "advanced" ? "bg-[#4C956C] text-white border-[#4C956C]" : "bg-[var(--light)] border-[var(--light-gray)] hover:bg-[#3B7D57] hover:text-white hover:border-[#3B7D57]"
                    }`}
                  onClick={() => handleDifficultyClick("advanced")}
                >
                  Advanced
                </button>
              </div>
            </div>
          </div>

          {/* Tutorials Grid */}
          <div className="grid gap-7.5 grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
            {filteredTutorials.map(tutorial => (
              <div
                key={tutorial.id}
                className="bg-white rounded-lg overflow-hidden shadow-[0_5px_15px_rgba(0,0,0,0.1)] transition-transform duration-300 eascursor-pointer hover:-translate-y-[5px]"
                data-category={tutorial.category}
                data-difficulty={tutorial.difficulty}
              >
                <div className="relative h-[200px]">
                  <div className="w-[100%] h-[100%] relative">
                    <iframe
                      className="rounded-t-[10px] rounded-b-0"
                      width="100%"
                      height="200"
                      src={`https://www.youtube.com/embed/${tutorial.youtubeId}`}
                      title={tutorial.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <span className={`absolute top-[15px] right-[15px] px-2.5 py-1.5 rounded-[20px] text-[0.8rem] font-medium  text-white z-10 ${difficultyColors[tutorial.difficulty]}`}>
                    {tutorial.difficulty.charAt(0).toUpperCase() + tutorial.difficulty.slice(1)}
                  </span>
                </div>

                <div className="p-[20px]">
                  <div className="tutorial-meta">
                    <span className="tutorial-category">
                      {tutorial.category.charAt(0).toUpperCase() + tutorial.category.slice(1)}
                    </span>
                    <span><i className="far fa-clock"></i> {tutorial.duration}</span>
                  </div>
                  <h3 className="mb-2.5 text-[var(--dark)]text-[1.3rem]">{tutorial.title}</h3>
                  <p className="text-[var(--gray)] mb-[15px] text-[.95rem] leading-[1.5]">{tutorial.description}</p>
                </div>
              </div>
            ))}
          </div>

          {filteredTutorials.length === 0 && (
            <div className="no-results">
              <i className="fas fa-search"></i>
              <h3 className ="text-center text-gray-500 mt-8">No tutorials found.</h3>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default TutorialsPage;